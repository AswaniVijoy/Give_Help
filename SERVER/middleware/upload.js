// upload.js — from theme.docx upload1.js (memory storage pattern)
// File is available as req.file.buffer for Sharp processing before DB storage
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
