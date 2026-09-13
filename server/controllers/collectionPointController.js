import { collectionPointService } from '../services/collectionPointService.js';

export const collectionPointController = {
  getCollectionPoints: async (req, res, next) => {
    try {
      const data = await collectionPointService.getAllCollectionPoints();
      return res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  },

  getCollectionPointById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const cp = await collectionPointService.getCollectionPointById(id);
      if (!cp) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Collection point '${id}' was not found.`
          }
        });
      }
      return res.status(200).json({
        success: true,
        data: cp
      });
    } catch (err) {
      next(err);
    }
  }
};
