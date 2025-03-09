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
        return JsonResponse({"success": True, "files": []})  # No files yet
    # Fetch the entire folder structure
    folder_structure = get_folder_structure(user_folder, user_id)
    return JsonResponse({"success": True, "structure": folder_structure})


def get_folder_structure(folder_path, user_id):
    structure = {}
    for item in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item)
        if os.path.isdir(item_path):
            structure[item] = get_folder_structure(item_path, user_id)
        else:
            structure[item] = (
                f"{settings.MEDIA_URL}{user_id}/file/{os.path.relpath(item_path, folder_path)}"
            )
    return structure
