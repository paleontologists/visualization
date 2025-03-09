# urls.py
from django.urls import path

from app_file.views import *

urlpatterns = [
    path("work_file_manager", view=work_file_manager, name="work-file-manager"),
    path("work_upload_file", view=work_upload_file, name="work-upload-file"),
    path("work_load_file", view=work_load_file, name="work-load-file"),
    path("work_create_folder", view=work_create_folder, name="work-create-folder"),
    path("work_rename_file", view=work_rename_file, name="work-rename-file"),
    path("work_move_file", view=work_move_file, name="work-move-file"),
    path("work_delete_file", view=work_delete_file, name="work-delete-file"),
]
