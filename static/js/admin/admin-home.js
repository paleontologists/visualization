document.addEventListener("DOMContentLoaded", function () {
    var ctx = document.getElementById('horizontalBarChart');
    if (ctx) {
        ctx = ctx.getContext('2d');
    } else {
        console.error("Canvas #horizontalBarChart not found!");
        return;
    }

    var userChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Users'],
            datasets: [{
                label: 'Total Users',
                data: [0],
                backgroundColor: 'rgba(127, 255, 212, 0.6)',
                borderColor: 'rgba(127, 255, 212, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { beginAtZero: true }
            }
        }
    });

    function fetchUserCount() {
        fetch(userCountApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.user_count !== undefined) {
                    userChart.data.datasets[0].data = [data.user_count];
                    userChart.update(); // Re render the chart
                } else {
                    console.error("Error: Missing user_count in response");
                }
            })
            .catch(error => console.error("Error fetching user count:", error));
    }

    fetchUserCount();
    setInterval(fetchUserCount, 10000); // Updated every 10 seconds
});


document.addEventListener("DOMContentLoaded", function () {
    var ctx = document.getElementById('projectChart');
    if (ctx) {
        ctx = ctx.getContext('2d');
    } else {
        console.error("Canvas #projectChart not found!");
        return;
    }

    var projectChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Projects'],
            datasets: [{
                label: 'Total Projects',
                data: [0],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { beginAtZero: true }
            }
        }
    });

    function fetchProjectCount() {
        fetch(projectCountApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.project_count !== undefined) {
                    projectChart.data.datasets[0].data = [data.project_count];
                    projectChart.update();
                } else {
                    console.error("Error: Missing project_count in response");
                }
            })
            .catch(error => console.error("Error fetching project count:", error));
    }

    fetchProjectCount();
    setInterval(fetchProjectCount, 10000); // Updated every 10 seconds
});

document.addEventListener("DOMContentLoaded", function () {
    var fileCtx = document.getElementById('fileChart');
    if (fileCtx) {
        fileCtx = fileCtx.getContext('2d');
    } else {
        console.error("Canvas #fileChart not found!");
        return;
    }

    var fileChart = new Chart(fileCtx, {
        type: 'bar',
        data: {
            labels: ['Files'],
            datasets: [{
                label: 'Total Files',
                data: [0], // 初始值
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { beginAtZero: true }
            }
        }
    });

    function fetchFileCount() {
        fetch(adminFileCountUrl)
            .then(response => response.json())
            .then(data => {
                if (data.file_count !== undefined) {
                    fileChart.data.datasets[0].data = [data.file_count];
                    fileChart.update();
                } else {
                    console.error("Error: Missing file_count in response");
                }
            })
            .catch(error => console.error("Error fetching file count:", error));
    }

    fetchFileCount();
    setInterval(fetchFileCount, 10000);
});