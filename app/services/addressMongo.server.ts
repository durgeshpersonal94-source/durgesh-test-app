import Address, { IAddress } from '../models/Address.server';
import { connectDB } from '../lib/mongodb.server';

export interface AddressInput {
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
}

export interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

/**
 * Validate address input
 */
function validateAddressInput(input: Partial<AddressInput>): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!input.customerId?.trim()) {
    errors.customerId = 'Customer ID is required';
  }

  if (!input.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (input.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  } else if (input.firstName.length > 50) {
    errors.firstName = 'First name must not exceed 50 characters';
  }

  if (!input.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (input.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  } else if (input.lastName.length > 50) {
    errors.lastName = 'Last name must not exceed 50 characters';
  }

  if (!input.address1?.trim()) {
    errors.address1 = 'Street address is required';
  } else if (input.address1.length < 5) {
    errors.address1 = 'Street address must be at least 5 characters';
  } else if (input.address1.length > 100) {
    errors.address1 = 'Street address must not exceed 100 characters';
  }

  if (input.address2 && input.address2.length > 100) {
    errors.address2 = 'Apartment/Suite must not exceed 100 characters';
  }

  if (!input.city?.trim()) {
    errors.city = 'City is required';
  } else if (input.city.length < 2) {
    errors.city = 'City must be at least 2 characters';
  } else if (input.city.length > 50) {
    errors.city = 'City must not exceed 50 characters';
  }

  if (!input.province?.trim()) {
    errors.province = 'State/Province is required';
  } else if (input.province.length < 2) {
    errors.province = 'State/Province must be at least 2 characters';
  } else if (input.province.length > 50) {
    errors.province = 'State/Province must not exceed 50 characters';
  }

  if (!input.country?.trim()) {
    errors.country = 'Country is required';
  } else if (input.country.length < 2) {
    errors.country = 'Country must be at least 2 characters';
  } else if (input.country.length > 50) {
    errors.country = 'Country must not exceed 50 characters';
  }

  if (!input.zip?.trim()) {
    errors.zip = 'ZIP/Postal code is required';
  } else if (input.zip.length < 3) {
    errors.zip = 'ZIP/Postal code must be at least 3 characters';
  } else if (input.zip.length > 20) {
    errors.zip = 'ZIP/Postal code must not exceed 20 characters';
  }

  if (input.phone && input.phone.length > 20) {
    errors.phone = 'Phone must not exceed 20 characters';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Add a new address for a customer
 */
export async function addAddress(addressData: AddressInput): Promise<ServiceResponse<IAddress>> {
  try {
    await connectDB();

    // Validate input
    const validation = validateAddressInput(addressData);
    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        error: 'Invalid address data',
        errors: validation.errors,
      };
    }

    // Create new address
    const address = new Address({
      customerId: addressData.customerId.trim(),
      firstName: addressData.firstName.trim(),
      lastName: addressData.lastName.trim(),
      address1: addressData.address1.trim(),
      address2: addressData.address2?.trim(),
      city: addressData.city.trim(),
      province: addressData.province.trim(),
      country: addressData.country.trim(),
      zip: addressData.zip.trim(),
      phone: addressData.phone?.trim(),
      isDefault: false,
    });

    await address.save();

    return {
      success: true,
      message: 'Address created successfully',
      data: address.toObject(),
    };
  } catch (error: any) {
    console.error('Error adding address:', error);
    return {
      success: false,
      message: 'Failed to create address',
      error: error.message,
    };
  }
}

/**
 * Get all addresses for a customer
 */
export async function getAddresses(customerId: string): Promise<ServiceResponse<IAddress[]>> {
  try {
    await connectDB();

    if (!customerId?.trim()) {
      return {
        success: false,
        message: 'Customer ID is required',
        error: 'Missing customer ID',
      };
    }

    const addresses = await Address.find({ customerId: customerId.trim() }).sort({ isDefault: -1, createdAt: -1 });

    return {
      success: true,
      message: 'Addresses retrieved successfully',
      data: addresses.map((addr) => addr.toObject()),
    };
  } catch (error: any) {
    console.error('Error fetching addresses:', error);
    return {
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message,
    };
  }
}

/**
 * Get a single address by ID
 */
export async function getAddress(addressId: string): Promise<ServiceResponse<IAddress>> {
  try {
    await connectDB();

    if (!addressId?.trim()) {
      return {
        success: false,
        message: 'Address ID is required',
        error: 'Missing address ID',
      };
    }

    const address = await Address.findById(addressId);

    if (!address) {
      return {
        success: false,
        message: 'Address not found',
        error: 'Address not found',
      };
    }

    return {
      success: true,
      message: 'Address retrieved successfully',
      data: address.toObject(),
    };
  } catch (error: any) {
    console.error('Error fetching address:', error);
    return {
      success: false,
      message: 'Failed to fetch address',
      error: error.message,
    };
  }
}

/**
 * Update an existing address
 */
export async function updateAddress(addressId: string, updateData: Partial<AddressInput>): Promise<ServiceResponse<IAddress>> {
  try {
    await connectDB();

    if (!addressId?.trim()) {
      return {
        success: false,
        message: 'Address ID is required',
        error: 'Missing address ID',
      };
    }

    // Find address
    const address = await Address.findById(addressId);

    if (!address) {
      return {
        success: false,
        message: 'Address not found',
        error: 'Address not found',
      };
    }

    // Prepare update data
    const cleanedData: Record<string, any> = {};

    if (updateData.firstName !== undefined) {
      cleanedData.firstName = updateData.firstName.trim();
    }
    if (updateData.lastName !== undefined) {
      cleanedData.lastName = updateData.lastName.trim();
    }
    if (updateData.address1 !== undefined) {
      cleanedData.address1 = updateData.address1.trim();
    }
    if (updateData.address2 !== undefined) {
      cleanedData.address2 = updateData.address2.trim();
    }
    if (updateData.city !== undefined) {
      cleanedData.city = updateData.city.trim();
    }
    if (updateData.province !== undefined) {
      cleanedData.province = updateData.province.trim();
    }
    if (updateData.country !== undefined) {
      cleanedData.country = updateData.country.trim();
    }
    if (updateData.zip !== undefined) {
      cleanedData.zip = updateData.zip.trim();
    }
    if (updateData.phone !== undefined) {
      cleanedData.phone = updateData.phone.trim();
    }

    // Validate if any fields are being updated
    if (Object.keys(cleanedData).length > 0) {
      const validation = validateAddressInput({
        customerId: address.customerId,
        ...address.toObject(),
        ...cleanedData,
      });

      if (!validation.valid) {
        return {
          success: false,
          message: 'Validation failed',
          error: 'Invalid address data',
          errors: validation.errors,
        };
      }
    }

    // Update address
    Object.assign(address, cleanedData);
    await address.save();

    return {
      success: true,
      message: 'Address updated successfully',
      data: address.toObject(),
    };
  } catch (error: any) {
    console.error('Error updating address:', error);
    return {
      success: false,
      message: 'Failed to update address',
      error: error.message,
    };
  }
}

/**
 * Delete an address
 */
export async function deleteAddress(addressId: string): Promise<ServiceResponse> {
  try {
    await connectDB();

    if (!addressId?.trim()) {
      return {
        success: false,
        message: 'Address ID is required',
        error: 'Missing address ID',
      };
    }

    const result = await Address.findByIdAndDelete(addressId);

    if (!result) {
      return {
        success: false,
        message: 'Address not found',
        error: 'Address not found',
      };
    }

    return {
      success: true,
      message: 'Address deleted successfully',
    };
  } catch (error: any) {
    console.error('Error deleting address:', error);
    return {
      success: false,
      message: 'Failed to delete address',
      error: error.message,
    };
  }
}

/**
 * Set an address as default for a customer
 */
export async function setDefaultAddress(customerId: string, addressId: string): Promise<ServiceResponse<IAddress>> {
  try {
    await connectDB();

    if (!customerId?.trim()) {
      return {
        success: false,
        message: 'Customer ID is required',
        error: 'Missing customer ID',
      };
    }

    if (!addressId?.trim()) {
      return {
        success: false,
        message: 'Address ID is required',
        error: 'Missing address ID',
      };
    }

    // Find the address
    const address = await Address.findById(addressId);

    if (!address || address.customerId !== customerId) {
      return {
        success: false,
        message: 'Address not found for this customer',
        error: 'Address not found',
      };
    }

    // Reset all addresses for this customer
    await Address.updateMany({ customerId }, { isDefault: false });

    // Set the selected address as default
    address.isDefault = true;
    await address.save();

    return {
      success: true,
      message: 'Default address set successfully',
      data: address.toObject(),
    };
  } catch (error: any) {
    console.error('Error setting default address:', error);
    return {
      success: false,
      message: 'Failed to set default address',
      error: error.message,
    };
  }
}

/**
 * Get default address for a customer
 */
export async function getDefaultAddress(customerId: string): Promise<ServiceResponse<IAddress>> {
  try {
    await connectDB();

    if (!customerId?.trim()) {
      return {
        success: false,
        message: 'Customer ID is required',
        error: 'Missing customer ID',
      };
    }

    const address = await Address.findOne({ customerId: customerId.trim(), isDefault: true });

    if (!address) {
      return {
        success: false,
        message: 'No default address found',
        error: 'No default address set',
      };
    }

    return {
      success: true,
      message: 'Default address retrieved successfully',
      data: address.toObject(),
    };
  } catch (error: any) {
    console.error('Error fetching default address:', error);
    return {
      success: false,
      message: 'Failed to fetch default address',
      error: error.message,
    };
  }
}
