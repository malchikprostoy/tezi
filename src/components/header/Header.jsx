import React from "react";
import logo from "../../assets/img/Manas_logo.png";
import { useNavigate } from "react-router-dom";
import { Avatar, MenuItem, Select, Box } from "@mui/material";
import Profile from "../profile/Profile";
import { useTranslation } from "react-i18next";

const Header = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#8B0000",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
        color: "white",
        height: "12vh",
        display: "flex",
        alignItems: "center",
        px: 4, // Внутренний отступ
      }}
    >
      {/* Левая часть (логотип) */}
      <Avatar
        src={logo}
        alt="Logo"
        sx={{ width: 60, height: 60, cursor: "pointer" }}
        onClick={handleLogoClick}
      />

      {/* Центрирующий Box (пушит правую часть вправо) */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Правая часть (язык + профиль) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Select
          value={i18n.language}
          onChange={handleLangChange}
          sx={{
            color: "white",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiSvgIcon-root": { color: "white" },
          }}
        >
          <MenuItem value="tr">TR</MenuItem>
          <MenuItem value="kg">KG</MenuItem>
          <MenuItem value="ru">RU</MenuItem>
          <MenuItem value="en">EN</MenuItem>
        </Select>
        <Profile />
      </Box>
    </Box>
  );
};

export default Header;
