# urls.py
from django.urls import path

from app_user.views import *

urlpatterns = [
    path("login", view=login, name="login"),
    path("register", view=register, name="register"),
    path("logout", view=logout, name="logout"),
    path("user_center", view=user_center, name="user-center"),
    path('user_profile', user_profile, name='user_profile'),
    path('user_update', update_profile, name='update_profile'),
    path('user_upload_photo', upload_photo, name='upload_photo'),
]
