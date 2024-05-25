import React, { useContext } from "react";
import "./Level.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Breadcrumbs } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { NavLink } from "react-router-dom";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import { LanguageContext } from "../../LanguageContext";

const Level = () => {
  const navigate = useNavigate();
  const { content } = useContext(LanguageContext);

  const handleA1 = () => {
    navigate("/russian")
  }

  return (
    <div className="type">
      <Header/>
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
                Year
              </NavLink>
              <Typography color="#fff">Level</Typography>
            </Breadcrumbs>
          </Box>
        </div>
        <div className="mid">
          <button className="btn btn-outline-danger btn-lg lng" onClick={handleA1}>А1</button>
          <button className="btn btn-outline-danger btn-lg lng">А2</button>
          <button className="btn btn-outline-danger btn-lg lng">B1</button>
          <button className="btn btn-outline-danger btn-lg lng">B2</button>
          <button className="btn btn-outline-danger btn-lg lng">C1</button>
        </div>
      </div>
      <Footer content={content}/>
    </div>
  );
};

export default Level;
