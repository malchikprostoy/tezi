const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  type: { type: String, required: true },
  question: { type: String, required: true },
  selectedOption: { type: mongoose.Schema.Types.Mixed }, // может быть строка или число
  correct: { type: Boolean, required: true },
  options: [{ type: String }],
});

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
