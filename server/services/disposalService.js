import mongoose from 'mongoose';
import { DisposalOption } from '../models/DisposalOption.js';
import { disposalOptions as rawDisposalOptions } from '../data/disposal.js';

export const disposalService = {
  getAllDisposalOptions: async (filters = {}) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const query = {};

        if (filters.condition) {
          query.suitableConditions = { $regex: new RegExp(filters.condition, 'i') };
        }

        if (filters.contaminationPercent !== undefined) {
          const contam = Number(filters.contaminationPercent);
          if (!isNaN(contam)) {
            query.maxContaminationPercent = { $gte: contam };
          }
        }

        const docs = await DisposalOption.find(query).sort({ hierarchyLevel: 1 }).lean();
        if (docs && docs.length > 0) return docs;
      }
    } catch (err) {
      console.warn('[disposalService] DB query error, using seed data:', err.message);
    }
    return rawDisposalOptions;
  },

  getDisposalOptionById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await DisposalOption.findOne({ id }).lean();
        if (doc) return doc;
      }
    } catch (err) {
      // Fallback
    }
    return rawDisposalOptions.find(d => d.id === id) || null;
  },

  createDisposalOption: async (data) => {
    const optionId = data.id || `disp-${Date.now().toString(36)}`;
    const optionObj = {
      id: optionId,
      route: data.route,
      hierarchyLevel: Number(data.hierarchyLevel) || 1,
      priority: data.priority || 'High',
      description: data.description || '',
      suitableConditions: Array.isArray(data.suitableConditions) ? data.suitableConditions : [],
      maxContaminationPercent: Number(data.maxContaminationPercent) || 10,
      carbonImpact: data.carbonImpact || '',
      targetFacilities: Array.isArray(data.targetFacilities) ? data.targetFacilities : [],
      recommendedActions: Array.isArray(data.recommendedActions) ? data.recommendedActions : []
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const option = new DisposalOption(optionObj);
        return await option.save();
      }
    } catch (err) {
      console.warn('[disposalService] DB save failed:', err.message);
    }
    return optionObj;
  }
};
