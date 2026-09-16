import { disposalService } from '../services/disposalService.js';

export const disposalController = {
  getDisposalOptions: async (req, res, next) => {
    try {
      const { condition, contaminationPercent } = req.query;
      const data = await disposalService.getAllDisposalOptions({ condition, contaminationPercent });
      return res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  },

  getDisposalOptionById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const option = await disposalService.getDisposalOptionById(id);
      if (!option) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Disposal option with ID '${id}' was not found.`
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
