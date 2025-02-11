from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password

class UserLoginTest(TestCase):
    
    def setUp(self):
        # Create a test user with a hashed password
        self.username = "testuser"
        self.password = "testpassword"  # Original password
        self.hashed_password = make_password(self.password)  # Hash the password
        self.user = User.objects.create(username=self.username, password=self.hashed_password)

    def test_user_login_valid(self):
        # Test if the user can log in with correct password
        user = User.objects.get(username=self.username)
        self.assertTrue(check_password(self.password, user.password))  # Check password validity

    def test_user_login_invalid(self):
        # Test invalid login (wrong password)
        wrong_password = "wrongpassword"
        user = User.objects.get(username=self.username)
        self.assertFalse(check_password(wrong_password, user.password))  # Password should not match

    def test_user_creation(self):
        # Check if user was created successfully with the correct password
        user = User.objects.get(username=self.username)
        self.assertEqual(user.username, self.username)
        self.assertTrue(check_password(self.password, user.password))  # Password should match after hashing
