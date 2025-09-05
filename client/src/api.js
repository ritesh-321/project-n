// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://project-n-se6h.onrender.com/api", // This is good
  // ❌ Don't manually set Content-Type here — let axios handle it for file uploads
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
export default API;
