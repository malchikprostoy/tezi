import React, { useState } from "react";
import "./Russian.scss";
import logo from "./../../../assets/img/Manas_logo.png";
import questionData from "./../../../questionData";
import { useNavigate, useLocation } from "react-router-dom";

const Russian = ({ userName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get("name");

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
    const isCorrect = questionData[questionIndex].correctAnswer === answer;
    if (!isCorrect) {
      setWrongAnswers([...wrongAnswers, questionIndex]);
    } else {
      const filtered = wrongAnswers.filter((index) => index !== questionIndex);
      setWrongAnswers(filtered);
    }
  };

  const score = Object.values(answers).filter(
    (answer, index) => questionData[index].correctAnswer === answer
  ).length;
  const totalQuestions = questionData.length;

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="russian">
      <div className="header">
        <div className="container" id="header">
          <div className="header__left">
            <a href="#" onClick={handleLogoClick}>
              <img src={logo} width={60} alt="Logo" />
            </a>
          </div>
          <div className="header__right">
            <span className="name-user">{userName}</span>
          </div>
        </div>
      </div>
      <div className="middle">
        <div className="mid">
          <h1>Моя семья</h1>
          <p>
            У меня большая семья из шести человек: я, мама, папа, старшая
            сестра, бабушка и дедушка. Мы живем все вместе с собакой Бимом и
            кошкой Муркой в большом доме в деревне. Мой папа встает раньше всех,
            потому что ему рано на работу. Он работает доктором. Обычно бабушка
            готовит нам завтрак. Я обожаю овсяную кашу, а моя сестра Аня –
            блины. После завтрака мы собираемся и идем в школу. Моя сестра
            учится в пятом классе, а я – во втором. Мы любим учиться и играть с
            друзьями. Больше всего я люблю географию. Когда мы приходим домой из
            школы, мы смотрим телевизор, а потом ужинаем и делаем уроки. Иногда
            мы помогаем бабушке и маме в огороде, где они выращивают овощи и
            фрукты.
          </p>
          <div>
            <h2>Ответьте на вопросы:</h2>
            {questionData.map((question, index) => (
              <div
                key={index}
                style={{
                  borderBottom:
                    wrongAnswers.includes(index) ? "2px solid red" : "none",
                }}
              >
                <p className="qns">
                  Вопрос {index + 1}: {question.question}
                </p>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <input
                      type="radio"
                      id={`question${index + 1}_option${optionIndex + 1}`}
                      name={`question${index + 1}`}
                      value={option}
                      onChange={() => handleAnswerChange(index, option)}
                    />
                    <label
                      htmlFor={`question${index + 1}_option${optionIndex + 1}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button onClick={handleSubmit}>Узнать результат</button>
          {showResult && (
            <p>
              Ваш результат: {score} из {totalQuestions}
            </p>
          )}
        </div>
      </div>
      <footer class="footer">
        <div class="container">
          <div class="lng-footer">
            © 2024 KIRGIZİSTAN-TÜRKİYE MANAS ÜNİVERSİTESİ
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Russian;
