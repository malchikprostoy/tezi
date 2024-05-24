import React, { useEffect, useState } from "react";
import "./Russian.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./../../../assets/img/Manas_logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Box, Breadcrumbs } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { NavLink } from "react-router-dom";
import ruData from "../../../components/data/ru/dataru.json";
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer"

const Russian = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = new URLSearchParams(location.search).get("name");
  const userName = localStorage.getItem("userName");

  const content = ruData.content;
  const content1 = ruData.content1;

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="russian">
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
      <div className="middle">
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
              <NavLink to={"/type"} style={{ color: "#fff" }}>
                Type
              </NavLink>
              <NavLink to={"/level"} style={{ color: "#fff" }}>
                Level
              </NavLink>
              <Typography color="#fff">Russian</Typography>
            </Breadcrumbs>
          </Box>
        </div>
        <div className="mid align-items-start">
          <div className="mid-content">
            <h1>{content.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: content.text }} />
            <div className="line"></div>
            <div className="comment text-start">
              <span dangerouslySetInnerHTML={{ __html: content.comment }} />
            </div>
          </div>
          <div className="mid-content">
            <h1>{content1.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: content1.text }} />
            <div className="line"></div>
            <div className="comment text-start">
              <span dangerouslySetInnerHTML={{ __html: content1.comment }} />
            </div>
          </div>
          <AudioPlayer />
        </div>
      </div>
      <footer class="footer">
        <div class="container d-flex justify-content-center align-items-center flex-column">
          <div class="lng-footer">
            © 2024 KIRGIZİSTAN-TÜRKİYE MANAS ÜNİVERSİTESİ
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Russian;
