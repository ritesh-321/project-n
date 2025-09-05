import React, { useEffect, useState, useRef } from 'react';
import API from '../api';
import './cs/Main.css';
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const Main = () => {
  const [textNews, setTextNews] = useState([]);
  const [imageNews, setImageNews] = useState([]);
  const [videoNews, setVideoNews] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const [newsRes, imgRes, vidRes] = await Promise.all([
          API.get("/news"),
          API.get("/news/image"),
          API.get("/news/video")
        ]);

        // ✅ Ensure arrays
        const allNews = Array.isArray(newsRes?.data) ? newsRes.data : [];
        const images = Array.isArray(imgRes?.data) ? imgRes.data : [];
        const videos = Array.isArray(vidRes?.data) ? vidRes.data : [];

        // Debug: log what URLs we actually got
        console.log("📰 Text News:", allNews);
        console.log("🖼️ Image URLs:", images.map(i => i.imageUrl));
        console.log("🎥 Video URLs:", videos.map(v => v.videoUrl));

        // Filter text-only
        const textOnly = allNews.filter(item => !item.imageUrl && !item.videoUrl);

        setTextNews(textOnly);
        setImageNews(images);
        setVideoNews(videos);
      } catch (err) {
        console.error("Error fetching news:", err);
        setTextNews([]);
        setImageNews([]);
        setVideoNews([]);
      }
    };

    fetchNews();
  }, []);

  const handlePlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) video.pause();
    });
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="main-container">
        <hr />
        <div className="top-section">
          {/* Left Column - Image News */}
          <div className="column left">
            {imageNews.map((img) => (
              <div key={img._id} className="left-grid">
                <div className="left-text">
                  <h3>{img.heading || img.title}</h3>
                  <p>{img.content}</p>
                </div>
                <div className="left-image">
                  <img
                    src={img.imageUrl?.startsWith("http") ? img.imageUrl : ""}
                    alt={img.title || "news image"}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Text News */}
          <div className="column right">
            {textNews.map((news) => (
              <div key={news._id} className="text-item">
                <h3>{news.title}</h3>
                <p>{news.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Video News */}
        <div className="video-section">
          <h2 className="section-heading">Video News</h2>
          <div className="video-grid">
            {videoNews.map((video, index) => (
              <div key={video._id} className="video-item">
                <div className="video-card">
                  <video
                    controls
                    className="video-player"
                    ref={(el) => (videoRefs.current[index] = el)}
                    onPlay={() => handlePlay(index)}
                  >
                    <source
                      src={video.videoUrl?.startsWith("http") ? video.videoUrl : ""}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <h4 className="video-title">{video.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
