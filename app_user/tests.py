from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch
import json

from app_user.views import user_profile
from app_user.models import User
from visualization.settings import TEMPLATE_PATHS
from tool.session_check import is_login

class UserProfileViewTest(TestCase):
    def setUp(self):
        """Set up the test client and test user"""
        self.client = Client()
        self.url = reverse("user_profile") 
        
        # Create a test user
        self.test_user = User.objects.create(
            id=1,
            first_name="John",
            last_name="Doe",
            email="johndoe@example.com",
            phone="1234567890",
            gender="Male",
            birth="1990-01-01",
            location="New York",
            introduction="Hello, I'm John!",
            photo=None,  # No profile photo
        )

    @patch("tool.session_check.is_login", return_value=False)
    def test_redirects_if_not_logged_in(self, mock_is_login):
        """Test that non-logged-in users are redirected to home"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, TEMPLATE_PATHS["home"])
        self.assertContains(response, "guest")

    @patch("tool.session_check.is_login", return_value=True)
    def test_user_not_found(self, mock_is_login):
        """Test that a 404 error is returned if the user is not found"""
        response = self.client.get(self.url)
        self.assertTemplateUsed(response, TEMPLATE_PATHS["home"])

    @patch("tool.session_check.is_login", return_value=True)
    @patch("app_file.models.User.project", return_value=5)
    @patch("app_file.models.User.file", return_value=10)
    def test_user_profile_returns_correct_data(self, mock_is_login, mock_project, mock_file):
        """Test that user profile returns correct JSON response"""
        session = self.client.session
        session["id"] = self.test_user.id  # Simulated logged-in user
        session["username"] = "John"
        session.save()

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        json_data = json.loads(response.content.decode())
        self.assertEqual(json_data["first_name"], "John")
        self.assertEqual(json_data["last_name"], "Doe")
        self.assertEqual(json_data["email"], "johndoe@example.com")
        self.assertEqual(json_data["phone"], "1234567890")
        self.assertEqual(json_data["gender"], "Male")
        self.assertEqual(json_data["birth"], "1990-01-01")
        self.assertEqual(json_data["location"], "New York")
        self.assertEqual(json_data["introduction"], "Hello, I'm John!")
        self.assertEqual(json_data["profile_photo"], None)  # No photo
        self.assertEqual(json_data["project_count"], 5)  # Mocked project count
        self.assertEqual(json_data["file_count"], 10)  # Mocked file count
