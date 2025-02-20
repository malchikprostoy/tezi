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
} from "@mui/material";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";

const LessonPageStudent = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Необходимо войти в систему");
      navigate("/login");
      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/lessons/${lessonId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLesson(data);
    } catch (error) {
      toast.error("Ошибка загрузки урока");
      navigate("/student");
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

      toast.success("Вы покинули урок");
      navigate("/");
    } catch (error) {
      toast.error("Ошибка выхода из урока");
      setLeaving(false);
    }
  };

  if (loading) return <LinearProgress />;
  if (!lesson) return <Alert severity="error">Урок не найден</Alert>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ flexGrow: 1, mt: 4 }}>
        <Typography variant="h4">{lesson.title}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Вы присоединились к этому уроку
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
          onClick={leaveLesson}
          disabled={leaving}
        >
          {leaving ? "Выходим..." : "Покинуть урок"}
        </Button>
      </Container>
      <Footer />
    </Box>
  );
};

export default LessonPageStudent;
