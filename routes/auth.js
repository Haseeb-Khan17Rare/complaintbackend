const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashed, role });
    await user.save();

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1d" });
    res.json({ user: { id: user._id, name, email, role }, token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1d" });
    res.json({ user: { id: user._id, name: user.name, email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
