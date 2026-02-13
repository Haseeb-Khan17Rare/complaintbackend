const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const auth = require("../middleware/auth");

// Create complaint (Citizen)
router.post("/", auth("citizen"), async (req, res) => {
  try {
    const complaint = new Complaint({ ...req.body, citizenId: req.user._id });
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all complaints (Citizen sees own, Admin sees all)
router.get("/", auth(), async (req, res) => {
  try {
    let complaints;
    if (req.user.role === "citizen") {
      complaints = await Complaint.find({ citizenId: req.user._id });
    } else {
      complaints = await Complaint.find();
    }
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update complaint (Admin only)
router.patch("/:id", auth("admin"), async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
