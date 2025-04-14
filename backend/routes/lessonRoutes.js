const express = require("express");
const router = express.Router();
const {
  addTask,
  getTasksByLessonId,
  deleteTask,
} = require("../controllers/taskController");
const {
  createLesson,
  joinLesson,
  getMyLessons,
  getStudentLessons,
  getLessonById,
  leaveLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");
const { authenticateToken } = require("../middleware/authRoutes");

router.post("/create", authenticateToken, createLesson);
router.post("/join", authenticateToken, joinLesson);
router.get("/my", authenticateToken, getMyLessons);
router.get("/student", authenticateToken, getStudentLessons);

router.delete("/:lessonId/leave", authenticateToken, leaveLesson);
router.put("/:id", authenticateToken, updateLesson);
router.delete("/:id", authenticateToken, deleteLesson);
router.post("/:lessonId/tasks", authenticateToken, addTask);
router.get("/:lessonId/tasks", authenticateToken, getTasksByLessonId);
router.delete("/:lessonId/tasks/:taskId", authenticateToken, deleteTask);
router.get("/:lessonId", authenticateToken, getLessonById);

module.exports = router;
