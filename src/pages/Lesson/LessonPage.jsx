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
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const LessonPageStudent = () => {
  const { t } = useTranslation();
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
      toast.error(t("You need to log in"));
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
      toast.error(t("Error loading the lesson"));
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

      toast.success(t("You have left the lesson"));
      navigate("/");
    } catch (error) {
      toast.error(t("Error leaving the lesson"));
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
      : t("Not specified");

    const formattedDuration = duration
      ? `${Math.round(duration / 60)} ${t("min")}`
      : t("Not specified");

    return `${t("Start")}: ${formattedStart} | ${t(
      "Duration"
    )}: ${formattedDuration}`;
  };

  if (loading) return <LinearProgress />;
  if (!lesson) return <Alert severity="error">{t("Lesson not found")}</Alert>;

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

        <Typography variant="h6" sx={{ mt: 4 }}>
          {t("Tasks")}
        </Typography>

        <List>
          {tasks.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2 }}>
              {t("There are no assignments for this lesson")}
            </Typography>
          ) : (
            tasks.map((task) => {
              const now = new Date();
              const startTime = task.timer?.startTime
                ? new Date(task.timer.startTime)
                : null;
              const isLocked = startTime && now < startTime;

              const handleClick = () => {
                if (isLocked) {
                  toast.info(
                    `${t("This task will be available at")}: ${format(
                      startTime,
                      "dd.MM.yyyy HH:mm"
                    )}`
                  );
                } else {
                  handleTaskClick(task._id);
                }
              };

              return (
                <ListItemButton key={task._id} onClick={handleClick}>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {task.title}
                        {isLocked && <HttpsOutlinedIcon color="action" />}
                      </Box>
                    }
                    secondary={renderTaskInfo(task)}
                  />
                </ListItemButton>
              );
            })
          )}
        </List>

        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
          onClick={leaveLesson}
          disabled={leaving}
        >
          {t(leaving ? "Leaving..." : "Leave the lesson")}
        </Button>
      </Container>
      <Footer />
    </Box>
  );
};

export default LessonPageStudent;
