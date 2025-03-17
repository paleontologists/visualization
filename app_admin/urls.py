# urls.py
from django.urls import path

from app_admin import views



urlpatterns = [
    path('admin-home/', views.admin_home, name='admin-home'),
    path('admin-user/', views.admin_user, name='admin-user'),
    path('admin-user-delete/', views.admin_user_delete, name='admin-user-delete'),
    path("admin-add-user/", views.admin_add_user, name="admin-user-add"),
    path("admin-edit-user/", views.admin_edit_user, name="admin-user-edit"),
    path('admin-project/', views.admin_project, name='admin-project'),
    path('admin-file/', views.admin_file, name='admin-file'),

    path('admin-project-add/', views.admin_project_add, name='admin-project-add'),
    path('admin-project-delete/', views.admin_project_delete, name='admin-project-delete'),
    path("admin-edit-project/", views.admin_edit_project, name="admin-project-edit"),

    path('admin-file-add/', views.admin_file_add, name='admin-file-add'),
    path('admin-file-delete/', views.admin_file_delete, name='admin-file-delete'),
    path("admin-edit-file/", views.admin_edit_file, name="admin-edit-file"),

    path('admin-user-count/', views.admin_user_count, name='admin_user_count'),
    path('admin-project-count/', views.admin_project_count, name='admin_project_count'),
    path('admin-file-count/', views.admin_file_count, name='admin_file_count'),  
]
