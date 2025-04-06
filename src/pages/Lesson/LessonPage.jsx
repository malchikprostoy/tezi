import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Typography,
  LinearProgress,
  Alert,
  Box,
  Container,
  List,
  ListItemText,
  Breadcrumbs,
  Link,
  ListItemButton,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";
import { format } from "date-fns";

const LessonPageStudent = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Необходимо войти в систему");
      navigate("/login");
      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/lessons/${lessonId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLesson(data);

      const tasksData = await axios.get(
        `http://localhost:5000/api/lessons/${lessonId}/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(tasksData.data);
    } catch (error) {
      toast.error("Ошибка загрузки урока");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const leaveLesson = async () => {
    setLeaving(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/lessons/${lessonId}/leave`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Вы покинули урок");
      navigate("/");
    } catch (error) {
      toast.error("Ошибка выхода из урока");
      setLeaving(false);
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/student/lesson/${lessonId}/tasks/${taskId}`);
  };

  const renderTaskInfo = (task) => {
    const start = task.timer?.startTime;
    const duration = task.timer?.duration;

    const formattedStart = start
      ? format(new Date(start), "dd.MM.yyyy HH:mm")
      : "Не указано";

    const formattedDuration = duration
      ? `${Math.round(duration / 60)} мин`
      : "Не указано";

    return `Начало: ${formattedStart} | Длительность: ${formattedDuration}`;
  };

  if (loading) return <LinearProgress />;
  if (!lesson) return <Alert severity="error">Урок не найден</Alert>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ flexGrow: 1, mt: 4 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="inherit" onClick={() => navigate("/")}>
            <HomeOutlinedIcon />
          </Link>
          <Typography color="text.primary">{lesson.title}</Typography>
        </Breadcrumbs>

        <Typography variant="h4">{lesson.title}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Вы присоединились к этому уроку
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Задания:
        </Typography>

        <List>
          {tasks.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Нет заданий для этого урока.
            </Typography>
          ) : (
            tasks.map((task) => (
              <ListItemButton
                key={task._id}
                onClick={() => handleTaskClick(task._id)}
              >
                <ListItemText
                  primary={task.title}
                  secondary={renderTaskInfo(task)}
                />
              </ListItemButton>
            ))
          )}
        </List>

        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
          onClick={leaveLesson}
          disabled={leaving}
        >
          {leaving ? "Выходим..." : "Покинуть урок"}
        </Button>
      </Container>
      <Footer />
    </Box>
  );
};

export default LessonPageStudent;
