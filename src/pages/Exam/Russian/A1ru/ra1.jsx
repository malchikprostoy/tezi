import React, { useState, useEffect, useMemo } from "react";
import "../../Russian/Russian.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import ruData from "../../../../components/data/ru/dataru.json";

const Ra1 = ({ updateResults, showResults }) => {
  const content1 = ruData.content1;

  const questions1 = useMemo(() => content1?.questions1 ?? [], [content1]);
  const questions2 = useMemo(() => content1?.questions2 ?? [], [content1]);
  const questions3 = useMemo(() => content1?.questions3 ?? [], [content1]);

  const [answers1, setAnswers1] = useState(
    new Array(questions1.length).fill(null)
  );
  const [answers2, setAnswers2] = useState(
    new Array(questions2.length).fill(null)
  );
  const [answers3, setAnswers3] = useState(
    new Array(questions3.length).fill(null)
  );

  const [incorrectAnswers1, setIncorrectAnswers1] = useState(
    new Array(questions1.length).fill(false)
  );
  const [incorrectAnswers2, setIncorrectAnswers2] = useState(
    new Array(questions2.length).fill(false)
  );
  const [incorrectAnswers3, setIncorrectAnswers3] = useState(
    new Array(questions3.length).fill(false)
  );

  useEffect(() => {
    updateResults(
      0,
      [...questions1, ...questions2, ...questions3],
      [...answers1, ...answers2, ...answers3]
    );
  }, [
    answers1,
    answers2,
    answers3,
    questions1,
    questions2,
    questions3,
    updateResults,
  ]);

  useEffect(() => {
    if (showResults) {
      checkAnswers();
    }
  }, [showResults]);

  const checkAnswers = () => {
    const newIncorrectAnswers1 = questions1.map(
      (q, i) => answers1[i] !== q.correctAnswer
    );
    const newIncorrectAnswers2 = questions2.map(
      (q, i) => answers2[i] !== q.correctAnswer
    );
    const newIncorrectAnswers3 = questions3.map(
      (q, i) => answers3[i] !== q.correctAnswer
    );

    setIncorrectAnswers1(newIncorrectAnswers1);
    setIncorrectAnswers2(newIncorrectAnswers2);
    setIncorrectAnswers3(newIncorrectAnswers3);
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

  return (
    <div className="read-content">
      <h1>{content1?.title}</h1>
      <p dangerouslySetInnerHTML={{ __html: content1?.text }} />
      <div className="line"></div>
      <div className="comment text-start">
        <span dangerouslySetInnerHTML={{ __html: content1?.comment }} />
      </div>
      <div className="mid-content">
        <p className="h5">
          Отметьте правильный вариант буквой «П», а неправильный – «Н»
        </p>
        <div className="questions-container">
          {questions1.map((question, index) => (
            <div
              key={index}
              className={`question ${
                incorrectAnswers1[index] ? "incorrect" : ""
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
            <div
              key={index}
              className={`question ${
                incorrectAnswers2[index] ? "incorrect" : ""
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
        <p className="h5">Отметьте нужные прилагательные.</p>
        <div className="questions-container">
          {questions3.map((question, index) => (
            <div
              key={index}
              className={`question ${
                incorrectAnswers3[index] ? "incorrect" : ""
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
  );
};

export default Ra1;
