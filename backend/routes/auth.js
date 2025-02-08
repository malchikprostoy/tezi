const express = require("express");
const multer = require("multer");
const {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const {
  authenticateToken,
  checkVerified,
} = require("../middleware/authRoutes");

const router = express.Router();

// Настройка хранилища multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Роуты
router.post("/register", upload.single("photo"), registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, checkVerified, getUserProfile);

module.exports = router;
