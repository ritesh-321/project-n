import React, { useEffect, useState } from "react";
import NewsForm from "../components/NewsForm";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [newsList, setNewsList] = useState([]);
  const navigate = useNavigate();

  const fetchNews = async () => {
    const res = await API.get("/news");
    setNewsList(res.data);
  };

  const handleDelete = async (id) => {
    await API.delete(`/news/${id}`);
    fetchNews(); // refresh after delete
  };

  const handleEdit = (id) => {
    navigate(`/admin?id=${id}`);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="container">
      <h1>Admin Panel</h1>
      <NewsForm onNewsSubmit={fetchNews} />

      <h2>All News</h2>
      {newsList.map((news) => (
        <div key={news._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h3>{news.title}</h3>
          <p>{news.content}</p>
          <p><strong>Author:</strong> {news.author}</p>
          <p><strong>Date:</strong> {new Date(news.date).toLocaleDateString()}</p>
          <button onClick={() => handleDelete(news._id)} style={{ marginRight: "1rem" }}>Delete</button>
          <button onClick={() => handleEdit(news._id)}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default Admin;
