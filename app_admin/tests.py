from django.test import TestCase, Client
from django.urls import reverse

from app_user.models import User
from visualization.settings import TEMPLATE_PATHS

class AdminHomeViewTest(TestCase):
    def setUp(self):
        """Set up test client and test user"""
        self.client = Client()
        self.admin_url = reverse("admin-home")  # Ensure the correct URL name
        # Create a test admin user
        self.admin_user = User.objects.create(id=1, username="admin", group="admin")
        # Create a test non-admin user
        self.non_admin_user = User.objects.create(id=2, username="regular_user", group="customer")

    def test_admin_in(self):
        """Test when session has an ID"""
        session = self.client.session
        session["username"] = "admin_user"
        session["id"] = self.admin_user.id 
        session.save()
        response = self.client.get(self.admin_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "admin/admin-home.html")  # Should be admin page

    def test_customer_in(self):
        """Test when session has an ID and user is a non-admin"""
        session = self.client.session
        session["username"] = "regular_user"
        session["id"] = self.non_admin_user.id
        session.save()
        response = self.client.get(self.admin_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, TEMPLATE_PATHS["home"])  # Should redirect to home
        self.assertContains(response, "regular_user")  # Ensure username is displayed
        
