const Task = require("../models/Task");
const Lesson = require("../models/Lesson");
const mongoose = require("mongoose");

const getTasksByLessonId = async (req, res) => {
  const { lessonId } = req.params;

  try {
    // Ищем урок с заданным lessonId
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Урок не найден" });
    }

    // Ищем задания для данного урока
    const tasks = await Task.find({ _id: { $in: lesson.tasks } });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении заданий" });
  }
};

// Обновить таймер задания
const updateTaskTimer = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { startTime, duration } = req.body;

    // Проверяем корректность taskId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Некорректный ID задания" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Задание не найдено" });
    }

    // Обновляем данные таймера
    task.timer = { startTime, duration };
    await task.save();

    res.json({ message: "Таймер обновлён", task });
  } catch (error) {
    console.error("Ошибка при обновлении таймера:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const getTimer = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Проверяем корректность taskId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Некорректный ID задания" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Задание не найдено" });
    }

    // Возвращаем таймер
    res.json(task.timer || {});
  } catch (error) {
    console.error("Ошибка при получении таймера:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const addTask = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Название задания обязательно" });
    }

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: "Некорректный ID урока" });
    }

    // Проверяем, существует ли урок
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: "Урок не найден" });
    }

    // Создаем задание
    const task = new Task({ title, lessonId });
    await task.save();

    // Добавляем задание к уроку
    await Lesson.findByIdAndUpdate(lessonId, { $push: { tasks: task._id } });

    res.status(201).json({ message: "Задание добавлено", task });
  } catch (error) {
    console.error("Ошибка добавления задания:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// Получить задание по ID
const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Некорректный ID задания" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Задание не найдено" });
    }

    res.json(task);
  } catch (error) {
    console.error("Ошибка при получении задания:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Обновить задание
const updateTask = async (req, res) => {
  try {
    const { title } = req.body;
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Некорректный ID задания" });
    }

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: "Название не может быть пустым" });
    }

    const task = await Task.findByIdAndUpdate(taskId, { title }, { new: true });

    if (!task) {
      return res.status(404).json({ message: "Задание не найдено" });
    }

    res.json({ message: "Задание обновлено", task });
  } catch (error) {
    console.error("Ошибка при обновлении задания:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const addExercise = async (req, res) => {
  try {
    const { taskId } = req.params;
    let {
      title,
      titlet,
      titlea,
      text,
      question,
      type,
      word,
      antonym,
      description,
      options,
      optionas,
      correctOption,
    } = req.body;

    // Проверяем корректность taskId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Некорректный ID задания" });
    }

    // Проверяем, что тип упражнения корректный
    if (!["text", "test", "antonym"].includes(type)) {
      return res.status(400).json({ message: "Некорректный тип упражнения" });
    }

    // Ищем задание в базе
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Задание не найдено" });
    }

    // Создаем новое упражнение с `_id`
    const newExercise = {
      _id: new mongoose.Types.ObjectId(), // Генерируем уникальный `_id`
      title,
      titlet,
      titlea,
      text,
      question,
      type,
      word,
      antonym,
      description,
      options,
      optionas,
      correctOption,
    };

    // Добавляем упражнение в задание
    task.exercises.push(newExercise);
    await task.save();

    // Возвращаем клиенту успешный ответ
    res
      .status(201)
      .json({ message: "Упражнение добавлено", exercise: newExercise });
  } catch (error) {
    console.error("Ошибка при добавлении упражнения:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const deleteExercise = async (req, res) => {
  try {
    const { taskId, exerciseId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(exerciseId)
    ) {
      return res.status(400).json({ message: "Некорректные ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Задание не найдено" });
    }

    const initialLength = task.exercises.length;
    task.exercises = task.exercises.filter(
      (ex) => !new mongoose.Types.ObjectId(exerciseId).equals(ex._id)
    );

    if (task.exercises.length === initialLength) {
      return res.status(404).json({ message: "Упражнение не найдено" });
    }

    await task.save();
    res.json({ message: "Упражнение удалено" });
  } catch (error) {
    console.error("Ошибка при удалении упражнения:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

module.exports = {
  getTasksByLessonId,
  updateTaskTimer,
  getTimer,
  addTask,
  getTaskById,
  updateTask,
  addExercise,
  deleteExercise,
};
