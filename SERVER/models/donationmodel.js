import { Schema, model } from "mongoose";

const donationSchema = new Schema({
  Donar:         String,
  CampaignTitle: String,
  Amount:        Number,
  Date:          { type: Date, default: Date.now },
});

export const Donation = model("Donation", donationSchema);
