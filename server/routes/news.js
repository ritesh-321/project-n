import express from "express";
import multer from "multer";
import path from "path";
import News from "../models/News.js";

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ------------------- POST: Text News -------------------
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  try {
    const newsItem = new News({
      title,
      content,
      type: "text"
    });
    const saved = await newsItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- POST: Image News -------------------
router.post("/image", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Image file is required." });
  }

  try {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const newsItem = new News({
      title,
      content,
      type: "image",
      imageUrl
    });
    const saved = await newsItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- POST: Video News -------------------
router.post("/video", upload.single("video"), async (req, res) => {
  const { title, content } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Video file is required." });
  }

  try {
    const videoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const newsItem = new News({
      title,
      content,
      type: "video",
      videoUrl
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
    console.log("✅ /api/news/image route hit");
    const imageNews = await News.find({ type: "image" }).sort({ createdAt: -1 });

    if (!imageNews || imageNews.length === 0) {
      return res.status(404).json({ error: "No image news found" });
    }

    res.json(imageNews);
  } catch (err) {
    console.error("❌ Error in /api/news/image route:", err);
    res.status(500).json({ error: "Server error while fetching image news" });
  }
});

// ------------------- GET: Only Video News -------------------
router.get("/video", async (req, res) => {
  try {
    const videoNews = await News.find({ type: "video" }).sort({ createdAt: -1 });
    res.json(videoNews);
  } catch (err) {
    console.error("Error fetching video news:", err);
    res.status(500).json({ error: "Failed to fetch video news" });
  }
});

// ------------------- GET: Filter by Type -------------------
router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const filtered = await News.find({ type }).sort({ createdAt: -1 });
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- GET: Single News by ID -------------------
router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- PUT: Update News -------------------
router.put("/:id", async (req, res) => {
  const { title, content } = req.body;

  try {
    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "News not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- DELETE: Delete News -------------------
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
