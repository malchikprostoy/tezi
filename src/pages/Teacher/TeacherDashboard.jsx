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

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [setLessonCode] = useState("");
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
    }
  }, [user]); // Выполняется только если `user` изменился

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const createLesson = async () => {
    if (!user || user.role !== "teacher") {
      console.error("❌ У вас нет прав для создания урока!");
      return;
    }
    if (!title.trim()) {
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
    } catch (error) {
      console.error("❌ Ошибка создания урока:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4" gutterBottom color={"#000"}>
        Мои уроки
      </Typography>

      <List sx={{ mb: 4 }}>
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <ListItemButton
              key={lesson._id}
              onClick={() =>
                navigate(
                  user.role === "teacher"
                    ? `/teacher/lesson/${lesson._id}`
                    : `/lesson/${lesson._id}`
                )
              }
            >
              <ListItemText sx={{ color: "#000" }} primary={lesson.title} />
            </ListItemButton>
          ))
        ) : (
          <Typography variant="body1" color={"#000"}>
            🔍 У вас пока нет уроков.
          </Typography>
        )}
      </List>

      <Typography variant="h5" gutterBottom color={"#000"}>
        Создать новый урок
      </Typography>

      <TextField
        label="Название урока"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" onClick={createLesson}>
        Создать урок
      </Button>
    </Container>
  );
};

export default TeacherDashboard;
