/**
 * Express Server
 * Main entry point for Address Management API
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB, disconnectDB } from './config/database.js';
import addressRoutes from './routes/address.routes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config({ path: '.env.local' });

// Initialize Express app
const app = express();
const PORT = process.env.EXPRESS_PORT || 8001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3100',
      'http://localhost:8000',
      'http://localhost:8001',
      process.env.SHOPIFY_APP_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/addresses', addressRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Address Management API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      createAddress: 'POST /api/addresses',
      getAddresses: 'GET /api/addresses/:customerId',
      getAddress: 'GET /api/addresses/address/:addressId',
      updateAddress: 'PUT /api/addresses/:addressId',
      deleteAddress: 'DELETE /api/addresses/:addressId',
      setDefault: 'POST /api/addresses/:customerId/:addressId/setDefault',
    },
    documentation: 'See ADDRESS_API.md for detailed documentation',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

/**
 * Start server function
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log('\n╔════════════════════════════════════╗');
      console.log('║   Address Management API Server   ║');
      console.log('╚════════════════════════════════════╝\n');
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`✓ API docs: http://localhost:${PORT}/api`);
      console.log(`✓ Base URL: http://localhost:${PORT}/api/addresses\n`);
    });
  } catch (error) {
    console.error('\n✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  console.log('\n\nShutting down gracefully...');
  try {
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  startServer();
}

export default app;
