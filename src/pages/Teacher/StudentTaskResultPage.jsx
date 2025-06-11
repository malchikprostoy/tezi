import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  Box,
  Breadcrumbs,
  Button,
  Alert,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";
import ScrollToTopButton from "../../components/ScrollToTopButton";

const StudentTaskResultPage = () => {
  const { lessonId, taskId, studentId } = useParams();
  const [task, setTask] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/results/task/${taskId}/student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResult(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке результата:", err);
      }
    };

    if (taskId && studentId) {
      fetchResult();
    }
  }, [taskId, studentId]);

  useEffect(() => {
    const fetchLessonAndTask = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error(t("You are not authorized"));
          return;
        }

        if (!lessonId || !taskId) {
          console.error("lessonId или taskId отсутствует, запрос отменён");
          return;
        }

        const [lessonRes, taskRes] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLesson(lessonRes.data);
        setTask(taskRes.data);
      } catch (error) {
        console.error("Ошибка загрузки задания:", error);
        toast.error(t("Error loading lesson"));
      }
    };

    if (lessonId && taskId) {
      fetchLessonAndTask();
    }
  }, [lessonId, taskId]);

  if (!result)
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <Container maxWidth="lg" sx={{ flex: 1, mt: 4, mb: 3 }}>
          <Alert severity="warning">
            {t("The student missed the task without completing it")}
          </Alert>
          <Button
            variant="outlined"
            sx={{ mt: 4, mb: 3 }}
            color="error"
            onClick={() => navigate(`/teacher/lesson/${lessonId}`)}
          >
            {t("Back to lesson")}
          </Button>
        </Container>
        <ScrollToTopButton />
        <Footer />
      </Box>
    );

  // Подсчет total и earned баллов
  let totalScore = 0;
  let earnedScore = 0;

  task?.exercises?.forEach((exercise) => {
    totalScore += exercise.score || 0;

    const answer = result.answers.find((a) => {
      if (exercise.type === "antonym") {
        return (
          (a.question || "").trim().toLowerCase() ===
          (exercise.word || "").trim().toLowerCase()
        );
      } else if (exercise.type === "test") {
        return (
          (a.question || "").trim().toLowerCase() ===
          (exercise.question || "").trim().toLowerCase()
        );
      } else if (exercise.type === "text") {
        return (
          (a.text || "").trim().toLowerCase() ===
          (exercise.text || "").trim().toLowerCase()
        );
      }
      return false;
    });

    if (
      exercise.type === "test" &&
      answer?.selectedOption === exercise.correctOption
    ) {
      earnedScore += exercise.score;
    }

    if (
      exercise.type === "antonym" &&
      answer?.selectedOption?.trim() ===
        exercise.optionas?.[exercise.correctOption]?.trim()
    ) {
      earnedScore += exercise.score;
    }
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="lg" sx={{ flex: 1, mt: 4, mb: 3 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
            <HomeOutlinedIcon sx={{ color: "#d93125" }} />
          </Link>
          {lesson && (
            <Link
              to={`/teacher/lesson/${lessonId}`}
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              <Typography color="text.primary">{lesson.title}</Typography>
            </Link>
          )}
          {task && (
            <Link
              to={`/teacher/lesson/${lessonId}/tasks/${taskId}/edit`}
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              <Typography color="text.primary">{task.title}</Typography>
            </Link>
          )}
          <Typography color="text.primary">
            {result.userId?.name || result.userId?.email}
          </Typography>
        </Breadcrumbs>

        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6">
            {t("Student")}: {result.userId?.name || result.userId?.email}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            {t("Task")}: {result.taskId?.title}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {t("Submitted at")}: {new Date(result.createdAt).toLocaleString()}
          </Typography>
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>
            {t("Score")}: {earnedScore} / {totalScore}
          </Typography>

          <Box sx={{ mt: 3 }}>
            {task?.exercises?.map((exercise, index) => {
              const answer = result.answers.find((a) => {
                if (exercise.type === "antonym") {
                  return (
                    (a.question || "").trim().toLowerCase() ===
                    (exercise.word || "").trim().toLowerCase()
                  );
                } else if (exercise.type === "test") {
                  return (
                    (a.question || "").trim().toLowerCase() ===
                    (exercise.question || "").trim().toLowerCase()
                  );
                } else if (exercise.type === "text") {
                  return (
                    (a.text || "").trim().toLowerCase() ===
                    (exercise.text || "").trim().toLowerCase()
                  );
                }
                return false;
              });

              const isCorrect =
                (exercise.type === "test" &&
                  answer?.selectedOption === exercise.correctOption) ||
                (exercise.type === "antonym" &&
                  answer?.selectedOption?.trim() ===
                    exercise.optionas?.[exercise.correctOption]?.trim());

              return (
                <Paper key={index} sx={{ p: 2, my: 2 }}>
                  {/* TEXT */}
                  {exercise.type === "text" && (
                    <>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {exercise.title}
                      </Typography>
                      <Typography sx={{ mt: 1, whiteSpace: "pre-line" }}>
                        {exercise.text}
                      </Typography>
                    </>
                  )}

                  {/* TEST */}
                  {exercise.type === "test" && (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {exercise.titlet}
                        </Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {isCorrect
                            ? `${exercise.score} / ${exercise.score}`
                            : `0 / ${exercise.score}`}
                        </Typography>
                      </Box>
                      <Typography>{exercise.question}</Typography>
                      <Box sx={{ mt: 2 }}>
                        {exercise.options?.map((option, idx) => {
                          const isCorrectOption =
                            idx === exercise.correctOption;
                          const isSelected = idx === answer?.selectedOption;
                          let bgColor = "inherit";
                          let color = "inherit";

                          if (isSelected && isCorrectOption) {
                            bgColor = "#c8e6c9";
                            color = "green";
                          } else if (isSelected && !isCorrectOption) {
                            bgColor = "#ffcdd2";
                            color = "red";
                          } else if (!isSelected && isCorrectOption) {
                            bgColor = "#c8e6c9";
                            color = "green";
                          }

                          return (
                            <Typography
                              key={idx}
                              sx={{
                                bgcolor: bgColor,
                                color,
                                p: 1,
                                mb: 1,
                                borderRadius: 1,
                                fontWeight:
                                  isSelected || isCorrectOption
                                    ? "bold"
                                    : "normal",
                              }}
                            >
                              {option}
                            </Typography>
                          );
                        })}
                      </Box>
                    </>
                  )}

                  {/* ANTONYM */}
                  {exercise.type === "antonym" && (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {exercise.titlea}
                        </Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {isCorrect
                            ? `${exercise.score} / ${exercise.score}`
                            : `0 / ${exercise.score}`}
                        </Typography>
                      </Box>
                      <Typography>{exercise.word}</Typography>
                      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
                        {exercise.optionas?.map((opt, idx) => {
                          const isCorrectOpt =
                            opt.trim() ===
                            exercise.optionas[exercise.correctOption].trim();
                          const isSelected =
                            answer?.selectedOption?.trim() === opt.trim();

                          let bgColor = "inherit";
                          let color = "inherit";

                          if (isSelected && isCorrectOpt) {
                            bgColor = "#c8e6c9";
                            color = "green";
                          } else if (isSelected && !isCorrectOpt) {
                            bgColor = "#ffcdd2";
                            color = "red";
                          } else if (!isSelected && isCorrectOpt) {
                            bgColor = "#c8e6c9";
                            color = "green";
                          }

                          return (
                            <Typography
                              key={idx}
                              sx={{
                                bgcolor: bgColor,
                                color,
                                p: 1,
                                mb: 1,
                                mr: 1,
                                borderRadius: 1,
                                fontWeight:
                                  isSelected || isCorrectOpt
                                    ? "bold"
                                    : "normal",
                              }}
                            >
                              {opt}
                            </Typography>
                          );
                        })}
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography>
                          <strong>{t("Correct answer")}:</strong>{" "}
                          {exercise.optionas?.[exercise.correctOption] ||
                            t("Unknown")}
                        </Typography>
                        <Typography>
                          <strong>{t("Your answer")}:</strong>{" "}
                          {answer?.selectedOption?.trim() || t("No selected")}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Paper>
              );
            })}
          </Box>
        </Paper>

        <Button
          variant="outlined"
          sx={{ mt: 4, mb: 3 }}
          color="error"
          onClick={() => navigate(`/teacher/lesson/${lessonId}`)}
        >
          {t("Back to lesson")}
        </Button>
      </Container>
      <ScrollToTopButton />
      <Footer />
    </Box>
  );
};

export default StudentTaskResultPage;
