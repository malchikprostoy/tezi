const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: ".env.local" });

connectDB();

const app = express();

// Статическая папка для загрузок
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Подключение маршрутов
app.use("/api", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
