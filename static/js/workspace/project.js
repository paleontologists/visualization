// Load files on page load
window.onload = function () {
    loadFileDetail(projectId);
};

document.addEventListener("DOMContentLoaded", function () {
    const chartDom = document.getElementById("chart");
    chart = echarts.init(chartDom);
    document.getElementById("fileExplorerModal").addEventListener("shown.bs.modal", function () {
        loadFiles(false);  // Call function when modal opens to show file tree
    });
    window.addEventListener('resize', function () {
        chart.resize();
    });
    exportPngButton();
    saveProjectButton();
    initDragResize();
    initChartTypeSelector();
});


// Main function to handle table display
function displayTable(data) {
    let fileData = validateFileData(data.file);
    if (!fileData) return;
    window.fileDataGlobal = fileData; // Store data globally for chart use
    populateTableHeaders(fileData);
    populateAxisSelectors(fileData);
    initializeLazyLoading(fileData);
    initAxisSelection();
    initializeChart();
}


// the button for export png
function exportPngButton() {
    document.getElementById("exportPngBtn").addEventListener("click", function () {
        // Get PNG Data URL
        const imgData = chart.getDataURL({
            type: "png",
            pixelRatio: 2,
            backgroundColor: "#fff"
        });
        // Create a temporary download link
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "chart.png";
        link.click();
    });
}

// the putton save project
function saveProjectButton() {
    document.getElementById("saveProjectBtn").addEventListener("click", function () {
        if (!projectId)
            alert("Project ID is missing. Cannot save chart.");
        else
            saveProject(); // Call saveChart function with current chart config
    });
}

// save project config
function saveProject() {
    const chartType = document.getElementById("chartTypeSelect").value;
    const xAxis = document.getElementById("xAxisSelect").value;
    const yAxis = document.getElementById("yAxisSelect").value;
    const xRange = document.getElementById("xRangeSlider").noUiSlider.get().map(Number);
    const yRange = document.getElementById("yRangeSlider").noUiSlider.get().map(Number);
    const xValues = window.fileDataGlobal.map(row => parseFloat(row[xAxis]) || 0);
    const yValues = window.fileDataGlobal.map(row => parseFloat(row[yAxis]) || 0);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const xStep = parseFloat(document.getElementById("xStepInput").value) || 0.01;
    const yStep = parseFloat(document.getElementById("yStepInput").value) || 0.01;
    const echartsConfig = {
        chartType: chartType,
        xAxis: xAxis,
        yAxis: yAxis,
        xMin: xMin,
        xMax: xMax,
        yMin: yMin,
        yMax: yMax,
        xMinCurrent: xRange[0],
        xMaxCurrent: xRange[1],
        yMinCurrent: yRange[0],
        yMaxCurrent: yRange[1],
        xStep: xStep,
        yStep: yStep
    };
    const formData = new FormData();
    formData.append("echarts_config", JSON.stringify(echartsConfig)); // Save config only, not data
    formData.append("project_id", projectId);
    formData.append("project_title", projectTitle);
    formData.append("project_description", projectDescription);
    fetch(saveProjectUrl, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: formData
    }).then(response => response.json())
        .then(data => {
            if (data.success) {
                const activeElement = parent.document.querySelector(".active");
                activeElement.textContent = projectTitle;
            }
            showAlert(data.success ? "Save chart success!" : "Save chart failed!", data.success ? "success" : "danger");
        })
        .catch(error => console.error("Error saving config:", error));
}

function checkChartData() {
    const chartElement = document.getElementById("chart");
    const noDataMessage = document.getElementById("noDataMessage");
    if (chartElement.innerHTML.trim() == "") noDataMessage.style.display = "block"; // Show message
    else noDataMessage.style.display = "none"; // Hide message
}


