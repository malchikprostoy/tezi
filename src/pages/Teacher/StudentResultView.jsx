// components/StudentResultView.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";

const StudentResultView = () => {
  const { lessonId, taskId, studentId } = useParams();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:5000/api/tasks/${taskId}/results/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResults(data);
      } catch (err) {
        console.error(err);
        toast.error("Ошибка при загрузке результатов");
      }
    };
    fetchResult();
  }, [taskId, studentId]);

  if (!results) return <Typography>Загрузка...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Результат студента: {results.studentName}
      </Typography>
      {/* Здесь отобразите подробности: ответы, правильность, время и т.д. */}
    </Box>
  );
};

export default StudentResultView;
