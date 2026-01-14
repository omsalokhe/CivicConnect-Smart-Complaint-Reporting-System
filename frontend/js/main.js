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

// async function submitComplaint(e) {
//     e.preventDefault();
//     console.log("Submit clicked");

//     const data = {
//         name: document.getElementById("name").value,
//         category: document.getElementById("category").value,
//         area: document.getElementById("location").value,
//         latitude: document.getElementById("latitude").value,
//         longitude: document.getElementById("longitude").value,
//         description: document.getElementById("description").value
//     };

//     console.log("Sending data:", data);

//     try {
//         const res = await fetch("http://localhost:5000/api/complaints", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(data)

//             // 1. Hide the entire card/form content
//         document.querySelector('.card').innerHTML = `
//             <div style="text-align: center; padding: 20px;">
//                 <h2 style="color: #2ecc71;">✔️ Submission Successful!</h2>
//                 <p>Your Complaint ID is:</p>
//                 <h3 id="idField" style="background: #eee; padding: 10px; border-radius: 5px;">${result.complaintId}</h3>
//                 <button onclick="copyId()" class="btn btn-primary">📋 Copy ID</button>
//                 <br><br>
//                 <a href="index.html" style="text-decoration: none; color: #3498db;">← Back to Home</a>
//             </div>
//         `;
//         });

//         const result = await res.json();
//         // // 1alert("Complaint submitted!\nID: " + result.complaint._id);
//         //2 alert("Complaint submitted successfully!");
//         // console.log("Server response:", result);
//         // 3alert(
//         // "✅ Complaint Registered!\n\nYour Complaint ID:\n" + result.complaintId
//         // );
//         const complaintId = result.complaintId;

//         const modal = document.createElement("div");
//         modal.style.position = "fixed";
//         modal.style.top = "0";
//         modal.style.left = "0";
//         modal.style.width = "100%";
//         modal.style.height = "100%";
//         modal.style.background = "rgba(0,0,0,0.5)";
//         modal.style.display = "flex";
//         modal.style.alignItems = "center";
//         modal.style.justifyContent = "center";

//         modal.innerHTML = `
//         <div style="background:white; padding:25px; border-radius:10px; text-align:center; width:300px">
//             <h3>✅ Complaint Registered</h3>
//             <p><b>Your Complaint ID:</b></p>
//             <input id="cid" value="${complaintId}" readonly style="width:100%; text-align:center; font-size:16px" />
//             <br><br>
//             <button onclick="copyID()">📋 Copy ID</button>
//             <button onclick="this.closest('div').parentElement.remove()">Close</button>
//         </div>
//         `;

//         document.body.appendChild(modal);

//         e.target.reset();

