import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  LinearProgress,
  Paper,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const StudentTaskResultPage = () => {
  const { taskId, studentId } = useParams();
  const [result, setResult] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/results/task/${taskId}/student/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResult(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке результата:", err);
      }
    };

    fetchResult();
  }, [taskId, studentId]);

  if (!result) return <LinearProgress />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">{t("Task Result")}</Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6">
          {t("Student")}: {result.userId?.name || result.userId?.email}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          {t("Task")}: {result.taskId?.title}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {t("Submitted at")}: {new Date(result.createdAt).toLocaleString()}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">{t("Answers")}</Typography>
          {result.answers.map((answer, index) => (
            <Paper key={index} sx={{ p: 2, my: 1 }}>
              <Typography>
                <strong>{t("Question")}:</strong> {answer.question}
              </Typography>
              <Typography>
                <strong>{t("Selected")}:</strong> {answer.selectedOption}
              </Typography>
              <Typography>
                <strong>{t("Correct")}:</strong>{" "}
                {answer.correct ? t("Yes") : t("No")}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default StudentTaskResultPage;
