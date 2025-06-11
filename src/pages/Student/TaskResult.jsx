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
import ScrollToTopButton from "../../components/ScrollToTopButton";

const ResultPageStudent = () => {
  const { t } = useTranslation();
  const [lesson, setLesson] = useState(null);
  const [task, setTask] = useState(null);
  const { lessonId, taskId } = useParams();
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
      toast.error(t("Error loading the lesson"));
    }
  };

  const normalize = (str) => (str || "").trim().toLowerCase();

  if (loading) return <LinearProgress />;
  if (!results) return <Alert severity="error">{t("Results not found")}</Alert>;

  // === SCORE CALCULATION ===
  let earnedScore = 0;
  let totalScore = 0;

  task?.exercises?.forEach((exercise) => {
    const fullScore = exercise.score || 0;
    totalScore += fullScore;

    const answer = results.answers.find((a) => {
      if (exercise.type === "antonym") {
        return normalize(a.question) === normalize(exercise.word);
      } else if (exercise.type === "test") {
        return normalize(a.question) === normalize(exercise.question);
      } else if (exercise.type === "text") {
        return normalize(a.text) === normalize(exercise.text);
      }
      return false;
    });

    const isCorrect =
      exercise.type === "test"
        ? answer?.selectedOption === exercise.correctOption
        : exercise.type === "antonym"
        ? answer?.selectedOption?.trim().toLowerCase() ===
          exercise.optionas?.[exercise.correctOption]?.trim().toLowerCase()
        : false;

    if (isCorrect) earnedScore += fullScore;
  });

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

        {/* SCORE BLOCK */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 3,
          }}
        >
          {t("Score")}: {earnedScore} / {totalScore}
        </Typography>

        {/* EXERCISES */}
        <Box sx={{ mt: 2 }}>
          {task?.exercises?.map((exercise, index) => {
            const answer = results.answers.find((a) => {
              if (exercise.type === "antonym") {
                return normalize(a.question) === normalize(exercise.word);
              } else if (exercise.type === "test") {
                return normalize(a.question) === normalize(exercise.question);
              } else if (exercise.type === "text") {
                return normalize(a.text) === normalize(exercise.text);
              }
              return false;
            });

            return (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  mb: 4,
                  bgcolor: "#f9f9f9",
                  p: 3,
                  borderRadius: "8px",
                }}
              >
                {(exercise.type === "test" || exercise.type === "antonym") && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 12,
                      color: "#000",
                      px: 1.2,
                      py: 0.3,
                      border: "1px solid #000",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {(() => {
                      const fullScore = exercise.score || 0;
                      if (!answer) return `0 / ${fullScore}`;
                      const isCorrect =
                        exercise.type === "test"
                          ? answer.selectedOption === exercise.correctOption
                          : exercise.type === "antonym"
                          ? answer.selectedOption?.trim().toLowerCase() ===
                            exercise.optionas?.[exercise.correctOption]
                              ?.trim()
                              .toLowerCase()
                          : false;
                      return `${isCorrect ? fullScore : 0} / ${fullScore}`;
                    })()}
                  </Box>
                )}

                {exercise.type === "text" && (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {exercise.title}
                    </Typography>
                    <Typography sx={{ mt: 1, whiteSpace: "pre-line" }}>
                      {exercise.text}
                    </Typography>
                  </>
                )}

                {exercise.type === "test" && answer && (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {exercise.titlet}
                    </Typography>
                    <Typography variant="h6">{answer.question}</Typography>
                    <Box sx={{ mt: 2 }}>
                      {exercise.options.map((option, idx) => {
                        const isCorrect = idx === exercise.correctOption;
                        const isSelected = idx === answer.selectedOption;

                        let bgColor = "inherit";
                        let textColor = "inherit";

                        if (isSelected && isCorrect) {
                          bgColor = "#c8e6c9";
                          textColor = "green";
                        } else if (isSelected && !isCorrect) {
                          bgColor = "#ffcdd2";
                          textColor = "red";
                        } else if (!isSelected && isCorrect) {
                          bgColor = "#c8e6c9";
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
                          {t("Your answer")}
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
                  </>
                )}

                {exercise.type === "antonym" && (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {exercise.titlea}
                    </Typography>
                    <Typography>{exercise.word}</Typography>

                    <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
                      {exercise.optionas?.map((opt, idx) => {
                        const isCorrect =
                          opt.trim() ===
                          exercise.optionas[exercise.correctOption].trim();
                        const isSelected =
                          answer?.selectedOption?.trim() === opt.trim();

                        let bgColor = "inherit";
                        let color = "inherit";

                        if (isSelected && isCorrect) {
                          bgColor = "#c8e6c9";
                          color = "green";
                        } else if (isSelected && !isCorrect) {
                          bgColor = "#ffcdd2";
                          color = "red";
                        } else if (!isSelected && isCorrect) {
                          bgColor = "#c8e6c9";
                          color = "green";
                        }

                        return (
                          <Typography
                            key={idx}
                            sx={{
                              bgcolor: bgColor,
                              color,
                              p: 1,
                              mb: 1,
                              mr: 1,
                              borderRadius: 1,
                              fontWeight:
                                isSelected || isCorrect ? "bold" : "normal",
                            }}
                          >
                            {opt}
                          </Typography>
                        );
                      })}
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography>
                        <strong>{t("Correct answer")}</strong>{" "}
                        {exercise.optionas?.[exercise.correctOption] ||
                          t("Unknown")}
                      </Typography>
                      <Typography>
                        <strong>{t("Your answer")}</strong>{" "}
                        {answer?.selectedOption?.trim() || t("No selected")}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            );
          })}
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
      <ScrollToTopButton />
      <Footer />
    </Box>
  );
};

export default ResultPageStudent;
