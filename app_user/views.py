from django.shortcuts import render
from app_user.models import User
from tool.session_check import is_login
from visualization.settings import TEMPLATE_PATHS
import json
from django.http import JsonResponse


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
    user_id = request.session.get("id")
    User.logout(user_id)
    request.session.flush()
    return render(request, to_page, {"message": message, "username": username})


# view for user center
def user_center(request):
    to_page = TEMPLATE_PATHS["user-center"]
    return render(request, to_page)


# user center get profile
def user_profile(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_id = request.session.get("id")
    try:
        user = User.objects.get(id=user_id)
    except:
        return JsonResponse({"error": "User not found"}, status=404)

    # count user files and projects
    project_count = User.project(user_id)
    file_count = User.file(user_id)
    user_info = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone": user.phone,
        "gender": user.gender,
        "birth": user.birth.strftime("%Y-%m-%d") if user.birth else "",
        "location": user.location,
        "introduction": user.introduction,
        "profile_photo": user.photo.url if user.photo else None,
        "project_count": project_count,
        "file_count": file_count,
    }
    return JsonResponse(user_info)


# user update profile
def update_profile(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    if request.method == "POST":
        try:    
            # get current user
            user_id = request.session.get("id")
            user = User.objects.get(id=user_id)
            # update
            user.first_name = request.POST.get("first_name", user.first_name)
            user.last_name = request.POST.get("last_name", user.last_name)
            user.email = request.POST.get("email", user.email)
            user.phone = request.POST.get("phone", user.phone)
            user.gender = request.POST.get("gender", user.gender)
            user.birth = request.POST.get("birth", user.birth)
            user.location = request.POST.get("location", user.location)
            user.introduction = request.POST.get("introduction", user.introduction)
            user.save()
            to_page = TEMPLATE_PATHS["user-center"]
            return render(request, to_page)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)


# upload photo for user
def upload_photo(request):
    if not is_login(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    if request.method == "POST":
        user_id = request.session.get("id")
        # makesure user has login
        if not user_id:
            return JsonResponse({"error": "User not logged in"}, status=403)
        try:
            user = User.objects.get(id=user_id)
            if "photo" in request.FILES:
                user.photo = request.FILES["photo"]
                user.save()
                return JsonResponse(
                    {
                        "message": "Profile updated successfully!",
                        "photo_url": user.photo.url,
                    }
                )
            else:
                return JsonResponse({"error": "No file uploaded"}, status=400)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

    return JsonResponse({"error": "Invalid request"}, status=400)
