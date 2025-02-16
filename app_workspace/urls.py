from django.urls import path

from app_workspace.views import *

urlpatterns = [
    path("overview", view=overview, name="overview"),
]
