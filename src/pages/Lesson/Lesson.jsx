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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import StudentResultsPage from "../Teacher/StudentResultsPage";

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newTask, setNewTask] = useState("");
  const [students, setStudents] = useState([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
      fetchStudents();
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLesson(response.data);
    } catch (error) {
      console.error("❌ Ошибка загрузки урока:", error);
      toast.error(t("Error loading lesson"));
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(res.data);
    } catch (err) {
      toast.error(t("Error loading students"));
    }
  };

  const updateLessonTitle = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTitle("");
      fetchLesson();
      toast.success(t("Lesson title updated successfully"));
    } catch (error) {
      console.error("❌ Ошибка обновления названия:", error);
      toast.error(t("Error updating lesson title"));
    }
  };

  const deleteLesson = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/");
      toast.success(t("Lesson deleted successfully"));
    } catch (error) {
      console.error("❌ Ошибка удаления урока:", error);
      toast.error(t("Error deleting lesson"));
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(t("Task deleted successfully"));
      fetchLesson(); // Обновим список заданий
    } catch (error) {
      console.error("❌ Ошибка удаления задания:", error);
      toast.error(t("Error deleting task"));
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}/tasks`,
        { lessonId, title: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTask("");
      fetchLesson();
      toast.success(t("Task added successfully"));
    } catch (error) {
      console.error("❌ Ошибка добавления задания:", error);
      toast.error(t("Error adding task"));
    }
  };

  // Открываем окно подтверждения удаления
  const handleOpenConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  // Закрываем окно подтверждения удаления
  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  // Удаление с закрытием окна
  const confirmDeleteLesson = async () => {
    await deleteLesson();
    setOpenConfirmDelete(false);
  };

  if (!lesson) return <LinearProgress />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container
        maxWidth="lg"
        sx={{ flex: 1, textAlign: "center", mt: 4, mb: 3 }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
            <HomeOutlinedIcon sx={{ color: "#d93125" }} />
          </Link>
          <Typography color="text.primary">{lesson.title}</Typography>
        </Breadcrumbs>

        <Typography variant="h4">{t("Manage Lesson")}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t("Lesson title")}: {lesson.title}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t("Lesson code")}: {lesson.code}
        </Typography>

        {/* Редактирование названия урока */}
        <TextField
          label={t("Lesson Title")}
          fullWidth
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button
          variant="outlined"
          color="error"
          sx={{
            mt: 2,
            "&:hover": {
              backgroundColor: "#a30000", // чуть светлее при наведении
              boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
              color: "#fff",
            },
          }}
          onClick={updateLessonTitle}
        >
          {t("Save")}
        </Button>

        <Button
          variant="outlined"
          color="error"
          sx={{
            mt: 2,
            ml: 2,
            "&:hover": {
              backgroundColor: "#a30000",
              boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
              color: "#fff",
            },
          }}
          onClick={handleOpenConfirmDelete}
        >
          {t("Delete Lesson")}
        </Button>

        {/* Модальное окно подтверждения */}
        <Dialog
          open={openConfirmDelete}
          onClose={handleCloseConfirmDelete}
          aria-labelledby="confirm-delete-title"
          aria-describedby="confirm-delete-description"
        >
          <DialogTitle id="confirm-delete-title">
            {t("Confirm Deletion")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-delete-description">
              {t(
                "Are you sure you want to delete this lesson? This action cannot be undone."
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDelete} color="primary">
              {t("Cancel")}
            </Button>
            <Button onClick={confirmDeleteLesson} color="error" autoFocus>
              {t("Delete")}
            </Button>
          </DialogActions>
        </Dialog>

        <StudentResultsPage />

        {/* Блок с заданиями */}
        <Typography variant="h5" sx={{ mt: 4 }}>
          {t("Tasks")}
        </Typography>
        {lesson.tasks && lesson.tasks.length > 0 ? (
          <List sx={{ mt: 2 }}>
            {lesson.tasks.map((task) => (
              <Box
                key={task._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1,
                  mb: 1,
                }}
              >
                <ListItemButton
                  sx={{ flex: 1 }}
                  onClick={() => {
                    navigate(
                      `/teacher/lesson/${lessonId}/tasks/${task._id}/edit`
                    );
                  }}
                >
                  <ListItemText primary={task.title} />
                </ListItemButton>
                <IconButton
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteTask(task._id)}
                  sx={{ ml: 2 }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ mt: 2, color: "gray" }}>
            {t("No tasks")}
          </Typography>
        )}

        {/* Добавление нового задания */}
        <Box sx={{ mt: 3 }}>
          <TextField
            label={t("New Task")}
            fullWidth
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button
            variant="outlined"
            color="error"
            sx={{
              mt: 2,
              "&:hover": {
                backgroundColor: "#a30000", // чуть светлее при наведении
                boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
                color: "#fff",
              },
            }}
            onClick={addTask}
          >
            {t("Add Task")}
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default LessonPage;
