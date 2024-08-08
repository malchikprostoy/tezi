import React from "react";
import "./Footer.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";

const Footer = ({ content }) => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer d-flex justify-content-center align-items-center text-center">
      <div className="container">
        <div className="lng-footer">
          © {currentYear} {t("footer") || "Loading..."}
        </div>
      </div>
    </div>
  );
};

export default Footer;
