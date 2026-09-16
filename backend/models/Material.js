import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  fiberType: { type: String },
  recyclabilityClass: { type: String },
  preferredProcess: { type: String },
  typicalValueGrade: { type: String },
  contaminationTolerance: { type: String },
  biodegradable: { type: Boolean, default: false },
  description: { type: String }
}, {
  timestamps: true
});

export const Material = mongoose.model('Material', materialSchema);
