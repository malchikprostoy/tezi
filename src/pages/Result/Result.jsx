import React from "react";
import "./Result.scss";
import logo from "../../assets/img/Manas_logo.png";
import { useLocation, useNavigate } from "react-router-dom";

const Result = ({ userName, score, totalQuestions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get("name");

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="result">
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
          <h2>Результат теста</h2>
          <p>
            {userName}, вы набрали {score} из {totalQuestions} правильных ответов.
          </p>
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

export default Result;
