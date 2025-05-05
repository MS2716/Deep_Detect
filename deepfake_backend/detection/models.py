from django.db import models

class MediaFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    is_fake = models.BooleanField(null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
