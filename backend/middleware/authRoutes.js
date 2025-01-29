const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // Save the decoded user data into req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

const checkVerified = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId); // Ensure User model is imported
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }
    next();
  } catch (error) {
    console.error("checkVerified error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { authenticateToken, checkVerified };
