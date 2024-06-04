import React, { useContext, useState } from "react";
import "../../Russian/Russian.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import ruData from "../../../../components/data/ru/dataru.json"
import { LanguageContext } from "../../../LanguageContext";

const ra1 = () => {
  const { content } = useContext(LanguageContext);
  const content1 = ruData.content1;
  const questions1 = content1?.questions1 ?? [];
  const questions2 = content1?.questions2 ?? [];
  const questions3 = content1?.questions3 ?? [];

  const [answers1, setAnswers1] = useState(
    new Array(questions1.length).fill(null)
  );
  const [answers2, setAnswers2] = useState(
    new Array(questions2.length).fill(null)
  );
  const [answers3, setAnswers3] = useState(
    new Array(questions3.length).fill(null)
  );

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
    <div className="russian d-flex flex-column">
      <div className="middle d-flex flex-column justify-content-center align-items-center">
        <div className="mid d-flex flex-column justify-content-center align-items-start">
          <div className="mid-content">
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
                <p className="h5">Отметьте нужные прилагательные.</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ra1;
