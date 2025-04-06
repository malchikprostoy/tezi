import {
  Box,
  TextField,
  Radio,
  RadioGroup,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const TestExercise = ({ newExercise, handleExerciseChange }) => {
  // Проверяем, есть ли массив options
  const options = newExercise.options || [];

  // Добавление нового варианта ответа
  const handleAddOption = () => {
    handleExerciseChange("options", [...options, ""]);
  };

  // Удаление варианта ответа
  const handleDeleteOption = (index) => {
    if (options.length > 1) {
      const updatedOptions = options.filter((_, i) => i !== index);
      handleExerciseChange("options", updatedOptions);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Добавить тест
      </Typography>
      <TextField
        fullWidth
        label="Описание задания"
        value={newExercise.titlet}
        onChange={(e) => handleExerciseChange("titlet", e.target.value)}
        margin="normal"
        multiline
        rows={2}
      />
      <TextField
        fullWidth
        label="Вопрос"
        value={newExercise.question}
        onChange={(e) => handleExerciseChange("question", e.target.value)}
        margin="normal"
      />
      {/* Варианты ответов */}
      <Typography variant="subtitle1">Варианты ответов:</Typography>
      <RadioGroup
        value={newExercise.correctOption}
        onChange={(e) =>
          handleExerciseChange("correctOption", Number(e.target.value))
        }
      >
        {options.map((option, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <Radio value={index} />
            <TextField
              fullWidth
              label={`Вариант ${index + 1}`}
              value={option}
              onChange={(e) => {
                const updatedOptions = [...options];
                updatedOptions[index] = e.target.value;
                handleExerciseChange("options", updatedOptions);
              }}
            />
            <IconButton color="error" onClick={() => handleDeleteOption(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </RadioGroup>

      {/* Кнопка для добавления нового варианта */}
      <IconButton color="primary" onClick={handleAddOption}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default TestExercise;
