import React, { useContext } from "react";
import "./Lesson.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { Typography, Box, Breadcrumbs } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { LanguageContext } from "../../LanguageContext";

const Lesson = () => {
  const { content } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleRussianClick = () => {
    navigate("/type");
  };

  return (
    <div className="lesson">
      <Header />
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
      <Footer content={content} />
    </div>
  );
};

export default Lesson;
