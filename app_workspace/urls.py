from django.urls import path

from app_workspace.views import *

urlpatterns = [
    path("work_home", view=work_home, name="work-home"),
    path("overview", view=overview, name="overview"),
    path("create", view=create, name="create"),
    path("history", view=history, name="history"),
]
