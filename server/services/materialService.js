import mongoose from 'mongoose';
import { Material } from '../models/Material.js';
import { materials as materialsData } from '../data/materials.js';

export const materialService = {
  getAllMaterials: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        return await Material.find().sort({ name: 1 }).lean();
      }
    } catch (err) {
      console.warn('[materialService] DB query failed, using local seed fallback:', err.message);
    }
    return materialsData;
  },

  getMaterialById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await Material.findOne({ $or: [{ id }, { name: new RegExp(`^${id}$`, 'i') }] }).lean();
        if (doc) return doc;
      }
    } catch (err) {
      // Fallback
    }
    return materialsData.find(m => m.id === id || m.name.toLowerCase() === id.toLowerCase()) || null;
  },

  createMaterial: async (data) => {
    const materialId = data.id || `mat_${data.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const materialData = {
      id: materialId,
      name: data.name,
      category: data.category || 'General Textile',
      fiberType: data.fiberType || 'Blended',
      recyclabilityClass: data.recyclabilityClass || 'Moderate',
      preferredProcess: data.preferredProcess || 'Mechanical Shredding',
      typicalValueGrade: data.typicalValueGrade || 'B',
      contaminationTolerance: data.contaminationTolerance || 'Medium',
      biodegradable: Boolean(data.biodegradable),
      description: data.description || ''
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const material = new Material(materialData);
        return await material.save();
      }
    } catch (err) {
      console.warn('[materialService] DB save failed:', err.message);
    }

    return materialData;
  }
};
