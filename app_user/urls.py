# urls.py
from django.urls import path

from app_user.views import *

urlpatterns = [
    path("login", view=login, name="login"),
    path("register", view=register, name="register"),
    path("logout", view=logout, name="logout"),
    path("user_center", view=user_center, name="user-center"),
]
