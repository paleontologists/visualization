from django.shortcuts import render
from django.conf import settings
from visualization.settings import TEMPLATE_PATHS

#测试
# view for home page inlcuding the navigator
def home(request):
    username = request.session.get("username", "guest")
    return render(request, TEMPLATE_PATHS["home"], {"username": username})


# view for introduction iframe page
def introduction(request):
    return render(request, TEMPLATE_PATHS["introduction"], {"data": "introduction"})


# view for models iframe page
def models(request):
    return render(
        request,
        TEMPLATE_PATHS["models"],
        {"data": "models", "media_test": settings.MEDIA_URL + "test1.png"},
    )


# view for workspace iframe page
def workspace(request):
    return render(request, TEMPLATE_PATHS["workspace"], {"data": "workspace"})


# view for support iframe page
def support(request):
    return render(request, TEMPLATE_PATHS["support"], {"data": "support"})


# view for fo to customer login page
def login_customer(request):
    return render(request, TEMPLATE_PATHS["login-customer"], {"data": "login_customer"})


# view for fo to customer register page
def register_customer(request):
    return render(request, TEMPLATE_PATHS["register"], {"data": "register"})
