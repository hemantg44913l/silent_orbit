import mongoose from 'mongoose';

const reuseOptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  suitableMaterials: [{ type: String }],
  suitableConditions: [{ type: String }],
  difficulty: { type: String },
  requiredTools: [{ type: String }],
  carbonSavingsRating: { type: String },
  estimatedTimeMinutes: { type: Number },
  category: { type: String },
  image: { type: String }
}, {
  timestamps: true
});

export const ReuseOption = mongoose.model('ReuseOption', reuseOptionSchema);
