from django.urls import path

from app_workspace.views import *

urlpatterns = [
    path("work_home", view=work_home, name="work-home"),
    path("project", view=project, name="project"),
    path(
        "remove_session_project",
        remove_session_project,
        name="remove-session-project",
    ),
    path(
        "remove_session_project/<int:project_id>/",
        remove_session_project,
        name="remove-session-project",
    ),
    path("history", view=history, name="history"),
]
