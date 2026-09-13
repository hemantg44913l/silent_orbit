import { vendorService } from '../services/vendorService.js';

export const vendorController = {
  getVendors: async (req, res, next) => {
    try {
      const { material, status, pickupAvailable, minCapacityKg } = req.query;
      const data = await vendorService.getAllVendors({
        material,
        status,
        pickupAvailable,
        minCapacityKg
      });
      return res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  },

  getVendorById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const vendor = await vendorService.getVendorById(id);
      if (!vendor) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Vendor with ID '${id}' was not found.`
          }
        });
      }
      return res.status(200).json({
        success: true,
        data: vendor
      });
    } catch (err) {
      next(err);
    }
  },

  createVendor: async (req, res, next) => {
    try {
      const created = await vendorService.createVendor(req.body);
      return res.status(201).json({
        success: true,
        message: 'Vendor registered successfully in MongoDB.',
        data: created
      });
    } catch (err) {
      next(err);
    }
  }
};
