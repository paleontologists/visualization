import os
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.utils.timezone import now
from django.db import models
import pandas as pd
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

    # get the file by file FileField
    @classmethod
    def get_file_by_path(cls, full_path, user_id):
        try:
            user = User.objects.get(id=user_id)
            return File.objects.get(file=full_path, user=user)
        except Exception as e:
            return None

    # get file by id
    @classmethod
    def get_file_by_id(cls, file_id, user_id):
        try:
            user = User.objects.get(id=user_id)
            return File.objects.get(id=file_id, user=user)
        except Exception as e:
            return None

    # transform relative path to path for FileField
    @classmethod
    def path_FileField(cls, file_path, user_id):
        return os.path.join(f"{user_id}/file", file_path).replace("\\", "/").strip()

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

    # modify file or folder path or name in a tree process
    @classmethod
    def modify_file_path(cls, user_id, old_relative_path, new_relative_path):
        # Check if the old file/folder exists
        old_path = File.path_FileField(old_relative_path, user_id)
        if not default_storage.exists(old_path):
            return False, "file not exist"
        # Prevent overwriting an existing file/folder
        new_path = File.path_FileField(new_relative_path, user_id)
        if default_storage.exists(new_path):
            return False, "same name file"
        #  If it's a file, rename directly
        file = File.get_file_by_path(old_path, user_id)
        if file is not None:
            with default_storage.open(old_path, "rb") as old_file:
                default_storage.save(new_path, old_file)  # Save the file
            default_storage.delete(file.file.name)  # Delete old file
            file.file.name = new_path  # Update FileField path
            file.save()
            return True, "file"
        #  Handle folder renaming (Recursively modify files & subfolders)
        if default_storage.exists(old_path):
            subfolders, files = default_storage.listdir(old_path)
            #  Create new folder using a placeholder file
            placeholder_path = os.path.join(new_path, ".keep").replace("\\", "/")
            # Create folder with .keep file an empty .keep file
            default_storage.save(placeholder_path, ContentFile(""))
            #  Remove the `.keep` file after all files are moved
            default_storage.delete(placeholder_path)
            #  First move all files in the current directory
            for file_name in files:
                cls.modify_file_path(
                    user_id,
                    os.path.join(old_relative_path, file_name),
                    os.path.join(new_relative_path, file_name),
                )
            #  Then recursively move all subfolders
            for folder_name in subfolders:
                cls.modify_file_path(
                    user_id,
                    os.path.join(old_relative_path, folder_name),
                    os.path.join(new_relative_path, folder_name),
                )
            #  Delete the old folder after moving everything
            default_storage.delete(old_path)
            return True, "folder"
        return False, "error"

    # delete the file or folder
    @classmethod
    def delete_file(cls, relative_path, user_id):
        path = File.path_FileField(relative_path, user_id)
        #  Check if the file/folder exists
        if not default_storage.exists(path):
            return False, "file not exist"
        try:
            #  Try listing contents to check if it's a folder
            subfolders, files = default_storage.listdir(path)
            if files or subfolders:  #  If it has contents, delete them recursively
                for file_name in files:
                    cls.delete_file(os.path.join(relative_path, file_name), user_id)
                for folder_name in subfolders:
                    cls.delete_file(os.path.join(relative_path, folder_name), user_id)
            #  Delete the folder itself
            default_storage.delete(path)
            return True, "success"
        except Exception as e:
            # If listdir() fails, it means path is a file, so delete it
            file = File.get_file_by_path(path, user_id)
            if file:
                default_storage.delete(file.file.name)  #  Delete from storage
                file.delete()  #  Remove database record
                return True, "file deleted"
        return False, "error"

    # read csv or excel to json
    @classmethod
    def read_file_to_json(cls, file):
        file_name = file.file.name.lower()  # Get file name in lowercase
        try:
            # Open the file using Django's storage system (supports cloud storage too)
            with default_storage.open(file.file.name, "rb") as f:
                # Read Excel files
                if file_name.endswith((".xls", ".xlsx")):
                    df = pd.read_excel(f, engine="openpyxl")
                # Read CSV files
                elif file_name.endswith(".csv"):
                    df = pd.read_csv(f)
                else:
                    return False  # Unsupported format
            return df
        except Exception as e:
            return False
