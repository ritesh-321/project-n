import React, { useEffect, useState } from "react";
import API from "../api";
import './css/NewsList.css';

const NewsList = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    API.get("/news").then((res) => {
      const filteredNews = res.data.filter(
        (news) => !news.imageUrl && !news.videoUrl
      );
      setNewsList(filteredNews);
    });
  }, []);

  return (
    <div className="container">
      <h2 className="news-heading">Latest News</h2>
      {newsList.length === 0 ? (
        <p className="no-news">No text-only news available.</p>
      ) : (
        newsList.map((news) => (
          <div key={news._id} className="news-card">
            <h3 className="news-title">{news.title}</h3>
            <p className="news-text">{news.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default NewsList;
