import os
from django.http import JsonResponse
from django.shortcuts import render

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
    file_path = os.path.join(settings.MEDIA_ROOT, uploaded_file.name)
    with open(file_path, "wb+") as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)
        return JsonResponse({"success": True})
    return JsonResponse({"success": False})
