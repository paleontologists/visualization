document.addEventListener("DOMContentLoaded", function () {
    fetch(userProfileUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById("first_name").value = data.first_name || "";
            document.getElementById("last_name").value = data.last_name || "";
            document.getElementById("email").value = data.email || "";
            document.getElementById("phone").value = data.phone || "";
            document.getElementById("gender").value = data.gender || "";
            document.getElementById("birth").value = data.birth || "";
            document.getElementById("location").value = data.location || "";
            document.getElementById("introduction").value = data.introduction || "";
            document.getElementById("profile_photo").src = data.profile_photo || "";
            document.getElementById("project_count").innerText = data.project_count || "0";
            document.getElementById("file_count").innerText = data.file_count || "0";
        })
        .catch(error => console.error("Error loading profile:", error));
});

// update
document.getElementById("upload-photo-btn").addEventListener("click", function () {
    let fileInput = document.getElementById("upload-photo");
    console.log(fileInput.files);
    if (fileInput.files.length == 0) {
        alert("Please select an image!");
        return;
    }

    let formData = new FormData();
    formData.append("photo", fileInput.files[0]);

    fetch(uploadPhotoUrl, {
        method: "POST",
        body: formData,
        headers: {
            "X-CSRFToken": csrftoken
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.photo_url) {
                document.getElementById("profile_photo").src = data.photo_url; // return photo URL
                alert("Photo uploaded successfully!");
            } else {
                alert("Upload failed!");
            }
        })
        .catch(error => console.error("Error uploading photo:", error));
});
