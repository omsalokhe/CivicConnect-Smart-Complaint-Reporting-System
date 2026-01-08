const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use("/api/complaints", require("./routes/complaintRoutes"));

// MongoDB Connection (FREE MongoDB Atlas)
mongoose.connect("mongodb://127.0.0.1:27017/complaintDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});
