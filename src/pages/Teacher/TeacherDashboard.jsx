import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  TextField,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/AuthContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const TeacherDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [lessonCode, setLessonCode] = useState("");
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  const fetchLessons = useCallback(async () => {
    if (!user || user.role !== "teacher") return; // Загружаем только если роль teacher

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/lessons/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data.lessons);
    } catch (error) {
      console.error("❌ Ошибка загрузки уроков:", error);
      toast.error(t("Error loading lessons"));
    }
  }, [user]); // Выполняется только если `user` изменился

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const createLesson = async () => {
    if (!user || user.role !== "teacher") {
      toast.error(t("You don't have permission to create lessons"));
      console.error("❌ У вас нет прав для создания урока!");
      return;
    }
    if (!title.trim()) {
      toast.error(t("Lesson title cannot be empty"));
      console.error("❌ Название урока не может быть пустым!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const lessonData = { title };

      const response = await axios.post(
        "http://localhost:5000/api/lessons/create",
        lessonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLessonCode(response.data.lesson.code);
      setLessons((prevLessons) => [...prevLessons, response.data.lesson]); // Обновляем список
      setTitle(""); // Очищаем поле ввода
      toast.success(t("Lesson created successfully"));
    } catch (error) {
      console.error("❌ Ошибка создания урока:", error);
      toast.error(t("Error creating lesson"));
    }
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4" gutterBottom color={"#000"}>
        {t("My Lessons")}
      </Typography>

      <List sx={{ mb: 4 }}>
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <ListItemButton
              key={lesson._id}
              onClick={() => navigate(`/teacher/lesson/${lesson._id}`)}
            >
              <ListItemText sx={{ color: "#000" }} primary={lesson.title} />
            </ListItemButton>
          ))
        ) : (
          <Typography variant="body1" color={"#000"}>
            {t("You don't have any lessons yet")}
          </Typography>
        )}
      </List>

      <Typography variant="h5" gutterBottom color={"#000"}>
        {t("Create a new lesson")}
      </Typography>

      <TextField
        label={t("Lesson Title")}
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="outlined"
        color="error"
        onClick={createLesson}
        sx={{
          "&:hover": {
            backgroundColor: "#a30000", // чуть светлее при наведении
            boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
            color: "#fff",
          },
        }}
      >
        {t("Create Lesson")}
      </Button>
    </Container>
  );
};

export default TeacherDashboard;
