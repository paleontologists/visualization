# urls.py
from django.urls import path

from app_customer.views import *

urlpatterns = [
    path("introduction", view=introduction, name="introduction"),
    path("models", view=models, name="models"),
    path("workspace", view=workspace, name="workspace"),
    path("support", view=support, name="support"),
    path("login_customer", view=login_customer, name="login-customer"),
    path("register_customer", view=register_customer, name="register-customer"),
]
