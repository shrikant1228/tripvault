import express from 'express';
import Trip from '../models/Trip.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// ========== CREATE TRIP ==========
router.post('/', async (req, res) => {
  try {
    const { title, destination, startDate, endDate, description, rating } = req.body;
    const trip = new Trip({
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
      user: req.user.userId // from authMiddleware
    });
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    console.error('❌ Create trip error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== GET ALL TRIPS FOR LOGGED-IN USER ==========
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error('❌ Get trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== GET SINGLE TRIP (OWNERSHIP CHECK) ==========
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(trip);
  } catch (error) {
    console.error('❌ Get trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== UPDATE TRIP (OWNERSHIP CHECK) ==========
router.put('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, destination, startDate, endDate, description, rating } = req.body;
    trip.title = title || trip.title;
    trip.destination = destination || trip.destination;
    trip.startDate = startDate || trip.startDate;
    trip.endDate = endDate || trip.endDate;
    trip.description = description || trip.description;
    trip.rating = rating || trip.rating;

    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error('❌ Update trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== DELETE TRIP (OWNERSHIP CHECK) ==========
router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await trip.deleteOne();
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('❌ Delete trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;