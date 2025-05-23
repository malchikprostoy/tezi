import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  LinearProgress,
  Paper,
  Box,
  Breadcrumbs,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";

const StudentTaskResultPage = () => {
  const { lessonId, taskId, studentId } = useParams();
  const [task, setTask] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [result, setResult] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    console.log("Fetching result for taskId:", taskId, "studentId:", studentId);
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/results/task/${taskId}/student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResult(res.data);
        console.log("Result received:", res.data);
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
          axios.get(`http://localhost:5000/api/lessons/${lessonId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
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

  if (!result) return <LinearProgress />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ mt: 4 }}>
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

        <Typography variant="h4">{t("Task Result")}</Typography>
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

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">{t("Answers")}</Typography>
            {result.answers.map((answer, index) => {
              const isSelected = answer.selectedOption != null;
              const isCorrect = isSelected && answer.correct;
              const options = answer.options || [];
              const selectedText = isSelected
                ? options[answer.selectedOption]
                : t("No selected");

              const correctOptionIndex =
                task?.exercises?.[index]?.correctOption;
              const correctOptionText =
                options[correctOptionIndex] || t("Unknown");

              return (
                <Paper key={index} sx={{ p: 2, my: 1 }}>
                  <Typography>
                    <strong>{t("Question")}:</strong> {answer.question}
                  </Typography>
                  <Typography>
                    <strong>{t("Selected")}:</strong> {selectedText}
                  </Typography>
                  <Typography>
                    <strong>{t("Correct answer")}:</strong> {correctOptionText}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default StudentTaskResultPage;
