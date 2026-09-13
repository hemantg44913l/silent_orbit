import { contactService } from '../services/contactService.js';

export const contactController = {
  submitContact: async (req, res, next) => {
    try {
      const msg = await contactService.createContactMessage({
        ...req.body,
        type: 'contact'
      });
      return res.status(201).json({
        success: true,
        message: 'Your inquiry has been submitted to the logistics team.',
        data: msg
      });
    } catch (err) {
      next(err);
    }
  },

  submitFeedback: async (req, res, next) => {
    try {
      const msg = await contactService.createContactMessage({
        ...req.body,
        type: 'feedback'
      });
      return res.status(201).json({
        success: true,
        message: 'Thank you for your feedback! It has been received.',
        data: msg
      });
    } catch (err) {
      next(err);
    }
  }
};
