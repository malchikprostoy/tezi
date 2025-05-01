const Lesson = require("../models/Lesson");
const Task = require("../models/Task");
const mongoose = require("mongoose");

// Функция генерации кода урока
const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase(); // Генератор кода урока

// 📌 Создание урока
const createLesson = async (req, res) => {
  try {
    const { title } = req.body; // Убираем description, если он не нужен

    if (!title) {
      return res.status(400).json({ message: "Название урока обязательно!" });
    }

    const lesson = new Lesson({
      title,
      teacherId: req.user.userId,
      code: generateCode(), // Генерируем уникальный код урока
    });

    await lesson.save();

    res.status(201).json({ message: "✅ Урок создан", lesson });
  } catch (error) {
    console.error("❌ Ошибка при создании урока:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// 📌 Присоединение к уроку
const joinLesson = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user?.userId?.toString(); // Убедимся, что userId - это строка

    if (!code) {
      return res.status(400).json({ error: "Код урока обязателен!" });
    }

    if (!userId) {
      return res.status(400).json({ error: "ID пользователя отсутствует!" });
    }

    // Находим урок по коду
    const lesson = await Lesson.findOne({ code });
    if (!lesson) {
      return res.status(404).json({ error: "Урок не найден!" });
    }

    // Проверяем, что userId является корректным ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Некорректный userId!" });
    }

    // Проверяем, есть ли пользователь уже в списке студентов
    if (lesson.students.some((studentId) => studentId.toString() === userId)) {
      return res.status(400).json({ error: "Вы уже записаны на этот урок!" });
    }

    // Добавляем студента в список
    lesson.students.push(userId);
    await lesson.save();

    res.json({ message: "Вы успешно присоединились!", lessonId: lesson._id });
  } catch (error) {
    console.error("❌ Ошибка в joinLesson:", error);
    res.status(500).json({ error: "Ошибка сервера!" });
  }
};

const getStudentLessons = async (req, res) => {
  try {
    const userId = req.query.userId || req.user?.userId;
    if (!userId) {
      return res.status(400).json({ error: "ID пользователя отсутствует!" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Некорректный ID пользователя!" });
    }

    const lessons = await Lesson.find({ students: userId.toString() }).lean();

    res.json({ lessons });
  } catch (error) {
    console.error("❌ Ошибка при получении уроков:", error);
    res.status(500).json({ error: "Ошибка сервера!" });
  }
};

const leaveLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user?.userId?.toString(); // ID пользователя из токена

    if (!lessonId || !mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: "Некорректный ID урока!" });
    }

    if (!userId) {
      return res.status(400).json({ error: "ID пользователя отсутствует!" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: "Урок не найден!" });
    }

    // Проверяем, записан ли пользователь на урок
    const isStudent = lesson.students.some(
      (studentId) => studentId.toString() === userId
    );

    if (!isStudent) {
      return res.status(400).json({ error: "Вы не записаны на этот урок!" });
    }

    // Удаляем студента из массива
    lesson.students = lesson.students.filter(
      (studentId) => studentId.toString() !== userId
    );

    await lesson.save();

    res.json({ message: "Вы покинули урок", lessonId });
  } catch (error) {
    console.error("❌ Ошибка при выходе из урока:", error);
    res.status(500).json({ error: "Ошибка сервера!" });
  }
};

const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!lessonId || lessonId === "undefined") {
      return res.status(400).json({ error: "Некорректный ID урока" });
    }

    const lesson = await Lesson.findById(lessonId).populate("tasks");

    if (!lesson) {
      return res.status(404).json({ error: "Урок не найден" });
    }

    res.status(200).json(lesson);
  } catch (error) {
    console.error("Ошибка загрузки урока:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const getMyLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ teacherId: req.user.userId });
    res.json({ lessons });
  } catch (error) {
    console.error("Ошибка при получении уроков:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Находим урок
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ message: "Урок не найден" });
    }

    // Проверяем, является ли пользователь владельцем урока
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Вы не можете редактировать этот урок" });
    }

    // Обновляем данные урока
    lesson.title = title || lesson.title;
    await lesson.save();

    res.json({ message: "Урок обновлен", lesson });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: "Урок не найден" });
    }
    res.json({ message: "✅ Урок удален" });
  } catch (error) {
    console.error("❌ Ошибка при удалении урока:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const getStudentsByLessonId = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).populate(
      "students",
      "name email"
    );
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    res.json(lesson.students);
  } catch (error) {
    console.error("Ошибка при получении студентов:", error);
    res.status(500).json({ message: "Failed to get students" });
  }
};

module.exports = {
  createLesson,
  joinLesson,
  getMyLessons,
  getStudentLessons,
  getLessonById,
  leaveLesson,
  updateLesson,
  deleteLesson,
  getStudentsByLessonId,
};
