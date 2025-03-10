let currentPath = []; // Tracks the current navigation path
let fileStructure = {}; // Stores the entire file structure in memory

// request file tree from django
function loadFiles(manage = true) {
    fetch(loadFilesUrl, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            if (!data.success) return;
            fileStructure = data.structure; // Store the entire structure in memory
            displayFiles(currentPath, manage);
        })
        .catch(error => console.error("Error loading files:", error));
}

function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        alert("Please select a file to upload.");
        return;
    }
    let formData = new FormData();
    formData.append("file", fileInput.files[0]); // Append file to FormData
    fetch(uploadUrl, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            fileInput.value = ""; // Clear input after upload
            if (data.success) loadFiles(); // Refresh file list
            else alert("Upload failed: " + data.error);
        })
        .catch(error => console.error("Upload error:", error));
}

// display file tree in page
function displayFiles(path = [], manage = true) {
    let fileList = document.getElementById("fileList");
    let pathDisplay = document.getElementById("filePath");
    fileList.innerHTML = "";
    updatePathDisplay(path);

    let folderContents = fileStructure;
    for (const folder of path) {
        if (folderContents[folder] && typeof folderContents[folder] === "object") {
            folderContents = folderContents[folder];
        } else {
            console.error("Invalid path:", folder);
            return;
        }
    }

    //  Add "Back" option
    if (path.length > 0) {
        let backItem = document.createElement("li");
        backItem.classList.add("file-item", "back-item");
        backItem.textContent = "⬅️ Back";
        backItem.style.cursor = "pointer";
        backItem.onclick = function () {
            currentPath.pop();
            displayFiles(currentPath, manage);
        };
        fileList.appendChild(backItem);
    }

    //  Create Folder/File List
    for (const key in folderContents) {
        let item = document.createElement("li");
        item.classList.add("file-item", "d-flex", "justify-content-between", "align-items-center");

        let nameSpan = document.createElement("span");
        let modifyTimeSpan = document.createElement("span");
        modifyTimeSpan.classList.add("modify-time");

        if (typeof folderContents[key] === "object") {
            //  Folder: Clicking navigates inside
            nameSpan.textContent = "📁 " + key;
            nameSpan.style.cursor = "pointer";
            nameSpan.onclick = function () {
                currentPath.push(key);
                displayFiles(currentPath, manage);
            };
        } else {
            //  Create file link
            let fileLink = document.createElement("a");
            fileLink.href = "#"; // Prevent default navigation
            fileLink.textContent = "📄" + key;
            fileLink.classList.add("custom-link");

            //  Bind click event to trigger download
            if (manage)
                fileLink.addEventListener("click", (event) => {
                    event.preventDefault();  // Prevent default link behavior
                    downloadFile(key);  // Call download function
                });
            else
                fileLink.addEventListener("click", (event) => {
                    event.preventDefault();  // Prevent default link behavior
                    chooseFile(key);
                });


            //  Append file link
            nameSpan.appendChild(fileLink);

            //  Display modification time
            modifyTimeSpan.textContent = folderContents[key]["modify_time"] || "N/A";
        }

        item.appendChild(nameSpan);
        item.appendChild(modifyTimeSpan);

        if (manage) { //  Action Buttons
            let actionContainer = document.createElement("div");
            actionContainer.classList.add("action-buttons");

            let renameButton = createActionButton("Rename ", () => renameFiles(key));
            let moveButton = createActionButton("Move ", () => moveFile(key));
            let deleteButton = createActionButton("Delete", () => deleteFileOrFolder(key, path));

            actionContainer.appendChild(renameButton);
            actionContainer.appendChild(moveButton);
            actionContainer.appendChild(deleteButton);
            item.appendChild(actionContainer);
        }
        fileList.appendChild(item);
    }

    if (manage) {//  Add "Create Folder" Button
        let createFolderButton = document.createElement("button");
        createFolderButton.textContent = "📁 Create Folder";
        createFolderButton.classList.add("btn", "btn-sm", "btn-primary", "mt-2");
        createFolderButton.onclick = createFolder;
        fileList.appendChild(createFolderButton);
    }
}

