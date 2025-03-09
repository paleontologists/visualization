import os
from django.utils.timezone import now
from django.db import models
from app_user.models import User


# upload file to user_id/file/y/m/d
def user_directory_path(instance, filename):
    return os.path.join(f"{instance.user.id}/file", filename)


class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to=user_directory_path)
    title = models.CharField(max_length=255)
    description = models.TextField()
    upload = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "file"

    @classmethod
    def upload_file(cls, user_id, uploaded_file, title=None, description=""):
        return File.objects.create(
            user=User.objects.get(id=user_id),
            file=uploaded_file,
            title=title if title else uploaded_file.name,
            description=description,
        )
