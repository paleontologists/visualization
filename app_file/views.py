from django.shortcuts import render

from visualization.settings import TEMPLATE_PATHS

def work_file_manager(request):
    return render(request, TEMPLATE_PATHS["work-file"])