function initializeChart() {
    // Set chart type
    const chartTypeSelect = document.getElementById("chartTypeSelect");
    chartTypeSelect.value = projectEchartsConfig.chartType || "bar";
    chartTypeSelect.addEventListener("change", function () {
        try {
            updateChart(); // Try updating the chart
        } catch (error) {
            alert("Chart type not suitable. Reverting to previous selection.");
            window.location.href = projectUrl;
        }
    });
    // Set X and Y axis selections
    const xAxisSelect = document.getElementById("xAxisSelect");
    const yAxisSelect = document.getElementById("yAxisSelect");
    if (projectEchartsConfig.xAxis) {
        xAxisSelect.value = projectEchartsConfig.xAxis;
        document.getElementById("xAxisLabel").textContent = projectEchartsConfig.xAxis;
    }
    if (projectEchartsConfig.yAxis) {
        yAxisSelect.value = projectEchartsConfig.yAxis;
        document.getElementById("yAxisLabel").textContent = projectEchartsConfig.yAxis;
    }
    // step
    document.getElementById("xStepInput").value = projectEchartsConfig.xStep || 0.01;
    document.getElementById("yStepInput").value = projectEchartsConfig.yStep || 0.01;
    // label sliders
    document.getElementById("xMinLabel").textContent = projectEchartsConfig.xMin;
    document.getElementById("xMaxLabel").textContent = projectEchartsConfig.xMax;
    document.getElementById("yMinLabel").textContent = projectEchartsConfig.yMin;
    document.getElementById("yMaxLabel").textContent = projectEchartsConfig.yMax;
    initSliders();
    // Call updateChart after initializing values
    // updateChart();
    checkChartData();
}

function initSliders() {
    const xSliderElement = document.getElementById("xRangeSlider");
    const ySliderElement = document.getElementById("yRangeSlider");
    // Extract slider parameters from projectEchartsConfig with fallbacks
    const xRange = [projectEchartsConfig.xMinCurrent || 0, projectEchartsConfig.xMaxCurrent || 0];
    const yRange = [projectEchartsConfig.yMinCurrent || 0, projectEchartsConfig.yMaxCurrent || 0];
    const xMin = projectEchartsConfig.xMin !== undefined ? projectEchartsConfig.xMin : 0;
    const xMax = projectEchartsConfig.xMax !== undefined ? projectEchartsConfig.xMax : 0;
    const yMin = projectEchartsConfig.yMin !== undefined ? projectEchartsConfig.yMin : 0;
    const yMax = projectEchartsConfig.yMax !== undefined ? projectEchartsConfig.yMax : 0;
    const xStep = projectEchartsConfig.xStep !== undefined ? projectEchartsConfig.xStep : 0.01;
    const yStep = projectEchartsConfig.yStep !== undefined ? projectEchartsConfig.yStep : 0.01;
    // Ensure sliders are not already initialized
    noUiSlider.create(xSliderElement, {
        start: xRange,
        connect: true,
        range: { min: xMin, max: xMax },
        step: xStep,
        behaviour: "drag",
        tooltips: false
    });
    noUiSlider.create(ySliderElement, {
        start: yRange,
        connect: true,
        range: { min: yMin, max: yMax },
        step: yStep,
        behaviour: "drag",
        tooltips: false,
    });
    xSliderElement.noUiSlider.on("update", function (values) {
        document.getElementById("xMinLabel").textContent = values[0];
        document.getElementById("xMaxLabel").textContent = values[1];
        updateChart();
    });
    ySliderElement.noUiSlider.on("update", function (values) {
        document.getElementById("yMinLabel").textContent = values[0];
        document.getElementById("yMaxLabel").textContent = values[1];
        updateChart();
    });
}

// Validate fileData before proceeding
function validateFileData(fileData) {
    const noFileMessage = document.getElementById("noFileMessage");
    noFileMessage.style.display = "block";
    if (typeof fileData === "string")
        try { fileData = JSON.parse(fileData); }
        catch (error) { return false; }
    if (!Array.isArray(fileData) || fileData.length === 0) return false;
    noFileMessage.style.display = "none"; // Hide message if valid
    return fileData;
}

// Populate table headers dynamically
function populateTableHeaders(fileData) {
    const tableHeader = document.getElementById("tableHeader");
    const headers = Object.keys(fileData[0]);
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHeader.appendChild(th);
    });
}

// Populate X and Y axis dropdowns
function populateAxisSelectors(fileData) {
    const xAxisSelect = document.getElementById("xAxisSelect");
    const yAxisSelect = document.getElementById("yAxisSelect");
    const headers = Object.keys(fileData[0]);
    headers.forEach(header => {
        const optionX = document.createElement("option");
        optionX.value = header;
        optionX.textContent = header;
        xAxisSelect.appendChild(optionX);
        const optionY = document.createElement("option");
        optionY.value = header;
        optionY.textContent = header;
        yAxisSelect.appendChild(optionY);
    });
}

// Initialize lazy loading for table rows
function initializeLazyLoading(fileData) {
    const tableBody = document.getElementById("tableBody");
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rowIndex = parseInt(entry.target.getAttribute("data-index"));
                addRowToTable(fileData[rowIndex]);
                observer.unobserve(entry.target);
            }
        });
    });
    fileData.forEach((_, index) => {
        const placeholderRow = document.createElement("tr");
        placeholderRow.setAttribute("data-index", index);
        placeholderRow.style.height = "40px";
        tableBody.appendChild(placeholderRow);
        observer.observe(placeholderRow);
    });
}

