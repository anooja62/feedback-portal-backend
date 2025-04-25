
import jwt from "jsonwebtoken";
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
// Register User
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
     // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
 // Create new user instance
    const user = new User({ email, password });
    // Save user to database
    await user.save();
// Respond with success message
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
     // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
};



// Controller function to handle user login
export const loginUser = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  try {
    // Find the user in the database by their email
    const user = await User.findOne({ email });
    // If user is not found, return a 400 status with an error message
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await user.matchPassword(password);
    // If passwords do not match, return a 400 status with an error message
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // If user is found and password matches, generate a JSON Web Token (JWT)
    // The token payload includes user ID and role, signed with a secret key and set to expire in 1 hour
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send a successful response with the generated token and basic user information
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    // If any error occurs during the process, return a 500 status with a server error message
    res.status(500).json({ message: 'Server error' });
  }
};

