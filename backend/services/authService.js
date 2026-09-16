import mongoose from 'mongoose';
import { User } from '../models/User.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

function validateAuthInputs(email, password) {
  if (!email || !EMAIL_REGEX.test(email.trim())) {
    const err = new Error('Please enter a valid email address (e.g. user@gmail.com).');
    err.statusCode = 400;
    throw err;
  }
  if (!password || !PASSWORD_REGEX.test(password)) {
    const err = new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).');
    err.statusCode = 400;
    throw err;
  }
}

// Memory fallback store for users if DB is offline
const memoryUsers = [];

export const authService = {
  register: async (userData) => {
    const { name, email, password, role = 'user', companyName = '', phone = '' } = userData;

    validateAuthInputs(email, password);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name ? name.trim() : cleanEmail.split('@')[0];

    // Check if user exists in MongoDB
    try {
      if (mongoose.connection.readyState === 1) {
        const existing = await User.findOne({ email: cleanEmail }).lean();
        if (existing) {
          const err = new Error('An account with this email address already exists.');
          err.statusCode = 400;
          throw err;
        }
      }
    } catch (err) {
      if (err.statusCode === 400) throw err;
      console.warn('[authService] DB lookup error:', err.message);
    }

    // Check memory store
    const memExist = memoryUsers.find(u => u.email === cleanEmail);
    if (memExist) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 400;
      throw err;
    }

    const userObj = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: cleanName,
      email: cleanEmail,
      password: password,
      role,
      companyName,
      phone,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const newUser = new User(userObj);
        const saved = await newUser.save();
        const userToReturn = saved.toObject();
        delete userToReturn.password;
        memoryUsers.push(userToReturn);
        return {
          user: userToReturn,
          token: `token_${Date.now()}_${userToReturn._id}`
        };
      }
    } catch (err) {
      console.warn('[authService] DB save failed, storing in memory:', err.message);
    }

    const userToReturn = { ...userObj };
    delete userToReturn.password;
    memoryUsers.push(userToReturn);

    return {
      user: userToReturn,
      token: `token_${Date.now()}_${userToReturn._id}`
    };
  },

  login: async ({ email, password }) => {
    validateAuthInputs(email, password);

    const cleanEmail = email.trim().toLowerCase();

    // Query MongoDB
    try {
      if (mongoose.connection.readyState === 1) {
        const userDoc = await User.findOne({ email: cleanEmail }).lean();
        if (userDoc) {
          if (userDoc.password !== password) {
            const err = new Error('Invalid email or password.');
            err.statusCode = 401;
            throw err;
          }
          const userToReturn = { ...userDoc };
          delete userToReturn.password;
          return {
            user: userToReturn,
            token: `token_${Date.now()}_${userToReturn._id}`
          };
        }
      }
    } catch (err) {
      if (err.statusCode === 401 || err.statusCode === 400) throw err;
      console.warn('[authService] DB query failed:', err.message);
    }

    // Check memory store
    const memUser = memoryUsers.find(u => u.email === cleanEmail);
    if (memUser) {
      if (memUser.password && memUser.password !== password) {
        const err = new Error('Invalid email or password.');
        err.statusCode = 401;
        throw err;
      }
      const userToReturn = { ...memUser };
      delete userToReturn.password;
      return {
        user: userToReturn,
        token: `token_${Date.now()}_${userToReturn._id}`
      };
    }

    // If not found in DB or memory, register as new user
    return authService.register({ name: cleanEmail.split('@')[0], email: cleanEmail, password, role: 'user' });
  },

  getProfile: async (emailOrId) => {
    if (!emailOrId) return null;
    const cleanStr = emailOrId.trim().toLowerCase();

    try {
      if (mongoose.connection.readyState === 1) {
        const userDoc = await User.findOne({
          $or: [
            { email: cleanStr },
            { _id: mongoose.isValidObjectId(cleanStr) ? cleanStr : null }
          ]
        }).lean();
        if (userDoc) {
          delete userDoc.password;
          return userDoc;
        }
      }
    } catch (err) {
      // Fallback
    }

    const memUser = memoryUsers.find(u => u.email === cleanStr || u._id === cleanStr);
    if (memUser) {
      const userToReturn = { ...memUser };
      delete userToReturn.password;
      return userToReturn;
    }

    return null;
  }
};
