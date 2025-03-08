from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse

from app_project.models import Project
from visualization.settings import TEMPLATE_PATHS


def overview(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    if username == "guest":
        return render(request, to_page, data)
    
    
    return render(request, to_page, data)

# create new project
def create_project(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    if username == "guest":
        return render(request, to_page, data)
    project = Project.create_project(request.session.get("id"))
    # to modify the attribute inside the session not directly modify session
    request.session.modified = True 
    request.session["work_project_list"].append({"id": project.id, "name": project.title})
    return JsonResponse({
        "project_id": project.id,
        "project_name": project.title,
        "work_project_list": request.session.get("work_project_list"),
    })
