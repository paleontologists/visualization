from django.shortcuts import render

from visualization.settings import TEMPLATE_PATHS


def overview(request):
    to_page = TEMPLATE_PATHS["home"]
    username = request.session["username"]
    data = {"username": username}
    return render(request, TEMPLATE_PATHS["overview"], data)
