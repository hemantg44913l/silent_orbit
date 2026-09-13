import mongoose from 'mongoose';

const collectionPointSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  acceptedMaterials: [{ type: String }],
  capacityPercent: { type: Number, default: 50 },
  status: { type: String, default: 'active' },
  operatingHours: { type: String, default: 'Mon - Sat (8:00 AM - 7:00 PM)' },
  accessInfo: { type: String, default: 'Public Access Bay' },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

export const CollectionPoint = mongoose.model('CollectionPoint', collectionPointSchema);
