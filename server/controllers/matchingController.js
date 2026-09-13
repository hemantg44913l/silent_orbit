import { matchingService } from '../services/matchingService.js';

export const matchingController = {
  matchTextile: async (req, res, next) => {
    try {
      const matchResult = await matchingService.matchVendorsForTextile(req.body || {});
      return res.status(200).json({
        success: true,
        data: matchResult
      });
    } catch (err) {
      next(err);
    }
  }
};
