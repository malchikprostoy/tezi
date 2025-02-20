const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Пароль обязателен только если нет Google ID
    },
  },
  photo: { type: String, default: "" },
  role: { type: String, enum: ["student", "teacher"], default: "student" }, // ✅ Должно быть!
  isVerified: { type: Boolean, default: false }, // Новый флаг для статуса верификации
  verificationCode: { type: String }, // Код для верификации
});

module.exports = mongoose.model("User", UserSchema);
