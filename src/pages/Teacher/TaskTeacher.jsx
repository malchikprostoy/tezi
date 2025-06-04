import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // Получение taskId из URL
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Modal,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Select,
  Breadcrumbs,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import AntonymExercise from "../Task/AntonymExercise";
import TestExercise from "../Task/TestExercise";
import TextExercise from "../Task/TextExercise";
import TaskTimer from "../Task/TaskTimer";
import axios from "axios";
import { toast } from "react-toastify";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import { useTranslation } from "react-i18next";
import ScrollToTopButton from "../../components/ScrollToTopButton";

const TaskTeacher = () => {
  const { t } = useTranslation();
  const { lessonId, taskId } = useParams(); // Получаем taskId из URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [exerciseType, setExerciseType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAntonym, setSelectedAntonym] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [students, setStudents] = useState([]);
  const [newExercise, setNewExercise] = useState({
    title: "",
    titlet: "",
    titlea: "",
    text: "",
    question: "",
    options: [],
    optionas: [],
    correctOption: null,
    word: "",
    antonym: "",
    type: "",
    audioSrc: "",
  });

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  // Загружаем задание с сервера
  useEffect(() => {
    const fetchLessonAndTask = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error(t("You are not authorized"));
          return;
        }

        if (!lessonId || !taskId) {
          console.error("lessonId или taskId отсутствует, запрос отменён");
          return;
        }

        const [lessonRes, taskRes] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLesson(lessonRes.data);
        setTask(taskRes.data);
      } catch (error) {
        console.error("Ошибка загрузки задания:", error);
        toast.error(t("Error loading lesson"));
      }
    };

    if (lessonId && taskId) {
      fetchLessonAndTask();
    }
  }, [lessonId, taskId]);

  // Открытие/закрытие меню
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // Выбор типа упражнения и открытие модалки
  const handleSelectExercise = (type) => {
    setExerciseType(type);
    setNewExercise((prev) => ({ ...prev, type }));
    setOpenModal(true);
    handleCloseMenu();
  };

  // Закрытие модалки
  const handleCloseModal = () => {
    setOpenModal(false);
    setExerciseType(null);
  };

  // Проверка перед отправкой данных
  const validateExercise = () => {
    if (exerciseType === "text" && !newExercise.title) {
      toast.error(t("Title is required for text exercise!"));
      return false;
    }

    if (exerciseType === "test") {
      if (!newExercise.options || newExercise.options.length < 2) {
        toast.error(t("Add at least two answer options!"));
        return false;
      }
      if (
        newExercise.correctOption === null ||
        newExercise.correctOption >= newExercise.options.length
      ) {
        toast.error(t("Select a valid correct option!"));
        return false;
      }
    }

    if (exerciseType === "audio" && !newExercise.audioSrc) {
      toast.error(t("You must upload an audio file!"));
      return false;
    }

    return true;
  };

  // Добавление нового упражнения
  const handleAddExercise = async () => {
    try {
      if (!validateExercise()) return;

      // Проверка, что аудиофайл был выбран
      if (exerciseType === "audio" && !newExercise.audioSrc) {
        toast.error(t("You must upload an audio file!"));
        return;
      }

      const token = localStorage.getItem("token"); // Получаем токен
      if (!token) {
        toast.error(t("You are not authorized"));
        return;
      }

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/exercises`,
        newExercise,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!data.exercise || !data.exercise._id) {
        console.error("Ошибка: сервер не вернул _id!", data);
        toast.error(t("Error saving task"));
        return;
      }

      setTask((prevTask) => ({
        ...prevTask,
        exercises: [...(prevTask.exercises || []), data.exercise],
      }));
      toast.success(t("Exercise added"));
      handleCloseModal();
    } catch (error) {
      console.error("Ошибка при добавлении упражнения:", error);
      toast.error(t("Error adding exercise"));
      if (error.response) {
        console.error("Ответ сервера:", error.response.data);
      }
    }
  };

  // Удаление упражнения
  const handleDeleteExercise = async (exerciseId) => {
    if (!exerciseId) {
      console.error("Ошибка: передан пустой exerciseId!");
      return;
    }
    try {
      const token = localStorage.getItem("token"); // Получаем токен
      if (!token) {
        toast.error(t("You are not authorized"));
        return;
      }

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/exercises/${exerciseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен
          },
        }
      );

      setTask((prevTask) => ({
        ...prevTask,
        exercises: prevTask.exercises.filter((ex) => ex._id !== exerciseId),
      }));
      toast.success(t("Exercise deleted"));
    } catch (error) {
      console.error("Ошибка при удалении упражнения:", error);
      toast.error(t("Error deleting exercise"));
    }
  };

  // Сохранение задания
  const handleSaveTask = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(t("You are not authorized"));
        return;
      }

      const updatedTask = {
        title: task.title,
        description: task.description,
        // Добавьте другие поля задачи, если необходимо
      };

      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(t("Task saved"));
      setTask(data);
      navigate(`/teacher/lesson/${lessonId}`);
    } catch (error) {
      console.error("Ошибка при сохранении задания:", error);
      toast.error(t("Error saving task"));
    }
  };

  const handleAudioChange = (newAudioSrc) => {
    setAudioSrc(newAudioSrc); // Update the state with the new audio source
  };

  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("audio", file);

      const token = localStorage.getItem("token"); // Или получаем токен из контекста

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/upload-audio`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // Добавляем токен
            },
          }
        );

        // Путь к файлу, который возвращает сервер
        setNewExercise((prev) => ({
          ...prev,
          audioSrc: res.data.path, // Например, /uploads/audio/yourfile.mp3
        }));
        toast.success(t("Audio uploaded successfully"));
      } catch (error) {
        console.error("Error uploading audio:", error);
        toast.error(t("Error uploading audio"));
      }
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Box sx={{ flex: 1, p: 3 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
            <HomeOutlinedIcon sx={{ color: "#d93125" }} />
          </Link>
          {lesson && (
            <Link
              to={`/teacher/lesson/${lessonId}`}
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              <Typography color="text.primary">{lesson.title}</Typography>
            </Link>
          )}
          <Typography color="text.primary">
            {task?.title || <CircularProgress />}
          </Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {task?.title || <LinearProgress />}
        </Typography>

        <Button
          variant="outlined"
          color="error"
          onClick={handleOpenMenu}
          sx={{
            "&:hover": {
              backgroundColor: "#a30000", // чуть светлее при наведении
              boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
              color: "#fff",
            },
          }}
        >
          {t("Add exercise")}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleSelectExercise("text")}>
            {t("Text")}
          </MenuItem>
          <MenuItem onClick={() => handleSelectExercise("test")}>
            {t("Test")}
          </MenuItem>
          <MenuItem onClick={() => handleSelectExercise("antonym")}>
            {t("Antonyms")}
          </MenuItem>
          <MenuItem onClick={() => handleSelectExercise("audio")}>
            {t("Audio")}
          </MenuItem>
        </Menu>

        <Box sx={{ mt: 2 }}>
          {/* Добавим проверку на существование task перед отображением таймера */}
          {task && task._id && <TaskTimer taskId={task._id} />}
          {/* Кнопка сохранения задания */}
          <Button
            variant="outlined"
            color="error"
            onClick={handleSaveTask}
            sx={{
              ml: 1,
              "&:hover": {
                backgroundColor: "#a30000", // чуть светлее при наведении
                boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
                color: "#fff",
              },
            }}
          >
            {t("Save task")}
          </Button>
        </Box>

        {/* Список упражнений */}
        <Box sx={{ mt: 3 }}>
          {task?.exercises?.map((exercise, index) => (
            <Box
              key={exercise._id || index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                mb: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
              }}
            >
              {/* Отображение упражнения в зависимости от его типа */}
              <Box sx={{ flex: 1 }}>
                {exercise.type === "text" && (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {exercise.title}
                    </Typography>
                    <Typography>{exercise.text || "no text"}</Typography>
                  </>
                )}

                {exercise.type === "test" && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {exercise.titlet}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>{exercise.question}</Typography>

                    <List>
                      {exercise.options?.map((option, i) => (
                        <ListItem
                          key={i}
                          sx={{
                            bgcolor:
                              i === exercise.correctOption
                                ? "lightgreen"
                                : "inherit",
                            borderRadius: 1,
                            mb: 0.5,
                          }}
                        >
                          <ListItemText
                            primary={option}
                            sx={{
                              color:
                                i === exercise.correctOption
                                  ? "green"
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
                        value={selectedAntonym}
                        onChange={(e) => setSelectedAntonym(e.target.value)}
                        displayEmpty
                        sx={{ mt: 1, bgcolor: "#fff" }}
                      >
                        <MenuItem disabled value="">
                          {t("Select")}
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
                    />
                  </Box>
                )}
              </Box>

              {/* ✅ Кнопка удаления с DeleteIcon */}
              <IconButton
                onClick={() => handleDeleteExercise(exercise._id)}
                sx={{ ml: 2 }}
                color="error"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* Модальное окно для добавления упражнения */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              maxHeight: "80vh",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              {t("Add exercise")}
            </Typography>

            <Box sx={{ overflowY: "auto", flex: 1, pr: 1 }}>
              {exerciseType === "text" && (
                <TextExercise
                  newExercise={newExercise}
                  handleExerciseChange={(key, value) =>
                    setNewExercise((prev) => ({ ...prev, [key]: value }))
                  }
                />
              )}
              {exerciseType === "test" && (
                <TestExercise
                  newExercise={newExercise}
                  handleExerciseChange={(key, value) =>
                    setNewExercise((prev) => ({ ...prev, [key]: value }))
                  }
                />
              )}
              {exerciseType === "antonym" && (
                <AntonymExercise
                  newExercise={newExercise}
                  handleExerciseChange={(key, value) =>
                    setNewExercise((prev) => ({ ...prev, [key]: value }))
                  }
                />
              )}
              {exerciseType === "audio" && (
                <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                  <AudioPlayer
                    audioSrc={newExercise.audioSrc} // Используем путь, полученный с сервера
                    onAudioChange={handleAudioChange}
                  />
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mt: 2, width: "100%" }}
                  >
                    {t("Upload audio")}
                    <VisuallyHiddenInput
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload} // Загрузка файла
                    />
                  </Button>
                </Box>
              )}
            </Box>
            <Button
              variant="outlined"
              color="error"
              onClick={handleAddExercise}
              sx={{
                mt: 2,
                width: "100%",
                "&:hover": {
                  backgroundColor: "#a30000", // чуть светлее при наведении
                  boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                },
              }}
            >
              {t("Save")}
            </Button>
          </Box>
        </Modal>
        <ScrollToTopButton />
      </Box>
      <Footer />
    </Box>
  );
};

export default TaskTeacher;
