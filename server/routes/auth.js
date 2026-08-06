import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';          // <-- .js extension required
import authMiddleware from '../middleware/authMiddleware.js'; // <-- .js extension required

const router = express.Router();

// ===================== REGISTER =====================
router.post('/register', async (req, res) => {
  try {
    console.log('📩 Register request body:', req.body);

    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user – password will be hashed automatically (see User model pre-save hook)
    const user = new User({ name, email, password });
    await user.save();

    // Send back success
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('❌ REGISTER ERROR:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      stack: error.stack // optional – helps debugging
    });
  }
});

// ===================== LOGIN =====================
router.post('/login', async (req, res) => {
  try {
    console.log('📩 Login request body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// ===================== PROTECTED ROUTE (GET /me) =====================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('❌ /me ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;