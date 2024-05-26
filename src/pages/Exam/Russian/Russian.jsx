import React, { useContext, useState } from "react";
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
import ruData from "../../../components/data/ru/dataru.json";
import ruauData from "../../../components/data/ru/dataruaudio.json"
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { LanguageContext } from "../../../LanguageContext";

const Russian = () => {
  const { content } = useContext(LanguageContext);
  const content1 = ruData.content1;
  const content2 = ruData.content2;
  const content3 = ruData.content3;
  const content4 = ruauData.content1;
  const content5 = ruauData.content2;
  const questions1 = content1?.questions1 ?? [];
  const questions2 = content1?.questions2 ?? [];
  const questions3 = content1?.questions3 ?? [];
  const questions4 = content2?.questions1 ?? [];
  const questions5 = content2?.questions2 ?? [];
  const questions6 = content2?.questions3 ?? [];
  const questions7 = content3?.questions1 ?? [];
  const questions8 = content4?.questions1 ?? [];
  const questions9 = content4?.questions2 ?? [];
  const questions10 = content4?.questions3 ?? [];
  const questions11 = content4?.questions4 ?? [];
  const questions12 = content5?.questions1 ?? [];
  const questions13 = content5?.questions2 ?? [];
  const questions14 = content5?.questions3 ?? [];

  const [answers1, setAnswers1] = useState(
    new Array(questions1.length).fill(null)
  );
  const [answers2, setAnswers2] = useState(
    new Array(questions2.length).fill(null)
  );
  const [answers3, setAnswers3] = useState(
    new Array(questions3.length).fill(null)
  );
  const [answers4, setAnswers4] = useState(
    new Array(questions4.length).fill(null)
  );
  const [answers5, setAnswers5] = useState(
    new Array(questions5.length).fill(null)
  );
  const [answers6, setAnswers6] = useState(
    new Array(questions6.length).fill(null)
  );
  const [answers7, setAnswers7] = useState(
    new Array(questions7.length).fill(null)
  );
  const [answers8, setAnswers8] = useState(
    new Array(questions8.length).fill(null)
  );
  const [resultShown, setResultShown] = useState(false);

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAnswer1 = (index, answer) => {
    const newAnswers = [...answers1];
    newAnswers[index] = answer;
    setAnswers1(newAnswers);
  };

  const handleAnswer2 = (index, answer) => {
    const newAnswers = [...answers2];
    newAnswers[index] = answer;
    setAnswers2(newAnswers);
  };

  const handleAnswer3 = (index, answer) => {
    const newAnswers = [...answers3];
    newAnswers[index] = answer;
    setAnswers3(newAnswers);
  };

  const handleAnswer4 = (index, answer) => {
    const newAnswers = [...answers4];
    newAnswers[index] = answer;
    setAnswers4(newAnswers);
  };

  const handleAnswer5 = (index, answer) => {
    const newAnswers = [...answers5];
    newAnswers[index] = answer;
    setAnswers5(newAnswers);
  };

  const handleAnswer6 = (index, answer) => {
    const newAnswers = [...answers6];
    newAnswers[index] = answer;
    setAnswers6(newAnswers);
  };

  const handleAnswer7 = (index, answer) => {
    const newAnswers = [...answers7];
    newAnswers[index] = answer;
    setAnswers7(newAnswers);
  };
  const handleAnswer8 = (index, answer) => {
    const newAnswers = [...answers8];
    newAnswers[index] = answer;
    setAnswers8(newAnswers);
  };

  const showResult = () => {
    setResultShown(true);
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
              {/* <NavLink to={"/type"} style={{ color: "#fff" }}>
                Type
              </NavLink> */}
              <NavLink to={"/level"} style={{ color: "#fff" }}>
                Level
              </NavLink>
              <Typography color="#fff">Exam</Typography>
            </Breadcrumbs>
          </Box>
        </div>
        <div className="mid d-flex flex-column justify-content-center align-items-start">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className="mid-content">
            {activeStep === 0 && (
              <div className="read-content">
                <h1>{content1?.title}</h1>
                <p dangerouslySetInnerHTML={{ __html: content1?.text }} />
                <div className="line"></div>
                <div className="comment text-start">
                  <span
                    dangerouslySetInnerHTML={{ __html: content1?.comment }}
                  />
                </div>
                <div className="mid-content">
                  <p className="h5">
                    Отметьте правильный вариант буквой «П», а неправильный – «Н»
                  </p>
                  <div className="questions-container">
                    {questions1.map((question, index) => (
                      <div key={index} className="question">
                        <p>
                          {index + 1}. {question.question}
                        </p>
                        <ul>
                          {question.answers.map((answer, ansIndex) => (
                            <li className="list-group-item" key={ansIndex}>
                              <label>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={answer}
                                  checked={answers1[index] === answer}
                                  onChange={() => handleAnswer1(index, answer)}
                                />
                                {answer}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mid-content">
                  <p className="h5">Отметьте правильный вариант</p>
                  <div className="questions-container">
                    {questions2.map((question, index) => (
                      <div key={index} className="question">
                        <p>
                          {index + 1}. {question.question}
                        </p>
                        <ul>
                          {question.answers.map((answer, ansIndex) => (
                            <li className="list-group-item" key={ansIndex}>
                              <label>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={answer}
                                  checked={answers2[index] === answer}
                                  onChange={() => handleAnswer2(index, answer)}
                                />
                                {answer}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mid-content">
                  <p className="h5">Отметьте   нужные прилагательные.</p>
                  <div className="questions-container">
                    {questions3.map((question, index) => (
                      <div key={index} className="question">
                        <p>
                          {index + 1}. {question.question}
                        </p>
                        <ul>
                          {question.options.map((option, optIndex) => (
                            <li className="list-group-item" key={optIndex}>
                              <label>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={option}
                                  checked={answers3[index] === option}
                                  onChange={() => handleAnswer3(index, option)}
                                />
                                {option}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeStep === 1 && (
              <div className="read-content">
                <h1>{content2?.title}</h1>
                <p dangerouslySetInnerHTML={{ __html: content2?.text }} />
                <div className="line"></div>
                <div className="comment text-start">
                  <span
                    dangerouslySetInnerHTML={{ __html: content2?.comment }}
                  />
                </div>
                <div className="mid-content">
                  <h2>Вопросы:</h2>
                  <div className="questions-container">
                    {questions4.map((question, index) => (
                      <div key={index} className="question">
                        <p>
                          {index + 1}. {question.question}
                        </p>
                        <ul>
                          {question.answers.map((answer, ansIndex) => (
                            <li className="list-group-item" key={ansIndex}>
                              <label>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={answer}
                                  checked={answers4[index] === answer}
                                  onChange={() => handleAnswer4(index, answer)}
                                />
                                {answer}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mid-content">
                  <p className="h5">Ответьте на вопросы.</p>
                  <div className="questions-container">
                    {questions5.map(
                      (
                        question,
                        index 
                      ) => (
                        <div key={index} className="question">
                          <p>
                            {index + 1}. {question.question}
                          </p>
                          <ul>
                            {question.options.map((option, optIndex) => (
                              <li className="list-group-item" key={optIndex}>
                                <label>
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value={option}
                                    checked={answers5[index] === option}
                                    onChange={() =>
                                      handleAnswer5(index, option)
                                    }
                                  />
                                  {option}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="mid-content">
                  <h2 className="h5">Отметьте правильный вариант. </h2>
                  <div className="questions-container">
                    {questions6.map((question, index) => (
                      <div key={index} className="question">
                        <p>
                          {index + 1}. {question.question}
                        </p>
                        <ul>
                          {question.answers.map((answer, ansIndex) => (
                            <li className="list-group-item" key={ansIndex}>
                              <label>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={answer}
                                  checked={answers6[index] === answer}
                                  onChange={() => handleAnswer6(index, answer)}
                                />
                                {answer}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mid-content">
                  <h2 className="h5">Г Р А М М А Т И К А </h2>
                  <div className="questions-container">
                    {questions7.map((question, index) => (
                      <div key={index} className="question">
                        <p>
                          {index + 1}. {question.question}
                        </p>
                        <ul>
                          {question.answers.map((answer, ansIndex) => (
                            <li className="list-group-item" key={ansIndex}>
                              <label>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={answer}
                                  checked={answers7[index] === answer}
                                  onChange={() => handleAnswer7(index, answer)}
                                />
                                {answer}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeStep === 2 && (
              <div className="listen-content">
                <h1>{content4?.title}</h1>
                <div className="comment text-start">
                  <span dangerouslySetInnerHTML={{ __html: content4?.comment }}/>
                </div>
                <AudioPlayer />
                <p className="h5">Ответьте на вопросы.</p>
                <div className="questions-container">
                  {questions8.map((question, index) => (
                    <div key={index} className="question">
                      <p>
                        {index + 1}. {question.question}
                      </p>
                      <ul>
                        {question.answers.map((answer, ansIndex) => (
                          <li className="list-group-item" key={ansIndex}>
                            <label>
                              <input
                                className="form-check-input"
                                type="radio"
                                value={answer}
                                checked={answers8[index] === answer}
                                onChange={() => handleAnswer8(index, answer)}
                              />
                              {answer}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="h5">Соедините информацию.</p>
                <div className="questions-container">
                  {questions9.map((question, index) => (
                    <div key={index} className="question">
                      <p>
                        {index + 1}. {question.question}
                      </p>
                      <ul>
                        {question.answers.map((answer, ansIndex) => (
                          <li className="list-group-item" key={ansIndex}>
                            <label>
                              <input
                                className="form-check-input"
                                type="radio"
                                value={answer}
                                checked={answers8[index] === answer}
                                onChange={() => handleAnswer8(index, answer)}
                              />
                              {answer}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="h5">Правильные утверждения обозначьте буквой «П», а неправильные – «Н».</p>
                <div className="questions-container">
                  {questions10.map((question, index) => (
                    <div key={index} className="question">
                      <p>
                        {index + 1}. {question.question}
                      </p>
                      <ul>
                        {question.answers.map((answer, ansIndex) => (
                          <li className="list-group-item" key={ansIndex}>
                            <label>
                              <input
                                className="form-check-input"
                                type="radio"
                                value={answer}
                                checked={answers8[index] === answer}
                                onChange={() => handleAnswer8(index, answer)}
                              />
                              {answer}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="h5">Отметьте правильный вариант.</p>
                <div className="questions-container">
                  {questions11.map((question, index) => (
                    <div key={index} className="question">
                      <p>
                        {index + 1}. {question.question}
                      </p>
                      <ul>
                        {question.answers.map((answer, ansIndex) => (
                          <li className="list-group-item" key={ansIndex}>
                            <label>
                              <input
                                className="form-check-input"
                                type="radio"
                                value={answer}
                                checked={answers8[index] === answer}
                                onChange={() => handleAnswer8(index, answer)}
                              />
                              {answer}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeStep === 3 && (
              <div className="listen-content">
                <h1>{content5?.title}</h1>
                <AudioPlayer />
                <div className="comment text-start">
                  <span dangerouslySetInnerHTML={{ __html: content5?.comment }}/>
                </div>
                <h2 className="h5">Выберите правильный вариант ответа.</h2>
                <div className="questions-container">
                  {questions12.map((question, index) => (
                    <div key={index} className="question">
                      <p>
                        {index + 1}. {question.question}
                      </p>
                      <ul>
                        {question.answers.map((answer, ansIndex) => (
                          <li className="list-group-item" key={ansIndex}>
                            <label>
                              <input
                                className="form-check-input"
                                type="radio"
                                value={answer}
                                checked={answers7[index] === answer}
                                onChange={() => handleAnswer7(index, answer)}
                              />
                              {answer}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <h2 className="h5">Отметьте правильный вариант.</h2>
                <div className="questions-container">
                  {questions13.map((question, index) => (
                    <div key={index} className="question">
                      <p>
                        {index + 1}. {question.question}
                      </p>
                      <ul>
                        {question.answers.map((answer, ansIndex) => (
                          <li className="list-group-item" key={ansIndex}>
                            <label>
                              <input
                                className="form-check-input"
                                type="radio"
                                value={answer}
                                checked={answers7[index] === answer}
                                onChange={() => handleAnswer7(index, answer)}
                              />
                              {answer}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <h2 className="h5">Правильные утверждения обозначьте буквой «П», неправильные – «Н».</h2>
                <div className="questions-container">
                  {questions14.map((question, index) => (
                    <div key={index} className="question">
                      <p>
                        {index + 1}. {question.question}
                      </p>
                      <ul>
                        {question.answers.map((answer, ansIndex) => (
                          <li className="list-group-item" key={ansIndex}>
                            <label>
                              <input
                                className="form-check-input pr-1"
                                type="radio"
                                value={answer}
                                checked={answers7[index] === answer}
                                onChange={() => handleAnswer7(index, answer)}
                              />
                              {answer}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="buttons">
            <button className="btn btn-outline-danger" disabled={activeStep === 0} onClick={handleBack}>
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
          >
            Показать результат
          </button>
          {resultShown && (
            <div>
              <h2>Результат:</h2>
              <p>
                Вы ответили правильно на {calculateScore(questions1, answers1)}{" "}
                из {questions1.length} вопросов.
              </p>
              <p>
                Вы ответили правильно на {calculateScore(questions2, answers2)}{" "}
                из {questions2.length} дополнительных вопросов.
              </p>
              <p>
                Вы ответили правильно на {calculateScore(questions3, answers3)}{" "}
                из {questions3.length} вопросов по соотнесению.
              </p>
              <p>
                Вы ответили правильно на {calculateScore(questions4, answers4)}{" "}
                из {questions4.length} вопросов из content2.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer content={content} />
    </div>
  );
};

export default Russian;
