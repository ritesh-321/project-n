import React, { useState, useEffect } from "react";
import API from "../api";
import { useSearchParams } from "react-router-dom";

const NewsForm = ({ onNewsSubmit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const newsId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (newsId) {
      API.get(`/news/${newsId}`).then((res) => {
        const { title, content, author } = res.data;
        setTitle(title);
        setContent(content);
        setAuthor(author);
      });
    } else {
      // clear form
      setTitle("");
      setContent("");
      setAuthor("");
    }
  }, [newsId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newsData = { title, content, author };

    if (newsId) {
      await API.put(`/news/${newsId}`, newsData);
      alert("News updated!");
    } else {
      await API.post("/news", newsData);
      alert("News created!");
    }

    // reset
    setSearchParams({});
    setTitle("");
    setContent("");
    setAuthor("");

    if (onNewsSubmit) {
      onNewsSubmit(); // refresh list in admin
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{newsId ? "Edit News" : "Add News"}</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required />
      <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" required />
      <button type="submit">{newsId ? "Update" : "Add"}</button>
    </form>
  );
};

export default NewsForm;
