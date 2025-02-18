document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".chart-option").forEach(function (chartOption) {
        chartOption.addEventListener("click", function () {
            let selectedChart = this.getAttribute("data-chart");

            // Store selected chart type
            document.getElementById("selectedChartType").value = selectedChart;

            // Open modal
            document.getElementById("createProjectLabel").textContent = "Create Project - " + selectedChart;
            new bootstrap.Modal(document.getElementById("createProjectModal")).show();
        });
    });

    document.getElementById("projectForm").addEventListener("submit", function (event) {
        event.preventDefault();
        let projectTitle = document.getElementById("projectTitle").value;
        let selectedChart = document.getElementById("selectedChartType").value;

        alert("Project Created!\nTitle: " + projectTitle + "\nChart Type: " + selectedChart);
        bootstrap.Modal.getInstance(document.getElementById("createProjectModal")).hide();
    });
});
