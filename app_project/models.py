import os
from django.db import models
from app_user.models import User
from app_file.models import File
import random
import string


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

    # search project id for certain user id
    @classmethod
    def work_search_id(cls, project_id, user_id):
        try:
            user = User.objects.get(id=user_id)
            return Project.objects.get(id=project_id, user=user)
        except Project.DoesNotExist:
            return None

    # create project
    @classmethod
    def create_project(cls, user_id):
        project = cls(user=User.objects.get(id=user_id))
        project.title = f"Project {generate_random_string()}"
        project.description = f"This is {project.title}!"
        project.save()
        return project

    # load project and its file
    @classmethod
    def load_project(cls, project_id, user_id):
        project = Project.work_search_id(project_id, user_id)
        try:
            file = File.get_file_by_id(project.file.id, user_id)
            json_file = File.read_file_to_json(file)
        except:
            json_file = None
        return project, json_file

    # choose a file for project
    @classmethod
    def work_choose_file(cls, project_id, user_id, file_path):
        project = Project.work_search_id(project_id, user_id)
        if not project:
            return False
        file_path = File.path_FileField(file_path, user_id)
        file = File.get_file_by_path(file_path, user_id)
        if not file:
            return False, "no file"
        project.file = file
        project.save()
        return True, "success"


def generate_random_string(length=5):
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))
