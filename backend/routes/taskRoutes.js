const express = require("express");
const {
  getTasksByLessonId,
  updateTaskTimer,
  getTimer,
  getTaskById,
  updateTask,
  addExercise,
  deleteExercise,
} = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/authRoutes");

const router = express.Router();

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
