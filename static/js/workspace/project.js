// Load files on page load
window.onload = function () {
    let loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.remove();// Hide the spinner correctly
    loadFileDetail(projectId);
};

document.addEventListener("DOMContentLoaded", function () {
    let tableContainer = document.getElementById("table-container");
    document.getElementById("fileExplorerModal").addEventListener("shown.bs.modal", function () {
        loadFiles(false);  //  Call function when modal opens to show file tree
    });
    // Initialize ECharts
    var chart = echarts.init(document.getElementById('chart'));
    var option = {
        title: { text: 'Chart' },
        tooltip: {},
        xAxis: { type: 'category', data: ['A', 'B', 'C', 'D'] },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: [100, 200, 300, 400] }]
    };
    chart.setOption(option);
    // Resize chart dynamically on window resize
    window.addEventListener('resize', function () {
        chart.resize();
    });
    // Drag to resize functionality
    let isResizing = false;
    const chartContainer = document.getElementById("chart-container");
    // const tableContainer = document.getElementById("table-container");
    const resizeHandle = document.getElementById("resize-handle");
    resizeHandle.addEventListener("mousedown", function (e) {
        isResizing = true;
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
    });
    function resize(e) {
        if (isResizing) {
            let totalWidth = chartContainer.parentElement.clientWidth;
            let newChartWidth = (e.clientX / totalWidth) * 100;
            newChartWidth = Math.min(90, Math.max(10, newChartWidth)); // Limit between 10% - 90%
            chartContainer.style.flexBasis = newChartWidth + "%";
            tableContainer.style.flexBasis = (100 - newChartWidth) + "%";
            chart.resize();// Update ECharts on resize
        }
    }
    function stopResize() {
        isResizing = false;
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
    }
});

function displayTable(fileData) {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("tableBody");
    const noFileMessage = document.getElementById("noFileMessage");
    const xAxisSelect = document.getElementById("xAxisSelect");
    const yAxisSelect = document.getElementById("yAxisSelect");
    const MAX_TEXT_LENGTH = 20;

    noFileMessage.style.display = "none"; // Hide "No file selected" message

    // Ensure fileData is parsed JSON if it's a string
    if (typeof fileData === "string") {
        try {
            fileData = JSON.parse(fileData);
        } catch (error) {
            noFileMessage.style.display = "block";
            return;
        }
    }

    // Ensure fileData is an array
    if (!Array.isArray(fileData) || fileData.length === 0) {
        noFileMessage.style.display = "block";
        return;
    }

    localStorage.setItem("fileData", JSON.stringify(fileData));

    // Clear previous table and axis selections
    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";
    xAxisSelect.innerHTML = '<option value="">Select X-Axis</option>';
    yAxisSelect.innerHTML = '<option value="">Select Y-Axis</option>';

    // Generate table headers dynamically
    const headers = Object.keys(fileData[0]);
    headers.forEach(header => {
        // Create table header
        const th = document.createElement("th");
        th.textContent = header;
        tableHeader.appendChild(th);

        // Populate X and Y axis dropdowns
        const xOption = document.createElement("option");
        xOption.value = header;
        xOption.textContent = header;
        xAxisSelect.appendChild(xOption);

        const yOption = document.createElement("option");
        yOption.value = header;
        yOption.textContent = header;
        yAxisSelect.appendChild(yOption);
    });

    // Lazy load rows using Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rowIndex = parseInt(entry.target.getAttribute("data-index"));
                addRowToTable(fileData[rowIndex]);
                observer.unobserve(entry.target);
            }
        });
    });

    // Create placeholder rows for lazy loading
    fileData.forEach((_, index) => {
        const placeholderRow = document.createElement("tr");
        placeholderRow.setAttribute("data-index", index);
        placeholderRow.style.height = "40px";
        tableBody.appendChild(placeholderRow);
        observer.observe(placeholderRow);
    });

    function addRowToTable(rowData) {
        const tr = document.createElement("tr");
        Object.values(rowData).forEach(value => {
            const td = document.createElement("td");

            let text = String(value);
            if (text.length > MAX_TEXT_LENGTH) {
                td.textContent = text.substring(0, MAX_TEXT_LENGTH) + "...";
                td.setAttribute("title", text);
            } else {
                td.textContent = text;
            }

            tr.appendChild(td);
        });

        const placeholder = document.querySelector(`[data-index='${fileData.indexOf(rowData)}']`);
        if (placeholder) {
            tableBody.replaceChild(tr, placeholder);
        }
    }
}

// Handle X and Y axis selection and update the chart
document.getElementById("updateChartBtn").addEventListener("click", function () {
    const xAxis = document.getElementById("xAxisSelect").value;
    const yAxis = document.getElementById("yAxisSelect").value;

    if (!xAxis || !yAxis) {
        alert("Please select both X and Y axes.");
        return;
    }

    updateChart(xAxis, yAxis);
});

function updateChart(xAxis, yAxis) {
    const fileData = JSON.parse(localStorage.getItem("fileData")) || [];

    if (!fileData.length) {
        alert("No data available for chart.");
        return;
    }

    // Extract data for chart
    const xValues = fileData.map(row => row[xAxis]);
    const yValues = fileData.map(row => parseFloat(row[yAxis]) || 0); // Ensure numeric y-values

    // Initialize ECharts instance
    const chartDom = document.getElementById("chart");
    const myChart = echarts.init(chartDom);

    // Configure ECharts options
    const option = {
        title: {
            text: `${yAxis} vs ${xAxis}`
        },
        tooltip: {},
        xAxis: {
            type: "category",
            data: xValues
        },
        yAxis: {
            type: "value"
        },
        series: [{
            name: yAxis,
            type: "line", // Change to "bar" or other chart type if needed
            data: yValues
        }]
    };

    // Render the chart
    myChart.setOption(option);
}
