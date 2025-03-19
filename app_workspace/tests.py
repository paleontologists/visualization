from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch
import json

from app_workspace.views import remove_session_project 
from tool.session_check import is_login
from visualization.settings import TEMPLATE_PATHS


class RemoveSessionProjectTest(TestCase):
    def setUp(self):
        """Set up the test client and session"""
        self.client = Client()
        self.url = reverse("remove-session-project", args=[1]) 

    @patch("tool.session_check.is_login", return_value=False)
    def test_redirects_if_not_logged_in(self, mock_is_login):
        """Test that non-logged-in users are redirected to home"""
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, TEMPLATE_PATHS["home"])
        self.assertContains(response, "guest")

    @patch("tool.session_check.is_login", return_value=True)
    def test_project_removed_if_exists(self, mock_is_login):
        """Test that the project is removed from the session"""
        session = self.client.session
        session["work_project_list"] = [
            {"id": "1", "name": "Project A"},
            {"id": "2", "name": "Project B"},
        ]
        session.save()
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)

    @patch("tool.session_check.is_login", return_value=True)
    def test_project_not_in_session(self, mock_is_login):
        """Test that the request still succeeds if the project is not in the session"""
        session = self.client.session
        session["work_project_list"] = [
            {"id": "2", "name": "Project B"},
        ]
        session.save()
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)
        # session still contains project B but never had project 1
        session = self.client.session
        self.assertEqual(session["work_project_list"], [{"id": "2", "name": "Project B"}])