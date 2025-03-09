from django.shortcuts import render
from app_user.models import User
from visualization.settings import TEMPLATE_PATHS


# view for user to login
def login(request):
    to_page = TEMPLATE_PATHS["home"]
    message = "connect error"
    data = {"message": message}
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        group, message, id = User.login(username, password)
        data.update({"message": message})
        if message == "login successful":
            # login success and return to home page for customer but go to admin page for admin
            if group == "admin":
                to_page = TEMPLATE_PATHS["admin-home"]
            # store user session so next time user don't need to login
            request.session["user_login"] = True
            request.session["username"] = username
            request.session["id"] = id
            request.session["work_project_list"] = []
            data.update({"username": username})
        else:
            to_page = TEMPLATE_PATHS["login-customer"]
    return render(request, to_page, data)


# view for customer to register
def register(request):
    to_page = TEMPLATE_PATHS["register"]
    message = "register"
    if request.method == "POST":
        # Create and save user
        username = request.POST["username"]
        password = request.POST["password"]
        message = User.register(username, password)
        if message == "success":
            # register successfully go to login page
            to_page = TEMPLATE_PATHS["login-customer"]
    return render(request, to_page, {"message": message})


# view for logout user
def logout(request):
    to_page = TEMPLATE_PATHS["home"]
    message = "home"
    username = "guest"
    request.session.flush()
    return render(request, to_page, {"message": message, "username": username})


# view for user center
def user_center(request):
    to_page = TEMPLATE_PATHS["user-center"]
    message = "user center"
    User.user_center(request.session["username"])
    return render(request, to_page, {"message": message})
