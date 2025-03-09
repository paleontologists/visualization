import json
import os
from django.http import JsonResponse
from django.shortcuts import render

from app_file.models import *
from visualization import settings
from visualization.settings import TEMPLATE_PATHS


def work_file_manager(request):
    return render(request, TEMPLATE_PATHS["work-file"])


# customer upload their files
def work_upload_file(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    if username == "guest":
        return render(request, to_page, data)
    uploaded_file = request.FILES["file"]
    user_id = request.session.get("id")
    file = File.upload_file(user_id, uploaded_file)
    return JsonResponse({"success": True})


# customer upload their files
def work_load_file(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    if username == "guest":
        return render(request, to_page, data)
    user_id = request.session.get("id")
    user_folder = os.path.join(settings.MEDIA_ROOT, f"{user_id}/file")
    if not os.path.exists(user_folder):
        return JsonResponse({"success": True, "structure": {}})  # No files yet
    folder_structure = File.load_folder_tree(user_folder, user_id)
    return JsonResponse({"success": True, "structure": folder_structure})


# customer create a folder
def work_create_folder(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    if username == "guest":
        return render(request, to_page, data)
    user_id = request.session.get("id")
    data = json.loads(request.body)
    relative_path = data.get("path", "").strip()  # Get the requested folder path
    if not relative_path:
        return JsonResponse({"success": False, "error": "No folder path"}, status=400)
    return JsonResponse({"success": File.create_folder(relative_path, user_id)})


# rename file or folder
def work_rename_file(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    if username == "guest":
        return render(request, to_page, data)
    user_id = request.session.get("id")
    data = json.loads(request.body)
    old_relative_path = data.get("old_path", "").strip()
    new_relative_path = data.get("new_path", "").strip()
    if not old_relative_path or not new_relative_path:
        return JsonResponse({"success": False})
    # Construct full paths
    old_path = os.path.join(settings.MEDIA_ROOT, f"{user_id}/file", old_relative_path)
    new_path = os.path.join(settings.MEDIA_ROOT, f"{user_id}/file", new_relative_path)
    # Check if the old file/folder exists
    if not os.path.exists(old_path):
        return JsonResponse({"success": False, "error": "not exist"})
    # Prevent overwriting an existing file/folder
    if os.path.exists(new_path):
        return JsonResponse({"success": False, "error": "exists"})
    return JsonResponse({"success": File.rename_file(old_path, new_path)})


# customer move a file or folder to another position
def work_move_file(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    if username == "guest":
        return render(request, to_page, data)
    user_id = request.session.get("id")
    data = json.loads(request.body)
    old_relative_path = data.get("old_path", "").strip()
    new_relative_path = data.get("new_path", "").strip()
    if not old_relative_path or not new_relative_path:
        return JsonResponse({"success": False})
    # Construct full paths
    old_path = os.path.join(settings.MEDIA_ROOT, f"{user_id}/file", old_relative_path)
    new_path = os.path.join(settings.MEDIA_ROOT, f"{user_id}/file", new_relative_path)
    # Check if the old file/folder exists
    if not os.path.exists(old_path):
        return JsonResponse({"success": False, "error": "not exist"})
    # Prevent overwriting an existing file/folder
    if os.path.exists(new_path):
        return JsonResponse({"success": False, "error": "exists"})
    return JsonResponse({"success": File.rename_file(old_path, new_path)})


# customer delete file or folder
def work_delete_file(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    if username == "guest":
        return render(request, to_page, data)
    user_id = request.session.get("id")
    data = json.loads(request.body)
    relative_path = data.get("path", "").strip()
    if not relative_path:
        return JsonResponse({"success": False})
    # Construct full paths
    full_path = os.path.join(settings.MEDIA_ROOT, f"{user_id}/file", relative_path)
    # Check if the old file/folder exists
    if not os.path.exists(full_path):
        return JsonResponse({"success": False, "error": "not exist"})
    return JsonResponse({"success": File.delete_file(full_path)})

