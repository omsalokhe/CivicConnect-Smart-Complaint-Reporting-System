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

    } catch (err) {
        alert("Server error");
    }
}