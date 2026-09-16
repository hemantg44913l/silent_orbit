import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { connectDB } from './config/db.js';
import { seedDatabaseIfEmpty } from './services/seedService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Global Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Basic Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// API Routes
app.use('/api', apiRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'RESOURCE_NOT_FOUND',
      message: `The requested endpoint '${req.originalUrl}' does not exist on this server.`
    }
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[API Server Error]:', err);

  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
  const response = {
    success: false,
    error: {
      code: err.code || (statusCode === 400 ? 'INVALID_REQUEST' : 'INTERNAL_SERVER_ERROR'),
      message: err.message || 'An unexpected error occurred processing your request.',
      details: err.details || null
    }
  };

  res.status(statusCode).json(response);
});

// Start Server & Keep Process Active
const server = app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(` TexLoop / ReTextile Backend Server`);
  console.log(` Port:     http://localhost:${PORT}`);
  console.log(` API:      http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);

  const isConnected = await connectDB();
  if (isConnected) {
    await seedDatabaseIfEmpty();
  } else {
    console.log('ℹ️  Operating in graceful local fallback data mode.');
  }
});

// Keep event loop active
setInterval(() => {}, 60000);

// Graceful termination
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
