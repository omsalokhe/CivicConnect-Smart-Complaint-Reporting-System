const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    complaintId: String,
    name: String,
    category: String,
    area: String,
    description: String,
    status: {
        type: String,
        default: "Pending"
    },
    reportCount: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
