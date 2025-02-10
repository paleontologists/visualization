from django.db import models
from app_user.models import User
from app_file.models import File


class Project(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    file_id = models.ForeignKey(File, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    diagram = models.CharField(max_length=100, blank=True, null=True)
    echarts_config = models.JSONField(blank=True, null=True)
    create = models.DateTimeField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "project"
