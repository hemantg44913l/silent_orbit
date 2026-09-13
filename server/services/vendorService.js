import mongoose from 'mongoose';
import { Vendor } from '../models/Vendor.js';
import { vendors as vendorsData } from '../data/vendors.js';

export const vendorService = {
  getAllVendors: async (filters = {}) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const query = {};

        if (filters.material) {
          query.acceptedMaterials = { $regex: new RegExp(filters.material, 'i') };
        }

        if (filters.status) {
          query.status = new RegExp(`^${filters.status}$`, 'i');
        }

        if (filters.pickupAvailable !== undefined) {
          query.pickupAvailable = String(filters.pickupAvailable) === 'true';
        }

        if (filters.minCapacityKg) {
          const minCap = Number(filters.minCapacityKg);
          if (!isNaN(minCap)) {
            query.availableCapacityKg = { $gte: minCap };
          }
        }

        const docs = await Vendor.find(query).sort({ rating: -1 }).lean();
        if (docs && docs.length > 0) return docs;
      }
    } catch (err) {
      console.warn('[vendorService] DB query error, using local seed data:', err.message);
    }

    // Filter local seed data fallback
    let results = [...vendorsData];
    if (filters.material) {
      results = results.filter(v => 
        v.acceptedMaterials.some(m => m.toLowerCase().includes(filters.material.toLowerCase()))
      );
    }
    if (filters.status) {
      results = results.filter(v => v.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.pickupAvailable !== undefined) {
      const isPick = String(filters.pickupAvailable) === 'true';
      results = results.filter(v => v.pickupAvailable === isPick);
    }
    return results;
  },

  getVendorById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await Vendor.findOne({ id }).lean();
        if (doc) return doc;
      }
    } catch (err) {
      // Fallback
    }
    return vendorsData.find(v => v.id === id || v._id === id) || null;
  },

  createVendor: async (data) => {
    const vendorId = data.id || `v-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
    const vendorObj = {
      id: vendorId,
      name: data.name,
      location: data.location,
      latitude: Number(data.latitude) || 0,
      longitude: Number(data.longitude) || 0,
      acceptedMaterials: Array.isArray(data.acceptedMaterials) ? data.acceptedMaterials : [data.acceptedMaterials],
      minQuantityKg: Number(data.minQuantityKg) || 0,
      maxQuantityKg: Number(data.maxQuantityKg) || 10000,
      availableCapacityKg: Number(data.availableCapacityKg) || 1000,
      acceptedConditions: Array.isArray(data.acceptedConditions) ? data.acceptedConditions : ['Good condition'],
      contaminationLimit: Number(data.contaminationLimit) || 10.0,
      pickupAvailable: Boolean(data.pickupAvailable),
      accessibility: data.accessibility || 'Standard Loading Bay',
      processingType: data.processingType || 'Textile Sorting & Recycling',
      status: data.status || 'active',
      rating: Number(data.rating) || 4.5,
      notes: data.notes || ''
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const vendor = new Vendor(vendorObj);
        return await vendor.save();
      }
    } catch (err) {
      console.warn('[vendorService] DB save failed:', err.message);
    }

    return vendorObj;
  }
};
