import { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  IconButton,
  RadioGroup,
  Radio,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const AntonymExercise = ({ newExercise, handleExerciseChange }) => {
  const [optionas, setOptionas] = useState([""]); // Начальное состояние — одно поле

  // Добавить новое поле для ответа
  const handleAddOptionField = () => {
    setOptionas([...optionas, ""]);
  };

  // Удалить поле ответа по индексу
  const handleRemoveOptionField = (index) => {
    if (optionas.length > 1) {
      const updatedOptionas = optionas.filter((_, i) => i !== index);
      setOptionas(updatedOptionas);
    }
  };

  // Обновить значение конкретного ответа
  const handleOptionChange = (index, value) => {
    const updatedOptionas = [...optionas];
    updatedOptionas[index] = value;
    setOptionas(updatedOptionas);
    handleExerciseChange("optionas", updatedOptionas); // Сохраняем массив в options
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Добавить упражнение
      </Typography>
      <TextField
        fullWidth
        label="Описание задания"
        value={newExercise.titlea}
        onChange={(e) => handleExerciseChange("titlea", e.target.value)}
        margin="normal"
        multiline
        rows={2}
      />
      <TextField
        fullWidth
        label="Слово"
        value={newExercise.word}
        onChange={(e) => handleExerciseChange("word", e.target.value)}
        margin="normal"
      />

      {/* Поля для ввода ответов */}
      <RadioGroup
        value={newExercise.correctOption}
        onChange={(e) =>
          handleExerciseChange("correctOption", Number(e.target.value))
        }
      >
        {optionas.map((optiona, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
            <Radio value={index} />
            <TextField
              fullWidth
              label={`Ответ ${index + 1}`}
              value={optiona}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              margin="normal"
            />
            <IconButton
              color="error"
              onClick={() => handleRemoveOptionField(index)}
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </RadioGroup>
      <IconButton color="primary" onClick={handleAddOptionField}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default AntonymExercise;
