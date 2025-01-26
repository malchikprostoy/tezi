const express = require("express");
const multer = require("multer");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const authenticateToken = require("../middleware/authRoutes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

// Маршруты
router.post("/register", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохранение ссылки на фото
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Создание пользователя
    const user = new User({
      name,
      email,
      password: hashedPassword,
      photo: photoUrl,
    });

    await user.save();

    // Генерация JWT токена
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});
router.post("/login", loginUser);
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Предполагается, что вы извлекаете user ID из токена
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ name: user.name, email: user.email, photo: user.photo });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
