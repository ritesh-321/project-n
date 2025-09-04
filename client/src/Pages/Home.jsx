import React from "react";
import Header from "../components/Header";
import NewsList from "../components/NewsList";
import Navbar from "../components/Navbar";
import "./cs/home.css";

const Home = () => {
  return (
    <>
      <Header />
      <Navbar />
      <div className="h-main-content"  style={{ paddingTop: "140px" }}>
        <NewsList />
      </div>
    </>
  );
};

export default Home;
