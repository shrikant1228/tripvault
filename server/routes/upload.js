import express from 'express';
import Trip from '../models/Trip.js';
import upload from '../middleware/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/trips/:id/upload – Upload a photo and attach to trip
router.post('/:id/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Check ownership
    if (trip.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // If no file uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    // Get Cloudinary URL from multer
    const imageUrl = req.file.path;
    
    // If this is the first photo, set as coverImage
    if (!trip.coverImage) {
      trip.coverImage = imageUrl;
    }
    
    // Add to photos array
    trip.photos.push(imageUrl);
    await trip.save();
    
    res.json({
      message: 'Photo uploaded successfully',
      trip,
      imageUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;