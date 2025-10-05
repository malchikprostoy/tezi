import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
import ScrollToTopButton from "../../components/ScrollToTopButton";

const TaskStudent = () => {
  const { t } = useTranslation();
  const { lessonId, taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmFinish, setOpenConfirmFinish] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [audioSrc, setAudioSrc] = useState(null);
  const timerIntervalRef = useRef(null);

  const LOCAL_STORAGE_KEY = `student-answers-${taskId}`;

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

        // ✅ Восстанавливаем ответы из localStorage
        const savedAnswers =
          JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
        const restoredExercises = (data.exercises || []).map((ex) => {
          if (
            ex.type === "test" &&
            savedAnswers[ex._id]?.selectedOption !== undefined
          ) {
            return {
              ...ex,
              selectedOption: savedAnswers[ex._id].selectedOption,
            };
          }
          if (ex.type === "antonym" && savedAnswers[ex._id]?.selectedAntonym) {
            return {
              ...ex,
              selectedAntonym: savedAnswers[ex._id].selectedAntonym,
            };
          }
          return ex;
        });

        setExercises(restoredExercises);
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
          toast.info(t("Time is up! The task will be completed automatically"));

          handleFinish(); // 🔥 Автоматический вызов
        } else {
          const hours = Math.floor(timeRemaining / 1000 / 3600)
            .toString()
            .padStart(2, "0");
          const minutes = Math.floor((timeRemaining / 1000 / 60) % 60)
            .toString()
            .padStart(2, "0");
          const seconds = Math.floor((timeRemaining / 1000) % 60)
            .toString()
            .padStart(2, "0");

          setTimeLeft(`${hours}:${minutes}:${seconds}`);
        }
      };

      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);
    }
  };

  useEffect(() => {
    if (lesson && timeLeft === "00:00:00!" && !showResults) {
      handleFinish();
    }
  }, [lesson, timeLeft]);

  // ✅ Сохраняем выбор для тестов
  const handleAnswerSelect = (exerciseId, selectedOption) => {
    setExercises((prevExercises) => {
      const updated = prevExercises.map((exercise) =>
        exercise._id === exerciseId ? { ...exercise, selectedOption } : exercise
      );

      const savedAnswers =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
      savedAnswers[exerciseId] = { selectedOption };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedAnswers));

      return updated;
    });
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
    if (showResults) return;
    if (!lesson) return;

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
            correctAnswer: exercise.correctAnswer,
            correct: exercise.selectedOption === exercise.correctAnswer,
          };
        } else if (exercise.type === "antonym") {
          return {
            type: "antonym",
            question: exercise.word,
            selectedOption: exercise.selectedAntonym,
            correctAnswer: exercise.correctAntonym,
            correct: exercise.selectedAntonym === exercise.correctAntonym,
          };
        }
      });

    await saveResults(calculatedAnswers);
    setShowResults(true);
    setOpenDialog(true);

    // ✅ Очистка сохранённых ответов после завершения
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    navigate(`/lesson/${lesson._id}`);
  };

  // Открыть/закрыть диалог
  const handleOpenConfirmFinish = () => setOpenConfirmFinish(true);
  const handleCloseConfirmFinish = () => setOpenConfirmFinish(false);

  // Подтверждение завершения
  const confirmFinishTask = () => {
    handleFinish();
    handleCloseConfirmFinish();
  };

  const handleAudioChange = (newAudioSrc) => {
    setAudioSrc(newAudioSrc);
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
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold" }}>
                        {exercise.titlet}
                      </Typography>
                      {exercise.score !== undefined && (
                        <Typography
                          sx={{
                            fontStyle: "italic",
                            fontWeight: "bold",
                            color: "gray",
                            fontSize: 14,
                          }}
                        >
                          {t("Score")}: {exercise.score}
                        </Typography>
                      )}
                    </Box>

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
                  <Box
                    sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2, mb: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {exercise.titlea}
                      </Typography>
                      {exercise.score !== undefined && (
                        <Typography
                          sx={{
                            fontStyle: "italic",
                            fontWeight: "bold",
                            color: "gray",
                            fontSize: 14,
                          }}
                        >
                          {t("Score")}: {exercise.score}
                        </Typography>
                      )}
                    </Box>

                    <Typography sx={{ mb: 1 }}>{exercise.word}</Typography>

                    {exercise.optionas && exercise.optionas.length > 0 ? (
                      <Select
                        autoWidth
                        value={exercise.selectedAntonym || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setExercises((prevExercises) => {
                            const updated = prevExercises.map((ex) =>
                              ex._id === exercise._id
                                ? { ...ex, selectedAntonym: value }
                                : ex
                            );

                            // ✅ сохраняем antonym ответ
                            const savedAnswers =
                              JSON.parse(
                                localStorage.getItem(LOCAL_STORAGE_KEY)
                              ) || {};
                            savedAnswers[exercise._id] = {
                              selectedAntonym: value,
                            };
                            localStorage.setItem(
                              LOCAL_STORAGE_KEY,
                              JSON.stringify(savedAnswers)
                            );

                            return updated;
                          });
                        }}
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
                  <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                    <AudioPlayer
                      audioSrc={exercise.audioSrc}
                      onAudioChange={handleAudioChange}
                      isReadOnly
                      maxPlays={2}
                    />
                  </Box>
                )}
              </Box>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, mb: 3 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleOpenConfirmFinish}
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

          {/* Модальное окно подтверждения */}
          <Dialog
            open={openConfirmFinish}
            onClose={handleCloseConfirmFinish}
            aria-labelledby="confirm-finish-title"
            aria-describedby="confirm-finish-description"
          >
            <DialogTitle id="confirm-finish-title">
              {t("Confirm Finish")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="confirm-finish-description">
                {t(
                  "Are you sure you want to finish this task? You won’t be able to make changes after this"
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseConfirmFinish}
                color="primary"
                variant="outlined"
              >
                {t("Cancel")}
              </Button>
              <Button
                onClick={confirmFinishTask}
                color="error"
                variant="outlined"
                sx={{
                  "&:hover": {
                    backgroundColor: "#a30000", // чуть светлее при наведении
                    boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                  },
                }}
                autoFocus
              >
                {t("Finish")}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
      <ScrollToTopButton />
      <Footer />
    </Box>
  );
};

export default TaskStudent;
