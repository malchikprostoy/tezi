import React, { useState, useEffect, useMemo } from "react";
import "../../Russian/Russian.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import ruData from "../../../../components/data/ru/dataru.json";

const Ra2 = ({ updateResults, showResults }) => {
  const content2 = ruData.content2;
  const content3 = ruData.content3;
  const questions4 = useMemo(() => content2?.questions1 ?? [], [content2]);
  const questions5 = useMemo(() => content2?.questions2 ?? [], [content2]);
  const questions6 = useMemo(() => content2?.questions3 ?? [], [content2]);
  const questions7 = useMemo(() => content3?.questions1 ?? [], [content3]);

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

  useEffect(() => {
    updateResults(
      0,
      [...questions4, ...questions5, ...questions6, ...questions7],
      [...answers4, ...answers5, ...answers6, ...answers7]
    );
  }, [
    answers4,
    answers5,
    answers6,
    answers7,
    questions4,
    questions5,
    questions6,
    questions7,
    updateResults,
  ]);

  const [incorrectAnswers4, setIncorrectAnswers4] = useState(
    new Array(questions4.length).fill(false)
  );
  const [incorrectAnswers5, setIncorrectAnswers5] = useState(
    new Array(questions5.length).fill(false)
  );
  const [incorrectAnswers6, setIncorrectAnswers6] = useState(
    new Array(questions6.length).fill(false)
  );
  const [incorrectAnswers7, setIncorrectAnswers7] = useState(
    new Array(questions7.length).fill(false)
  );

  useEffect(() => {
    if (showResults) {
      checkAnswers();
    }
  }, [showResults]);

  const checkAnswers = () => {
    const newIncorrectAnswers4 = questions4.map(
      (q, i) => answers4[i] !== q.correctAnswer
    );
    const newIncorrectAnswers5 = questions5.map(
      (q, i) => answers5[i] !== q.correctAnswer
    );
    const newIncorrectAnswers6 = questions6.map(
      (q, i) => answers6[i] !== q.correctAnswer
    );
    const newIncorrectAnswers7 = questions7.map(
      (q, i) => answers7[i] !== q.correctAnswer
    );

    setIncorrectAnswers4(newIncorrectAnswers4);
    setIncorrectAnswers5(newIncorrectAnswers5);
    setIncorrectAnswers6(newIncorrectAnswers6);
    setIncorrectAnswers7(newIncorrectAnswers7);
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

  return (
    <div className="read-content">
      <h1>{content2?.title}</h1>
      <p dangerouslySetInnerHTML={{ __html: content2?.text }} />
      <div className="line"></div>
      <div className="comment text-start">
        <span dangerouslySetInnerHTML={{ __html: content2?.comment }} />
      </div>
      <div className="mid-content">
        <h2>Вопросы:</h2>
        <div className="questions-container">
          {questions4.map((question, index) => (
            <div
              key={index}
              className={`question ${
                incorrectAnswers4[index] ? "incorrect" : ""
              }`}
            >
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
          {questions5.map((question, index) => (
            <div
              key={index}
              className={`question ${
                incorrectAnswers5[index] ? "incorrect" : ""
              }`}
            >
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
                        onChange={() => handleAnswer5(index, option)}
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
      <div className="mid-content">
        <h2 className="h5">Отметьте правильный вариант. </h2>
        <div className="questions-container">
          {questions6.map((question, index) => (
            <div
              key={index}
              className={`question ${
                incorrectAnswers6[index] ? "incorrect" : ""
              }`}
            >
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
            <div
              key={index}
              className={`question ${
                incorrectAnswers7[index] ? "incorrect" : ""
              }`}
            >
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
  );
};

export default Ra2;
