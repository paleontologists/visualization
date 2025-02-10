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
