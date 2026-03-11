import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript interface for Address
export interface IAddress extends Document {
  customerId: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const addressSchema = new Schema<IAddress>(
  {
    customerId: {
      type: String,
      required: [true, 'Customer ID is required'],
      index: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name must not exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name must not exceed 50 characters'],
    },
    address1: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      minlength: [5, 'Street address must be at least 5 characters'],
      maxlength: [100, 'Street address must not exceed 100 characters'],
    },
    address2: {
      type: String,
      trim: true,
      maxlength: [100, 'Apartment/Suite must not exceed 100 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      minlength: [2, 'City must be at least 2 characters'],
      maxlength: [50, 'City must not exceed 50 characters'],
    },
    province: {
      type: String,
      required: [true, 'State/Province is required'],
      trim: true,
      minlength: [2, 'State/Province must be at least 2 characters'],
      maxlength: [50, 'State/Province must not exceed 50 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      minlength: [2, 'Country must be at least 2 characters'],
      maxlength: [50, 'Country must not exceed 50 characters'],
    },
    zip: {
      type: String,
      required: [true, 'ZIP/Postal code is required'],
      trim: true,
      minlength: [3, 'ZIP/Postal code must be at least 3 characters'],
      maxlength: [20, 'ZIP/Postal code must not exceed 20 characters'],
      match: [/^[a-zA-Z0-9\-\s]+$/, 'ZIP/Postal code format is invalid'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone must not exceed 20 characters'],
      match: [/^[\d\+\-\s\(\)]+$/, 'Phone format is invalid'],
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'addresses',
  }
);

// Compound index for efficient customer queries
addressSchema.index({ customerId: 1, isDefault: -1 });
addressSchema.index({ customerId: 1, createdAt: -1 });

// Pre-save hook for validation
addressSchema.pre('save', async function (next) {
  try {
    // Validate phone format if provided
    if (this.phone) {
      // Basic phone validation
      const phoneRegex = /^[\d\+\-\s\(\)]+$/;
      if (!phoneRegex.test(this.phone)) {
        throw new Error('Invalid phone format');
      }
    }

    // Validate zip format
    const zipRegex = /^[a-zA-Z0-9\-\s]+$/;
    if (!zipRegex.test(this.zip)) {
      throw new Error('Invalid ZIP/Postal code format');
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

// Get or create model
const Address: Model<IAddress> =
  mongoose.models.Address || mongoose.model<IAddress>('Address', addressSchema);

export default Address;
