import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js"; 
import authRoutes from "./routes/auth.js";
import feedbackRoutes from "./routes/feedback.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api', feedbackRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the feedback portal");
});

export default app;
