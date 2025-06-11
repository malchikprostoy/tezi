import { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";

const AntonymExercise = ({ newExercise, handleExerciseChange }) => {
  const { t } = useTranslation();

  // ✅ Инициализируем из newExercise.optionas (или по умолчанию)
  const [optionas, setOptionas] = useState(newExercise.optionas || [""]);

  // ✅ Следим за обновлением newExercise.optionas извне
  useEffect(() => {
    if (Array.isArray(newExercise.optionas)) {
      setOptionas(newExercise.optionas);
    }
  }, [newExercise.optionas]);

  const handleAddOptionField = () => {
    const updated = [...optionas, ""];
    setOptionas(updated);
    handleExerciseChange("optionas", updated);
  };

  const handleRemoveOptionField = (index) => {
    if (optionas.length > 1) {
      const updated = optionas.filter((_, i) => i !== index);
      setOptionas(updated);
      handleExerciseChange("optionas", updated);
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...optionas];
    updated[index] = value;
    setOptionas(updated);
    handleExerciseChange("optionas", updated);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" gutterBottom>
        {t("Add exercise")}
      </Typography>
      <TextField
        fullWidth
        label={t("Task description")}
        value={newExercise.titlea}
        onChange={(e) => handleExerciseChange("titlea", e.target.value)}
        margin="normal"
        multiline
        rows={2}
      />
      <TextField
        fullWidth
        label={t("Score")}
        type="number"
        inputProps={{ step: "0.1", min: 0 }}
        value={newExercise.score || ""}
        onChange={(e) =>
          handleExerciseChange("score", parseFloat(e.target.value))
        }
        margin="normal"
      />
      <TextField
        fullWidth
        label={t("Word")}
        value={newExercise.word}
        onChange={(e) => handleExerciseChange("word", e.target.value)}
        margin="normal"
      />

      <RadioGroup
        value={newExercise.correctOption}
        onChange={(e) => {
          const selectedIdx = Number(e.target.value);
          handleExerciseChange("correctOption", selectedIdx);
          handleExerciseChange("correctAntonym", optionas[selectedIdx]); // <-- добавляем сюда
        }}
      >
        {optionas.map((optiona, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
            <Radio value={index} />
            <TextField
              fullWidth
              label={`${t("Answer")} ${index + 1}`}
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
