import { ContactMessage } from '../models/ContactMessage.js';
import mongoose from 'mongoose';

export const contactService = {
  createContactMessage: async (data) => {
    if (!data.message || typeof data.message !== 'string' || data.message.trim() === '') {
      const error = new Error('Message content is required');
      error.statusCode = 400;
      throw error;
    }

    const messageId = `msg-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

    if (mongoose.connection.readyState === 1) {
      const msg = new ContactMessage({
        id: messageId,
        name: data.name || 'Guest User',
        email: data.email || 'guest@texloop.org',
        phone: data.phone || '',
        subject: data.subject || 'General Inquiry',
        message: data.message,
        type: data.type || 'contact',
        status: 'new'
      });
      return await msg.save();
    }

    return { id: messageId, ...data, createdAt: new Date().toISOString() };
  }
};
