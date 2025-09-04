// src/components/Header.jsx
import React from "react";
import "./css/Header.css";
import logo from "../assets/logo.png";


const Header = () => {
  return (
    
    <header className="header">
        
      <img src={logo} alt="Logo" className="logo-img" />
      <h1 className="title">Nepal Hotspot</h1>
    </header>
  );
};

export default Header;
