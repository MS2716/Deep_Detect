from rest_framework import serializers
from .models import MediaFile

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaFile
        fields = ['id', 'file', 'is_fake', 'uploaded_at']