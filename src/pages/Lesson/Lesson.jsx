import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Breadcrumbs,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const LessonPage = () => {
  const { lessonId } = useParams(); // Получаем lessonId из URL
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (lessonId) fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    if (!lessonId) return;

    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:5000/api/lessons/${lessonId}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLesson(response.data);
    } catch (error) {
      console.error("❌ Ошибка загрузки урока:", error);
    }
  };

  const updateLessonTitle = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/lessons/${lessonId}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLesson();
    } catch (error) {
      console.error("❌ Ошибка обновления названия:", error);
    }
  };

  const deleteLesson = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (error) {
      console.error("❌ Ошибка удаления урока:", error);
    }
  };

  if (!lesson) return <LinearProgress />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="lg" sx={{ flex: 1, textAlign: "center", mt: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
            Главная
          </Link>
          <Link
            to="/lessons"
            style={{ textDecoration: "none", color: "#1976d2" }}
          >
            Уроки
          </Link>
          <Typography color="text.primary">{lesson.title}</Typography>
        </Breadcrumbs>

        <Typography variant="h4">Управление уроком</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Название урока: {lesson.title}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Код урока: {lesson.code}
        </Typography>

        <TextField
          label="Название урока"
          fullWidth
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={updateLessonTitle}
        >
          Сохранить
        </Button>

        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2, ml: 2 }}
          onClick={deleteLesson}
        >
          Удалить урок
        </Button>
      </Container>
      <Footer content={t} />
    </Box>
  );
};

export default LessonPage;
