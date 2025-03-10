// Load files on page load
document.addEventListener("DOMContentLoaded", function () {
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
    const tableContainer = document.getElementById("table-container");
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



function populateTable(data) {
    let tableHead = document.querySelector("#dataTable thead");
    let tableBody = document.querySelector("#dataTable tbody");

    tableHead.innerHTML = ""; // Clear previous headers
    tableBody.innerHTML = ""; // Clear previous data

    if (data.length === 0) {
        document.getElementById("noFileMessage").style.display = "block";
        return;
    } else {
        document.getElementById("noFileMessage").style.display = "none";
    }

    // Create table header
    let headerRow = document.createElement("tr");
    Object.keys(data[0]).forEach(key => {
        let th = document.createElement("th");
        th.innerText = key;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Populate table body
    data.forEach(row => {
        let tr = document.createElement("tr");
        Object.values(row).forEach(value => {
            let td = document.createElement("td");
            td.innerText = value;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}