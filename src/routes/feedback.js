import express from "express";
import multer from "multer";
import { createFeedback, getAllFeedback,replyToFeedback,suggestReplies } from "../controllers/feedbackController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from '../utils/multerConfig.js';
import { adminMiddleware } from "../middleware/adminMiddleware.js";
const router = express.Router();

router.post('/feedback', authMiddleware, upload.single('image'), createFeedback); 
router.get('/all-feedback', authMiddleware,adminMiddleware, getAllFeedback); 
router.post('/reply', authMiddleware, adminMiddleware, replyToFeedback);
router.post('/suggest-replies', authMiddleware,adminMiddleware, suggestReplies);


export default router;