//  Update Path Display
function updatePathDisplay(path, manage = true) {
    let pathDisplay = document.getElementById("filePath");
    pathDisplay.innerHTML = ""; // Clear previous path

    let homeLink = document.createElement("span");
    homeLink.textContent = "🏠 Home";
    homeLink.style.cursor = "pointer";
    homeLink.onclick = function () {
        currentPath = [];
        displayFiles(currentPath, manage);
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
            displayFiles(currentPath, manage);
        };

        pathDisplay.appendChild(folderLink);
    }
}

//  Function to Create Folder
function createFolder() {
    let folderName = prompt("Enter folder name:");
    if (!folderName) return;
    let fullPath = [...currentPath, folderName].join("/");
    fetch(createFolderUrl, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: JSON.stringify({ path: fullPath })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) loadFiles();
            else alert("Failed to create folder: " + data.error);
        })
        .catch(error => console.error("Error creating folder:", error));
}

//  Function to Rename file and folder
function renameFiles(oldName) {
    let newName = prompt(`Enter new name for "${oldName}":`);
    if (!newName) return;
    let oldPath = [...currentPath, oldName].join("/");
    let newPath = [...currentPath, newName].join("/");
    fetch(modifyFilePathUrl, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: JSON.stringify({ old_path: oldPath, new_path: newPath })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) loadFiles();
            else alert("Failed to rename folder: " + data.text);
        })
        .catch(error => console.error("Error renaming folder:", error));
}

//  Function to Move File
function moveFile(fileName) {
    let targetFolder = prompt(`Enter target folder for "${fileName}":`);
    // Allow empty folder path by keeping the file in the same directory
    if (targetFolder === null) targetFolder = "";
    let currentFilePath = [...currentPath, fileName].join("/");
    // If blank, keep the same path
    let targetFilePath = targetFolder ? `${targetFolder}/${fileName}` : fileName;
    fetch(modifyFilePathUrl, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: JSON.stringify({ old_path: currentFilePath, new_path: targetFilePath })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) loadFiles();
            else alert("Failed to move file: " + data.text);
        })
        .catch(error => console.error("Error moving file:", error));
}

// delete file or folder
function deleteFileOrFolder(fileKey, filePath) {
    if (!confirm(`Are you sure you want to delete "${fileKey}"?`)) return;
    // Ensure filePath does not start with a "/"
    let cleanFilePath = (filePath + "/" + fileKey).replace(/^\/+/, "");
    fetch(deleteFileUrl, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: JSON.stringify({ path: cleanFilePath })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) loadFiles();  // Refresh file list
            else alert("Failed to delete: " + data.error);
        })
        .catch(error => console.error("Error deleting file:", error));
}

function downloadFile(fileName) {
    let currentFilePath = [...currentPath, fileName].join("/");
    let downloadUrl = `${downloadFileUrl}?path=${encodeURIComponent(currentFilePath)}`;
    let link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", fileName); // Ensures correct filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function chooseFile(fileName) {
    let formData = new FormData();
    formData.append("project_id", projectId); // Ensure project ID is correctly passed from Django
    formData.append("file_path", [...currentPath, fileName].join("/")); // Build file path
    fetch(chooseFileUrl, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Close Bootstrap Modal
                console.table(data)
                let modalElement = document.getElementById("fileExplorerModal");
                let modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide(); // Close modal
            }
            else alert("Error");
        })
        .catch(error => console.error("Error selecting file:", error));
}


//  Function to Create Action Button
function createActionButton(text, action) {
    let button = document.createElement("span");
    button.textContent = text;
    button.classList.add("action-btn");
    button.style.cursor = "pointer";
    button.onclick = action;
    return button;
}

