import { CollectionPoint } from '../models/CollectionPoint.js';
import { collectionPoints as rawCollectionPoints } from '../data/collectionPoints.js';
import mongoose from 'mongoose';

export const collectionPointService = {
  getAllCollectionPoints: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        const docs = await CollectionPoint.find({ status: 'active' }).lean();
        if (docs && docs.length > 0) return docs;
      }
    } catch (err) {
      console.warn('[collectionPointService] DB query failed, using seed data:', err.message);
    }
    return rawCollectionPoints;
  },

  getCollectionPointById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await CollectionPoint.findOne({ id }).lean();
        if (doc) return doc;
      }
    } catch (err) {
      // Fallback
    }
    return rawCollectionPoints.find(cp => cp.id === id) || null;
  }
};
