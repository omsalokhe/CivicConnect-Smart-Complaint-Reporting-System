// ==========================================
// 1. GOOGLE CHARTS INITIALIZATION
// ==========================================
// Load the library 
if (typeof google !== 'undefined') {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(refreshChart);
}

// Function to fetch data and draw/refresh the chart
async function refreshChart() {
    try {
        const res = await fetch("http://localhost:5000/api/complaints");
        const complaints = await res.json();

        const counts = {};
        complaints.forEach(c => {
            // We use c.reportCount to make the graph slices grow dynamically
            counts[c.category] = (counts[c.category] || 0) + (c.reportCount || 1);
        });

        const chartData = [['Category', 'Total Reports']];
        for (let category in counts) {
            chartData.push([category, counts[category]]);
        }

        const dataTable = google.visualization.arrayToDataTable(chartData);
        // Inside your refreshChart function
        const isDarkMode = document.body.classList.contains("dark");
        const textColor = isDarkMode ? "#f0f0f0" : "#333333"; // White for dark, Dark-grey for light

        const options = {
                title: 'Live Civic Issue Statistics',
                // 1. Color of the Main Title
                titleTextStyle: {
                    color: textColor,
                    fontSize: 18,
                    bold: true
                },
                // 2. Color of the Legend (the variable labels)
                legend: {
                    textStyle: { color: textColor }
                },
                // 3. Color of the labels inside/around the pie slices
                pieSliceTextStyle: {
                    color: '#ffffff' // Usually white looks best inside the colored slices
                },
                is3D: true,
                backgroundColor: 'transparent', // Keeps it matching your site background
                chartArea: { width: '90%', height: '80%' },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                }
        };

        const chartElement = document.getElementById('piechart');
        if (chartElement) {
            const chart = new google.visualization.PieChart(chartElement);
            chart.draw(dataTable, options);
        }
    } catch (err) {
        console.error("Chart error:", err);
    }
}


// SUBMIT COMPLAINT
// async function submitComplaint() {
//     const data = {
//         name: document.getElementById("name").value,
//         category: document.getElementById("category").value,
//         area: document.getElementById("area").value,
//         description: document.getElementById("description").value
//     };

//     const res = await fetch("http://localhost:5000/api/complaints", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//     });

//     const result = await res.json();
//     alert("Complaint ID: " + result.id);
// }

async function submitComplaint(e) {
    e.preventDefault();
    console.log("Submit clicked");

    const data = {
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        area: document.getElementById("location").value,
        description: document.getElementById("description").value
    };

    console.log("Sending data:", data);

    try {
        const res = await fetch("http://localhost:5000/api/complaints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        // // 1alert("Complaint submitted!\nID: " + result.complaint._id);
        //2 alert("Complaint submitted successfully!");
        // console.log("Server response:", result);
        // 3alert(
        // "✅ Complaint Registered!\n\nYour Complaint ID:\n" + result.complaintId
        // );
        const complaintId = result.complaintId;

        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.background = "rgba(0,0,0,0.5)";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";

        modal.innerHTML = `
        <div style="background:white; padding:25px; border-radius:10px; text-align:center; width:300px">
            <h3>✅ Complaint Registered</h3>
            <p><b>Your Complaint ID:</b></p>
            <input id="cid" value="${complaintId}" readonly style="width:100%; text-align:center; font-size:16px" />
            <br><br>
            <button onclick="copyID()">📋 Copy ID</button>
            <button onclick="this.closest('div').parentElement.remove()">Close</button>
        </div>
        `;

        document.body.appendChild(modal);

        e.target.reset();

    } catch (err) {
        console.error("Error:", err);
        alert("❌ Submission failed");
    }
}

function copyID() {
    const input = document.getElementById("cid");

    navigator.clipboard.writeText(input.value)
        .then(() => {
            alert("✅ Complaint ID copied!");
        })
        .catch(() => {
            alert("❌ Copy failed");
        });
}


// LOAD DASHBOARD
async function loadDashboard() {
    const res = await fetch("http://localhost:5000/api/complaints");
    const data = await res.json();

    const table = document.getElementById("dashboardTable");
    table.innerHTML = ""; // clear old rows
    data.forEach(c => {
        table.innerHTML += `
            <tr>
                <td>${c.category}</td>
                <td>${c.area}</td>
                <td class="status-pending">${c.status || "Pending"}</td>
                <td>${c.reportCount}</td>
                <td>
                <button onclick="reportSameIssue('${c._id}')">
                    Report Same Issue
                </button>
                </td>

            </tr>
        `;
    });
}

// TRACK COMPLAINT
// async function trackComplaint() {
//     const id = document.getElementById("trackId").value;
//     const res = await fetch(`http://localhost:5000/api/complaints/${id}`);
//     const data = await res.json();
//     document.getElementById("result").innerText = `Status: ${data.status}`;
// }
// ===============================
// async function trackComplaint() {
//     const id = document.getElementById("trackId").value;

//     if (!id) {
//         alert("Please enter Complaint ID");
//         return;
//     }

//     try {
//         const res = await fetch(
//             `http://localhost:5000/api/complaints/track/${id}`
//         );

//         if (!res.ok) throw new Error();

//         const data = await res.json();
//         document.getElementById("result").innerText =
//             `Status: ${data.status}`;

//     } catch {
//         alert("Invalid Complaint ID");
//     }
// }
async function trackComplaint() {
    const id = document.getElementById("trackId").value;
    if (!id) {
        alert("Please enter Complaint ID");
        return;
    }
    const res = await fetch(
        `http://localhost:5000/api/complaints/track/${id}`
    );

    if (!res.ok) {
        alert("Invalid Complaint ID");
        return;
    }

    const data = await res.json();
    document.getElementById("result").innerText =
        `Status: ${data.status}`;
}


async function reportSameIssue(id) {
    // 1. Tell the server to increase the count
    await fetch(`http://localhost:5000/api/complaints/report-same/${id}`, {
        method: "PUT"
    });

    // 2. Refresh the table (your existing code)
    loadDashboard(); 

    // 3. RE-DRAW THE CHART (The missing piece!)
    refreshChart(); 
}

function loadAdminDashboard() {
    loadDashboard(); // reuse
}
// =========================
// DARK MODE TOGGLE
// =========================

function toggleTheme() {
    document.body.classList.toggle("dark");

    // Save preference
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

    // TRIGGER THE CHART REFRESH
    // This makes the headings change color immediately when you click the toggle
    if (typeof refreshChart === 'function') {
        refreshChart();
    }
}
// Load saved theme
(function () {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }
})();


console.log("main.js loaded");
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggle");

    if (!btn) return; // prevents error on pages without button

    btn.addEventListener("click", toggleTheme);

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
});




