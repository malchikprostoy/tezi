import React, { useState } from "react";
import "./Year.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/img/Manas_logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Box, Breadcrumbs } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { NavLink } from "react-router-dom";

const Year = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = new URLSearchParams(location.search).get("name");
  const userName = localStorage.getItem("userName");

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleBtn = () => {
    navigate("/level")
  }

  return (
    <div className="year">
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
              <Typography color="#fff">Level</Typography>
            </Breadcrumbs>
          </Box>
        </div>
        <div className="mid">
          <button className="btn btn-outline-danger btn-lg lng" onClick={handleBtn}>Type 1</button>
        </div>
      </div>
      <footer class="footer">
        <div class="container d-flex justify-content-center align-items-center flex-column text-center">
          <div class="lng-footer">
            © 2024 KIRGIZİSTAN-TÜRKİYE MANAS ÜNİVERSİTESİ
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Year;
