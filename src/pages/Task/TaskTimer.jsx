import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { format } from "date-fns"; // Для форматирования времени
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const TaskTimer = ({ taskId }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  ); // Текущее время
  const [duration, setDuration] = useState(30); // Продолжительность по умолчанию в минутах

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token"); // Получаем токен из localStorage

      if (!token) {
        console.error("Ошибка: Не авторизован!");
        return; // Если токен не найден, прекращаем выполнение
      }

      // Преобразуем продолжительность в секунды перед отправкой
      const durationInSeconds = duration * 60; // Продолжительность в секундах

      const response = await axios.post(
        `http://localhost:5000/api/tasks/${taskId}/timer`,
        { startTime, duration: durationInSeconds },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
          },
        }
      );
      toast(t("Timer saved successfully"));
      handleClose();
    } catch (error) {
      console.error("Ошибка при сохранении таймера:", error);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        sx={{
          "&:hover": {
            backgroundColor: "#a30000", // чуть светлее при наведении
            boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.5)",
            color: "#fff",
          },
        }}
        onClick={handleClickOpen}
      >
        {t("Set timer")}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("Set timer")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("Start time")}
            type="datetime-local"
            fullWidth
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label={t("Duration (minutes)")}
            type="number"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>
            {t("Cancel")}
          </Button>
          <Button variant="outlined" color="error" onClick={handleSave}>
            {t("Save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskTimer;
