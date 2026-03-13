import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// authenticate — from theme.docx auth.js pattern
// Supports BOTH cookie (theme pattern) and Authorization header (React pattern)
function authenticate(req, res, next) {
  try {
    let token = req.headers.authorization;

    if (!token) {
      const cookies = req.headers.cookie;
      if (cookies) {
        const parsed = Object.fromEntries(
          cookies.split("; ").map(c => {
            const [key, ...val] = c.split("=");
            return [key, val.join("=")];
          })
        );
        token = parsed.authToken;
      }
    }

    if (!token) return res.status(401).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.name = decoded.UserName;
    req.role = decoded.UserRole;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return res.status(401).json({ msg: "Token expired. Please login again." });
    if (error.name === "JsonWebTokenError")
      return res.status(401).json({ msg: "Invalid token" });
    return res.status(500).json({ msg: "Authentication failed" });
  }
}

// isAdmin — from theme.docx adminauth.js pattern
function isAdmin(req, res, next) {
  if (req.role === "Admin") return next();
  res.status(403).json({ msg: "You are not allowed" });
}

export { authenticate, isAdmin };
