const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Модель User
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // Для генерации случайного кода

// Функция для отправки верификационного email
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

// Регистрация пользователя
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Проверяем, существует ли пользователь с таким email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Генерация верификационного кода
    const verificationCode = crypto.randomBytes(16).toString("hex");
    const expirationTime = new Date(Date.now() + 3600000); // 1 час

    // ✅ Определяем роль: если только цифры — студент, иначе — учитель
    const localPart = email.split("@")[0];
    const isStudent = /^\d+$/.test(localPart);
    const role = isStudent ? "student" : "teacher";

    // Создаем нового пользователя
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      photo: req.file ? req.file.path : null, // Сохраняем путь к фото, если оно загружено
      emailVerificationCode: verificationCode, // Сохраняем верификационный код
      verificationCodeExpiration: expirationTime, // Устанавливаем время истечения
      role,
    });

    // Сохраняем пользователя
    await newUser.save();

    // Отправляем верификационный email
    await sendVerificationEmail(newUser, verificationCode);

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification.",
      token,
      role,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
};

// Верификация email
const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Проверяем, совпадает ли код
    if (
      user.emailVerificationCode !== verificationCode ||
      new Date() > user.verificationCodeExpiration
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    // Подтверждаем email
    user.isEmailVerified = true; // Устанавливаем флаг подтверждения на true
    user.emailVerificationCode = null; // Убираем верификационный код после подтверждения
    await user.save();

    res.status(200).json({ message: "Email successfully verified" });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ message: "Server error during email verification" });
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Находим пользователя по email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Проверяем, что email еще не подтвержден
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email уже подтвержден" });
    }

    // Генерация нового кода и обновление времени истечения
    const verificationCode = crypto.randomBytes(16).toString("hex");
    user.emailVerificationCode = verificationCode;
    user.verificationCodeExpiration = new Date(Date.now() + 3600000);
    await user.save();

    // Отправка нового email
    await sendVerificationEmail(user, verificationCode);

    res.status(200).json({ message: "Новый код верификации отправлен" });
  } catch (error) {
    console.error("Ошибка при повторной отправке кода:", error);
    res.status(500).json({ message: "Произошла ошибка на сервере" });
  }
};

// Вход пользователя
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Получение профиля пользователя
const getUserProfile = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID not found in request." });
  }

  try {
    const user = await User.findById(userId); // Ищем пользователя по ID
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ Проверяем, является ли фото полным URL
    let photoUrl = null;
    if (user.photo) {
      photoUrl = user.photo.startsWith("http")
        ? user.photo // Если это URL, оставляем как есть
        : `${process.env.REACT_APP_API_URL}/${user.photo.replace(/\\/g, "/")}`; // Если локальный, добавляем базовый URL
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        photo: photoUrl, // Возвращаем полный путь к фото
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  getUserProfile,
};
