// find all the options in the top navigator and change the color when user click, also change the iframe
document.querySelectorAll('#navbarNav .nav-item .nav-link').forEach(function (navLink) {
    navLink.addEventListener('click', function (event) {
        document.querySelectorAll('#navbarNav .nav-item').forEach(function (navItem) {
            navItem.classList.remove('active');
        });
        this.closest('.nav-item').classList.add('active');
        event.preventDefault();
        document.getElementById('customerFrame').src = this.dataset.url;
    });
});

// switch login button and user center when user login
document.addEventListener("DOMContentLoaded", function () {
    var username = document.body.dataset.username;
    if (username !== "guest") {
        document.getElementById("login-customer").hidden = true;
        document.getElementById("user-center").hidden = false;
    }
});

document.getElementById("customerFrame").onload = function () {
    let iframeDocument = document.getElementById("customerFrame").contentWindow.document;
    
    // Make the iframe height match its content
    let iframeBody = iframeDocument.body;
    let iframeHtml = iframeDocument.documentElement;

    let height = Math.max(
        iframeBody.scrollHeight, 
        iframeBody.offsetHeight, 
        iframeHtml.clientHeight, 
        iframeHtml.scrollHeight, 
        iframeHtml.offsetHeight
    );

    document.getElementById("customerFrame").style.height = height + "px";
};
