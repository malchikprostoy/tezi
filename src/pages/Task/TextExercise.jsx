import { TextField, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const TextExercise = ({ newExercise, handleExerciseChange }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t("Add text")}
      </Typography>
      <TextField
        fullWidth
        label={t("Title")}
        value={newExercise.title}
        onChange={(e) => handleExerciseChange("title", e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label={t("Text")}
        value={newExercise.text}
        onChange={(e) => handleExerciseChange("text", e.target.value)}
        margin="normal"
        multiline
        rows={4}
      />
    </Box>
  );
};

export default TextExercise;
