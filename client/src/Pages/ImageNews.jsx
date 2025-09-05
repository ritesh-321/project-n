import React, { useEffect, useState } from "react";
import API from "../api";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import "./cs/Image.css";

const ImageNews = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await API.get("/news/image");

        // ✅ Validate response data
        if (res && Array.isArray(res.data)) {
          setNews(res.data);
        } else {
          console.error("Invalid data received:", res?.data);
          throw new Error("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Error fetching image news:", err);
        setError("Failed to load image news.");
        setNews([]); // fallback to empty array
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
          const imageUrl = item?.imageUrl || "";

          return (
            <div key={item._id} className={`news-card ${index === 0 ? "highlight" : ""}`}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={item.title || "News Image"}
                  style={{ width: "100%", borderRadius: "8px" }}
                  className="news-image"
                />
              )}
              <div className="i-news-content">
                <h3 className="i-news-title">{item.title || "Untitled"}</h3>
                <p className="i-news-text">{item.content || "No content available."}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ImageNews;
