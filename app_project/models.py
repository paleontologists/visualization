from django.db import models
from app_user.models import User
from app_file.models import File


class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.ForeignKey(File, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    diagram = models.CharField(max_length=100, blank=True, null=True)
    echarts_config = models.JSONField(blank=True, null=True)
    create = models.DateTimeField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "project"

    @classmethod
    def create_project(cls, user_id, title="New project", description="Project description", file=None, diagram=None, echarts_config=None):
        return Project.objects.create(
            user=User.objects.get(id=user_id),
            file=file,
            title=title,
            description=description,
            diagram=diagram,
            echarts_config=echarts_config
        )
    
    @classmethod
    def search_by_id(cls, project_id, user_id):
        try:
            return Project.objects.get(id=project_id, user_id=user_id)
        except Project.DoesNotExist:
            return None
    