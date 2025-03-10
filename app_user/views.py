from django.shortcuts import render
from app_user.models import User
from visualization.settings import TEMPLATE_PATHS
from django.http import JsonResponse
from django.core.files.base import ContentFile
from django.conf import settings
import os

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

def user_profile(request):
    user_id = request.session.get("id")
    user = User.objects.get(id=user_id)
    user_info = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone": user.phone,
        "gender": user.gender,
        "birth": user.birth.strftime("%Y-%m-%d") if user.birth else "",
        "location": user.location,
        "introduction": user.introduction,
    }
    return JsonResponse(user_info)


def update_profile(request):
    if request.method == "POST":
        try:
            user_id= request.session.get("id")
            print(user_id)
            user = User.objects.get(id=user_id) 
            # 更新用户信息
            user.first_name = request.POST.get("first_name", user.first_name)
            user.last_name = request.POST.get("last_name", user.last_name)
            user.phone = request.POST.get("phone", user.phone)
            user.gender = request.POST.get("gender", user.gender)
            user.birth = request.POST.get("birth", user.birth)
            user.location = request.POST.get("location", user.location)
            user.introduction = request.POST.get("introduction", user.introduction)

            user.save()  # 保存更改
            return JsonResponse({"message": "Profile updated successfully!"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

def upload_photo(request):
    """使用 session 让用户登录后才能上传头像"""
    if request.method == "POST" and request.FILES.get("photo"):
        user_id = request.session.get("id")  # ✅ 从 session 获取用户 ID
        if not user_id:
            return JsonResponse({"error": "User not logged in"}, status=403)

        try:
            user = User.objects.get(id=user_id)
            photo = request.FILES["photo"]

            # 删除旧头像（可选）
            if user.photo:
                old_photo_path = os.path.join(settings.MEDIA_ROOT, str(user.photo))
                if os.path.exists(old_photo_path):
                    os.remove(old_photo_path)

            # 保存新头像
            user.photo.save(photo.name, ContentFile(photo.read()))
            user.save()

            return JsonResponse({"message": "Photo uploaded successfully!", "photo_url": user.photo.url})
        
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

    return JsonResponse({"error": "No file uploaded"}, status=400)
