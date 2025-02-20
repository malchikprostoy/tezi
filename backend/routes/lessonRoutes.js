const express = require("express");
const router = express.Router();
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
router.get("/:lessonId", authenticateToken, getLessonById);
router.delete("/:lessonId/leave", authenticateToken, leaveLesson);
router.put("/:id", authenticateToken, updateLesson);
router.delete("/:id", authenticateToken, deleteLesson);

module.exports = router;
