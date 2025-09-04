const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

// Public routes: register & login
// ... your existing register/login here ...

// Protected route
router.get("/data", verifyToken, (req, res) => {
  res.json({
    secret: "This is admin-only data",
    userId: req.user.id
  });
});

module.exports = router;
