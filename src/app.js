import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js"; // relative to `src` or root depending on setup
import authRoutes from "./routes/auth.js";
import feedbackRoutes from "./routes/feedback.js";

dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', feedbackRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the feedback portal");
});

export default app;
