window.addEventListener('resize', function () {
    location.reload();
});

//  delete
function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const formData = new FormData();
    formData.append("user_id", userId);
    fetch(adminUserDeleteUrl, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                document.getElementById(`user-row-${userId}`).remove();
            } else {
                alert("Error deleting user.");
            }
        })
        .catch(error => console.error("Error:", error));
}

// edit
document.addEventListener("DOMContentLoaded", function () {
    const editUserModal = document.getElementById("editUserModal");
    const editUserForm = document.getElementById("editUserForm");

    // Monitor the "Edit" button click event and fill in the form data
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.getElementById("edit-user-id").value = this.getAttribute("data-user-id");
            document.getElementById("edit-username").value = this.getAttribute("data-username");
            document.getElementById("edit-email").value = this.getAttribute("data-email");
            document.getElementById("edit-phone").value = this.getAttribute("data-phone");
            document.getElementById("edit-group").value = this.getAttribute("data-group");
            document.getElementById("edit-status").value = this.getAttribute("data-status");
        });
    });

    const saveChangesBtn = document.getElementById("saveChangesBtn");
    saveChangesBtn.addEventListener("click", function () {
        const userId = document.getElementById("edit-user-id").value;
        const username = document.getElementById("edit-username").value;
        const email = document.getElementById("edit-email").value;
        const phone = document.getElementById("edit-phone").value;
        const group = document.getElementById("edit-group").value;
        const status = document.getElementById("edit-status").value;
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("group", group);
        formData.append("status", status);

        fetch(adminUserEditUrl, {
            method: "POST",
            headers: { "X-CSRFToken": csrftoken },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("User updated successfully!");
                    location.reload();
                } else {
                    alert("Failed to update user: " + data.error);
                }
            })
            .catch(error => console.error("Error:", error));
    });
});


//add
document.addEventListener("DOMContentLoaded", function () {
    const addUserForm = document.getElementById("addUserForm");

    addUserForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(addUserForm);
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch(adminUserAddUrl, {
            method: "POST",
            headers: { "X-CSRFToken": csrftoken },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert("Error adding user: " + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
    });
});