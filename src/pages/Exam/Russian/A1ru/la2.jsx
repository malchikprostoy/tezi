import React, { useEffect, useMemo, useState } from "react";
import "../../Russian/Russian.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import ruauData from "../../../../components/data/ru/dataruaudio.json";
import AudioPlayer from "../../../../components/AudioPlayer/AudioPlayer";

const La2 = ({ updateResults, showResults }) => {
  const content5 = ruauData.content2;
  const questions12 = useMemo(() => content5?.questions1 ?? [], [content5]);
  const questions13 = useMemo(() => content5?.questions2 ?? [], [content5]);
  const questions14 = useMemo(() => content5?.questions3 ?? [], [content5]);

  const [answers12, setAnswers12] = useState(
    new Array(questions12.length).fill(null)
  );
  const [answers13, setAnswers13] = useState(
    new Array(questions13.length).fill(null)
  );
  const [answers14, setAnswers14] = useState(
    new Array(questions14.length).fill(null)
  );

  useEffect(() => {
    updateResults(
      0,
      [...questions12, ...questions13, ...questions14],
      [...answers12, ...answers13, ...answers14]
    );
  }, [
    answers12,
    answers13,
    answers14,
    questions12,
    questions13,
    questions14,
    updateResults,
  ]);

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

  return (
    <div className="listen-content">
      <h1>{content5?.title}</h1>
      <AudioPlayer />
      <div className="comment text-start">
        <span dangerouslySetInnerHTML={{ __html: content5?.comment }} />
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
                      checked={answers12[index] === answer}
                      onChange={() => handleAnswer12(index, answer)}
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
                      checked={answers13[index] === answer}
                      onChange={() => handleAnswer13(index, answer)}
                    />
                    {answer}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <h2 className="h5">
        Правильные утверждения обозначьте буквой «П», неправильные – «Н».
      </h2>
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
                      checked={answers14[index] === answer}
                      onChange={() => handleAnswer14(index, answer)}
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

export default La2;
