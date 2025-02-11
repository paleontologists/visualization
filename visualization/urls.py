"""visualization URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings
from app_customer.views import home

urlpatterns = [
    # home page
    path("", view=home, name="home"),
    # app url
    path("admin/", include("app_admin.urls")),
    path("customer/", include("app_customer.urls")),
    path("file/", include("app_file.urls")),
    path("project/", include("app_project.urls")),
    path("user/", include("app_user.urls")),
    path("workspace/", include("app_workspace.urls")),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)