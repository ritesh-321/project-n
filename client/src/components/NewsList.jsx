import React, { useEffect, useState } from "react";
import API from "../api";
import './css/NewsList.css';

const NewsList = () => {
  const [newsList, setNewsList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await API.get("/news");

        // ✅ Ensure we always have an array before filtering
        const allNews = Array.isArray(res?.data) ? res.data : [];

        // Only text news (no image or video)
        const filteredNews = allNews.filter(
          (news) => !news.imageUrl && !news.videoUrl
        );

        setNewsList(filteredNews);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news.");
        setNewsList([]); // fallback to empty array
      }
    };

    fetchNews();
  }, []);

  if (error) return <div className="error">{error}</div>;

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
