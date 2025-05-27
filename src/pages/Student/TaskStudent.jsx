import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import { useTranslation } from "react-i18next";

const TaskStudent = () => {
  const { t } = useTranslation();
  const { lessonId, taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAntonym, setSelectedAntonym] = useState("");
  const [lesson, setLesson] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [audioSrc, setAudioSrc] = useState(null);
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
      toast.error(t("You need to log in"));
      return;
    }

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
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
        toast.error(t("Task not found"));
        setLoading(false);
      }
    } catch (error) {
      console.error(t("Error loading the task:"), error);
      toast.error(t("Error loading the task"));
      setLoading(false);
    }
  };

  const fetchTimer = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(t("You need to log in"));
        return;
      }

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/timer`,
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
      toast.error(t("Error loading the timer"));
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
          setTimeLeft("00:00:00!");
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
      toast.error(t("You need to log in"));
      return;
    }

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data && data._id) {
        setLesson(data);
      } else {
        toast.error(t("Lesson not found"));
      }
    } catch (error) {
      console.error("Ошибка при загрузке урока:", error);
      toast.error(t("Error loading the lesson"));
    }
  };

  const handleAnswerSelect = (exerciseId, selectedOption) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise._id === exerciseId ? { ...exercise, selectedOption } : exercise
      )
    );
  };

  const saveResults = async (answers) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(t("You need to log in"));
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/results`,
        {
          lessonId,
          taskId,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(t("Results saved successfully!"));
    } catch (error) {
      console.error("Ошибка при сохранении результатов:", error);
      toast.error(t("Error saving the results"));
    }
  };

  const handleFinish = async () => {
    const calculatedAnswers = exercises
      .filter(
        (exercise) => exercise.type === "test" || exercise.type === "antonym"
      )
      .map((exercise) => {
        if (exercise.type === "test") {
          return {
            type: "test",
            question: exercise.question,
            selectedOption: exercise.selectedOption,
            correctAnswer: exercise.correctAnswer, // добавлено
            correct: exercise.selectedOption === exercise.correctAnswer,
          };
        } else if (exercise.type === "antonym") {
          return {
            type: "antonym",
            question: exercise.word,
            selectedOption: exercise.selectedAntonym,
            correctAnswer: exercise.correctAntonym, // добавлено
            correct: exercise.selectedAntonym === exercise.correctAntonym,
          };
        }
      });

    setAnswers(calculatedAnswers);
    await saveResults(calculatedAnswers);
    setShowResults(true);
    setOpenDialog(true);

    navigate(`/lesson/${lesson._id}`);
  };

  const handleAudioChange = (newAudioSrc) => {
    setAudioSrc(newAudioSrc); // Update the state with the new audio source
  };

  if (loading) return <LinearProgress />;
  if (!task) return <Alert severity="info">{t("Task not found")}</Alert>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ flexGrow: 1, mt: 4 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link to="/" color="inherit">
            <HomeOutlinedIcon sx={{ color: "#d93125" }} />
          </Link>
          {lesson && (
            <Link
              to={`/lesson/${lesson._id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              }
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              {lesson.title}
            </Link>
          )}
          <Typography color="text.primary">{task.title}</Typography>
        </Breadcrumbs>

        <Typography variant="h4">{task.title}</Typography>

        {/* Отображаем таймер */}
        {timeLeft && (
          <Box
            sx={{
              mt: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              background: "linear-gradient(90deg, #ff4e50, #f9d423)",
              padding: "12px 24px",
              width: "300px",
              borderRadius: "12px",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.5rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <AccessTimeIcon sx={{ fontSize: "2rem" }} />
            <Typography
              variant="h4"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              {timeLeft}
            </Typography>
          </Box>
        )}

        <Typography variant="h6">{t("Exercises:")}</Typography>
        <List>
          {exercises.map((exercise) => (
            <ListItem key={exercise._id}>
              <Box sx={{ flex: 1 }}>
                {exercise.type === "text" && (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {exercise.title}
                    </Typography>
                    <Typography>{exercise.text}</Typography>
                  </>
                )}

                {exercise.type === "test" && (
                  <Box>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {exercise.titlet}
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
                      {exercise.titlea}
                    </Typography>
                    <Typography>{exercise.word}</Typography>

                    {exercise.optionas && exercise.optionas.length > 0 ? (
                      <Select
                        autoWidth
                        value={exercise.selectedAntonym || ""}
                        onChange={(e) =>
                          setExercises((prevExercises) =>
                            prevExercises.map((ex) =>
                              ex._id === exercise._id
                                ? { ...ex, selectedAntonym: e.target.value }
                                : ex
                            )
                          )
                        }
                        displayEmpty
                        sx={{ mt: 1, bgcolor: "#fff" }}
                      >
                        <MenuItem disabled value="">
                          {t("Choose")}
                        </MenuItem>
                        {exercise.optionas.map((optiona, i) => (
                          <MenuItem key={i} value={optiona}>
                            {optiona}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <Typography>{t("No antonyms added")}</Typography>
                    )}
                  </Box>
                )}

                {exercise.type === "audio" && (
                  <>
                    <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                      <AudioPlayer
                        audioSrc={exercise.audioSrc}
                        onAudioChange={handleAudioChange}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Кнопка завершения задания */}
        <Box sx={{ mt: 3, mb: 3 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleFinish}
            size="large"
            sx={{
              "&:hover": {
                backgroundColor: "#a30000", // чуть светлее при наведении
                boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
                color: "#fff",
              },
            }}
          >
            {t("Finish")}
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default TaskStudent;
