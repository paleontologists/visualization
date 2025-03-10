document.addEventListener("DOMContentLoaded", function () {
    fetch("/user/profile/")
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

function updateProfile() {
    let data = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        phone: document.getElementById("phone").value,
        gender: document.getElementById("gender").value,
        birth: document.getElementById("birth").value,
        location: document.getElementById("location").value,
        introduction: document.getElementById("introduction").value,
    };

    fetch("/user/update/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error("Error updating profile:", error));
}

