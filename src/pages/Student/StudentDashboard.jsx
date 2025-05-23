import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const StudentDashboard = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchStudentLessons(token);
    } else {
      toast.error(t("You are not logged in!"));
      setMessage(t("You are not logged in!"));
    }
  }, []);

  const fetchStudentLessons = async () => {
    let token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ Ошибка: Токен отсутствует.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/lessons/student`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data.lessons)) {
        setLessons(response.data.lessons);
      } else {
        console.error(
          "❌ Ошибка: `lessons` не является массивом!",
          response.data
        );
      }
    } catch (error) {
      console.error(
        "❌ Ошибка загрузки уроков студента:",
        error.response?.data || error
      );
      setMessage(
        error.response?.data?.message || "Ошибка при загрузке уроков."
      );
    }
  };

  const joinLesson = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(t("You are not logged in!"));
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/lessons/join`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(t("You have successfully joined!"));
      setCode(""); // Очистить поле ввода
      fetchStudentLessons(); // 🔄 Обновляем список уроков
    } catch (error) {
      console.error(t("Error when joining:"), error);
      toast.error(error.response?.data?.message || t("Error when joining"));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4" color={"#000"} gutterBottom>
        {t("Joining the lesson")}
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, color: "#000" }}>
        {t("My lessons")}
      </Typography>

      {lessons.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          {t("You have not joined any lesson yet")}
        </Typography>
      ) : (
        <List sx={{ color: "#000" }}>
          {lessons.map((lesson) => (
            <ListItemButton
              key={lesson._id}
              onClick={() => navigate(`/lesson/${lesson._id}`)}
            >
              <ListItemText primary={lesson.title} />
            </ListItemButton>
          ))}
        </List>
      )}

      {message && (
        <Box mt={2}>
          <Typography color="error">{message}</Typography>
        </Box>
      )}

      <TextField
        label={t("Enter the lesson code")}
        variant="outlined"
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ my: 2 }}
      />

      <Button
        variant="outlined"
        color="error"
        onClick={joinLesson}
        sx={{
          "&:hover": {
            backgroundColor: "#a30000", // чуть светлее при наведении
            boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
            color: "#fff",
          },
        }}
      >
        {t("Join")}
      </Button>
    </Container>
  );
};

export default StudentDashboard;
