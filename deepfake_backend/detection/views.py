from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import MediaFile
from .serializers import MediaSerializer
import tensorflow as tf
import cv2
import numpy as np
import os
from django.conf import settings
import logging

# Set up logging
logger = logging.getLogger(__name__)

class MediaViewSet(viewsets.ModelViewSet):
    queryset = MediaFile.objects.all()
    serializer_class = MediaSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        # Load the model only when needed
        model = tf.keras.models.load_model(r'deepfake_model.keras')

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file_obj = serializer.validated_data['file']
        file_path = os.path.join(settings.MEDIA_ROOT, file_obj.name)
        logger.info(f"File path: {file_path}")

        # Ensure the file is saved to disk
        with open(file_path, 'wb') as f:
            for chunk in file_obj.chunks():
                f.write(chunk)
        logger.info(f"File saved to: {file_path}")

        # Detect based on file type
        if file_obj.name.endswith(('.jpg', '.png', '.mp4')):
            if file_obj.name.endswith(('.jpg', '.png')):
                img = cv2.imread(file_path)
                if img is None:
                    logger.error(f"Failed to read image: {file_path}")
                    return Response({"error": "Failed to read image"}, status=400)
                img = cv2.resize(img, (224, 224))
                img = np.expand_dims(img, axis=0) / 255.0
                prediction = model.predict(img)
                is_fake = bool(prediction[0][0] > 0.5)
            else:
                cap = cv2.VideoCapture(file_path)
                if not cap.isOpened():
                    logger.error(f"Failed to open video: {file_path}")
                    return Response({"error": "Failed to open video"}, status=400)
                ret, frame = cap.read()
                if ret:
                    frame = cv2.resize(frame, (224, 224))
                    frame = np.expand_dims(frame, axis=0) / 255.0
                    prediction = model.predict(frame)
                    is_fake = bool(prediction[0][0] > 0.3)
                else:
                    logger.error(f"Failed to read frame from video: {file_path}")
                    is_fake = None
                cap.release()
        else:
            return Response({"error": "Unsupported file type. Please upload an image (.jpg, .png) or video (.mp4)."}, status=400)

        media_instance = serializer.save(is_fake=is_fake)
        return Response({"id": media_instance.id, "is_fake": is_fake})