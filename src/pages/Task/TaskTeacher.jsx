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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import AntonymExercise from "./AntonymExercise";
import TestExercise from "./TestExercise";
import TextExercise from "./TextExercise";
import TaskTimer from "./TaskTimer";
import axios from "axios";
import { toast } from "react-toastify";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";

const TaskTeacher = () => {
  const { lessonId, taskId } = useParams(); // Получаем taskId из URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [exerciseType, setExerciseType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAntonym, setSelectedAntonym] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
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
          toast.error("Вы не авторизованы");
          return;
        }

        if (!lessonId || !taskId) {
          console.error("lessonId или taskId отсутствует, запрос отменён");
          return;
        }

        const [lessonRes, taskRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/lessons/${lessonId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLesson(lessonRes.data);
        setTask(taskRes.data);
      } catch (error) {
        console.error("Ошибка загрузки задания:", error);
        toast.error("Ошибка загрузки задания");
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
      toast.error("Название обязательно для текстового упражнения!");
      return false;
    }

    if (exerciseType === "test") {
      if (!newExercise.options || newExercise.options.length < 2) {
        toast.error("Добавьте хотя бы два варианта ответа!");
        return false;
      }
      if (
        newExercise.correctOption === null ||
        newExercise.correctOption >= newExercise.options.length
      ) {
        toast.error("Выберите корректный вариант ответа!");
        return false;
      }
    }

    if (exerciseType === "audio" && !newExercise.audioSrc) {
      toast.error("Необходимо загрузить аудиофайл!");
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
        toast.error("Необходимо загрузить аудиофайл!");
        return;
      }

      const token = localStorage.getItem("token"); // Получаем токен
      if (!token) {
        toast.error("Вы не авторизованы");
        return;
      }

      const { data } = await axios.post(
        `http://localhost:5000/api/tasks/${taskId}/exercises`,
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
        toast.error("Ошибка сохранения упражнения");
        return;
      }

      setTask((prevTask) => ({
        ...prevTask,
        exercises: [...(prevTask.exercises || []), data.exercise],
      }));
      toast.success("Упражнение добавлено");
      handleCloseModal();
    } catch (error) {
      console.error("Ошибка при добавлении упражнения:", error);
      toast.error("Ошибка добавления упражнения");
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
        toast.error("Вы не авторизованы");
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/tasks/${taskId}/exercises/${exerciseId}`,
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
      toast.success("Упражнение удалено");
    } catch (error) {
      console.error("Ошибка при удалении упражнения:", error);
      toast.error("Ошибка удаления упражнения");
    }
  };

  // Сохранение задания
  const handleSaveTask = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Вы не авторизованы");
        return;
      }

      const updatedTask = {
        title: task.title,
        description: task.description,
        // Добавьте другие поля задачи, если необходимо
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Задание сохранено");
      setTask(data);
      navigate(`/teacher/lesson/${lessonId}`);
    } catch (error) {
      console.error("Ошибка при сохранении задания:", error);
      toast.error("Ошибка при сохранении задания");
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
          `http://localhost:5000/api/tasks/${taskId}/upload-audio`,
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
      } catch (error) {
        console.error("Error uploading audio:", error);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Box sx={{ flex: 1, p: 3 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
            <HomeOutlinedIcon />
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
            {task?.title || "Загрузка..."}
          </Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {task?.title || "Загрузка задания..."}
        </Typography>

        <Button variant="contained" onClick={handleOpenMenu}>
          Добавить упражнение
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleSelectExercise("text")}>
            Текст
          </MenuItem>
          <MenuItem onClick={() => handleSelectExercise("test")}>Тест</MenuItem>
          <MenuItem onClick={() => handleSelectExercise("antonym")}>
            Антонимы
          </MenuItem>
          <MenuItem onClick={() => handleSelectExercise("audio")}>
            Аудио
          </MenuItem>
        </Menu>

        <Box sx={{ mt: 2 }}>
          {/* Добавим проверку на существование task перед отображением таймера */}
          {task && task._id && <TaskTimer taskId={task._id} />}
          {/* Кнопка сохранения задания */}
          <Button variant="contained" onClick={handleSaveTask} sx={{ ml: 1 }}>
            Сохранить задание
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
                    <Typography variant="h6">{exercise.title}</Typography>
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
              Добавить упражнение
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
                    Upload audio
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
              variant="contained"
              onClick={handleAddExercise}
              sx={{ mt: 2, width: "100%" }}
            >
              Сохранить
            </Button>
          </Box>
        </Modal>
      </Box>
      <Footer />
    </Box>
  );
};

export default TaskTeacher;
