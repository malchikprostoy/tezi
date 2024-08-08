import React, { useEffect, useState, useMemo } from "react";
import "../../Russian/Russian.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import ruauData from "../../../../components/data/ru/dataruaudio.json";
import AudioPlayer from "../../../../components/AudioPlayer/AudioPlayer";

const La1 = ({ updateResults, showResults }) => {
  const content4 = ruauData.content1;
  const questions8 = useMemo(() => content4?.questions1 ?? [], [content4]);
  const questions9 = useMemo(() => content4?.questions2 ?? [], [content4]);
  const questions10 = useMemo(() => content4?.questions3 ?? [], [content4]);
  const questions11 = useMemo(() => content4?.questions4 ?? [], [content4]);

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

  useEffect(() => {
    updateResults(
      0,
      [...questions8, ...questions9, ...questions10, ...questions11],
      [...answers8, ...answers9, ...answers10, ...answers11]
    );
  }, [
    answers8,
    answers9,
    answers10,
    answers11,
    questions8,
    questions9,
    questions10,
    questions11,
    updateResults,
  ]);

  const [incorrectAnswers8, setIncorrectAnswers8] = useState(
    new Array(questions8.length).fill(false)
  );
  const [incorrectAnswers9, setIncorrectAnswers9] = useState(
    new Array(questions9.length).fill(false)
  );
  const [incorrectAnswers10, setIncorrectAnswers10] = useState(
    new Array(questions10.length).fill(false)
  );
  const [incorrectAnswers11, setIncorrectAnswers11] = useState(
    new Array(questions11.length).fill(false)
  );

  useEffect(() => {
    if (showResults) {
      checkAnswers();
    }
  }, [showResults]);

  const checkAnswers = () => {
    const newIncorrectAnswers8 = questions8.map(
      (q, i) => answers8[i] !== q.correctAnswer
    );
    const newIncorrectAnswers9 = questions9.map(
      (q, i) => answers9[i] !== q.correctAnswer
    );
    const newIncorrectAnswers10 = questions10.map(
      (q, i) => answers10[i] !== q.correctAnswer
    );
    const newIncorrectAnswers11 = questions11.map(
      (q, i) => answers11[i] !== q.correctAnswer
    );

    setIncorrectAnswers8(newIncorrectAnswers8);
    setIncorrectAnswers9(newIncorrectAnswers9);
    setIncorrectAnswers10(newIncorrectAnswers10);
    setIncorrectAnswers11(newIncorrectAnswers11);
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

  return (
    <div className="listen-content">
      <h1>{content4?.title}</h1>
      <div className="comment text-start">
        <span dangerouslySetInnerHTML={{ __html: content4?.comment }} />
      </div>
      <AudioPlayer />
      <p className="h5">Ответьте на вопросы.</p>
      <div className="questions-container">
        {questions8.map((question, index) => (
          <div
            key={index}
            className={`question ${
              incorrectAnswers8[index] ? "incorrect" : ""
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
          <div
            key={index}
            className={`question ${
              incorrectAnswers9[index] ? "incorrect" : ""
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
                      checked={answers9[index] === answer}
                      onChange={() => handleAnswer9(index, answer)}
                    />
                    {answer}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="h5">
        Правильные утверждения обозначьте буквой «П», а неправильные – «Н».
      </p>
      <div className="questions-container">
        {questions10.map((question, index) => (
          <div
            key={index}
            className={`question ${
              incorrectAnswers10[index] ? "incorrect" : ""
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
                      checked={answers10[index] === answer}
                      onChange={() => handleAnswer10(index, answer)}
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
          <div
            key={index}
            className={`question ${
              incorrectAnswers11[index] ? "incorrect" : ""
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
                      checked={answers11[index] === answer}
                      onChange={() => handleAnswer11(index, answer)}
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
  );
};

export default La1;
