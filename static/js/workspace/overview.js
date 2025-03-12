// Create or load a project
document.addEventListener("DOMContentLoaded", function () {
    // Create a project
    document.querySelector(".btn-primary").addEventListener("click", function () {
        fetch(createProjectUrl, {
            method: "POST",
            headers: { "X-CSRFToken": csrftoken },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(data => {
                window.parent.addProjectToSidebar(data.project_id, data.project_title);
                window.location.href = toOverview;
            });
    });

    // open existing and dynamically added projects
    document.querySelector("tbody").addEventListener("click", function (event) {
        const row = event.target.closest("tr");
        if (!row) return;
        const projectId = row.querySelector("td:first-child").innerText.trim();
        if (event.target.classList.contains("btn-info")) {
            const projectTitle = row.querySelector("td:nth-child(2)").innerText.trim();
            fetch(`${openProjectUrl}/${projectId}`, { method: "GET" })
                .then(response => response.json())
                .then(data => { window.parent.addProjectToSidebar(projectId, projectTitle); })
                .catch(error => console.error("Error:", error));
        } else if (event.target.classList.contains("btn-secondary")) {
            const existingProject = window.parent.document.getElementById(`project-${projectId}`);
            const projectUrl = `${loadProjectUrl}/${projectId}`;
            window.parent.activeSidebar(existingProject.querySelector(".nav-link"), projectUrl);
        }
    });

    // Delete project
    document.querySelector("tbody").addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-project")) {
            const row = event.target.closest("tr");
            const projectId = row.querySelector("td:first-child").innerText.trim();
            fetch(deleteProjectUrl, {
                method: "POST",
                headers: { "X-CSRFToken": csrftoken },
                body: JSON.stringify({ "project_id": projectId })
            })
                .then(response => response.json())
                .then(data => {
                    showAlert("Project deleted successfully!", "success");
                    row.remove();
                    window.parent.removeProjectFromSidebar(projectId);
                })
                .catch(error => console.error("Error:", error));
        }
    });

    // Initial execution to update buttons
    updateProjectButtons(true);

    // event listener for messages from parent
    window.addEventListener("message", function (event) {
        if (event.data && event.data.type === "updateProjectList") {
            updateProjectButtons(); // Execute function when message is received
        }
    });
});

// this make Open -> View
function updateProjectButtons(init = false) {
    document.querySelectorAll("tbody tr").forEach(row => {
        const projectId = parseInt(row.cells[0].textContent.trim()); // Get project ID from first column
        const button = row.querySelector(".btn-info, .btn-secondary");
        const buttonText = button.textContent.trim()
        const isInList = window.parent.workProjectList.some(p => p.id == projectId)
        if (buttonText == "Open" && isInList) {
            button.textContent = "View"; // Change text to "View"
            button.classList.remove("btn-info");
            button.classList.add("btn-secondary"); // Change color to gray
        } else if (buttonText == "View" && !isInList) {
            button.textContent = "Open";
            button.classList.remove("btn-secondary");
            button.classList.add("btn-info");
        }
    });
}


// Function to show a floating alert message
function showAlert(message, type = "success") {
    const alertBox = document.createElement("div");
    alertBox.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x m-3 p-2`;
    alertBox.style.zIndex = "1050"; // Ensure it's on top
    alertBox.innerText = message;
    document.body.appendChild(alertBox);

    // Automatically remove alert after 2 seconds
    setTimeout(() => {
        alertBox.remove();
    }, 2000);
}