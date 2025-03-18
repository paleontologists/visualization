from django.http import JsonResponse
from django.shortcuts import redirect, render

from tool.session_check import is_login
from visualization.settings import TEMPLATE_PATHS


# from workspace which is in webiste home page to work home
def work_home(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    if "username" in request.session:
        to_page = TEMPLATE_PATHS["work-home"]
    data = {"username": username}
    return render(request, to_page, data)

# remeber how many project have been open by user
def remove_session_project(request, project_id):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    request.session["work_project_list"] = [
        project
        for project in request.session["work_project_list"]
        if str(project["id"]) != str(project_id)
    ]
    request.session.modified = True
    return JsonResponse({"state": "success"})