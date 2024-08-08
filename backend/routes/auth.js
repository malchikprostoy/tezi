const express = require("express");
const path = require("path");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/register", upload.single("photo"), registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, getUserProfile);

module.exports = router;
