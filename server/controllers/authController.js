import { authService } from '../services/authService.js';

export const authController = {
  register: async (req, res, next) => {
    try {
      const result = await authService.register(req.body || {});
      return res.status(201).json({
        success: true,
        message: 'Account registered successfully in MongoDB.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authService.login(req.body || {});
      return res.status(200).json({
        success: true,
        message: 'Authenticated successfully with MongoDB credentials.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  getMe: async (req, res, next) => {
    try {
      const emailOrId = req.query.email || req.query.id;
      if (!emailOrId) {
        return res.status(400).json({
          success: false,
          error: { code: 'MISSING_PARAM', message: 'Email or ID is required' }
        });
      }
      const user = await authService.getProfile(emailOrId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: { code: 'USER_NOT_FOUND', message: 'User not found in MongoDB database.' }
        });
      }
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  }
};
