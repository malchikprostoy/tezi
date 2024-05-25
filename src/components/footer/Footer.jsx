import React from "react";
import './Footer.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = ({ content }) => {
  return (
    <div className="footer d-flex justify-content-center align-items-center text-center">
      <div className="container">
        <div className="lng-footer">{content.footer || "Loading..."}</div>
      </div>
    </div>
  );
};

export default Footer;