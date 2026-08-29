import express from 'express';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/users/:username/profile – public profile (no auth)
router.get('/:username/profile', async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username })
      .select('name username bio createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const trips = await Trip.find({ user: user._id })
      .select('title destination startDate endDate rating coverImage photos description')
      .sort({ createdAt: -1 });
    
    res.json({
      user,
      trips,
    });
  } catch (error) {
    console.error('Public profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/profile – update logged-in user's bio
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { bio, username } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }
    
    if (bio !== undefined) {
      user.bio = bio;
    }
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;