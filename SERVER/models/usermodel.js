// usermodel.js — from theme.docx Sample1.js schema pattern
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  UserName: { type: String, required: true },
  Email:    { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  UserRole: { type: String, enum: ["Admin", "User"], default: "User" },
});

export const User = model("User", userSchema);
