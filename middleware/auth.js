const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = (requiredRole) => async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, "your_jwt_secret");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: "User not found" });

    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({ msg: "Access denied for this role" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
