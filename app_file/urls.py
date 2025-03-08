# urls.py
from django.urls import path

from app_file.views import *

urlpatterns = [
    path("work_file_manager", view = work_file_manager, name="work-file-manager"),
    path("work_upload_file", view = work_upload_file, name="work-upload-file"),
]