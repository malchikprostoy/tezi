const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/adminAuth");
const User = require("../models/User");

router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Удалить пользователя
router.delete("/users/:userId", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: "Пользователь удалён" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Обновить роль пользователя
router.put("/users/:userId/role", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!["student", "teacher", "admin"].includes(role)) {
      return res.status(400).json({ error: "Неверная роль" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });
    user.role = role;
    await user.save();
    res.json({ message: "Роль обновлена", user });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
