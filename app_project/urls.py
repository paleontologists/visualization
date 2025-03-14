from django.urls import include, path
from app_customer.views import home
from app_project.views import *

urlpatterns = [
    path("overview", view=overview, name="overview"),
    path("create_project", view=create_project, name="create-project"),
    path("delete_project", view=delete_project, name="delete-project"),
    path("open_project", view=open_project, name="open-project"),
    path(
        "open_project/<int:project_id>/",
        view=open_project,
        name="open-project",
    ),
    path("load_project", view=load_project, name="work-load-project"),
    path(
        "load_project/<int:project_id>/",
        view=load_project,
        name="work-load-project",
    ),
    path("choose_file", view=choose_file, name="choose-file"),
    path("save_project", view=save_project, name="save-project"),
]
