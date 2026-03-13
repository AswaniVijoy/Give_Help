import { Schema, model } from "mongoose";

const campaignSchema = new Schema({
  Title:       { type: String, required: true },
  Description: String,
  Category:    String,
  Goal:        { type: Number, default: 0 },
  Raised:      { type: Number, default: 0 },
  Image:       String,
  Status:      { type: String, enum: ["Active", "Closed"], default: "Active" },
  CreatedBy:   String,
  CreatedAt:   { type: Date, default: Date.now },
});

export const Campaign = model("Campaign", campaignSchema);
