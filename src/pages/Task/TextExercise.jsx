import { TextField, Box, Typography } from "@mui/material";

const TextExercise = ({ newExercise, handleExerciseChange }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Добавить текст
      </Typography>
      <TextField
        fullWidth
        label="Название"
        value={newExercise.title}
        onChange={(e) => handleExerciseChange("title", e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Текст"
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
