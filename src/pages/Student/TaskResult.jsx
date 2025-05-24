import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Button,
  Alert,
  LinearProgress,
  Breadcrumbs,
  Link,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ResultPageStudent = () => {
  const { t } = useTranslation();
  const [lesson, setLesson] = useState(null);
  const [task, setTask] = useState(null);
  const { lessonId, taskId } = useParams(); // Получаем lessonId и taskId из URL
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get("studentId");

  useEffect(() => {
    fetchResults();
    fetchTask();
    fetchLesson();
  }, [lessonId, taskId]);

  const fetchTask = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTask(data);
    } catch (error) {
      toast.error(t("Error loading the task"));
    }
  };

  // Функция для получения результатов
  const fetchResults = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(t("You need to log in"));
      navigate("/login");
      return;
    }

    try {
      const url = studentId
        ? `${process.env.REACT_APP_API_URL}/api/results/task/${taskId}/student/${studentId}`
        : `${process.env.REACT_APP_API_URL}/api/results/task/${taskId}`;

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(data);
    } catch (error) {
      toast.error(t("Error loading the results"));
      navigate(`/student/lesson/${lessonId}`);
    } finally {
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

  if (loading) return <LinearProgress />;

  if (!results) return <Alert severity="error">{t("Results not found")}</Alert>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ flexGrow: 1, mt: 4 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            <HomeOutlinedIcon sx={{ color: "#d93125" }} />
          </Link>
          {lesson && (
            <Link
              color="inherit"
              onClick={() => navigate(`/lesson/${lesson._id}`)}
              underline="hover"
              sx={{ cursor: "pointer" }}
            >
              {lesson.title}
            </Link>
          )}
          {task && (
            <Typography color="text.primary">
              {t("Result")} ({task.title})
            </Typography>
          )}
        </Breadcrumbs>

        <Box sx={{ mt: 2 }}>
          {results.answers.length === 0 ? (
            <Typography variant="body1">{t("No answers submitted")}</Typography>
          ) : (
            results.answers.map((answer, index) => {
              const exercise = task?.exercises?.find(
                (ex) => ex.question === answer.question
              );

              return (
                <Box
                  key={index}
                  sx={{
                    mb: 4,
                    bgcolor: "#f9f9f9",
                    p: 3,
                    borderRadius: "8px",
                  }}
                >
                  <Typography variant="h6">{answer.question}</Typography>

                  {exercise ? (
                    <Box sx={{ mt: 2 }}>
                      {exercise.options.map((option, idx) => {
                        const isCorrect = idx === exercise.correctOption;
                        const isSelected = idx === answer.selectedOption;

                        let bgColor = "inherit";
                        let textColor = "inherit";

                        if (isSelected && isCorrect) {
                          bgColor = "#c8e6c9"; // выбран и правильный — зелёный
                          textColor = "green";
                        } else if (isSelected && !isCorrect) {
                          bgColor = "#ffcdd2"; // выбран и неправильный — красный
                          textColor = "red";
                        } else if (!isSelected && isCorrect) {
                          bgColor = "#c8e6c9"; // правильный, но не выбран — зелёный
                          textColor = "green";
                        }

                        return (
                          <Typography
                            key={idx}
                            sx={{
                              display: "block",
                              bgcolor: bgColor,
                              color: textColor,
                              p: 1,
                              borderRadius: 1,
                              mb: 1,
                              fontWeight:
                                isSelected || isCorrect ? "bold" : "normal",
                            }}
                          >
                            {option}
                          </Typography>
                        );
                      })}

                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f0f0f0",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography sx={{ fontWeight: "bold", mr: 1 }}>
                          {t("Your answer")}:
                        </Typography>
                        <Typography
                          sx={{
                            color:
                              answer.selectedOption !== undefined &&
                              answer.selectedOption !== null
                                ? "text.primary"
                                : "text.disabled",
                            fontStyle:
                              answer.selectedOption !== undefined &&
                              answer.selectedOption !== null
                                ? "normal"
                                : "italic",
                          }}
                        >
                          {answer.selectedOption !== undefined &&
                          answer.selectedOption !== null
                            ? exercise.options[answer.selectedOption]
                            : t("No selected")}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography>{t("Task data not found")}</Typography>
                  )}
                </Box>
              );
            })
          )}
        </Box>

        <Button
          variant="outlined"
          sx={{ mt: 4, mb: 3 }}
          color="error"
          onClick={() => navigate(`/lesson/${lessonId}`)}
        >
          {t("Back to lesson")}
        </Button>
      </Container>
      <Footer />
    </Box>
  );
};

export default ResultPageStudent;
