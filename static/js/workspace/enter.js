// if user haven't login than they need to login
document.getElementById('enter-workbench').addEventListener('click', function () {
    if (username == 'guest') {
        alert('Please log in to continue.');
        window.parent.location.href = loginUrl;
    } else {
        console.log(username+1)
        window.parent.location.href = overviewUrl;
    }
});