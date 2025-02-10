from django.db import models
from app_user.models import User

class File(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='file/%Y/%m/%d/')
    title = models.CharField(max_length=255)
    description = models.TextField()
    upload = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "file"