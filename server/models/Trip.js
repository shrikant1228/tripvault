import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  coverImage: { type: String }, // Single cover image URL
  photos: { type: [String], default: [] }, // Array of image URLs
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);