// Adds a row to the table
function addRowToTable(rowData) {
    const tableBody = document.getElementById("tableBody");
    const MAX_TEXT_LENGTH = 20;
    const tr = document.createElement("tr");
    Object.values(rowData).forEach(value => {
        const td = document.createElement("td");
        let text = String(value);
        if (text.length > MAX_TEXT_LENGTH) {
            td.textContent = text.substring(0, MAX_TEXT_LENGTH) + "...";
            td.setAttribute("title", text);
        } else td.textContent = text;
        tr.appendChild(td);
    });
    const placeholder = document.querySelector(`[data-index='${window.fileDataGlobal.indexOf(rowData)}']`);
    if (placeholder) tableBody.replaceChild(tr, placeholder);
}

function updateStep(axisType) {
    // Get step input directly from the field
    let stepInput = axisType === "x" ? document.getElementById("xStepInput").value : document.getElementById("yStepInput").value;
    let slider = axisType === "x" ? document.getElementById("xRangeSlider") : document.getElementById("yRangeSlider");
    let step = parseFloat(stepInput) || 0.01; // Default step if input is invalid
    if (slider.noUiSlider) slider.noUiSlider.updateOptions({ step: step });
}

function updateSlider(axisType, selectedAxis) {
    let slider = axisType === "x" ? document.getElementById("xRangeSlider") : document.getElementById("yRangeSlider");
    let axisLabel = axisType === "x" ? "xAxisLabel" : "yAxisLabel";
    let minLabel = axisType === "x" ? "xMinLabel" : "yMinLabel";
    let maxLabel = axisType === "x" ? "xMaxLabel" : "yMaxLabel";
    if (!selectedAxis || !window.fileDataGlobal) {
        slider.noUiSlider.updateOptions({ range: { min: 0, max: 0 }, start: [0, 0] });
        document.getElementById(axisLabel).textContent = "None";
        document.getElementById(minLabel).textContent = "0";
        document.getElementById(maxLabel).textContent = "0";
        return;
    }
    const values = window.fileDataGlobal.map(row => parseFloat(row[selectedAxis]) || 0);
    if (values.length === 0) return;
    const min = Math.min(...values);
    const max = Math.max(...values);
    // Update labels
    document.getElementById(axisLabel).textContent = selectedAxis;
    document.getElementById(minLabel).textContent = min.toFixed(2);
    document.getElementById(maxLabel).textContent = max.toFixed(2);
    // If slider exists, update values
    if (slider.noUiSlider)
        slider.noUiSlider.updateOptions({
            range: { min: min, max: max },
            start: [min, max]
        });
}

// Event listener to update slider step when user leaves the input field
document.getElementById("xStepInput").addEventListener("blur", function () {
    updateStep("x");
});

// Event listener to update slider step when user leaves the input field
document.getElementById("yStepInput").addEventListener("blur", function () {
    updateStep("y");
});

// the middle drag line to change the space of chart and table
function initDragResize() {
    let isResizing = false;
    const chartContainer = document.getElementById("chart-container");
    const tableContainer = document.getElementById("table-container");
    const resizeHandle = document.getElementById("resize-handle");

    resizeHandle.addEventListener("mousedown", function () {
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
            chart.resize(); // Update ECharts on resize
        }
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
    }
}

// select axis
function initAxisSelection() {
    document.getElementById("xAxisSelect").addEventListener("change", function () {
        updateSlider("x", this.value);
        checkChartData();
    });
    document.getElementById("yAxisSelect").addEventListener("change", function () {
        updateSlider("y", this.value);
        checkChartData();
    });
}

