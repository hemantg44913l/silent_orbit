import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  type: { type: String, enum: ['contact', 'feedback'], default: 'contact' },
  status: { type: String, default: 'new' },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
