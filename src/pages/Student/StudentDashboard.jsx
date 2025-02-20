import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const StudentDashboard = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchStudentLessons(token);
    } else {
      toast.error("Вы не авторизованы!");
      setMessage("Вы не авторизованы!");
    }
  }, []);

  const fetchStudentLessons = async () => {
    let token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ Ошибка: Токен отсутствует.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/lessons/student",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data.lessons)) {
        setLessons(response.data.lessons);
      } else {
        console.error(
          "❌ Ошибка: `lessons` не является массивом!",
          response.data
        );
      }
    } catch (error) {
      console.error(
        "❌ Ошибка загрузки уроков студента:",
        error.response?.data || error
      );
      setMessage(
        error.response?.data?.message || "Ошибка при загрузке уроков."
      );
    }
  };

  const joinLesson = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Вы не авторизованы.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/lessons/join",
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || "Вы успешно присоединились!");
      setCode(""); // Очистить поле ввода
      fetchStudentLessons(); // 🔄 Обновляем список уроков
    } catch (error) {
      console.error("Ошибка при присоединении:", error);
      toast.error(error.response?.data?.message || "Ошибка при присоединении.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4" color={"#000"} gutterBottom>
        Студент: Присоединение к уроку
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, color: "#000" }}>
        Мои уроки
      </Typography>

      {lessons.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Вы еще не присоединились ни к одному уроку.
        </Typography>
      ) : (
        <List sx={{ color: "#000" }}>
          {lessons.map((lesson) => (
            <ListItemButton
              key={lesson._id}
              onClick={() => navigate(`/lesson/${lesson._id}`)}
            >
              <ListItemText primary={lesson.title} />
            </ListItemButton>
          ))}
        </List>
      )}

      {message && (
        <Box mt={2}>
          <Typography color="error">{message}</Typography>
        </Box>
      )}

      <TextField
        label="Введите код урока"
        variant="outlined"
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ my: 2 }}
      />

      <Button variant="contained" color="primary" onClick={joinLesson}>
        Присоединиться
      </Button>
    </Container>
  );
};

export default StudentDashboard;
