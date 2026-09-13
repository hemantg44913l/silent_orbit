import mongoose from 'mongoose';

const textileSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  image: { type: String, default: null },
  selectedPath: { type: String, default: 'sell' },
  material: { type: String, required: true },
  weightKg: { type: Number, required: true },
  condition: { type: String, default: 'Good condition' },
  contaminationLevel: { type: String, default: 'Low (0-5%)' },
  location: { type: String, default: 'Austin, TX' },
  latitude: { type: Number, default: 30.2672 },
  longitude: { type: Number, default: -97.7431 },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Textile = mongoose.model('Textile', textileSchema);
