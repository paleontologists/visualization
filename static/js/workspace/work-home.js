var workProjectList;
var overview;
document.addEventListener("DOMContentLoaded", function () {
    workProjectList = JSON.parse(document.getElementById("work_project_list").textContent);
    overview = document.getElementById("workspace-overview");
});

// left navigator click handling (for existing sidebar links)
document.querySelectorAll('#sideNav .nav-link').forEach(function (navLink) {
    navLink.addEventListener('click', function (event) {
        event.preventDefault();
        activeSidebar(this, this.getAttribute("data-url"));
    });
});

// Attach event listeners for existing "remove-project" buttons
document.querySelectorAll('.remove-project').forEach(button => {
    button.addEventListener('click', function () {
        const projectElement = this.closest(".nav-item");
        const projectId = projectElement.id.replace("project-", "");
        removeProjectFromSidebar(projectId, removeSessionProject);
    });
});

// Function to add a new project link to the sidebar and activate it
function addProjectToSidebar(projectId, projectTitle) {
    const sideNav = document.getElementById("sideNav");

    // Create wrapper div for project item
    const newNavItem = document.createElement("div");
    newNavItem.classList.add("d-flex", "align-items-center", "justify-content-between", "nav-item");
    newNavItem.id = `project-${projectId}`;

    // Create project link
    const projectLink = document.createElement("a");
    projectLink.classList.add("nav-link", "flex-grow-1");
    projectLink.href = "#";
    projectLink.innerText = projectTitle;
    projectLink.setAttribute("data-url", `${loadProjectUrl}/${projectId}`);

    // Create "X" remove button
    const removeButton = document.createElement("button");
    removeButton.classList.add("btn", "btn-sm", "btn-danger", "remove-project");
    removeButton.innerText = "x";

    // Append elements to sidebar
    newNavItem.appendChild(projectLink);
    newNavItem.appendChild(removeButton);
    sideNav.appendChild(newNavItem);

    // Add event listener to project link
    projectLink.addEventListener("click", function (event) {
        event.preventDefault();
        activeSidebar(this, this.getAttribute("data-url"));
    });

    // Add event listener to "X" remove button
    removeButton.addEventListener("click", function () {
        removeProjectFromSidebar(projectId);
    });

    workProjectList.push({ id: projectId, name: projectTitle });

    // this tell iframe overview some project is opened or close
    const iframe = document.getElementById("workFrame");
    iframe.contentWindow.postMessage({ type: "updateProjectList" }, "*");
}


// click sidebar to change iframe, or create or load project to change iframe
function activeSidebar(linkElement, projectUrl) {
    document.querySelectorAll("#sideNav a, #sideNav div a").forEach(item => item.classList.remove("active"));
    linkElement.classList.add('active');
    document.getElementById('workFrame').src = projectUrl;
}

// Function to remove a project from the sidebar
function removeProjectFromSidebar(projectId) {
    if (workProjectList.some(p => p.id == projectId)) {
        const activeProject = document.querySelector("#sideNav .nav-link.active");
        if (activeProject && activeProject.dataset.url.includes(`${loadProjectUrl}/${projectId}`))
            window.parent.activeSidebar(overview, toOverview);
        fetch(`${removeSessionProject}/${projectId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                optionOverview = window.document.getElementById("workspace-overview");
                document.getElementById(`project-${projectId}`).remove();
                workProjectList = workProjectList.filter(project => project.id != projectId);
                const iframe = document.getElementById("workFrame");
                iframe.contentWindow.postMessage({ type: "updateProjectList" }, "*");
            })
            .catch(error => console.error('Error:', error));
    }
}