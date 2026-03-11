import mongoose, { Connection } from 'mongoose';

// Global cache for MongoDB connection
declare global {
  var mongooseConnection: Connection | null;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopify-app';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Connect to MongoDB
 * Uses connection pooling to avoid creating multiple connections
 */
export async function connectDB(): Promise<Connection> {
  try {
    // Return cached connection if available and connected
    if (global.mongooseConnection && mongoose.connection.readyState === 1) {
      console.log('✓ Using cached MongoDB connection');
      return global.mongooseConnection;
    }

    console.log('🔄 Establishing new MongoDB connection...');

    // Ensure we're not already connecting
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
    });

    global.mongooseConnection = conn.connection;
    console.log('✓ MongoDB connected successfully');
    return global.mongooseConnection;
  } catch (error: any) {
    console.error('✗ MongoDB connection error:', error.message);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      global.mongooseConnection = null;
      console.log('✓ MongoDB disconnected');
    }
  } catch (error: any) {
    console.error('✗ MongoDB disconnection error:', error.message);
  }
}

/**
 * Get current MongoDB connection
 */
export async function getDB(): Promise<Connection> {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Connect if not connected
  return connectDB();
}

/**
 * Health check - verify MongoDB is responsive
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const db = await getDB();
    await db.db?.admin().ping();
    return true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}
