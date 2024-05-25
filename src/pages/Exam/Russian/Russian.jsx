import React, { useContext, useEffect } from "react";
import "./Russian.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Typography, Box, Breadcrumbs } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { NavLink } from "react-router-dom";
import ruData from "../../../components/data/ru/dataru.json";
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer"
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { LanguageContext } from "../../../LanguageContext";

const Russian = () => {
  const { content } = useContext(LanguageContext);
  const content1 = ruData.content1;
  const content2 = ruData.content2;


  return (
    <div className="russian d-flex flex-column">
      <Header/>
      <div className="middle d-flex flex-column justify-content-center align-items-center">
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
              <Typography color="#fff">Exam</Typography>
            </Breadcrumbs>
          </Box>
        </div>
        <div className="mid d-flex flex-column justify-content-center align-items-start">
          <div className="mid-content">
            <h1>{content1.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: content1.text }} />
            <div className="line"></div>
            <div className="comment text-start">
              <span dangerouslySetInnerHTML={{ __html: content1.comment }} />
            </div>
          </div>
          <div className="mid-content">
            <h1>{content2.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: content2.text }} />
            <div className="line"></div>
            <div className="comment text-start">
              <span dangerouslySetInnerHTML={{ __html: content2.comment }} />
            </div>
          </div>
          <AudioPlayer />
        </div>
      </div>
      <Footer content={content}/>
    </div>
  );
};

export default Russian;
