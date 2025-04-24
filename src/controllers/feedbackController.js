import Feedback from '../models/Feedback.js';
import User from '../models/User.js'; // Make sure this import exists to check user roles

// Create Feedback (for clients)
export const createFeedback = async (req, res) => {
  const { rating, text } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
console.log('✌️image --->', image);


  try {
    if (!req.user || req.user.role !== 'client') {

      return res.status(403).json({ message: 'Only clients can submit feedback.' });
    }

    const feedback = new Feedback({
      user: req.user._id,  
      rating,
      text,
      image,
    });

    await feedback.save();
    res.status(201).json(feedback);
console.log('✌️feedback --->', feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error' ,err});
  }
};

// Get all Feedback (for admin)
export const getAllFeedback = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view all feedback.' });
    }

    const feedback = await Feedback.find().populate('user', 'email');
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
