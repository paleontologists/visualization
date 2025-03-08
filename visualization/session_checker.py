from django.shortcuts import redirect
from django.conf import settings

from visualization.settings import TEMPLATE_PATHS

class SessionCheck:
    """Custom session validation class for checking user authentication status."""

    @staticmethod
    def guest_get_off(request):
        """
        Check if the session username is 'guest'.
        Returns True if the user is a guest, otherwise False.
        """
        username = request.session.get("username", "guest")
        return request.session.get("username", "guest") == "guest"

    @staticmethod
    def require_login(request):
        """
        Redirect 'guest' users to the home page.
        If user is a guest, return a redirect response to the home page.
        Otherwise, return None (meaning no redirect is needed).
        """
        if SessionCheck.is_guest(request):
            return redirect(settings.TEMPLATE_PATHS["home"])
        return None
