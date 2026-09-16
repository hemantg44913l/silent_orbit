import { textileService } from '../services/textileService.js';

export const textileController = {
  submitTextile: async (req, res, next) => {
    try {
      const submission = await textileService.submitTextile(req.body);
      return res.status(201).json({
        success: true,
        message: 'Textile batch registered successfully in database.',
        data: submission
      });
    } catch (err) {
      next(err);
    }
  },

  getTextiles: async (req, res, next) => {
    try {
      const data = await textileService.getAllTextiles();
      return res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  },

  getTextileById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const textile = await textileService.getTextileById(id);
      if (!textile) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Textile submission with ID '${id}' was not found.`
          }
        });
      }
      return res.status(200).json({
        success: true,
        data: textile
      });
    } catch (err) {
      next(err);
    }
  }
};
