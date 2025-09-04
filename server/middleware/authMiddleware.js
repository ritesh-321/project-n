const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "superSecretKey");
    req.user = decoded; // decoded contains { id: user._id }
    next();
  } catch (err) {
    res.status(403).json({ msg: "Token is not valid" });
  }
};

module.exports = verifyToken;
