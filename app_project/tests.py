from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch

from app_project.views import load_project 
from app_project.models import Project
from app_user.models import User
from tool.session_check import is_login
from visualization.settings import TEMPLATE_PATHS

class LoadProjectViewTest(TestCase):
    def setUp(self):
        """Set up the test client and test data"""
        self.client = Client()
        self.url = reverse("work-load-project", args=[1])
        self.session = self.client.session

    @patch("tool.session_check.is_login", return_value=False)
    def test_redirects_if_not_logged_in(self, mock_is_login):
        """Test that non-logged-in users are redirected to home"""
        self.session["username"] = None
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, TEMPLATE_PATHS["home"])
        self.assertContains(response, "guest")

    @patch("tool.session_check.is_login", return_value=True)
    @patch("app_project.models.Project.load_project", return_value=None)
    def test_project_not_found(self, mock_is_login, mock_load_project):
        """Test that it renders work-home when the project is not found"""
        self.session["username"] = "123" 
        self.session.save()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, TEMPLATE_PATHS["work-home"])

    @patch("tool.session_check.is_login", return_value=True)
    @patch("app_project.models.Project.load_project", return_value={"id": 1, "name": "Test Project"})
    def test_project_found(self, mock_is_login, mock_load_project):
        """Test that it renders project template when the project exists"""
        self.session["username"] = "123" 
        self.session.save()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, TEMPLATE_PATHS["project"])
