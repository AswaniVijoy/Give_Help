import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import { user } from "./routes/userroute.js";
import { campaign } from "./routes/campaignroute.js";
import { admin } from "./routes/adminroute.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/user", user);
app.use("/campaign", campaign);
app.use("/admin", admin);

app.listen(2000, () => {
  console.log("Server running on port 2000");
});