import { reuseService } from '../services/reuseService.js';

export const reuseController = {
  getReuseOptions: async (req, res, next) => {
    try {
      const { material, condition } = req.query;
      const data = await reuseService.getAllReuseOptions({ material, condition });
      return res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  },

  getReuseOptionById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const option = await reuseService.getReuseOptionById(id);
      if (!option) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Reuse option with ID '${id}' was not found.`
          }
        });
      }
      return res.status(200).json({
        success: true,
        data: option
      });
    } catch (err) {
      next(err);
    }
  }
};
