// Create or load a project
document.addEventListener("DOMContentLoaded", function () {
    // Create a project
    document.querySelector(".btn-primary").addEventListener("click", function () {
        fetch(createProjectUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(data => {
                createOrLoadProject(data.project_id, data.project_name);
            });
    });

    // Handle "View" button clicks for existing projects
    document.querySelectorAll(".btn-info").forEach(button => {
        button.addEventListener("click", function () {
            const projectName = this.closest("tr").querySelector("td:first-child").innerText;
            createOrLoadProject(projectName);
        });
    });
});

// create a new project and update UI
function createOrLoadProject(projectId, projectName) {
    const projectUrl = "project";
    window.parent.addProjectToSidebar(projectId, projectName, projectUrl);
    setTimeout(() => {
        window.parent.activeSidebar(projectName, projectUrl);
    }, 100);
}
