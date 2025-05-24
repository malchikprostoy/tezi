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
  const { lessonId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (lessonId) {
      fetchLessonTasks();
      fetchStudents();
      setSelectedStudentId(null); // сброс при смене урока
    }
  }, [lessonId]);

  const fetchLessonTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Ошибка при загрузке заданий:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/lessons/${lessonId}/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(res.data || []);
    } catch (error) {
      console.error("Ошибка при загрузке студентов:", error);
    }
  };

  const onStudentClick = (studentId) => {
    setSelectedStudentId(studentId);
  };

  const onTaskClick = (taskId) => {
    if (!selectedStudentId) {
      alert(t("Please, select a student"));
      return;
    }
    navigate(
      `/teacher/lesson/${lessonId}/student/${selectedStudentId}/task/${taskId}`
    );
  };

  if (!tasks.length || !students.length) return <LinearProgress />;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        {t("List of students")}
      </Typography>
      <List>
        {students.map((student) => (
          <ListItem
            button
            key={student._id || student.id}
            selected={selectedStudentId === (student._id || student.id)}
            onClick={() => onStudentClick(student._id || student.id)}
          >
            <ListItemText primary={student.name || student.email} />
          </ListItem>
        ))}
      </List>

      {selectedStudentId && (
        <>
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            {t("Select the student's task")}
          </Typography>
          <List>
            {tasks.map((task) => (
              <ListItem
                button
                key={task._id || task.id}
                onClick={() => onTaskClick(task._id || task.id)}
              >
                <ListItemText primary={task.title} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Container>
  );
};

export default StudentResultsPage;
