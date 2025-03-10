// Load files on page load
window.onload = function () {
    let loadingSpinner = document.getElementById("loadingSpinner");
    // ✅ Hide the spinner correctly
    loadingSpinner.remove()
};

document.addEventListener("DOMContentLoaded", function () {
    let tableBody = document.getElementById("tableBody");
    let tableWrapper = document.getElementById("tableWrapper");
    let tableHeader = document.getElementById("tableHeader");

    // Load dataset from hidden input field
    let allData = JSON.parse(document.getElementById("file-data").getAttribute("data-json"));

    let rowHeight = 30; // Approximate row height in pixels
    let bufferSize = 5; // Extra rows for smooth scrolling
    let visibleRows = Math.ceil(tableWrapper.clientHeight / rowHeight) + bufferSize;
    let totalRows = allData.length;
    
    function renderTable() {
        let scrollTop = tableWrapper.scrollTop;
        let startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - bufferSize);
        let endRow = Math.min(totalRows, startRow + visibleRows);

        tableBody.innerHTML = ""; // Clear existing rows

        let fragment = document.createDocumentFragment();
        for (let i = startRow; i < endRow; i++) {
            let tr = document.createElement("tr");
            Object.values(allData[i]).forEach(value => {
                let td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });
            fragment.appendChild(tr);
        }
        tableBody.appendChild(fragment);
    }

    // Initial render
    renderTable();

    // Update table on scroll
    tableWrapper.addEventListener("scroll", renderTable);

    // Resize event to adjust visible rows
    window.addEventListener("resize", function () {
        visibleRows = Math.ceil(tableWrapper.clientHeight / rowHeight) + bufferSize;
        renderTable();
    });
});

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

    function checkTableEmpty() {
        let tableBody = document.querySelector("#dataTable tbody");
        let noFileMessage = document.getElementById("noFileMessage");
        if (tableBody.children.length === 0) {
            noFileMessage.style.display = "block";  //  Show message when table is empty
        } else {
            noFileMessage.style.display = "none";   // ❌ Hide message when table has files
        }
    }
    // Call this function whenever the table updates
    checkTableEmpty();



    // Generate a 100x100 table dynamically
    function generateTable(rows, cols) {
        let tableHead = document.querySelector("#dataTable thead");
        let tableBody = document.querySelector("#dataTable tbody");

        let headRow = document.createElement("tr");
        headRow.appendChild(document.createElement("th")).innerText = "#";
        for (let i = 1; i <= cols; i++) {
            let th = document.createElement("th");
            th.innerText = "Col " + i;
            headRow.appendChild(th);
        }
        tableHead.appendChild(headRow);

        for (let r = 1; r <= rows; r++) {
            let row = document.createElement("tr");
            let rowHeader = document.createElement("td");
            rowHeader.innerText = "Row " + r;
            row.appendChild(rowHeader);

            for (let c = 1; c <= cols; c++) {
                let td = document.createElement("td");
                td.innerText = r * c;
                row.appendChild(td);
            }
            tableBody.appendChild(row);
        }
    }
    // generateTable(100, 100);

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

            // Update ECharts on resize
            chart.resize();
        }
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
    }
});



