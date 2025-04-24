import express from "express";
import multer from "multer";
import { createFeedback, getAllFeedback } from "../controllers/feedbackController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from '../utils/multerConfig.js';

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

router.post('/feedback', authMiddleware, upload.single('image'), createFeedback); // Only clients can post feedback
router.get('/feedback', authMiddleware, getAllFeedback); // Admin can view all feedback

export default router;
