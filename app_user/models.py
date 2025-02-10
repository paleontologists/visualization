from django.db import models
from flask import send_file
from visualization.settings import EMAIL_HOST_USER


class User(models.Model):
    group = models.CharField(max_length=8, default="customer")
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    birth = models.DateField(blank=True, null=True)
    introduction = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    photo = models.ImageField(upload_to="photos/%Y/%m/%d/", blank=True, null=True)
    status = models.CharField(max_length=20, default="inactive")
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user"

    # Additional fields can be added here
    def __str__(self):
        return self.email

    @classmethod
    def emailTest(cls, email=""):
        print("ready to send")
        send_file(
            "IT项目系统发邮件",
            "由系统发送的邮件",
            EMAIL_HOST_USER,  # From email
            [email],  # To email
            fail_silently=False,
        )
        print("send to ", email)
