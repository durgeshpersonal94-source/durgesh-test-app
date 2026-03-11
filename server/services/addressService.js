/**
 * Address Service
 * Business logic for address operations
 */

import Address from '../models/Address.js';

class AddressService {
  /**
   * Create a new address
   */
  async createAddress(addressData) {
    try {
      const address = new Address(addressData);
      await address.save();
      return {
        success: true,
        message: 'Address created successfully',
        data: address,
      };
    } catch (error) {
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
  async getAddressesByCustomer(customerId) {
    try {
      if (!customerId) {
        return {
          success: false,
          message: 'Customer ID is required',
          error: 'Missing customerId',
        };
      }

      const addresses = await Address.find({ customerId })
        .sort({ isDefault: -1, createdAt: -1 })
        .lean();

      return {
        success: true,
        message: 'Addresses retrieved successfully',
        data: addresses,
        count: addresses.length,
      };
    } catch (error) {
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
  async getAddressById(addressId) {
    try {
      if (!addressId) {
        return {
          success: false,
          message: 'Address ID is required',
          error: 'Missing addressId',
        };
      }

      const address = await Address.findById(addressId).lean();

      if (!address) {
        return {
          success: false,
          message: 'Address not found',
          error: 'Address with this ID does not exist',
        };
      }

      return {
        success: true,
        message: 'Address retrieved successfully',
        data: address,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch address',
        error: error.message,
      };
    }
  }

  /**
   * Update an address
   */
  async updateAddress(addressId, updateData) {
    try {
      if (!addressId) {
        return {
          success: false,
          message: 'Address ID is required',
          error: 'Missing addressId',
        };
      }

      // Remove customerId from update data if present (for security)
      delete updateData.customerId;

      const address = await Address.findByIdAndUpdate(addressId, updateData, {
        new: true,
        runValidators: true,
      }).lean();

      if (!address) {
        return {
          success: false,
          message: 'Address not found',
          error: 'Address with this ID does not exist',
        };
      }

      return {
        success: true,
        message: 'Address updated successfully',
        data: address,
      };
    } catch (error) {
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
  async deleteAddress(addressId) {
    try {
      if (!addressId) {
        return {
          success: false,
          message: 'Address ID is required',
          error: 'Missing addressId',
        };
      }

      const address = await Address.findByIdAndDelete(addressId);

      if (!address) {
        return {
          success: false,
          message: 'Address not found',
          error: 'Address with this ID does not exist',
        };
      }

      return {
        success: true,
        message: 'Address deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete address',
        error: error.message,
      };
    }
  }

  /**
   * Set address as default
   */
  async setDefaultAddress(customerId, addressId) {
    try {
      if (!customerId || !addressId) {
        return {
          success: false,
          message: 'Customer ID and Address ID are required',
          error: 'Missing required parameters',
        };
      }

      // Verify address belongs to customer
      const address = await Address.findById(addressId);

      if (!address) {
        return {
          success: false,
          message: 'Address not found',
          error: 'Address with this ID does not exist',
        };
      }

      if (address.customerId !== customerId) {
        return {
          success: false,
          message: 'Address does not belong to this customer',
          error: 'Authorization failed',
        };
      }

      // Reset all addresses for this customer
      await Address.updateMany({ customerId }, { isDefault: false });

      // Set the selected address as default
      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        { isDefault: true },
        { new: true }
      ).lean();

      return {
        success: true,
        message: 'Default address set successfully',
        data: updatedAddress,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to set default address',
        error: error.message,
      };
    }
  }
}

export default new AddressService();
