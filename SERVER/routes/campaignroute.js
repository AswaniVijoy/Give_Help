import { Router } from "express";
import { Campaign } from "../models/campaignmodel.js";
import sharp from "sharp";

export const campaign = Router();

// GET /campaign/featured — top 6 most funded (MUST be before /:id)
campaign.get("/featured", async (req, res) => {
  try {
    const data = await Campaign.find({ Status: "Active" }).sort({ Raised: -1 }).limit(6);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /campaign/category/:category
campaign.get("/category/:category", async (req, res) => {
  try {
    const data = await Campaign.find({ Category: req.params.category, Status: "Active" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /campaign/image/:title — serves compressed JPEG from base64 (theme upload pattern)
campaign.get("/image/:title", async (req, res) => {
  try {
    const data = await Campaign.findOne({ Title: req.params.title });
    if (!data || !data.Image) return res.status(404).json({ msg: "Image not found" });

    const imageBuffer = Buffer.from(data.Image, "base64");
    const compressed = await sharp(imageBuffer).resize({ width: 400 }).jpeg({ quality: 70 }).toBuffer();
    res.set("Content-Type", "image/jpeg");
    res.send(compressed);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /campaign — all active campaigns
campaign.get("/", async (req, res) => {
  try {
    const data = await Campaign.find({ Status: "Active" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /campaign/:id — single campaign (MUST be last)
campaign.get("/:id", async (req, res) => {
  try {
    const data = await Campaign.findById(req.params.id);
    if (!data) return res.status(404).json({ msg: "Campaign not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
