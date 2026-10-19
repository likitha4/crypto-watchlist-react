const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("authmiddleware hit");
  console.log("cookies", req.cookies);
  console.log("auth path:", req.originalUrl);
  console.log("token present:", Boolean(req.cookies?.token));
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ","");
    if (!token) return res.status(401).json({ error: "Not authorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("auth error:", error.message);
    return res.status(401).json({ error: "Not authorized" });
  }
};

module.exports = authMiddleware;
