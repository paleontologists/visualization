# urls.py
from django.urls import path

from app_customer.views import *
from . import views
from django.conf.urls.static import static
urlpatterns = [
    path("introduction", view=introduction, name="introduction"),
    path("models", view=models, name="models"),
    path("workspace", view=workspace, name="workspace"),
    path("support", view=support, name="support"),
    path("login_customer", view=login_customer, name="login-customer"),
    path("register_customer", view=register_customer, name="register-customer"),
    path('contact-us', views.contact_us, name='contact_us'),
    path('about-us', views.about_us, name='about_us'),
    path('support-us', views.support_us, name='support_us'),
    path('support', views.support, name='support'), 
    path("donate", views.donate, name="donate"),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


