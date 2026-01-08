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


//report same issue
async function reportSameIssue(id) {
    await fetch(`http://localhost:5000/api/complaints/report-same/${id}`, {
        method: "PUT"
    });
    loadDashboard();
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




