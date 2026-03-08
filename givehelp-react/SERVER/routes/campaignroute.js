import express from "express";
import { Campaign } from "../models/campaignmodel.js";
import sharp from "sharp";

export const campaign = express.Router();

// Get all active campaigns (Public)
campaign.get("/", async (req, res) => {
  try {
    const data = await Campaign.find({ Status: "Active" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get featured campaigns — top 6 most funded active campaigns (Public)
campaign.get("/featured", async (req, res) => {
  try {
    const data = await Campaign.find({ Status: "Active" })
      .sort({ Raised: -1 })   // highest Raised first
      .limit(6);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get campaigns by category (Public)
campaign.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const data = await Campaign.find({
      Category: category,
      Status: "Active",
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get image by title (Public)
campaign.get("/image/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const data = await Campaign.findOne({ Title: title });

    if (!data || !data.Image) {
      return res.status(404).json({ msg: "Image not found" });
    }

    const imageBuffer = Buffer.from(data.Image, "base64");
    const compressedImage = await sharp(imageBuffer)
      .resize({ width: 400 })
      .jpeg({ quality: 70 })
      .toBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(compressedImage);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get single campaign by ID (Public)
// ✅ IMPORTANT: /:id must always be LAST — otherwise it catches /image and /category
campaign.get("/:id", async (req, res) => {
  try {
    const data = await Campaign.findById(req.params.id);
    if (!data) return res.status(404).json({ msg: "Campaign not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});