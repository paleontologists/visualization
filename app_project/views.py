import json
import os
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from app_file.models import File
from app_project.models import Project
from tool.session_check import is_login
from visualization import settings
from visualization.settings import TEMPLATE_PATHS

# the home page of workspace
def overview(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    to_page = TEMPLATE_PATHS["overview"]
    username = request.session.get("username", "guest")
    user_id = request.session.get("id")
    projects = Project.objects.filter(user_id=user_id).order_by("-create")
    data = {
        "username": username,
        "projects": projects,
    }
    return render(request, to_page, data)


# create new project
def create_project(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    project = Project.create_project(request.session.get("id"))
    # to modify the attribute inside the session not directly modify session
    request.session.modified = True
    request.session["work_project_list"].append(
        {"id": project.id, "name": project.title}
    )
    return JsonResponse(
        {
            "project_id": project.id,
            "project_title": project.title,
        }
    )


# open project
def open_project(request, project_id):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_id = request.session.get("id")
    project = Project.work_search_id(project_id, user_id)
    to_page = TEMPLATE_PATHS["work-home"]
    if project == None:
        return render(request, to_page)
    request.session.modified = True
    request.session["work_project_list"].append(
        {"id": project.id, "name": project.title}
    )
    return JsonResponse(
        {
            "project_id": project.id,
            "project_title": project.title,
        }
    )


# delete project
def delete_project(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_id = request.session.get("id")
    project_id = json.loads(request.body.decode("utf-8")).get("project_id")
    project = Project.work_search_id(project_id, user_id)
    to_page = TEMPLATE_PATHS["work-home"]
    if project == None:
        return render(request, to_page)
    project.delete()
    request.session["work_project_list"] = [
        project
        for project in request.session["work_project_list"]
        if str(project["id"]) != str(project_id)
    ]
    return JsonResponse({"success": True})


# load project
def load_project(request, project_id):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_id = request.session.get("id")
    project = Project.load_project(project_id, user_id)
    to_page = TEMPLATE_PATHS["work-home"]
    if not project:
        return render(request, to_page)
    data = {"project": project}
    to_page = TEMPLATE_PATHS["project"]
    return render(request, to_page, data)


# choose a file for project
def choose_file(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    project_id = request.POST.get("project_id")
    user_id = request.session.get("id")
    file_path = request.POST.get("file_path")
    state, text = Project.work_choose_file(project_id, user_id, file_path)
    return JsonResponse({"success": state, "text": text})


# save project
def save_project(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_id = request.session.get("id")
    project_id = request.POST.get("project_id")
    project_title = request.POST.get("project_title")
    project_description = request.POST.get("project_description")
    echarts_config = request.POST.get("echarts_config")
    return JsonResponse(
        {
            "success": Project.save_project(
                project_id, user_id, project_title, project_description, echarts_config
            )
        }
    )
