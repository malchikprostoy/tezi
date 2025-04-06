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
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newTask, setNewTask] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (lessonId) fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/lessons/${lessonId}/tasks`,
        { lessonId, title: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTask("");
      fetchLesson();
    } catch (error) {
      console.error("❌ Ошибка добавления задания:", error);
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
            <HomeOutlinedIcon />
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

        {/* Редактирование названия урока */}
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

        {/* Блок с заданиями */}
        <Typography variant="h5" sx={{ mt: 4 }}>
          Задания
        </Typography>
        {lesson.tasks && lesson.tasks.length > 0 ? (
          <List sx={{ mt: 2 }}>
            {lesson.tasks.map((task) => (
              <ListItemButton
                key={task._id}
                onClick={() => {
                  navigate(
                    `/teacher/lesson/${lessonId}/tasks/${task._id}/edit`
                  );
                }}
              >
                <ListItemText primary={task.title} />
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ mt: 2, color: "gray" }}>
            Нет заданий
          </Typography>
        )}

        {/* Добавление нового задания */}
        <Box sx={{ mt: 3 }}>
          <TextField
            label="Новое задание"
            fullWidth
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={addTask}
          >
            Добавить задание
          </Button>
        </Box>
      </Container>
      <Footer content={t} />
    </Box>
  );
};

export default LessonPage;
