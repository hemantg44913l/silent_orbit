import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  acceptedMaterials: [{ type: String }],
  minQuantityKg: { type: Number, default: 0 },
  maxQuantityKg: { type: Number, default: 10000 },
  availableCapacityKg: { type: Number, required: true },
  acceptedConditions: [{ type: String }],
  contaminationLimit: { type: Number, default: 10.0 },
  pickupAvailable: { type: Boolean, default: true },
  accessibility: { type: String },
  processingType: { type: String },
  status: { type: String, default: 'active' },
  rating: { type: Number, default: 4.5 },
  notes: { type: String }
}, {
  timestamps: true
});

export const Vendor = mongoose.model('Vendor', vendorSchema);
