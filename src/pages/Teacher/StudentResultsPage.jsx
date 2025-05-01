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
  const [student, setStudent] = useState(null);
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
        `http://localhost:5000/api/users/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudent(res.data);
    } catch (error) {
      console.error("Ошибка при загрузке студента:", error);
    }
  };

  if (!tasks) return <LinearProgress />;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        {t("Tasks of student")}: {student?.name || student?.email || studentId}
      </Typography>

      {tasks.length === 0 ? (
        <Typography variant="body1">{t("No tasks in this lesson")}</Typography>
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task._id}
              button
              onClick={() =>
                navigate(
                  `/teacher/lesson/${lessonId}/student/${studentId}/task/${task._id}`
                )
              }
            >
              <ListItemText primary={task.title} />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default StudentResultsPage;
