import React from "react";
import { Link } from "react-router-dom";
import './css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">NewsPortal</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Main">Fast News</Link></li>
          <li><Link to="/images">News Post</Link></li>
          <li><Link to="/videos">Videos</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
