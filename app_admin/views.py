from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from app_project.models import Project
from app_file.models import File
from app_user.models import User
from tool.session_check import is_admin
from visualization.settings import TEMPLATE_PATHS
from django.contrib.auth.hashers import make_password, check_password

def admin_home(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    return render(request, 'admin/admin-home.html')  

def admin_user(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    users = User.objects.all()  # Get all users
    return render(request, 'admin/admin-user.html', {'users': users,'count':users.count()})  # Transfer user data to the template


def admin_project(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    projects = Project.objects.all()  
    return render(request, 'admin/admin-project.html', {'projects': projects,'count':projects.count()})  

def admin_file(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    files = File.objects.all()  
    return render(request, 'admin/admin-file.html', {'files': files,'count':files.count()})  


def admin_user_delete(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_id = request.POST.get("user_id")
    user = get_object_or_404(User, id=user_id)
    user.delete()
    return JsonResponse({"message": "User deleted successfully"}, status=200)


def admin_add_user(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    if request.method == "POST":
        try:
            username = request.POST.get("username")
            password = request.POST.get("password")
            password = make_password(password)
            email = request.POST.get("email")
            phone = request.POST.get("phone")
            group = request.POST.get("group")
            status = request.POST.get("status")

            # Create a new user
            user = User.objects.create(
                username=username,
                password=password,
                email=email,
                phone=phone,
                group=group,
                status=status
            )
            return JsonResponse({"success": True, "message": user.id})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})
    return JsonResponse({"success": False, "error": "Invalid request"}, status=400)

def admin_edit_user(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    if request.method == "POST":
        user_id = request.POST.get("user_id")
        username = request.POST.get("username")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        group = request.POST.get("group")
        status = request.POST.get("status")

        # Find Users
        user = get_object_or_404(User, id=user_id)
        user.username = username
        user.email = email
        user.phone = phone
        user.group = group
        user.status = status
        user.save()

        return JsonResponse({"success": True})

    return JsonResponse({"success": False, "error": "Invalid request"}, status=400)



def admin_project_add(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    if request.method == "POST":
        username = request.POST.get("username")  
        title = request.POST.get("title")
        description = request.POST.get("description")

        # Ensure that the field is not empty
        if not username:
            return JsonResponse({"success": False, "message": "Username is required"}, status=400)
        if not title:
            return JsonResponse({"success": False, "message": "Title is required"}, status=400)

        # Retrieve user object (if it does not exist, return error)
        user = get_object_or_404(User, username=username)

        # Create a project and associate it with users
        project = Project.objects.create(user=user, title=title, description=description)

        return JsonResponse({"success": True, "message": "Project added successfully", "project_id": project.id})

    return JsonResponse({"success": False, "message": "Invalid request"}, status=400)


def admin_project_delete(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    to_page = TEMPLATE_PATHS["home"]
    username = request.session.get("username", "guest")
    data = {"username": username}
    id = request.session.get("id", "guest")
    user = get_object_or_404(User, id=id)
    if user.group != "admin":
        return render(request, to_page, data)

    project_id = request.POST.get("project_id")
    project = get_object_or_404(Project, id=project_id)
    project.delete()
    return JsonResponse({"message": "Project deleted successfully"}, status=200)

def admin_edit_project(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    if request.method == "POST":
        project_id = request.POST.get("project_id")
        title = request.POST.get("title")
        description = request.POST.get("description")

        # Use project_id to retrieve the project
        project = get_object_or_404(Project, id=project_id)

        project.title = title
        project.description = description
        project.save()

        return JsonResponse({"success": True})

    return JsonResponse({"success": False, "error": "Invalid request"}, status=400)

def admin_file_add(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    if request.method == "POST" and request.FILES.get("file"):
        title = request.POST.get("title")
        description = request.POST.get("description", "")
        file = request.FILES["file"]
        username = request.POST.get("username")
        user = get_object_or_404(User, username=username)

        new_file = File.objects.create(title=title, description=description, file=file, user=user)

        return JsonResponse({
            "success": True,
            "file": {
                "id": new_file.id,
                "title": new_file.title,
                "description": new_file.description,
                "url": new_file.file.url,
                "uploaded": new_file.upload.strftime("%Y-%m-%d %H:%M"),
                "preview": f'<img src="{new_file.file.url}" width="50">' if new_file.file.url.endswith((".jpg", ".png", ".jpeg")) else "View File"
            }
        })

    return JsonResponse({"success": False, "error": "Invalid request"}, status=400)


def admin_file_delete(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    file_id = request.POST.get("file_id")
    file = get_object_or_404(File, id=file_id)
    file.delete()
    return JsonResponse({"message": "File deleted successfully"}, status=200)

def admin_edit_file(request):  
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    if request.method == "POST":
        try:
            file_id = request.POST.get("file_id")
            file_obj = get_object_or_404(File, id=file_id)  # Retrieve file object

            file_obj.title = request.POST.get("title")
            file_obj.description = request.POST.get("description")
            file_obj.save()

            return JsonResponse({
                "success": True,
                "file": {
                    "id": file_obj.id,
                    "title": file_obj.title,
                    "description": file_obj.description,
                    "url": file_obj.file.url if file_obj.file else None,
                    "uploaded": file_obj.upload.strftime("%Y-%m-%d %H:%M"),
                }
            })

        except File.DoesNotExist:
            return JsonResponse({"success": False, "error": "File not found"}, status=404)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Invalid request"}, status=400)


def admin_user_count(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    user_count = User.objects.count()  
    return JsonResponse({"user_count": user_count})  

def admin_project_count(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    project_count = Project.objects.count()  
    return JsonResponse({"project_count": project_count})  

def admin_file_count(request):
    if not is_admin(request):
        return render(request, TEMPLATE_PATHS["home"], {"username": request.session.get("username", "guest")})
    file_count = File.objects.count()  
    return JsonResponse({"file_count": file_count})  