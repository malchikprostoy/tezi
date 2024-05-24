import React, { useEffect, useState } from "react";
import logo from "../../assets/img/Manas_logo.png";
import "./Lesson.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Box, Breadcrumbs } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { NavLink } from "react-router-dom";
import Translation from '../../Data.json'

const Lesson = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = new URLSearchParams(location.search).get('name');
  const userName = localStorage.getItem('userName');
  const [content, setContent] = useState({});

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleRussianClick = () => {
    navigate("/type");
  };

  

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'tr') {
        setContent(Translation.tr);
    } else if (savedLang === 'kg') {
        setContent(Translation.kg);
    } else if (savedLang === 'ru') {
        setContent(Translation.ru);
    } else if (savedLang === 'en') {
        setContent(Translation.en);
    }
}, []);

  return (
    <div className="lesson">
      <div className="header">
        <div className="container" id="header">
          <div className="header__left">
            <a onClick={handleLogoClick}>
              <img src={logo} width={60} alt="Logo" />
            </a>
          </div>
          <div className="header__right">
            <span className="name-user">{userName}</span>
          </div>
        </div>
      </div>
      <div className="middle d-flex justify-content-center align-items-center flex-column">
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
              <Typography color="#fff">Lesson</Typography>
            </Breadcrumbs>
          </Box>
        </div>
        <div className="mid d-flex justify-content-center align-items-center flex-column container-sm">
          <button className="btn btn-outline-danger btn-lg lng">Türkçe</button>
          <button className="btn btn-outline-danger btn-lg lng">Кыргыз тили</button>
          <button className="btn btn-outline-danger btn-lg lng" onClick={handleRussianClick}>
            Русский язык
          </button>
          <button className="btn btn-outline-danger btn-lg lng">English</button>
        </div>
      </div>
      <footer class="footer">
        <div class="container d-flex justify-content-center align-items-center">
          <div class="lng-footer">
            {content.footer}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Lesson;
