import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import { User } from "../models/usermodel.js";
import { Donation } from "../models/donationmodel.js";
import { Campaign } from "../models/campaignmodel.js";
import { authenticate } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

export const user = Router();

// POST /user/signup
user.post("/signup", async (req, res) => {
  try {
    const { UserName, Email, Password, UserRole, AdminSecret } = req.body;

    if (!UserName || !Email || !Password)
      return res.status(400).json({ msg: "All fields are required" });

    const existingUser = await User.findOne({ Email });
    if (existingUser)
      return res.status(400).json({ msg: "Email already registered" });

    const hashedPassword = await bcrypt.hash(Password, 10);

    let role = "User";
    if (UserRole && UserRole.toLowerCase() === "admin") {
      if (AdminSecret === process.env.ADMIN_SECRET) {
        role = "Admin";
      } else {
        return res.status(403).json({ msg: "Invalid admin secret" });
      }
    }

    const newUser = await User.create({
      UserName,
      Email,
      Password: hashedPassword,
      UserRole: role,
    });

    res.status(201).json({
      msg: "Signup successful",
      user: { name: newUser.UserName, role: newUser.UserRole },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// POST /user/login
user.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const userData = await User.findOne({ Email });

    if (!userData) return res.status(404).json({ msg: "Email not registered" });

    const valid = await bcrypt.compare(Password, userData.Password);
    if (!valid) return res.status(401).json({ msg: "Invalid Password" });

    const token = jwt.sign(
      { Email: userData.Email, UserRole: userData.UserRole, UserName: userData.UserName },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("authToken", token, { httpOnly: true, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ msg: "Login successful", token, role: userData.UserRole, username: userData.UserName });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

// POST /user/logout
user.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ msg: "Logged out successfully" });
});

// GET /user/profile (protected)
user.get("/profile", authenticate, async (req, res) => {
  try {
    const userData = await User.findOne({ UserName: req.name }).select("-Password");
    if (!userData) return res.status(404).json({ msg: "User not found" });
    res.json(userData);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ─── NEW: PUT /user/profile-picture ─────────────────────────────────────────
// Accepts multipart/form-data with field "ProfilePicture"
// Compresses with Sharp and stores as base64 in DB
user.put(
  "/profile-picture",
  authenticate,
  upload.single("ProfilePicture"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ msg: "No image uploaded" });

      const compressed = await sharp(req.file.buffer)
        .resize({ width: 300, height: 300, fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();

      const base64 = compressed.toString("base64");

      await User.findOneAndUpdate(
        { UserName: req.name },
        { ProfilePicture: base64 },
        { new: true }
      );

      res.json({ msg: "Profile picture updated successfully" });
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
);

// ─── NEW: GET /user/avatar/:username ────────────────────────────────────────
// Serves the user's profile picture as a JPEG image
user.get("/avatar/:username", async (req, res) => {
  try {
    const userData = await User.findOne({ UserName: req.params.username });

    if (!userData || !userData.ProfilePicture)
      return res.status(404).json({ msg: "Avatar not found" });

    const imageBuffer = Buffer.from(userData.ProfilePicture, "base64");
    res.set("Content-Type", "image/jpeg");
    res.send(imageBuffer);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// POST /user/donate (protected, User only)
user.post("/donate", authenticate, async (req, res) => {
  try {
    const { CampaignTitle, Amount } = req.body;

    if (!CampaignTitle || !Amount)
      return res.status(400).json({ msg: "CampaignTitle and Amount required" });

    if (Amount <= 0)
      return res.status(400).json({ msg: "Amount must be greater than 0" });

    if (req.role === "Admin")
      return res.status(403).json({ msg: "Admins are not allowed to donate" });

    const campaignData = await Campaign.findOne({ Title: CampaignTitle });
    if (!campaignData)
      return res.status(404).json({ msg: "Campaign not found" });

    const currentRaised = campaignData.Raised || 0;
    const newRaised = currentRaised + Number(Amount);

    if (campaignData.Goal && campaignData.Goal > 0 && newRaised > campaignData.Goal) {
      const remaining = campaignData.Goal - currentRaised;
      return res.status(400).json({ msg: `Donation exceeds goal. Only Rs.${remaining} is needed.` });
    }

    await Donation.create({ Donar: req.name, CampaignTitle, Amount: Number(Amount) });

    const updatedCampaign = await Campaign.findOneAndUpdate(
      { Title: CampaignTitle },
      { $inc: { Raised: Number(Amount) } },
      { new: true }
    );

    if (updatedCampaign.Goal && updatedCampaign.Raised >= updatedCampaign.Goal) {
      return res.status(201).json({
        msg: "Donation successful! Campaign goal fully achieved!",
        Raised: updatedCampaign.Raised,
      });
    }

    res.status(201).json({
      msg: "Donation successful",
      Raised: updatedCampaign.Raised,
      Remaining: updatedCampaign.Goal - updatedCampaign.Raised,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// GET /user/my (protected) --- user's own donations
user.get("/my", authenticate, async (req, res) => {
  try {
    const data = await Donation.find({ Donar: req.name });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});