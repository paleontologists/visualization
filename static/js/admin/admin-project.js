//add
document.addEventListener("DOMContentLoaded", function () {
    const addProjectForm = document.getElementById("addProjectForm");

    addProjectForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(addProjectForm);

        fetch(adminProjectAddUrl, {
            method: "POST",
            headers: { "X-CSRFToken": csrftoken },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload(); // Refresh the page after success
                } else {
                    alert("Error adding project: " + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
    });
});

window.addEventListener('resize', function () {
    location.reload();
});

// delete  
function deleteProject(projectId) {
    if (!confirm("Are you sure you want to delete this profect?")) return;
    const formData = new FormData();
    formData.append("project_id", projectId);  // Transfer data in form format
    fetch(adminProjectDeleteUrl, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                document.getElementById(`project-row-${projectId}`).remove();
            } else {
                alert("Error deleting project.");
            }
        })
        .catch(error => console.error("Error:", error));
}

//edit
document.addEventListener("DOMContentLoaded", function () {
    const editButtons = document.querySelectorAll(".edit-btn");
    const saveButton = document.getElementById("saveChangesBtn");

    let editProjectIdInput = document.getElementById("edit-project-id");
    let editTitleInput = document.getElementById("edit-title");
    let editDescriptionInput = document.getElementById("edit-description");

    // Monitor the "Edit" button click event
    editButtons.forEach(button => {
        button.addEventListener("click", function () {
            let projectId = this.getAttribute("data-id");
            let projectTitle = this.getAttribute("data-title");
            let projectDescription = this.getAttribute("data-description");

            // Set values within the modal
            editProjectIdInput.value = projectId;
            editTitleInput.value = projectTitle;
            editDescriptionInput.value = projectDescription;
        });
    });

    // Monitor the 'Save Changes' button click event
    saveButton.addEventListener("click", function () {
        let projectId = editProjectIdInput.value;
        let newTitle = editTitleInput.value;
        let newDescription = editDescriptionInput.value;


        fetch(adminProjectEditUrl, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                project_id: projectId,
                title: newTitle,
                description: newDescription,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Project updated successfully!");
                    location.reload();
                } else {
                    alert("Error updating project: " + data.error);
                }
            })
            .catch(error => console.error("Error:", error));
    });
});
