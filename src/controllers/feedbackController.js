
import Feedback from '../models/Feedback.js';
// Create Feedback (for clients)
export const createFeedback = async (req, res) => {
  const { rating, text } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const feedback = new Feedback({ user: req.user.id, rating, text, image });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all Feedback (for admin)
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('user', 'email');
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
