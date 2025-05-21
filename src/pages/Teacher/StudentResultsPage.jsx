import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const StudentResultsPage = () => {
  const { lessonId, studentId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessonTasks();
    fetchStudentInfo();
  }, [lessonId, studentId]);

  const fetchLessonTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Ошибка при загрузке заданий:", error);
    }
  };

  const fetchStudentInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/lessons/${lessonId}/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(res.data);
    } catch (error) {
      console.error("Ошибка при загрузке студента:", error);
    }
  };

  const onStudentClick = (studentId) => {
    if (tasks.length === 0) {
      alert("Нет заданий для этого урока");
      return;
    }
    const firstTaskId = tasks[0]._id || tasks[0].id;
    navigate(
      `/teacher/lesson/${lessonId}/student/${studentId}/task/${firstTaskId}`
    );
  };

  if (!tasks) return <LinearProgress />;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Список студентов
      </Typography>
      <List>
        {students.map((student) => (
          <ListItem
            button
            key={student._id || student.id}
            onClick={() => onStudentClick(student._id || student.id)}
          >
            <ListItemText primary={student.name || student.email} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default StudentResultsPage;
