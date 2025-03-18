import json
import os
from django.http import FileResponse, HttpResponseNotFound, JsonResponse
from django.shortcuts import render

from app_file.models import *
from tool.session_check import is_login
from visualization import settings
from visualization.settings import TEMPLATE_PATHS


def work_file_manager(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    return render(request, TEMPLATE_PATHS["work-file"])


# customer upload their files
def work_upload_file(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    uploaded_file = request.FILES["file"]
    user_id = request.session.get("id")
    file = File.upload_file(user_id, uploaded_file)
    return JsonResponse({"success": True})


# customer load their files
def work_load_file(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_id = request.session.get("id")
    user_folder = os.path.join(settings.MEDIA_ROOT, f"{user_id}/file")
    if not os.path.exists(user_folder):
        return JsonResponse({"success": True, "structure": {}})  # No files yet
    folder_structure = File.load_folder_tree(user_folder, user_id)
    return JsonResponse({"success": True, "structure": folder_structure})


# customer load their file detail for chart
def work_detail_file(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_id = request.session.get("id")
    project_id = request.GET.get("project_id")
    state, json_file = File.load_file(project_id, user_id)
    return JsonResponse({"success": state, "file": json_file})


# customer create a folder
def work_create_folder(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_id = request.session.get("id")
    data = json.loads(request.body.decode("utf-8"))
    relative_path = data.get("path", "").strip()  # Get the requested folder path
    if not relative_path:
        return JsonResponse({"success": False, "error": "No folder path"}, status=400)
    state, text = File.create_folder(relative_path, user_id)
    return JsonResponse({"success": state, "text": text})


# customer move a file or folder to another position
def work_modify_file_path(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_id = request.session.get("id")
    data = json.loads(request.body.decode("utf-8"))
    old_relative_path = data.get("old_path", "").strip()
    new_relative_path = data.get("new_path", "").strip()
    if not old_relative_path or not new_relative_path:
        return JsonResponse({"success": False})
    state, text = File.modify_file_path(user_id, old_relative_path, new_relative_path)
    return JsonResponse({"success": state, "text": text})


# customer delete file or folder
def work_delete_file(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_id = request.session.get("id")
    data = json.loads(request.body.decode("utf-8"))
    relative_path = data.get("path", "").strip()
    if not relative_path:
        return JsonResponse({"success": False})
    state, text = File.delete_file(relative_path, user_id)
    return JsonResponse({"success": state, "text": text})


# customer download file
def work_download_file(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    file_path = request.GET.get("path")
    if not file_path:
        return HttpResponseNotFound("Missing file path")
    user_id = request.session.get("id")
    user = User.objects.get(id=user_id)
    file = str(user_id) + "/file/" + file_path
    to_page = TEMPLATE_PATHS["work-home"]
    if not File.objects.filter(file=file, user=user).first():  # If None, return early
        return render(request, to_page)
    full_path = os.path.join(settings.MEDIA_ROOT, f"{user_id}/file", file_path)
    if not os.path.exists(full_path):
        return HttpResponseNotFound("File not found: " + full_path)
    return FileResponse(open(full_path, "rb"), as_attachment=True)
