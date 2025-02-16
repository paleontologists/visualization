from django.shortcuts import redirect, render

from visualization.settings import TEMPLATE_PATHS


def overview(request):
    to_page = TEMPLATE_PATHS["home"]
    username = "guest"
    if "username" in request.session:
        username = request.session["username"]
        to_page = TEMPLATE_PATHS["overview"]
    data = {"username": username}
    return render(request, to_page, data)
