const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema(
  {
    title: String,
    titlet: String,
    titlea: String,
    text: String,
    description: String,
    question: String,
    options: [String],
    optionas: [String],
    answers: [String],
    correctOption: Number,
    word: String,
    antonym: String,
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  exercises: [ExerciseSchema],
  timer: {
    startTime: Date, // Время начала задачи
    duration: Number, // Продолжительность в минутах
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
  },
});

module.exports = mongoose.model("Task", taskSchema);
