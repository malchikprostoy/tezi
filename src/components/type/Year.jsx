import React, { useContext } from "react";
import "./Year.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Breadcrumbs } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { NavLink } from "react-router-dom";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import { LanguageContext } from "../../LanguageContext";

const Year = () => {
  const { content } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleBtn = () => {
    navigate("/level")
  }

  return (
    <div className="year">
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
              <Typography color="#fff">Year</Typography>
            </Breadcrumbs>
          </Box>
        </div>
        <div className="mid">
          <button className="btn btn-outline-danger btn-lg lng" onClick={handleBtn}>Type 1</button>
        </div>
      </div>
      <Footer content={content}/>
    </div>
  );
};

export default Year;
