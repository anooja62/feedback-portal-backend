import Feedback from '../models/Feedback.js';
import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();
// Create Feedback (for clients)
export const createFeedback = async (req, res) => {
  const { rating, text } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;



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




export const suggestReplies = async (req, res) => {
  const { feedbackText } = req.body;

  // Validate that feedback text is provided
  if (!feedbackText) {
    return res.status(400).json({ error: 'Feedback text is required' });
  }

  try {
    // Set the OpenAI API URL for chat completions
    // Using gpt-3.5-turbo as an example model
    const url = 'https://api.openai.com/v1/chat/completions';

    // Set the OpenAI API token in the Authorization header
    const headers = {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json', // OpenAI API requires Content-Type
    };

    // Prepare the request body for the OpenAI Chat Completions API
    // We structure the input as a 'messages' array, typical for chat models
    const requestBody = {
      model: 'gpt-3.5-turbo', // Specify the OpenAI model to use
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that suggests polite and constructive replies to customer feedback. Provide a few distinct suggestions.',
        },
        {
          role: 'user',
          content: `Suggest replies for the following feedback: "${feedbackText}"`,
        },
      ],
      max_tokens: 150, // Limit the length of the generated response
      temperature: 0.7, // Control the creativity/randomness of the output
    };

    // Send the request to the OpenAI API
    const response = await axios.post(
      url,
      requestBody, // Use the structured request body
      { headers }
    );

    // Extract the generated suggestions from the OpenAI response
    // The response structure for chat completions is different from Hugging Face
    // We expect the main content in response.data.choices[0].message.content
    const suggestions = response.data.choices[0]?.message?.content.trim();
console.log('✌️suggestions --->', suggestions);
    res.json({ suggestions }); // Send the extracted suggestions back to the client
    


  } catch (error) {
    // Log the detailed error for debugging
    console.error('Error generating suggestions from OpenAI:', error.response?.data || error.message);

    // Respond with a 500 status and a generic error message
    res.status(500).json({ error: 'Failed to generate suggestions using OpenAI' });
  }
};

