from django.http import JsonResponse
from django.shortcuts import render

from app_project.models import Project
from visualization.settings import TEMPLATE_PATHS


def overview(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    if username == "guest":
        return render(request, to_page, data)
    to_page = TEMPLATE_PATHS["overview"]
    user_id = request.session.get("id")
    projects = Project.objects.filter(user_id=user_id).order_by("-create")
    data = {
        "username": username,
        "projects": projects,
    }
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
    request.session["work_project_list"].append(
        {"id": project.id, "name": project.title}
    )
    return JsonResponse(
        {
            "project_id": project.id,
            "project_title": project.title,
        }
    )


# load project
def load_project(request, project_id):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    if username == "guest":
        return render(request, to_page, data)
    user_id = request.session.get("id")
    project = Project.search_by_id(project_id, user_id)
    if project == None:
        return render(request, to_page, data)
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
