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

def create(request):
    to_page = TEMPLATE_PATHS["create"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    return render(request, to_page, data)

def history(request):
    to_page = TEMPLATE_PATHS["history"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    return render(request, to_page, data)