function initChartTypeSelector() {
    const chartTypes = [
        // Basic Chart Types
        "bar",            // Bar chart (standard)
        "line",           // Line chart
        "scatter",        // Scatter plot

        // Special Variations
        "effectScatter",  // Scatter plot with animation effects
        "candlestick",    // Financial stock chart (OHLC)

        // Pie & Donut Charts
        "pie",            // Pie chart (can be styled as a donut)
        "funnel",         // Funnel chart for conversion rates

        // Statistical & Data Distribution
        "boxplot",        // Box plot (statistical distribution)
        "heatmap",        // Heatmap (color-intensity matrix)
        "treemap",        // Treemap (hierarchical data visualization)
        "sunburst",       // Sunburst chart (nested hierarchical data)
        "parallel",       // Parallel coordinates (multi-dimensional comparison)

        // Advanced Graphs & Networks
        "graph",          // Graph (for network & relationship diagrams)
        "sankey",         // Sankey diagram (flow visualization)

        // Polar & Radar Charts
        "radar",          // Radar (spider) chart
        "gauge",          // Gauge chart (speedometer-like)

        // Maps & Geospatial Charts
        "map",            // Geographical map
        "lines",          // Flight routes, connections on a map
        "effectLines",    // Animated line effects on maps

        // Custom & Advanced Charts
        "pictorialBar",   // Pictogram-based bar chart
        "themeRiver",     // Theme river (multi-series trends over time)
        "custom"          // Custom chart (for creating unique visualizations)
    ];

    const chartTypeSelect = document.getElementById("chartTypeSelect");
    chartTypeSelect.innerHTML = ""; // Clear existing options

    chartTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize first letter
        chartTypeSelect.appendChild(option);
    });
}


function updateChart() {
    const xAxis = document.getElementById("xAxisSelect").value;
    const yAxis = document.getElementById("yAxisSelect").value;
    const chartDom = document.getElementById("chart");
    const myChart = echarts.init(chartDom);
    if (!xAxis || !yAxis) {
        echarts.dispose(chartDom);
        chartDom.innerHTML = "";
        return;
    }
    const fileData = window.fileDataGlobal;
    if (!fileData.length) {
        alert("No data available for chart.");
        return;
    }
    // Get slider range values
    const xRange = document.getElementById("xRangeSlider").noUiSlider.get().map(Number);
    const yRange = document.getElementById("yRangeSlider").noUiSlider.get().map(Number);
    const [xMin, xMax] = xRange;
    const [yMin, yMax] = yRange;
    // Filter data based on selected ranges
    const filteredData = fileData.filter(row => {
        const xValue = parseFloat(row[xAxis]) || 0;
        const yValue = parseFloat(row[yAxis]) || 0;
        return xValue >= xMin && xValue <= xMax && yValue >= yMin && yValue <= yMax;
    });
    const xValues = filteredData.map(row => row[xAxis]);
    const yValues = filteredData.map(row => parseFloat(row[yAxis]) || 0);
    // Sort filtered data
    const sortedData = xValues.map((x, i) => ({ x, y: yValues[i] })).sort((a, b) => a.x - b.x);
    const xValuesSorted = sortedData.map(d => d.x);
    const yValuesSorted = sortedData.map(d => d.y);
    // Initialize ECharts instance
    const chartType = document.getElementById("chartTypeSelect").value;
    // Configure ECharts options
    const echartsConfig = {
        title: {
            text: projectTitle + `: ${yAxis} vs ${xAxis}`,
            subtext: projectDescription,
            left: "left",
        },
        tooltip: {
            trigger: "axis", // Shows tooltip when hovering over the axis
            axisPointer: { type: "cross" }, // Adds a crosshair effect
            formatter: function (params) {
                let data = params[0]; // Extract the first data point
                return `X: ${data.name} <br> Y: ${data.value}`;
            }
        },
        xAxis: { type: "category", data: xValuesSorted },
        yAxis: { type: "value" },
        series: [{
            name: yAxis,
            type: chartType,
            data: yValuesSorted
        }]
    };
    myChart.setOption(echartsConfig);
}

function showAlert(message, type) {
    // Remove existing alert if present
    const existingAlert = document.getElementById("dynamicAlert");
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert div
    const alertDiv = document.createElement("div");
    alertDiv.id = "dynamicAlert";
    alertDiv.className = `alert-message alert-${type}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    // Show alert with smooth fade-in at the top-middle
    setTimeout(() => {
        alertDiv.classList.add("show-alert");
    }, 50);

    // Auto-hide after 3 seconds with smooth fade-out
    setTimeout(() => {
        alertDiv.classList.remove("show-alert");
        setTimeout(() => alertDiv.remove(), 500); // Remove from DOM after transition
    }, 3000);
}

document.getElementById("configBtn").addEventListener("click", function () {
    const configModal = new bootstrap.Modal(document.getElementById("configModal"));
    configModal.show();
});

// conform Config Data
document.getElementById("saveConfigBtn").addEventListener("click", function () {
    const title = document.getElementById("configTitleInput").value.trim();
    const description = document.getElementById("configDescInput").value.trim();
    projectTitle = title;
    projectDescription = description;
    bootstrap.Modal.getInstance(document.getElementById("configModal")).hide();// Hide modal after saving
    updateChart();
}); 