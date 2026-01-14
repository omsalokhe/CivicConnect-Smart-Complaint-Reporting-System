async function loadAdminComplaints() {
    try {
        const res = await fetch("http://localhost:5000/api/complaints");
        const data = await res.json();

        const table = document.getElementById("adminTable");
        table.innerHTML = "";

        data.forEach(c => {
            table.innerHTML += `
                <tr>
                    <td>${c.complaintId}</td>
                    <td>${c.category}</td>
                    <td>${c.area}</td>
                    <td>${c.status}</td>
                    <td>
                        ${c.status !== "Resolved" ? `
                            <button data-id="${c._id}" onclick="markResolved(this)">
                                Mark Resolved
                            </button>
                        ` : `
                            <button class="btn-danger" data-id="${c._id}" onclick="deleteComplaint(this)">
                                Delete
                            </button>
                        `}
                    </td>

                </tr>
            `;
        });
    } catch (err) {
        console.error(err);
        alert("Failed to load complaints");
    }
}

async function markResolved(btn) {
    const id = btn.dataset.id;

    try {
        const res = await fetch(`http://localhost:5000/api/complaints/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Resolved" })
        });

        if (!res.ok) {
            alert("Failed to update status");
            return;
        }

        alert("Complaint marked as Resolved");
        loadAdminComplaints(); // refresh table
        drawAdminChart();
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

// Load complaints when admin page opens
loadAdminComplaints();
async function deleteComplaint(btn) {
    const id = btn.dataset.id;

    if (!confirm("Are you sure you want to permanently delete this complaint?")) {
        return;
    }

    try {
        const res = await fetch(
            `http://localhost:5000/api/complaints/${id}`,
            { method: "DELETE" }
        );

        if (!res.ok) {
            const msg = await res.json();
            alert(msg.message || "Delete failed");
            return;
        }

        alert("Complaint deleted successfully");
        loadAdminComplaints();
        drawAdminChart();

    } catch (err) {
        alert("Server error");
    }
}
// 1. Initialize Google Charts
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawAdminChart);

async function drawAdminChart() {
    try {
        const res = await fetch("http://localhost:5000/api/complaints");
        const data = await res.json();

        // 2. Count statuses (Pending vs Resolved)
        const statusCounts = { "Pending": 0, "Resolved": 0 };
        data.forEach(c => {
            const s = c.status || "Pending";
            statusCounts[s] = (statusCounts[s] || 0) + 1;
        });

        // 3. Prepare data for the Chart
        const chartData = google.visualization.arrayToDataTable([
            ['Status', 'Count', { role: 'style' }],
            ['Pending', statusCounts["Pending"], '#e74c3c'],  // Red for pending
            ['Resolved', statusCounts["Resolved"], '#2ecc71'] // Green for resolved
        ]);

        // 4. Set Chart Options (Handling Dark Mode too!)
        const isDarkMode = document.body.classList.contains("dark");
        const textColor = isDarkMode ? "#f0f0f0" : "#333333";

    const options = {
        title: 'Complaint Resolution Status',
        titleTextStyle: { 
            color: textColor, 
            fontSize: 18, 
            bold: true 
        },
        backgroundColor: 'transparent', // Crucial for dark mode
        hAxis: {
            title: 'Status',
            titleTextStyle: { color: textColor },
            textStyle: { color: textColor }
        },
        vAxis: {
            title: 'Number of Complaints',
            titleTextStyle: { color: textColor },
            textStyle: { color: textColor },
            gridlines: { color: isDarkMode ? '#444' : '#ccc' } // Subtle grid lines
        },
        legend: { position: 'none' }, // Hiding legend for cleaner look
        animation: { duration: 800, easing: 'out', startup: true }
    };

        const chart = new google.visualization.ColumnChart(document.getElementById('adminStatusChart'));
        chart.draw(chartData, options);
    } catch (err) {
        console.error("Admin chart error:", err);
    }
}
function toggleTheme() {
    document.body.classList.toggle("dark");

    // Save preference
    const currentTheme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);

    // RE-DRAW THE ADMIN CHART
    // This tells Google Charts to pick up the new 'textColor' immediately
    if (typeof drawAdminChart === 'function') {
        drawAdminChart();
    }
}
