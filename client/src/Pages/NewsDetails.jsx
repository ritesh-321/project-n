// src/pages/NewsDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const NewsDetails = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await API.get(`/news/${id}`);
        setNewsItem(response.data);
      } catch (err) {
        setError("Failed to fetch news item.");
        console.error(err);
      }
    };

    fetchNewsItem();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!newsItem) return <p>Loading...</p>;

  return (
    <div className="news-details">
      <h2>{newsItem.title}</h2>
      <p>{newsItem.content}</p>
      <p><i>Published on: {new Date(newsItem.createdAt).toLocaleString()}</i></p>
    </div>
  );
};

export default NewsDetails;
