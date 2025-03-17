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

