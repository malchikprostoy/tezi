import React, { useState } from "react";
import logo from "../../assets/img/Manas_logo.png";
import "./Main.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../components/footer/Footer";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const Main = ({ setUserName }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserName(name);
    localStorage.setItem("userName", name);
    navigate(`/lesson?name=${name}`);
  };

  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="main">
      <div className="header">
        <div className="container" id="header">
          <div className="header__left">
            <img src={logo} width={60} alt="Logo" />
          </div>
          <div className="header__right">
            <Select value={i18n.language} onChange={handleLangChange}>
              <MenuItem value="tr">TR</MenuItem>
              <MenuItem value="kg">KG</MenuItem>
              <MenuItem value="ru">RU</MenuItem>
              <MenuItem value="en">EN</MenuItem>
            </Select>
          </div>
        </div>
      </div>
      <div className="middle d-flex justify-content-center align-items-center">
        <form
          className="form d-flex flex-column align-items-center justify-content-center"
          onSubmit={handleSubmit}
        >
          <label className="d-flex flex-column" htmlFor="name">
            {t("text")}
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button type="submit">{t("button")}</button>
        </form>
      </div>
      <Footer content={t} />
    </div>
  );
};

export default Main;
