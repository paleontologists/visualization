//add
document.addEventListener("DOMContentLoaded", function () {
    const addfileForm = document.getElementById("addfileForm");

    addfileForm.addEventListener("submit", function (e) {
        e.preventDefault();  // Prevent default submission behavior

        let formData = new FormData(addfileForm);  // Get form data

        fetch("{% url 'admin-file-add' %}", {  // Ensure that this URL exists in Django urls.py
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken  // Django CSRF protect
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert("Error adding file: " + data.error);
                }
            })
            .catch(error => console.error("Error:", error));
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const editModal = new bootstrap.Modal(document.getElementById("editfileModal")); // Get edit mode box
    const editFileForm = document.getElementById("editfileForm"); // Get Form
    let editFileId = null; // Store the file ID to be edited

    //Monitor all 'Edit' buttons and fill in modal boxes
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
            editFileId = this.getAttribute("data-id");
            document.getElementById("edit-title").value = this.getAttribute("data-title");
            document.getElementById("edit-description").value = this.getAttribute("data-description");

            // Update hidden field storage ID
            document.getElementById("edit-file-id").value = editFileId;
            editModal.show();
        });
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function () {
            deleteFileId = this.getAttribute("data-id");
            if (!confirm("Are you sure you want to delete this file?")) return;
            const formData = new FormData();
            formData.append("file_id", deleteFileId);
            fetch(adminFileDeleteUrl, {
                method: "POST",
                headers: { "X-CSRFToken": csrftoken },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        document.getElementById(`file-row-${deleteFileId}`).remove();
                    } else {
                        alert("Error deleting file.");
                    }
                })
                .catch(error => console.error("Error:", error));
        });
    });

    // Listening form submission
    editFileForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Block default submission

        if (!editFileId) {
            alert("Error: No file selected for editing!");
            return;
        }

        let formData = new FormData(editFileForm);
        formData.append("file_id", editFileId);

        // Send a request to the Django server
        fetch("{% url 'admin-edit-file' %}", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert("Error updating file: " + data.error);
                }
            })
            .catch(error => console.error("Error:", error));
    });
});

window.addEventListener('resize', function () {
    location.reload();
});