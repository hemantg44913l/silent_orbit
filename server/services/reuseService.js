import mongoose from 'mongoose';
import { ReuseOption } from '../models/ReuseOption.js';
import { reuseOptions as rawReuseOptions } from '../data/reuse.js';

export const reuseService = {
  getAllReuseOptions: async (filters = {}) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const query = {};

        if (filters.material) {
          query.suitableMaterials = { $regex: new RegExp(filters.material, 'i') };
        }

        if (filters.condition) {
          query.suitableConditions = { $regex: new RegExp(filters.condition, 'i') };
        }

        const docs = await ReuseOption.find(query).sort({ title: 1 }).lean();
        if (docs && docs.length > 0) return docs;
      }
    } catch (err) {
      console.warn('[reuseService] DB query error, using seed data:', err.message);
    }
    return rawReuseOptions;
  },

  getReuseOptionById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await ReuseOption.findOne({ id }).lean();
        if (doc) return doc;
      }
    } catch (err) {
      // Fallback
    }
    return rawReuseOptions.find(r => r.id === id) || null;
  },

  createReuseOption: async (data) => {
    const optionId = data.id || `reuse-${Date.now().toString(36)}`;
    const optionObj = {
      id: optionId,
      title: data.title,
      description: data.description,
      suitableMaterials: Array.isArray(data.suitableMaterials) ? data.suitableMaterials : [data.suitableMaterials],
      suitableConditions: Array.isArray(data.suitableConditions) ? data.suitableConditions : ['Good condition'],
      difficulty: data.difficulty || 'Easy',
      requiredTools: Array.isArray(data.requiredTools) ? data.requiredTools : [],
      carbonSavingsRating: data.carbonSavingsRating || 'High',
      estimatedTimeMinutes: Number(data.estimatedTimeMinutes) || 30,
      category: data.category || 'Upcycling',
      image: data.image || null
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const option = new ReuseOption(optionObj);
        return await option.save();
      }
    } catch (err) {
      console.warn('[reuseService] DB save failed:', err.message);
    }
    return optionObj;
  }
};
