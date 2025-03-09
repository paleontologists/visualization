document.addEventListener("DOMContentLoaded", function () {
    loadFiles();
});

// Function to load files dynamically
let currentPath = []; // Tracks the current navigation path
let fileStructure = {}; // Stores the entire file structure in memory

function loadFiles() {
    fetch(updateUrl, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fileStructure = data.structure; // Store the entire structure in memory
                console.log("File Structure Loaded:", fileStructure);
                displayFiles(currentPath);
            } else {
                alert("Failed to load files: " + data.error);
            }
        })
        .catch(error => console.error("Error loading files:", error));
}

function displayFiles(path = []) {
    let fileList = document.getElementById("fileList");
    let pathDisplay = document.getElementById("filePath");
    fileList.innerHTML = ""; // Clear previous list
    
    // ✅ Update Path Display (Breadcrumb)
    updatePathDisplay(path);

    // ✅ Navigate through the stored file structure
    let folderContents = fileStructure;
    for (const folder of path) {
        if (folderContents[folder] && typeof folderContents[folder] === "object") {
            folderContents = folderContents[folder]; // Navigate deeper
        } else {
            console.error("Invalid path:", folder);
            return;
        }
    }

    // ✅ Create File/Folder List
    for (const key in folderContents) {
        let item = document.createElement("li");
        item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        if (typeof folderContents[key] === "object") {
            // ✅ Folder: Clicking navigates inside
            let folderLink = document.createElement("span");
            folderLink.textContent = "📁 " + key;
            folderLink.style.cursor = "pointer";
            folderLink.onclick = function () {
                currentPath.push(key);
                displayFiles(currentPath); // ✅ Load from memory instead of Django
            };
            item.appendChild(folderLink);
        } else {
            // ✅ File: Clicking opens the file
            let fileLink = document.createElement("a");
            fileLink.href = folderContents[key]; // File URL
            fileLink.textContent = key; // File name
            fileLink.target = "_blank"; // Open in new tab
            fileLink.classList.add("custom-link");
            item.appendChild(fileLink);
        }

        // ✅ Add Delete Button
        let deleteButton = document.createElement("span");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = function () {
            deleteFileOrFolder(key, path);
        };
        item.appendChild(deleteButton);

        fileList.appendChild(item);
    }
}

// ✅ Update Path Display (Breadcrumb)
function updatePathDisplay(path) {
    let pathDisplay = document.getElementById("filePath");
    pathDisplay.innerHTML = ""; // Clear previous path

    let homeLink = document.createElement("span");
    homeLink.textContent = "🏠 Home";
    homeLink.style.cursor = "pointer";
    homeLink.onclick = function () {
        currentPath = [];
        displayFiles(currentPath); // ✅ Load from memory instead of Django
    };
    pathDisplay.appendChild(homeLink);

    let tempPath = [];
    for (let i = 0; i < path.length; i++) {
        tempPath.push(path[i]);

        let separator = document.createTextNode(" / ");
        pathDisplay.appendChild(separator);

        let folderLink = document.createElement("span");
        folderLink.textContent = path[i];
        folderLink.style.cursor = "pointer";
        folderLink.onclick = function () {
            currentPath = tempPath.slice(0, i + 1);
            displayFiles(currentPath); // ✅ Load from memory instead of Django
        };

        pathDisplay.appendChild(folderLink);
    }
}

// ✅ Function to Delete File or Folder
function deleteFileOrFolder(name, path) {
    let confirmDelete = confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;

    let fullPath = [...path, name].join("/"); // Convert to string path
    fetch(deleteUrl, { // Make sure deleteUrl is defined in your Django template
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCSRFToken() },
        body: JSON.stringify({ path: fullPath })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`"${name}" deleted successfully.`);
                loadFiles(path); // Refresh the file list
            } else {
                alert("Failed to delete: " + data.error);
            }
        })
        .catch(error => console.error("Error deleting file/folder:", error));
}


// Function to delete a file
function deleteFile(fileId) {
    fetch(`${deleteUrl}${fileId}/`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("File deleted successfully!");
                loadFiles();
            } else {
                alert("Delete failed: " + data.error);
            }
        })
        .catch(error => console.error("Delete error:", error));
}

// Function to update a file
function updateFile(fileId, fileName) {
    const newFile = prompt(`Enter the new file name for replacing "${fileName}":`);
    if (!newFile) return;

    const formData = new FormData();
    formData.append("file", newFile);

    fetch(`${updateUrl}${fileId}/`, { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("File updated successfully!");
                loadFiles();
            } else {
                alert("Update failed: " + data.error);
            }
        })
        .catch(error => console.error("Update error:", error));
}
