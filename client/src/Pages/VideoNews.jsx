import React, { useEffect, useState, useRef } from "react";
import API from "../api";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import "./cs/Video.css";

const VideoNews = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get("/news/video");

        // ✅ Ensure we always get an array
        if (res && Array.isArray(res.data)) {
          // Filter out invalid objects without videoUrl
          const validVideos = res.data.filter(item => item && item.videoUrl);
          setNews(validVideos);
        } else {
          console.error("Invalid response for video news:", res);
          throw new Error("Invalid data format for video news");
        }
      } catch (err) {
        console.error("Error fetching video news:", err);
        setError("Failed to load video news.");
        setNews([]); // fallback to empty array
      }
    };

    fetchVideos();
  }, []);

  const handlePlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) video.pause();
    });
  };

  if (error) return <div className="error">{error}</div>;
  if (news.length === 0) return <p>No video news available.</p>;

  return (
    <>
      <Header />
      <Navbar />
      <div className="video-section">
        <h2 className="video-heading">🎥 Video News</h2>
        <div className="video-grid">
          {news.map((item, index) => (
            <div key={item._id} className="video-item">
              <div className="video-card">
                {item.videoUrl && (
                  <video
                    controls
                    className="video-player"
                    ref={(el) => (videoRefs.current[index] = el)}
                    onPlay={() => handlePlay(index)}
                  >
                    <source src={item.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <h3 className="video-title">{item.title || "Untitled"}</h3>
              <p className="video-desc">{item.content || "No description."}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoNews;
