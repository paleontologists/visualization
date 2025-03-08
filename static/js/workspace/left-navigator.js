// left navigator DataVizHub
document.querySelectorAll('#sideNav .nav-link').forEach(function (navLink) {
    navLink.addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelectorAll('#sideNav .nav-link').forEach(function (link) {
            link.classList.remove('active');
        });
        this.classList.add('active');
        document.getElementById('workFrame').src = this.getAttribute('data-url');
    });
});

// left navigator click handling (for existing sidebar links)
document.querySelectorAll('#sideNav .nav-link').forEach(function (navLink) {
    navLink.addEventListener('click', function (event) {
        event.preventDefault();
        activeSidebar(this, this.getAttribute('data-url'));
    });
});

// Attach event listeners for existing "remove-project" buttons
document.querySelectorAll('.remove-project').forEach(button => {
    button.addEventListener('click', function () {
        const projectId = this.getAttribute('data-id');
        removeProjectFromSidebar(projectId);
    });
});

// Function to add a new project link to the sidebar and activate it
function addProjectToSidebar(projectId, projectName, projectUrl) {
    const sideNav = document.getElementById("sideNav");

    // Create wrapper div for project item
    const newNavItem = document.createElement("div");
    newNavItem.classList.add("d-flex", "align-items-center", "justify-content-between", "nav-item");
    newNavItem.id = `project-${projectId}`;

    // Create project link
    const projectLink = document.createElement("a");
    projectLink.classList.add("nav-link", "flex-grow-1");
    projectLink.href = "#";
    projectLink.innerText = projectName;
    projectLink.setAttribute("data-url", projectUrl);

    // Create "X" remove button
    const removeButton = document.createElement("button");
    removeButton.classList.add("btn", "btn-sm", "btn-danger", "remove-project");
    removeButton.innerText = "x";
    removeButton.setAttribute("data-id", projectId);

    // Append elements to sidebar
    newNavItem.appendChild(projectLink);
    newNavItem.appendChild(removeButton);
    sideNav.appendChild(newNavItem);

    // Add event listener to project link
    projectLink.addEventListener("click", function (event) {
        event.preventDefault();
        activeSidebar(this, projectUrl);
    });

    // Add event listener to "X" remove button
    removeButton.addEventListener("click", function () {
        removeProjectFromSidebar(projectId);
    });

    // Activate the new project
    activeSidebar(projectLink, projectUrl);
}

// click sidebar to change iframe, or create or load project to change iframe
function activeSidebar(linkElement, projectUrl) {
    document.querySelectorAll("#sideNav a, #sideNav div a").forEach(item => item.classList.remove("active"));
    linkElement.classList.add('active');
    document.getElementById('workFrame').src = projectUrl;
}

// Function to remove a project from the sidebar
function removeProjectFromSidebar(projectId) {
    fetch(`${removeSessionProject}/${projectId}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const overviewLink = document.getElementById("workspace-overview");
            activeSidebar(overviewLink, overviewLink.getAttribute("data-url"));
            document.getElementById(`project-${projectId}`).remove();
        })
        .catch(error => console.error('Error:', error));
}