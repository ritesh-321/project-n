import express from "express";
import multer from "multer";
import News from "../models/News.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// ------------------- Cloudinary Setup -------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------------- Multer + Cloudinary Storage -------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "news_images";
    if (file.mimetype.startsWith("video")) folder = "news_videos";
    return {
      folder,
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

const upload = multer({ storage });

// ------------------- POST: Text News -------------------
router.post("/", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Title and content are required." });

  try {
    const newsItem = new News({ title, content, type: "text" });
    const saved = await newsItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- POST: Image News -------------------
router.post("/image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Image file is required." });

  const { title, content } = req.body;
  try {
    const newsItem = new News({
      title,
      content,
      type: "image",
      imageUrl: req.file.path, // Cloudinary URL
    });
    const saved = await newsItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- POST: Video News -------------------
router.post("/video", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Video file is required." });

  const { title, content } = req.body;
  try {
    const newsItem = new News({
      title,
      content,
      type: "video",
      videoUrl: req.file.path, // Cloudinary URL
    });
    const saved = await newsItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- GET: All News -------------------
router.get("/", async (req, res) => {
  try {
    const allNews = await News.find().sort({ createdAt: -1 });
    res.json(allNews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- GET: Only Image News -------------------
router.get("/image", async (req, res) => {
  try {
    const imageNews = await News.find({ type: "image" }).sort({ createdAt: -1 });
    res.json(imageNews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- GET: Only Video News -------------------
router.get("/video", async (req, res) => {
  try {
    const videoNews = await News.find({ type: "video" }).sort({ createdAt: -1 });
    res.json(videoNews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- Other Routes -------------------
router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const filtered = await News.find({ type }).sort({ createdAt: -1 });
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { title, content } = req.body;
  try {
    const updated = await News.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!updated) return res.status(404).json({ error: "News not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "News not found" });
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
