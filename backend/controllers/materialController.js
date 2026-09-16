import { materialService } from '../services/materialService.js';

export const materialController = {
  getMaterials: async (req, res, next) => {
    try {
      const data = await materialService.getAllMaterials();
      return res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  },

  getMaterialById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const material = await materialService.getMaterialById(id);
      if (!material) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Material with ID or name '${id}' was not found.`
          }
        });
      }
      return res.status(200).json({
        success: true,
        data: material
      });
    } catch (err) {
      next(err);
    }
  },

  createMaterial: async (req, res, next) => {
    try {
      const created = await materialService.createMaterial(req.body);
      return res.status(201).json({
        success: true,
        message: 'Material registered successfully in MongoDB.',
        data: created
      });
    } catch (err) {
      next(err);
    }
  }
};
