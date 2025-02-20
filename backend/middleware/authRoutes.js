const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No or invalid Authorization header");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("❌ Token missing");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.role) {
      console.log("❌ User has no role assigned");
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = { userId: user._id, role: user.role }; // ✅ Теперь есть role
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

const checkVerified = async (req, res, next) => {
  try {
    let user;
    if (/^\d+$/.test(req.user.userId)) {
      // Если userId состоит только из цифр, ищем по googleId
      user = await User.findOne({ googleId: req.user.userId });
    } else {
      // Иначе ищем по стандартному _id
      user = await User.findById(req.user.userId);
    }

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
