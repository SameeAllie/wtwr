import React from "react";
import "../blocks/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer__author">Developed By Samee Allie</p>
      <p className="footer__year">{new Date().getFullYear()}</p>
    </footer>
  );
};
export default Footer;
