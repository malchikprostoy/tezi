const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Модель User

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
    console.log("Hashed password during registration:", hashedPassword); // Логируем хеш

    // Создаем нового пользователя
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      photo: req.file ? req.file.path : null, // Сохраняем путь к фото, если оно загружено
    });

    await newUser.save();

    // Создаем JWT токен
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
};

// Вход пользователя
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ищем пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(`User found: ${user.name}`);

    // Сравниваем введенный пароль с хешем из базы данных
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.log("Error during password comparison:", err);
        return res
          .status(500)
          .json({ message: "Server error during password comparison" });
      }

      console.log("Password match:", isMatch); // Лог для результата сравнения паролей

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Если пароли совпали, генерируем JWT токен
      const token = jwt.sign(
        { id: user._id }, // ID пользователя передаем в payload
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Срок действия токена 1 час
      );

      // Отправляем ответ только один раз
      return res.json({
        message: "Login successful",
        token,
      });
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Получение профиля пользователя
const getUserProfile = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID not found in request." });
  }

  try {
    const user = await User.findById(userId); // Ищем пользователя по ID
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Возвращаем путь к фото с базовым URL
    const photoUrl = user.photo ? `http://localhost:5000/${user.photo}` : null;

    return res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        name: user.name,
        email: user.email,
        photo: photoUrl, // Возвращаем полный путь к фото
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
