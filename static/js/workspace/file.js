document.addEventListener("DOMContentLoaded", function () {
    loadFiles();

    // Handle File Upload
    document.getElementById("uploadBtn").addEventListener("click", function () {
        const fileInput = document.getElementById("fileInput");
        if (!fileInput.files.length) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        fetch(uploadUrl, { method: "POST", body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("File uploaded successfully!");
                    loadFiles();
                } else {
                    alert("Upload failed: " + data.error);
                }
            })
            .catch(error => console.error("Upload error:", error));
    });
});

// Function to load files dynamically
function loadFiles() {
    fetch(fetchFilesUrl)
        .then(response => response.json())
        .then(data => {
            const fileList = document.getElementById("fileList");
            fileList.innerHTML = "";  // Clear previous files

            data.files.forEach(file => {
                const listItem = document.createElement("li");
                listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

                listItem.innerHTML = `
                    <span>${file.name}</span>
                    <div>
                        <button class="btn btn-sm btn-warning me-2" onclick="updateFile('${file.id}', '${file.name}')">Update</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteFile('${file.id}')">Delete</button>
                    </div>
                `;
                fileList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error loading files:", error));
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
