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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
  const [completedTasks, setCompletedTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

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
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLesson(data);

      const tasksData = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(tasksData.data);

      const resultsData = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/results/lesson/${lessonId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const completed = resultsData.data.map((r) => r.taskId.toString());
      setCompletedTasks(completed);
    } catch (error) {
      toast.error(t("Error loading the lesson"));
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const leaveLesson = async () => {
    handleCloseDialog();
    setLeaving(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}/leave`,
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

  const hasTimeEnded = (task) => {
    const startTime = task.timer?.startTime
      ? new Date(task.timer.startTime).getTime()
      : null;
    const duration = task.timer?.duration ? task.timer.duration * 1000 : null; // в миллисекундах

    if (!startTime || !duration) return false;

    const endTime = startTime + duration;
    const now = new Date().getTime();
    return now > endTime; // если сейчас позже конца задания
  };

  if (loading) return <LinearProgress />;
  if (!lesson) return <Alert severity="error">{t("Lesson not found")}</Alert>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ flexGrow: 1, mt: 4 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="inherit" onClick={() => navigate("/")}>
            <HomeOutlinedIcon
              sx={{ color: "#d93125", "&:hover": { cursor: "pointer" } }}
            />
          </Link>
          <Typography color="text.primary">{lesson.title}</Typography>
        </Breadcrumbs>

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

              const isCompleted = completedTasks.includes(task._id.toString());

              const handleClick = () => {
                if (isLocked) {
                  toast.info(
                    `${t("This task will be available at")}: ${format(
                      startTime,
                      "dd.MM.yyyy HH:mm"
                    )}`
                  );
                } else if (hasTimeEnded(task)) {
                  toast.warn(t("Time for this task has expired"));
                } else if (isCompleted) {
                  toast.info(
                    t("You only had one attempt to complete this task")
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
                        {isCompleted && (
                          <CheckCircleIcon color="success" fontSize="small" />
                        )}
                        {/* Показываем VisibilityIcon если время истекло */}
                        {!isLocked && hasTimeEnded(task) && (
                          <VisibilityIcon
                            color="action"
                            sx={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation(); // чтобы не срабатывал navigate к задаче
                              navigate(
                                `/student/lesson/${lessonId}/tasks/${task._id}/results`
                              );
                            }}
                          />
                        )}
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
          variant="outlined"
          color="error"
          sx={{
            mt: 3,
            "&:hover": {
              backgroundColor: "#a30000",
              boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
              color: "#fff",
            },
          }}
          onClick={handleOpenDialog}
          disabled={leaving}
        >
          {t(leaving ? "Leaving..." : "Leave the lesson")}
        </Button>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{t("Confirm Exit")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t("Are you sure you want to leave the lesson?")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              {t("No")}
            </Button>
            <Button onClick={leaveLesson} color="error" autoFocus>
              {t("Yes")}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </Box>
  );
};

export default LessonPageStudent;
