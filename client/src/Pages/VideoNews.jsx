import React, { useEffect, useState, useRef } from 'react';
import API from '../api';
import './cs/Video.css';
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const VideoNews = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get('/news/video');
        if (Array.isArray(res.data)) {
          setNews(res.data);
        } else {
          throw new Error('Invalid data format for video news');
        }
      } catch (err) {
        console.error('Error fetching video news:', err);
        setError('Failed to load video news.');
      }
    };

    fetchVideos();
  }, []);

  const handlePlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) {
        video.pause();
      }
    });
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <Navbar />
      <div className="video-section">
        <h2 className="video-heading">🎥 Video News</h2>
        {news.length === 0 ? (
          <p>No video news available.</p>
        ) : (
          <div className="video-grid">
            {news.slice(0, 3).map((item, index) => (
              <div key={item._id} className="video-item">
                <div className="video-card">
                  <video
                    controls
                    className="video-player"
                    ref={(el) => (videoRefs.current[index] = el)}
                    onPlay={() => handlePlay(index)}
                    src={item.videoUrl}
                  />
                </div>
                <h3 className="video-title">{item.title}</h3>
                <p className="video-desc">{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VideoNews;
