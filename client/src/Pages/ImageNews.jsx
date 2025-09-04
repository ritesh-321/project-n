import React, { useEffect, useState } from 'react';
import API from '../api';
import './cs/Image.css';
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_API_URL;

const ImageNews = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await API.get('/news/image');
        if (Array.isArray(res.data)) {
          setNews(res.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching image news:', err);
        setError('Failed to load image news.');
      }
    };

    fetchNews();
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (news.length === 0) return <p className="no-news">No image news available.</p>;

  return (
    <>
      <Header />
      <Navbar />
      <div className="news-grid">
        {news.map((item, index) => {
          // ✅ Prefix backend URL
          console.log("Image URL from DB:", item.imageUrl);

          const imageUrl = item.imageUrl;
         // console.log("Image URL:", imageUrl);

         return (
            <div key={item._id} className={`news-card ${index === 0 ? 'highlight' : ''}`}>
              <img
                src={imageUrl}
                alt={item.title}
                style={{ width: "100%", borderRadius: "8px" }}
                className="news-image"
              />
              <div className="i-news-content">
                <span className="i-news-category"></span>
                <h3 className="i-news-title">{item.title}</h3>
                <p className="i-news-text">{item.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ImageNews;
