import os
import shutil
from django.utils.timezone import now
from django.db import models
from app_user.models import User
from visualization import settings


# upload file to user_id/file/y/m/d
def user_directory_path(instance, filename):
    return os.path.join(f"{instance.user.id}/file", filename)


class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to=user_directory_path)
    title = models.CharField(max_length=255)
    description = models.TextField()
    upload = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "file"

    @classmethod
    def upload_file(cls, user_id, uploaded_file, title=None, description=""):
        return File.objects.create(
            user=User.objects.get(id=user_id),
            file=uploaded_file,
            title=title if title else uploaded_file.name,
            description=description,
        )

    # return file tree structure
    @classmethod
    def load_folder_tree(cls, folder_path, user_id):
        tree = {}
        folders = []
        files = []
        for item in sorted(os.listdir(folder_path)):  # Sort for consistency
            item_path = os.path.join(folder_path, item)
            if os.path.isdir(item_path):
                folders.append(item)
            else:
                files.append(item)
        for folder in folders:  # Process folders first
            next_folder_path = os.path.join(folder_path, folder)
            tree[folder] = File.load_folder_tree(next_folder_path, user_id)
        media_url = settings.MEDIA_URL
        for file in files:  # Process files only after all folders are added
            file_path = os.path.relpath(os.path.join(folder_path, file), media_url)
            tree[file] = f"{media_url}{user_id}/file/{file_path}"
        return tree

    # create folder
    @classmethod
    def create_folder(cls, relative_path, user_id):
        user_folder = os.path.join(  # Construct the absolute folder path inside the user's directory
            settings.MEDIA_ROOT, f"{user_id}/file", relative_path
        )
        try:  #  Create folder, avoid errors if exists
            os.makedirs(user_folder, exist_ok=True)
            return True
        except Exception as e:
            return False

    # rename file or folder
    @classmethod
    def rename_file(cls, old_path, new_path):
        try:
            os.rename(old_path, new_path)  # Rename file/folder
            return True
        except Exception as e:
            return False

    # move the file or folder
    @classmethod
    def move_file(cls, old_path, new_path):
        try:
            # Ensure the target directory exists
            os.makedirs(os.path.dirname(new_path), exist_ok=True)
            # Move the file or folder
            shutil.move(old_path, new_path)
            return True
        except Exception as e:
            return False

    # delete the file or folder
    @classmethod
    def delete_file(cls, full_path):
        try:
            shutil.rmtree(full_path) if os.path.isdir(full_path) else os.remove(full_path)
            return True
        except Exception as e:
            return False