const mongoose = require("mongoose");
const Result = require("../models/Result");

const getResultsByLesson = async (req, res) => {
  try {
    const userId = req.user.userId; // Берем ID текущего пользователя из токена
    const { lessonId } = req.params;

    const results = await Result.find({ lessonId, userId }).select("taskId");

    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Server error fetching results" });
  }
};

const saveResult = async (req, res) => {
  try {
    const userId = req.user.userId; // из токена
    const { lessonId, taskId, answers } = req.body;

    if (!lessonId || !taskId || !answers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newResult = new Result({
      userId,
      lessonId,
      taskId,
      answers, // предполагается, что ответы содержат информацию о выбранных вариантах
    });

    await newResult.save();

    res.status(201).json({ message: "Result saved successfully" });
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({ message: "Server error saving result" });
  }
};

const getResultByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await Result.findOne({
      taskId,
      userId: req.user.userId, // чтобы пользователь видел только свои результаты
    });

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getStudentResultByTask = async (req, res) => {
  try {
    const { taskId, studentId } = req.params;

    const result = await Result.findOne({
      taskId,
      userId: studentId,
    })
      .populate("userId", "name email") // если нужно отображать имя или email
      .populate("taskId", "title");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Ошибка при получении результата студента:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getResultsByLesson,
  saveResult, // добавляем сюда
  getResultByTask,
  getStudentResultByTask,
};
