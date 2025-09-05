import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
// agar register/login ke liye controller functions likhe ho to unko bhi import karo
// import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// 🔓 Public routes (Register & Login yaha honge)
// Example ke liye agar controllers use kar rahe ho:
// router.post("/register", registerUser);
// router.post("/login", loginUser);

// 🔒 Protected route
router.get("/data", verifyToken, (req, res) => {
  res.json({
    secret: "This is admin-only data",
    userId: req.user.id,
  });
});

export default router;
