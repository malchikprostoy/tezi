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

const TaskTimer = ({ taskId }) => {
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
      toast("Таймер успешно сохранён");
      handleClose();
    } catch (error) {
      console.error("Ошибка при сохранении таймера:", error);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Установить таймер
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Установить таймер</DialogTitle>
        <DialogContent>
          <TextField
            label="Время начала"
            type="datetime-local"
            fullWidth
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label="Продолжительность (минуты)"
            type="number"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отменить</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskTimer;
