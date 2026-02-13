const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  district: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-progress", "resolved", "rejected"], default: "pending" },
  remarks: { type: String },
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);
