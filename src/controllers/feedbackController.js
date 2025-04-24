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

  } catch (err) {
    res.status(500).json({ message: 'Server error' ,err});
  }
};

// Get all Feedback (for admin)
export const getAllFeedback = async (req, res) => {
console.log('✌️getAllFeedback --->');
console.log('✌️req --->', req.user);
  try {
    // Check if user is authenticated and has admin privileges
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Fetch all feedback entries and populate the user's email
    const feedback = await Feedback.find().populate('user', 'email');

    // Respond with all feedback
    res.status(200).json(feedback);
  } catch (err) {
    console.error('Error fetching feedback:', err.message);
    res.status(500).json({ message: 'Server error while fetching feedback.' });
  }
};

export const replyToFeedback = async (req, res) => {
  const { feedbackId, replyText } = req.body;

  try {
    // Ensure the user is an admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Find the feedback to reply to
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    // Create a new reply
    const newReply = {
      admin: req.user._id, // Admin replying
      reply: replyText, // Reply text
      created_at: new Date(), // Timestamp of the reply
    };

    // Push the reply to the feedback's replies array
    feedback.replies.push(newReply);
    await feedback.save();

    res.status(200).json({ message: 'Reply added successfully.', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error while replying to feedback.' });
  }
};
