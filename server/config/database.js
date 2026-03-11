/**
 * MongoDB Database Configuration for Express Server
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/customize-checkout-address-details';

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return mongoose.connection;
    }

    console.log('Connecting to MongoDB...');
    console.log(`URI: ${MONGODB_URI}`);

    await mongoose.connect(MONGODB_URI, {
      // Mongoose connection options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✓ MongoDB connected successfully');
    console.log(`Database: ${mongoose.connection.name}`);

    // Connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.error('Make sure MongoDB is running at:', MONGODB_URI);
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
};

export {
  connectDB,
  disconnectDB,
  MONGODB_URI,
};
