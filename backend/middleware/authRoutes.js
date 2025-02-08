const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ObjectId } = require("mongoose").Types;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = { userId: decoded.userId }; // Save the decoded user data into req.user
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

const createUser = async (profile) => {
  try {
    const user = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      isVerified: profile._json.email_verified,
    });

    await user.save();
    return user;
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

module.exports = { authenticateToken, checkVerified };
