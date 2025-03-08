from django.urls import include, path
from app_customer.views import home
from app_project.views import *

urlpatterns = [
    path("overview", view=overview, name="overview"),
    path("create_project", view=create_project, name="create-project"),
    path("load_project", view=load_project, name="load-project"),
    path(
        "load_project/<int:project_id>/",
        view=load_project,
        name="load-project",
    ),
]
