import mongoose from 'mongoose';

const disposalOptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  route: { type: String, required: true },
  hierarchyLevel: { type: Number },
  priority: { type: String },
  description: { type: String },
  suitableConditions: [{ type: String }],
  maxContaminationPercent: { type: Number },
  carbonImpact: { type: String },
  targetFacilities: [{ type: String }],
  recommendedActions: [{ type: String }]
}, {
  timestamps: true
});

export const DisposalOption = mongoose.model('DisposalOption', disposalOptionSchema);
