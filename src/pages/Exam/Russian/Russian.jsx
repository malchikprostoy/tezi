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
  const [answers9, setAnswers9] = useState(
    new Array(questions9.length).fill(null)
  );
  const [answers10, setAnswers10] = useState(
    new Array(questions10.length).fill(null)
  );
  const [answers11, setAnswers11] = useState(
    new Array(questions11.length).fill(null)
  );
  const [answers12, setAnswers12] = useState(
    new Array(questions12.length).fill(null)
  );
  const [answers13, setAnswers13] = useState(
    new Array(questions13.length).fill(null)
  );
  const [answers14, setAnswers14] = useState(
    new Array(questions14.length).fill(null)
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
  
  const handleAnswer9 = (index, answer) => {
    const newAnswers = [...answers9];
    newAnswers[index] = answer;
    setAnswers9(newAnswers);
  };

  const handleAnswer10 = (index, answer) => {
    const newAnswers = [...answers10];
    newAnswers[index] = answer;
    setAnswers10(newAnswers);
  };

  const handleAnswer11 = (index, answer) => {
    const newAnswers = [...answers11];
    newAnswers[index] = answer;
    setAnswers11(newAnswers);
  };

  const handleAnswer12 = (index, answer) => {
    const newAnswers = [...answers12];
    newAnswers[index] = answer;
    setAnswers12(newAnswers);
  };

  const handleAnswer13 = (index, answer) => {
    const newAnswers = [...answers13];
    newAnswers[index] = answer;
    setAnswers13(newAnswers);
  };

  const handleAnswer14 = (index, answer) => {
    const newAnswers = [...answers14];
    newAnswers[index] = answer;
    setAnswers14(newAnswers);
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
            style={{ display: activeStep === steps.length - 1 ? 'block' : 'none' }}
          >
            Показать результат
          </button>
          {resultShown && (
          <div className="result">
            <h2>Results</h2>
            <p>Чтение и понимание 1: {calculateScore(questions1, answers1)} / {questions1.length}</p>
            <p>Чтение и понимание 2: {calculateScore(questions2, answers2)} / {questions2.length}</p>
            <p>Чтение и понимание 3: {calculateScore(questions3, answers3)} / {questions3.length}</p>
            <p>Чтение и понимание 4: {calculateScore(questions4, answers4)} / {questions4.length}</p>
            <p>Чтение и понимание 5: {calculateScore(questions5, answers5)} / {questions5.length}</p>
            <p>Чтение и понимание 6: {calculateScore(questions6, answers6)} / {questions6.length}</p>
            <p>Чтение и понимание 7: {calculateScore(questions7, answers7)} / {questions7.length}</p>
            <p>Слушание и понимание 1: {calculateScore(questions8, answers8)} / {questions8.length}</p>
            <p>Слушание и понимание 2: {calculateScore(questions9, answers9)} / {questions9.length}</p>
            <p>Слушание и понимание 3: {calculateScore(questions10, answers10)} / {questions10.length}</p>
            <p>Слушание и понимание 4: {calculateScore(questions11, answers11)} / {questions11.length}</p>
            <p>Слушание и понимание 5: {calculateScore(questions12, answers12)} / {questions12.length}</p>
            <p>Слушание и понимание 6: {calculateScore(questions13, answers13)} / {questions13.length}</p>
            <p>Слушание и понимание 7: {calculateScore(questions14, answers14)} / {questions14.length}</p>
          </div>
        )}
        </div>
      </div>
      <Footer content={content} />
    </div>
  );
};

export default Russian;