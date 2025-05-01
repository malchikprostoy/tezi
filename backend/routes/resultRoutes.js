const express = require("express");
const {
  getResultsByLesson,
  saveResult,
  getResultByTask,
  getStudentResultByTask,
} = require("../controllers/resultController");
const { authenticateToken } = require("../middleware/authRoutes");

const router = express.Router();

router.get("/lesson/:lessonId", authenticateToken, getResultsByLesson);
router.post("/", authenticateToken, saveResult);
router.get("/task/:taskId", authenticateToken, getResultByTask);
router.get(
  "/task/:taskId/student/:studentId",
  authenticateToken,
  getStudentResultByTask
);

module.exports = router;