//     } catch (err) {
//         console.error("Error:", err);
//         alert("❌ Submission failed");
//     }
// }
async function submitComplaint(e) {
    e.preventDefault();
    console.log("Submit clicked");

    // Gather data
    const data = {
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        area: document.getElementById("location").value,
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value,
        description: document.getElementById("description").value
    };

    try {
        const res = await fetch("http://localhost:5000/api/complaints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        const complaintId = result.complaintId;

        // SUCCESS UI: Replace the form card with a success message
        // This solves the overlapping map issue completely.
        const card = document.querySelector('.card');
        card.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2 style="color: #2ecc71; margin-bottom: 15px;">✔️ Complaint Registered!</h2>
                <p style="margin-bottom: 5px; font-weight: bold;">Your Tracking ID:</p>
                <div style="background: #f4f4f4; border: 1px dashed #ccc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 id="cid" style="margin: 0; color: #333; letter-spacing: 2px;">${complaintId}</h3>
                </div>
                <button onclick="copyID()" class="btn btn-primary" style="margin-bottom: 10px; width: 100%;">📋 Copy ID</button>
                <br>
                <a href="index.html" style="text-decoration: none; color: #3498db; font-size: 0.9em;">← Submit Another Report</a>
            </div>
        `;

    } catch (err) {
        console.error("Error:", err);
        alert("❌ Submission failed. Please check your connection.");
    }
}
function copyID() {
    // 1. Get the element containing the ID
    const idElement = document.getElementById("cid");
    
    // Safety check
    if (!idElement) {
        console.error("ID element not found");
        return;
    }

    // 2. Get the text inside the <h3> tag
    const idText = idElement.innerText;

    // 3. Copy to clipboard
    navigator.clipboard.writeText(idText)
        .then(() => {
            alert("✅ Complaint ID copied: " + idText);
        })
        .catch((err) => {
            console.error("Copy failed:", err);
            alert("❌ Failed to copy ID");
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


// for the map feature
// Global variables
let map;
let marker;

// 1. Initialize Map when page loads
// 1. Initialize Map ONLY if the reporting map container exists
document.addEventListener('DOMContentLoaded', () => {
    const reportMapElement = document.getElementById('map');
    
    // Only run this logic if we are on the "Report Issue" page
    if (reportMapElement) {
        initMap();
    }
});

function initMap() {
    // Default location (Example: Central Park, NY - Change to your city!)
    const defaultLat = 28.6139; 
    const defaultLng = 77.2090;

    // Create the map
    map = L.map('map').setView([defaultLat, defaultLng], 13);

    // Add the "Tiles" (The visual map images from OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add a Draggable Marker
    marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

    // Event: When user drags the marker
    marker.on('dragend', function (e) {
        const position = marker.getLatLng();
        getAddress(position.lat, position.lng);
    });

    // Event: Click anywhere to move marker
    map.on('click', function (e) {
        marker.setLatLng(e.latlng);
        getAddress(e.latlng.lat, e.latlng.lng);
    });
    const locationInput = document.getElementById('location');

    locationInput.addEventListener('input', () => {
        // If the user types manually, clear the hidden GPS fields
        // This tells the backend 'this is a manual address, not a map pin'
        document.getElementById('latitude').value = "";
        document.getElementById('longitude').value = "";
        console.log("Manual address entry detected. GPS cleared.");
    });
}

// 2. "Use My Location" Button Logic
// function getUserLocation() {
//     if (navigator.geolocation) {
//         // Options for better accuracy
//         const geoOptions = {
//             enableHighAccuracy: true, // Forces the device to use GPS if available
//             timeout: 5000,            // Wait 5 seconds for a signal
//             maximumAge: 0             // Do not use a cached (old) location
//         };

//         navigator.geolocation.getCurrentPosition((position) => {
//             const lat = position.coords.latitude;
//             const lng = position.coords.longitude;

//             // Move map and marker to the precise point
//             map.setView([lat, lng], 17); // Zoom in closer (17 is very close)
//             marker.setLatLng([lat, lng]);

//             // Get the specific address
//             getAddress(lat, lng);
//         }, (error) => {
//             console.warn(`ERROR(${error.code}): ${error.message}`);
//             alert("Could not get a precise location. Please drag the pin manually to your street.");
//         }, geoOptions); // Apply the accuracy options here
//     } else {
//         alert("Geolocation is not supported by your browser.");
//     }
// }
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Only update if it's reasonably accurate or if user confirms
            map.setView([lat, lng], 17);
            marker.setLatLng([lat, lng]);
            getAddress(lat, lng);
        }, (error) => {
            alert("Could not get GPS signal. Please use the search bar above.");
        }, { enableHighAccuracy: true });
    }
}

// 3. Convert Coordinates to Address (Reverse Geocoding)
// Uses the free Nominatim API
async function getAddress(lat, lng) {
    // Save to hidden inputs
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
    
    // Show "Loading..." while fetching
    const locInput = document.getElementById('location');
    locInput.value = "Fetching address...";

    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data && data.display_name) {
            locInput.value = data.display_name; // The full address
        } else {
            locInput.value = "Unknown Location";
        }
    } catch (err) {
        console.error("Geocoding error:", err);
        locInput.value = "Error fetching address";
    }
}


async function searchArea() {
    const query = document.getElementById('mapSearch').value;
    if (!query) return alert("Please enter an area name");

    const statusInput = document.getElementById('location');
    statusInput.value = "Searching...";

    try {
        // We append "Pune" to the query to make the results more relevant to your city
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Pune")}`;
        
        const response = await fetch(url);
        const results = await response.json();

        if (results.length > 0) {
            const firstResult = results[0];
            const lat = parseFloat(firstResult.lat);
            const lon = parseFloat(firstResult.lon);

            // 1. Move the Map
            map.setView([lat, lon], 16);

            // 2. Move the Marker
            marker.setLatLng([lat, lon]);

            // 3. Update the Address and Hidden GPS fields
            document.getElementById('location').value = firstResult.display_name;
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lon;

            console.log("Map moved to search result:", firstResult.display_name);
        } else {
            alert("Area not found. Please try a different name or drag the pin manually.");
            statusInput.value = "";
        }
    } catch (error) {
        console.error("Search error:", error);
        alert("Error connecting to search service.");
    }
}

// OPTIONAL: Allow user to press "Enter" in the search box
document.getElementById('mapSearch')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchArea();
    }
});
