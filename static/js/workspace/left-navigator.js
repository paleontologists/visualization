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

// left navigator 
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