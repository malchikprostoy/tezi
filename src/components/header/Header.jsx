import React from "react";
import logo from "../../assets/img/Manas_logo.png";
import "./Header.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="header">
        <div className="container" id="header">
          <div className="header__left">
            <img onClick={handleLogoClick} src={logo} width={60} alt="Logo" />
          </div>
          <div className="header__right">
            <span className="name-user">{userName}</span>
          </div>
        </div>
      </div>
  );
};

export default Header;
