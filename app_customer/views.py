from django.shortcuts import render
from django.conf import settings

from visualization.settings import TEMPLATE_PATHS


# Create your views here.
def home(request):
    return render(request, TEMPLATE_PATHS["home"], {"data": "yeah home"})


def introduction(request):
    return render(request, TEMPLATE_PATHS["introduction"], {"data": "introduction"})


def models(request):
    return render(request, TEMPLATE_PATHS["models"], {"data": "models"})


def workspace(request):
    return render(request, TEMPLATE_PATHS["workspace"], {"data": "workspace"})


def support(request):
    return render(request, TEMPLATE_PATHS["support"], {"data": "support"})
