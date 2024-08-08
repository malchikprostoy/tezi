import React, { useContext, useRef, useState } from "react";
import "./Russian.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Typography,
  Box,
  Breadcrumbs,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { NavLink } from "react-router-dom";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { LanguageContext } from "../../../LanguageContext";
import Ra1 from "./A1ru/ra1";
import Ra2 from "./A1ru/ra2";
import La1 from "./A1ru/la1";
import La2 from "./A1ru/la2";

const Russian = () => {
  const { content } = useContext(LanguageContext);

  const [resultShown, setResultShown] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [results, setResults] = useState([]);

  const ra1Ref = useRef(null);
  const ra2Ref = useRef(null);
  const la1Ref = useRef(null);
  const la2Ref = useRef(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const showResult = () => {
    setResultShown(true); // Устанавливаем результат как показанный
    // Вызываем функцию checkAnswers в каждом компоненте, чтобы отметить неправильные ответы
    ra1Ref.current && ra1Ref.current.checkAnswers();
    ra2Ref.current && ra2Ref.current.checkAnswers();
    la1Ref.current && la1Ref.current.checkAnswers();
    la2Ref.current && la2Ref.current.checkAnswers();
  };

  const updateResults = (stepIndex, questions, answers) => {
    const newResults = [...results];
    newResults[stepIndex] = { questions, answers };
    setResults(newResults);
  };

  const calculateScore = (questions, answers) => {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctAnswer) {
        score++;
      }
    }
    return score;
  };

  const calculateTotalScore = () => {
    return results.reduce((total, step) => {
      return total + calculateScore(step.questions, step.answers);
    }, 0);
  };

  const steps = [
    "Чтение и понимание",
    "Чтение и понимание 2",
    "Слушание и понимание",
    "Слушание и понимание 2",
  ];

  return (
    <div className="russian d-flex flex-column">
      <Header />
      <div className="middle d-flex flex-column justify-content-center align-items-center">
        <div className="bcrumbs">
          <Box m={2}>
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={<NavigateNext fontSize="large" color="#fff" />}
            >
              <NavLink to={"/"}>
                <HomeRoundedIcon
                  color="primary"
                  sx={{ fontSize: 50, color: "#fff" }}
                />
              </NavLink>
              <NavLink to={"/lesson"} style={{ color: "#fff" }}>
                Lesson
              </NavLink>
              <NavLink to={"/level"} style={{ color: "#fff" }}>
                Level
              </NavLink>
              <Typography color="#fff">Exam</Typography>
            </Breadcrumbs>
          </Box>
        </div>
        <div className="mid d-flex flex-column justify-content-center align-items-start">
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ display: "flex", flexWrap: "wrap" }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className="mid-content">
            {activeStep === 0 && (
              <Ra1
                ref={ra1Ref}
                updateResults={updateResults}
                showResults={resultShown}
              />
            )}
            {activeStep === 1 && (
              <Ra2
                ref={ra2Ref}
                updateResults={updateResults}
                showResults={resultShown}
              />
            )}
            {activeStep === 2 && (
              <La1
                ref={la1Ref}
                updateResults={updateResults}
                showResults={resultShown}
              />
            )}
            {activeStep === 3 && (
              <La2
                ref={la2Ref}
                updateResults={updateResults}
                showResults={resultShown}
              />
            )}
          </div>
          <div className="buttons">
            <button
              className="btn btn-outline-danger"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Назад
            </button>
            <button
              className="btn btn-outline-danger"
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              Далее
            </button>
          </div>
          <button
            className="btn btn-outline-danger btn-lg lng"
            variant="contained"
            onClick={showResult}
            style={{
              display: activeStep === steps.length - 1 ? "block" : "none",
            }}
          >
            Показать результат
          </button>
          {resultShown && (
            <div className="score">
              <h3>
                Ваш результат: {calculateTotalScore()} из{" "}
                {results.reduce(
                  (total, step) => total + step.questions.length,
                  0
                )}
              </h3>
            </div>
          )}
        </div>
      </div>
      <Footer content={content} />
    </div>
  );
};

export default Russian;
