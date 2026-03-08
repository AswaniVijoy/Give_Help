import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/usermodel.js";
import { Donation } from "../models/donationmodel.js";
import { Campaign } from "../models/campaignmodel.js";
import { authenticate } from "../middleware/auth.js";

export const user = express.Router();

// =============================
// SIGNUP
// =============================
user.post("/signup", async (req, res) => {
  try {
    const { UserName, Email, Password, UserRole, AdminSecret } = req.body;

    if (!UserName || !Email || !Password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

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
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// =============================
// LOGIN
// =============================
user.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const userData = await User.findOne({ Email });
    if (!userData) return res.status(404).json({ msg: "Email not registered" });

    const valid = await bcrypt.compare(Password, userData.Password);
    if (!valid) return res.status(401).json({ msg: "Invalid Password" });

    const token = jwt.sign(
      {
        Email: userData.Email,
        UserRole: userData.UserRole,
        UserName: userData.UserName,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: "Login successful",
      token,
      role: userData.UserRole,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

// =============================
// LOGOUT
// =============================
user.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ msg: "Logged out successfully" });
});

// =============================
// PROFILE
// =============================
user.get("/profile", authenticate, async (req, res) => {
  try {
    const userData = await User.findOne({ UserName: req.name }).select("-Password");
    if (!userData) return res.status(404).json({ msg: "User not found" });
    res.json(userData);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// =============================
// DONATE
// =============================
user.post("/donate", authenticate, async (req, res) => {
  try {
    const { CampaignTitle, Amount } = req.body;

    if (!CampaignTitle || !Amount) {
      return res.status(400).json({ msg: "CampaignTitle and Amount required" });
    }

    if (Amount <= 0) {
      return res.status(400).json({ msg: "Amount must be greater than 0" });
    }

    if (req.role === "Admin") {
      return res.status(403).json({ msg: "Admins are not allowed to donate" });
    }

    const campaignData = await Campaign.findOne({ Title: CampaignTitle });
    if (!campaignData) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    const currentRaised = campaignData.Raised || 0;
    const newRaised = currentRaised + Number(Amount);

    // ✅ FIXED: only check goal limit if Goal exists and is greater than 0
    if (campaignData.Goal && campaignData.Goal > 0 && newRaised > campaignData.Goal) {
      const remaining = campaignData.Goal - currentRaised;
      return res.status(400).json({
        msg: `Donation exceeds goal. Only Rs.${remaining} is needed.`,
      });
    }

    await Donation.create({
      Donar: req.name,
      CampaignTitle,
      Amount: Number(Amount),
    });

    const updatedCampaign = await Campaign.findOneAndUpdate(
      { Title: CampaignTitle },
      { $inc: { Raised: Number(Amount) } },
      { new: true }
    );

    if (updatedCampaign.Goal && updatedCampaign.Raised >= updatedCampaign.Goal) {
      return res.status(201).json({
        msg: "Donation successful! Campaign goal fully achieved!",
        Raised: updatedCampaign.Raised,
        Goal: updatedCampaign.Goal,
      });
    }

    res.status(201).json({
      msg: "Donation successful",
      Raised: updatedCampaign.Raised,
      Goal: updatedCampaign.Goal,
      Remaining: updatedCampaign.Goal - updatedCampaign.Raised,
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// =============================
// GET MY DONATIONS
// =============================
user.get("/my", authenticate, async (req, res) => {
  try {
    const data = await Donation.find({ Donar: req.name });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default user;