from django.http import JsonResponse
from django.shortcuts import redirect, render

from visualization.settings import TEMPLATE_PATHS


# from workspace which is in home page to work home
def work_home(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    if "username" in request.session:
        to_page = TEMPLATE_PATHS["work-home"]
    data = {"username": username}
    return render(request, to_page, data)


def overview(request):
    to_page = TEMPLATE_PATHS["overview"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    return render(request, to_page, data)


def project(request):
    to_page = TEMPLATE_PATHS["project"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    return render(request, to_page, data)


def remove_session_project(request, project_id):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    if username == "guest":
        return render(request, to_page, data)
    request.session["work_project_list"] = [
        project
        for project in request.session["work_project_list"]
        if str(project["id"]) != str(project_id)
    ]
    request.session.modified = True
    return JsonResponse(
        {
            "work_project_list": request.session.get("work_project_list"),
        }
    )


def history(request):
    to_page = TEMPLATE_PATHS["history"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    return render(request, to_page, data)
