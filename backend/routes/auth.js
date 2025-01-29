const express = require("express");
const multer = require("multer");
const { loginUser } = require("../controllers/authController");
const {
  authenticateToken,
  checkVerified,
} = require("../middleware/authRoutes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

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

/// Функция для отправки email
const sendVerificationEmail = async (user, verificationCode) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465, // Correct port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Email Verification",
    text: `Hello ${user.name},\n\nYour verification code is: ${verificationCode}\n\nThis code is valid for 1 hour.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Маршрут для регистрации
router.post("/register", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      photo: photoUrl,
      emailVerificationCode: verificationCode,
      verificationCodeExpiration: Date.now() + 3600000, // Код действует 1 час
    });

    await user.save();

    await sendVerificationEmail(user, verificationCode);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully. Verification email sent.",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});
// Верификация email
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;

    // Найти пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Проверить совпадение кода
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Обновить статус пользователя на "верифицирован"
    user.isVerified = true;
    user.verificationCode = null; // Очистить код после верификации
    await user.save();

    // Генерация токена
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Email verified successfully", token });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});
router.post("/login", loginUser);
router.get("/profile", authenticateToken, checkVerified, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ name: user.name, email: user.email, photo: user.photo });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
