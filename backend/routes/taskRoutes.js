const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getTasksByLessonId,
  updateTaskTimer,
  getTimer,
  getTaskById,
  updateTask,
  addExercise,
  uploadAudio,
  deleteExercise,
} = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/authRoutes");

const router = express.Router();

const audioDir = path.join(__dirname, "..", "uploads", "audio");

// Проверяем, существует ли директория, если нет — создаем
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Конфигурация для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "audio")); // Путь, куда сохраняется файл
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname); // Генерация имени файла
  },
});

const upload = multer({ storage });

router.post(
  "/:taskId/upload-audio",
  authenticateToken,
  upload.single("audio"),
  uploadAudio
);

router.get("/:lessonId/tasks", authenticateToken, getTasksByLessonId);
router.get("/:taskId", authenticateToken, getTaskById); // Получить задание
router.put("/:taskId", authenticateToken, updateTask); // Обновить задание
router.post("/:taskId/timer", authenticateToken, updateTaskTimer);
router.get("/:taskId/timer", authenticateToken, getTimer);
router.post("/:taskId/exercises", authenticateToken, addExercise);
router.delete(
  "/:taskId/exercises/:exerciseId",
  authenticateToken,
  deleteExercise
);

module.exports = router;
