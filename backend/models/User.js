const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
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
    required: true,
  },
  photo: {
    type: String,
  },
  isVerified: { type: Boolean, default: false }, // Новый флаг для статуса верификации
  verificationCode: { type: String }, // Код для верификации
});

module.exports = mongoose.model("User", UserSchema);
