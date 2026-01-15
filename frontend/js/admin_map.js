
// if (typeof adminMap === 'undefined') {
//     var adminMap; 
// }

// document.addEventListener('DOMContentLoaded', () => {
//     initAdminMap();
//     loadComplaintsOnMap();
// });





// // Function to initialize the map
// function initAdminMap() {
//     const mapContainer = document.getElementById('adminMap');
    
//     if (!mapContainer) return;

//     // FIX: Check if map is already initialized to prevent "already initialized" error
//     if (adminMap !== undefined && adminMap !== null) {
//         adminMap.remove(); // Remove the old instance
//     }

//     // Initialize Map centered on Pune
//     adminMap = L.map('adminMap').setView([18.5204, 73.8567], 12);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors'
//     }).addTo(adminMap);

//     // Force a resize check to fix the "blank map" issue
//     setTimeout(() => {
//         adminMap.invalidateSize();
//     }, 500);

//     // Load the data after map is ready
//     loadComplaintsOnMap();
// }
// // async function loadComplaintsOnMap() {
// //     const res = await fetch("http://localhost:5000/api/complaints");
// //     const complaints = await res.json();
    
// //     complaints.forEach(complaint => {
// //         console.log(`Checking complaint ${complaint.complaintId}: Lat: ${complaint.latitude}, Lng: ${complaint.longitude}`);
        
// //         if (complaint.latitude && complaint.longitude) {
// //             // ... your marker code ...
// //             console.log("✅ Adding marker to map!");
// //         } else {
// //             console.log("❌ Skipping marker: No coordinates found.");
// //         }
// //     });
// // }
// async function loadComplaintsOnMap() {
//     try {
//         const res = await fetch("http://localhost:5000/api/complaints");
//         const complaints = await res.json();
        
//         const validLocations = []; // To store coordinates for auto-zoom

//         complaints.forEach(complaint => {
//             // ONLY if lat/lng exist in the JSON
//             if (complaint.latitude && complaint.longitude) {
//                 const lat = parseFloat(complaint.latitude);
//                 const lng = parseFloat(complaint.longitude);
                
//                 validLocations.push([lat, lng]);

//                 const markerColor = complaint.status === 'Resolved' ? 'green' : 'red';
                
//                 // Bigger, more visible marker
//                 const marker = L.circleMarker([lat, lng], {
//                     radius: 12, 
//                     fillColor: markerColor,
//                     color: "#fff",
//                     weight: 3,
//                     fillOpacity: 1
//                 }).addTo(adminMap);

//                 marker.bindPopup(`<b>${complaint.category}</b><br>${complaint.description}`);
//             }
//         });

//         // AUTO-ZOOM: If we have at least one pin, zoom directly to it
//         if (validLocations.length > 0) {
//             const bounds = L.latLngBounds(validLocations);
//             adminMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
//         }

//     } catch (err) {
//         console.error("Map Error:", err);
//     }
// }

// Initialize when the page is ready
// document.addEventListener('DOMContentLoaded', initAdminMap);



// Global variable for the map
var adminMap;

function initAdminMap() {
    const mapContainer = document.getElementById('adminMap');
    
    // Safety: Exit if the map container isn't found
    if (!mapContainer) return;

    // Destroy previous instance if it exists to prevent "already initialized" error
    if (adminMap) {
        adminMap.remove();
    }

    // Initialize Map on Pune
    adminMap = L.map('adminMap').setView([18.5204, 73.8567], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(adminMap);

    // Refresh size for flexbox layout
    setTimeout(() => {
        adminMap.invalidateSize();
    }, 500);

    // Fetch and plot data
    loadComplaintsOnMap();
}

async function loadComplaintsOnMap() {
    try {
        const res = await fetch("http://localhost:5000/api/complaints");
        const complaints = await res.json();
        
        const validLocations = [];

        complaints.forEach(complaint => {
            if (complaint.latitude && complaint.longitude) {
                const lat = parseFloat(complaint.latitude);
                const lng = parseFloat(complaint.longitude);
                
                validLocations.push([lat, lng]);

                const markerColor = complaint.status === 'Resolved' ? '#2ecc71' : '#ff0000'; // Bright Green or Red

                const marker = L.circleMarker([lat, lng], {
                    radius: 15,          // INCREASED from 12 to 15 for "Big" dots
                    fillColor: markerColor,
                    color: "#ffffff",    // White border
                    weight: 3,           // Thick border to make it pop
                    opacity: 1,
                    fillOpacity: 1       // Solid color, no transparency
                }).addTo(adminMap);

                // Privacy-friendly popup
                marker.bindPopup(`
                    <b>${complaint.category}</b><br>
                    ${complaint.description}<br>
                    <small>Status: ${complaint.status}</small>
                `);
            }
        });

        // Auto-zoom to fit markers
        if (validLocations.length > 0) {
            const bounds = L.latLngBounds(validLocations);
            adminMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }

    } catch (err) {
        console.error("Map Data Error:", err);
    }
}

// Start the map after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initAdminMap);

// Function to update status directly from the map
async function updateStatusFromMap(id) {
    if (confirm("Mark this issue as Resolved?")) {
        try {
            await fetch(`http://localhost:5000/api/complaints/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Resolved" })
            });
            location.reload(); // Refresh to show the green marker
        } catch (err) {
            alert("Update failed");
        }
    }
}
