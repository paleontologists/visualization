from django.shortcuts import get_object_or_404, render
from app_user.models import User
from visualization.settings import TEMPLATE_PATHS

# Checks if the user is an admin
def is_admin(request):
    id = request.session.get("id")  # Get user ID from session
    if not id:  # If no ID in session, return False
        return False
    try:
        user = get_object_or_404(User, id=id)  # Get user object
        if user.group == "admin":
            return True  # Return True only if the user is an admin
    except:
        return False  # Return False if the user does not exist
    return False

# cheack if user has login
def is_login(request):
    username = request.session.get("username", "guest")
    if username == "guest":
        return False
    return True