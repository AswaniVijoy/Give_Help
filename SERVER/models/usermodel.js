// usermodel.js
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  UserName:       { type: String, required: true },
  Email:          { type: String, required: true, unique: true },
  Password:       { type: String, required: true },
  UserRole:       { type: String, enum: ["Admin", "User"], default: "User" },
  ProfilePicture: { type: String, default: null },  // base64 JPEG stored in DB
});

export const User = model("User", userSchema);