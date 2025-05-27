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
      audioSrc,
    } = req.body;

    // Проверяем корректность taskId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Некорректный ID задания" });
    }

    // Проверяем, что тип упражнения корректный
    if (!["text", "test", "antonym", "audio"].includes(type)) {
      return res.status(400).json({ message: "Некорректный тип упражнения" });
    }

    // Ищем задание в базе
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Задание не найдено" });
    }

    // Очистка ненужных полей по типу
    if (type === "antonym") {
      // Очищаем лишние поля
      title = undefined;
      titlet = undefined;
      text = undefined;
      question = undefined;
      description = undefined;
      options = undefined;
      audioSrc = undefined;
    }

    if (type === "text") {
      titlet = undefined;
      titlea = undefined;
      question = undefined;
      description = undefined;
      word = undefined;
      antonym = undefined;
      options = undefined;
      optionas = undefined;
      correctOption = undefined;
      audioSrc = undefined;
    }

    if (type === "test") {
      title = undefined;
      titlea = undefined;
      word = undefined;
      optionas = undefined;
      antonym = undefined;
      audioSrc = undefined;
      description = undefined;
    }

    if (type === "audio") {
      title = undefined;
      titlet = undefined;
      titlea = undefined;
      word = undefined;
      antonym = undefined;
      question = undefined;
      text = undefined;
      options = undefined;
      optionas = undefined;
      correctOption = undefined;
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
      audioSrc,
    };

    // Удаляем из объекта поля со значением undefined
    Object.keys(newExercise).forEach(
      (key) => newExercise[key] === undefined && delete newExercise[key]
    );

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

const uploadAudio = async (req, res) => {
  if (req.file) {
    const audioPath = `${process.env.REACT_APP_API_URL}/uploads/audio/${req.file.filename}`;
    res.json({ path: audioPath });
  } else {
    console.log("Нет файла для загрузки");
    res.status(400).json({ error: "Нет файла для загрузки" });
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

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Некорректный ID задания" });
    }

    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: "Задание не найдено" });
    }

    // Удаляем ссылку из Lesson
    await Lesson.findByIdAndUpdate(task.lessonId, {
      $pull: { tasks: taskId },
    });

    res.json({ message: "Задание удалено" });
  } catch (error) {
    console.error("Ошибка при удалении задания:", error);
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
  uploadAudio,
  deleteExercise,
  deleteTask,
};
