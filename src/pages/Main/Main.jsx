import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../features/AuthContext"; // Импортируем контекст
import { toast } from "react-toastify";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import StudentDashboard from "../Student/StudentDashboard";
import TeacherDashboard from "../Teacher/TeacherDashboard";

const Main = () => {
  const { user } = useAuth(); // Получаем пользователя из контекста
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (user !== undefined) {
      setIsCheckingAuth(false);
    }
  }, [user]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!isCheckingAuth && !user && !storedToken) {
      toast.warning(
        t("You are not logged in. Redirection to the login page..."),
        {
          autoClose: 3000,
        }
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [user, navigate, t, isCheckingAuth]);

  if (isCheckingAuth) {
    return null; // Ждем, пока получим информацию о пользователе
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "white",
        px: 0, // Убираем отступы по бокам
        m: 0, // Убираем отступы по бокам
      }}
    >
      <Header />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {user?.role === "student" ? <StudentDashboard /> : <TeacherDashboard />}
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#561209",
          color: "white",
        }}
      >
        <Footer />
      </Box>
    </Container>
  );
};

export default Main;
