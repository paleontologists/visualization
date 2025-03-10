document.addEventListener("DOMContentLoaded", function () {
    fetch(userProfileUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById("first_name").value = data.first_name || "";
            document.getElementById("last_name").value = data.last_name || "";
            document.getElementById("email").value = data.email || "";
            document.getElementById("phone").value = data.phone || "";
            document.getElementById("gender").value = data.gender || "";
            document.getElementById("birth").value = data.birth || "";
            document.getElementById("location").value = data.location || "";
            document.getElementById("introduction").value = data.introduction || "";
        })
        .catch(error => console.error("Error loading profile:", error));
});