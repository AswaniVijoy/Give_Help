import express from "express";
import { Campaign } from "../models/campaignmodel.js";
import { Donation } from "../models/donationmodel.js";
import upload from "../middleware/upload.js";
import sharp from "sharp";
import { authenticate, isAdmin } from "../middleware/auth.js";

export const admin = express.Router();

// Get all campaigns (Admin)
admin.get("/campaigns", authenticate, isAdmin, async (req, res) => {
  try {
    const data = await Campaign.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Create campaign (Admin)
admin.post("/campaign", authenticate, isAdmin, upload.single("Image"), async (req, res) => {
  try {
    const { Title, Category, Target, Status, Description, CreatedBy } = req.body;

    if (!Title || !Target) {
      return res.status(400).json({ msg: "Title and Target are required" });
    }

    if (Number(Target) <= 0) {
      return res.status(400).json({ msg: "Goal must be greater than 0" });
    }

    const existing = await Campaign.findOne({ Title });
    if (existing) return res.status(400).json({ msg: "Campaign already exists" });

    let imageBase64 = null;
    if (req.file) {
      const compressedImage = await sharp(req.file.buffer)
        .resize({ width: 500 })
        .jpeg({ quality: 70 })
        .toBuffer();
      imageBase64 = compressedImage.toString("base64");
    }

    await Campaign.create({
      Title,
      Category,
      Goal: Number(Target),   // ✅ FIXED: was Target, must be Goal
      Status: Status || "Active",
      Description: Description || "",
      Image: imageBase64,
      CreatedBy: CreatedBy || req.name,
      Raised: 0,              // ✅ always start at 0
    });

    res.status(201).json({ msg: "Campaign created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update campaign (Admin)
admin.put("/campaign/:id", authenticate, isAdmin, upload.single("Image"), async (req, res) => {
  try {
    const { Title, Category, Target, Status, Description } = req.body;

    const updateData = {
      Title,
      Category,
      Goal: Number(Target),   // ✅ correct
      Status,
      Description,
    };

    if (req.file) {
      const compressedImage = await sharp(req.file.buffer)
        .resize({ width: 500 })
        .jpeg({ quality: 70 })
        .toBuffer();
      updateData.Image = compressedImage.toString("base64");
    }

    await Campaign.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json({ msg: "Campaign updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete campaign (Admin)
admin.delete("/campaign/:id", authenticate, isAdmin, async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ msg: "Campaign deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// View all donations (Admin)
admin.get("/donations", authenticate, isAdmin, async (req, res) => {
  try {
    const data = await Donation.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Dashboard stats (Admin)
admin.get("/dashboard", authenticate, isAdmin, async (req, res) => {
  try {
    const campaignCount = await Campaign.countDocuments();
    const donationCount = await Donation.countDocuments();
    const totalRaised = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$Amount" } } }
    ]);

    res.status(200).json({
      Campaigns: campaignCount,
      Donations: donationCount,
      TotalRaised: totalRaised[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});