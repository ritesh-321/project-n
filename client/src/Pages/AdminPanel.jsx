import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  
 const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear JWT
    navigate("/login"); // redirect to login page
  }
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    file: null,
    type: 'image'
  });

  const [newsList, setNewsList] = useState([]);
  const [editingId, setEditingId] = useState(null); // For tracking which news is being edited

  // Load all image and video news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const imageRes = await API.get('/news/image');
        const videoRes = await API.get('/news/video');
        setNewsList([...imageRes.data, ...videoRes.data]);
      } catch (err) {
        console.error('Error loading news:', err);
      }
    };
    fetchNews();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);

    const isImage = formData.type === 'image';
    if (formData.file) {
      data.append(isImage ? 'image' : 'video', formData.file);
    }

    const endpoint = isImage ? '/news/image' : '/news/video';

    try {
      if (editingId) {
        // Update
        await API.put(`/news/${editingId}`, {
          title: formData.title,
          content: formData.content
        });
        alert('News updated');
      } else {
        // Create
        await API.post(endpoint, data);
        alert('News uploaded');
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Operation failed');
    }
  };

  const handleEdit = (news) => {
    setEditingId(news._id);
    setFormData({
      title: news.title,
      content: news.content,
      file: null,
      type: news.type
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return;
    try {
      await API.delete(`/news/${id}`);
      alert('News deleted');
      setNewsList(newsList.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (


    
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? 'Edit News' : 'Admin Panel'}
      </h2>
      <h2 className="text-2xl font-bold">
          {editingId ? "Edit News" : "Admin Panel"}
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="type"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          value={formData.type}
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <input
          type="file"
          name="file"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          accept={formData.type === 'image' ? 'image/*' : 'video/*'}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? 'Update News' : 'Upload'}
        </button>
      </form>

      {/* List */}
      <h3 className="text-xl font-semibold mb-4">Uploaded News</h3>
      <div className="grid grid-cols-1 gap-4">
        {newsList.map((item) => (
          <div key={item._id} className="border p-4 rounded shadow">
            <h4 className="text-lg font-bold">{item.title}</h4>
            <p>{item.content}</p>
            {item.type === 'image' && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="mt-2 max-h-48 object-cover"
              />
            )}
            {item.type === 'video' && (
              <video
                src={item.videoUrl}
                controls
                className="mt-2 w-full max-h-64"
              />
            )}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-400 px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
