# urls.py
from django.urls import path

from app_file.views import *

urlpatterns = [
    path("work_file_manager", view = work_file_manager, name="work-file-manager"),
]