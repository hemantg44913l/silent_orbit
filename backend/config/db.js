import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI not configured in .env file.');
    mongoose.set('bufferCommands', false);
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      autoIndex: true
    });
    console.log(`====================================================`);
    console.log(` ✅ MongoDB Atlas Connected Successfully!`);
    console.log(` Host: ${conn.connection.host}`);
    console.log(` DB:   ${conn.connection.name}`);
    console.log(`====================================================`);
    return true;
  } catch (err) {
    console.error('❌ [MongoDB Connection Error]:', err.message);
    console.log('💡 Tip: Ensure IP address (0.0.0.0/0) is allowed in MongoDB Atlas Network Access.');
    mongoose.set('bufferCommands', false);
    return false;
  }
}
