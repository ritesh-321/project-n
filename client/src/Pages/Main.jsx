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
    Promise.all([
      API.get("/news"),
      API.get("/news/image"),
      API.get("/news/video")
    ])
    .then(([newsRes, imgRes, vidRes]) => {
      const textOnly = newsRes.data.filter(n => !n.imageUrl && !n.videoUrl);
      setTextNews(textOnly);
      setImageNews(imgRes.data);
      setVideoNews(vidRes.data);
    })
    .catch(err => console.error(err));
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
        <hr/>
        <div className="top-section">
          {/* Left Column - Title + Content + Image Grid */}
          <div className="column left">
            {imageNews.map((img) => (
              <div key={img._id} className="left-grid">
                <div className="left-text">
                  <h3>{img.heading || img.title}</h3>
                  <p>{img.content}</p>
                </div>
                <div className="left-image">
                  <img src={img.imageUrl} 
                  alt={img.title}
                  loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Text News (unchanged) */}
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
  <source src={video.videoUrl} type="video/mp4" />
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
