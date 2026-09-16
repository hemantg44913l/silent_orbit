import mongoose from 'mongoose';
import { Textile } from '../models/Textile.js';
import { validateTextileSubmission } from '../utils/validator.js';

const memoryTextiles = [];

export const textileService = {
  submitTextile: async (data) => {
    const validation = validateTextileSubmission(data);
    if (!validation.isValid) {
      const error = new Error('Textile submission validation failed');
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    const textileObj = {
      _id: new mongoose.Types.ObjectId().toString(),
      id: `sub-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      image: data.image || null,
      selectedPath: data.selectedPath || 'sell',
      material: data.material || 'Cotton',
      weightKg: Number(data.weightKg) || 0,
      condition: data.condition || 'Good condition',
      contaminationLevel: data.contaminationLevel || 'Low (0-5%)',
      location: data.location || 'Austin, TX',
      latitude: data.latitude !== undefined ? Number(data.latitude) : 30.2672,
      longitude: data.longitude !== undefined ? Number(data.longitude) : -97.7431,
      notes: data.notes || '',
      createdAt: new Date()
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const newTextile = new Textile(textileObj);
        const saved = await newTextile.save();
        memoryTextiles.unshift(saved.toObject());
        return saved.toObject();
      }
    } catch (err) {
      console.warn('[textileService] DB save failed, storing in memory:', err.message);
    }

    memoryTextiles.unshift(textileObj);
    return textileObj;
  },

  getAllTextiles: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        return await Textile.find().sort({ createdAt: -1 }).lean();
      }
    } catch (err) {
      // Fallback
    }
    return memoryTextiles;
  },

  getTextileById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await Textile.findOne({ id }).lean();
        if (doc) return doc;
      }
    } catch (err) {
      // Fallback
    }
    return memoryTextiles.find(t => t.id === id || t._id === id) || null;
  }
};
