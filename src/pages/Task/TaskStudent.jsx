import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  LinearProgress,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Alert,
  Select,
  MenuItem,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";

const TaskStudent = () => {
  const { lessonId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAntonym, setSelectedAntonym] = useState("");
  const [lesson, setLesson] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [answers, setAnswers] = useState([]);
  const timerIntervalRef = useRef(null);

  const { role } = JSON.parse(localStorage.getItem("user")) || {};
  const isStudent = role === "student";

  useEffect(() => {
    fetchTask();
    fetchLesson();
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [taskId, lessonId]);

  const fetchTask = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Необходимо войти в систему");
      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data && data._id) {
        setTask(data);
        setExercises(data.exercises || []);
        setLoading(false);
        fetchTimer(data._id);
      } else {
        toast.error("Ошибка: задание не найдено");
        setLoading(false);
      }
    } catch (error) {
      console.error("Ошибка при загрузке задания:", error);
      toast.error("Ошибка загрузки задания");
      setLoading(false);
    }
  };

  const fetchTimer = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Необходимо войти в систему");
        return;
      }

      const { data } = await axios.get(
        `http://localhost:5000/api/tasks/${taskId}/timer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data) {
        startTimer(data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке таймера:", error);
      toast.error("Ошибка при загрузке таймера");
    }
  };

  const startTimer = (timerData) => {
    if (timerData && timerData.startTime && timerData.duration) {
      const startTime = new Date(timerData.startTime).getTime();
      const duration = timerData.duration * 1000;
      const endTime = startTime + duration;

      const updateTimer = () => {
        const currentTime = new Date().getTime();
        const timeRemaining = endTime - currentTime;

        if (timeRemaining <= 0) {
          setTimeLeft("Время вышло!");
          clearInterval(timerIntervalRef.current);
        } else {
          const hours = Math.floor(timeRemaining / 1000 / 3600);
          const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
          const seconds = Math.floor((timeRemaining / 1000) % 60);
          setTimeLeft(`${hours}:${minutes}:${seconds}`);
        }
      };

      timerIntervalRef.current = setInterval(updateTimer, 1000);
    }
  };

  const fetchLesson = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Необходимо войти в систему");
      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data && data._id) {
        setLesson(data);
      } else {
        toast.error("Ошибка: урок не найден");
      }
    } catch (error) {
      console.error("Ошибка при загрузке урока:", error);
      toast.error("Ошибка загрузки урока");
    }
  };

  const handleAnswerSelect = (exerciseId, selectedOption) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise._id === exerciseId ? { ...exercise, selectedOption } : exercise
      )
    );
  };

  const handleFinish = () => {
    setAnswers(
      exercises
        .filter(
          (exercise) => exercise.type === "test" || exercise.type === "antonym"
        )
        .map((exercise) => {
          if (exercise.type === "test") {
            return {
              type: "test",
              question: exercise.question,
              selectedOption: exercise.selectedOption,
              correct: exercise.selectedOption === exercise.correctOption,
            };
          } else if (exercise.type === "antonym") {
            return {
              type: "antonym",
              question: exercise.word,
              selectedOption: exercise.selectedAntonym,
              correct: exercise.selectedAntonym === exercise.correctAntonym,
            };
          }
        })
    );

    setShowResults(true);
    setOpenDialog(true); // Open the dialog to show results
  };

  if (loading) return <LinearProgress />;
  if (!task) return <Alert severity="info">Задание не найдено</Alert>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ flexGrow: 1, mt: 4 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <HomeOutlinedIcon />
          </Link>
          {lesson && (
            <Link
              to={`/lesson/${lesson._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {lesson.title}
            </Link>
          )}
          <Typography color="text.primary">{task.title}</Typography>
        </Breadcrumbs>

        <Typography variant="h4">{task.title}</Typography>

        {/* Отображаем таймер */}
        {timeLeft && (
          <Typography variant="h6" sx={{ mt: 2, color: "red" }}>
            {timeLeft}
          </Typography>
        )}

        <Typography variant="h6" sx={{ mt: 4 }}>
          Упражнения:
        </Typography>
        <List>
          {exercises.map((exercise) => (
            <ListItem key={exercise._id}>
              <Box sx={{ flex: 1 }}>
                {exercise.type === "text" && (
                  <>
                    <Typography variant="h6">{exercise.title}</Typography>
                    <Typography>{exercise.text || "Нет текста"}</Typography>
                  </>
                )}

                {exercise.type === "test" && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {exercise.title}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>{exercise.question}</Typography>

                    <List>
                      {exercise.options?.map((option, i) => (
                        <ListItem
                          key={i}
                          sx={{
                            bgcolor:
                              i === exercise.selectedOption
                                ? "lightblue"
                                : "inherit",
                            borderRadius: 1,
                            mb: 0.5,
                          }}
                        >
                          <ListItemText
                            primary={option}
                            onClick={() => handleAnswerSelect(exercise._id, i)}
                            sx={{
                              cursor: "pointer",
                              color:
                                i === exercise.selectedOption
                                  ? "blue"
                                  : "black",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {exercise.type === "antonym" && (
                  <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {exercise.title}
                    </Typography>
                    <Typography>{exercise.word}</Typography>

                    {exercise.optionas && exercise.optionas.length > 0 ? (
                      <Select
                        autoWidth
                        value={selectedAntonym}
                        onChange={(e) => setSelectedAntonym(e.target.value)}
                        displayEmpty
                        sx={{ mt: 1, bgcolor: "#fff" }}
                      >
                        <MenuItem disabled value="">
                          Выберите
                        </MenuItem>
                        {exercise.optionas.map((optiona, i) => (
                          <MenuItem key={i} value={optiona}>
                            {optiona}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <Typography>Антонимы не добавлены</Typography>
                    )}
                  </Box>
                )}
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Кнопка завершения задания */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinish}
            size="large"
          >
            Завершить
          </Button>
        </Box>

        {/* Результаты */}
        {showResults && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Вы завершили задание! Проверьте свои ответы выше.
          </Alert>
        )}
      </Container>
      <Footer />

      {/* Диалог с результатами */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Результаты</DialogTitle>
        <DialogContent>
          {answers.map((answer, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body1">{answer.question}</Typography>
              <Typography
                sx={{
                  color: answer.correct ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {answer.correct ? "Правильно" : "Неправильно"}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskStudent;
