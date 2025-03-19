from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch
from django.conf import settings
import os
import json

from app_file.views import work_load_file
from app_file.models import File
from tool.session_check import is_login
from visualization.settings import TEMPLATE_PATHS

class WorkLoadFileViewTest(TestCase):
    def setUp(self):
        """Set up the test client and test data"""
        self.client = Client()
        self.url = reverse("work-load-file") 
    
    @patch("tool.session_check.is_login", return_value=False)
    def test_redirects_if_not_logged_in(self, mock_is_login):
        """Test that non-logged-in users are redirected to home"""
        session = self.client.session
        session["username"] = "guest"
        session.save()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, TEMPLATE_PATHS["home"])
        self.assertContains(response, "guest")