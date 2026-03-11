/**
 * Address Controller
 * Request handlers for address operations
 */

import addressService from '../services/addressService.js';

/**
 * Create a new address
 * POST /api/addresses
 */
const createAddress = async (req, res, next) => {
  try {
    const result = await addressService.createAddress(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all addresses for a customer
 * GET /api/addresses/:customerId
 */
const getAddresses = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const result = await addressService.getAddressesByCustomer(customerId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single address
 * GET /api/addresses/address/:addressId
 */
const getAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const result = await addressService.getAddressById(addressId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an address
 * PUT /api/addresses/:addressId
 */
const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const result = await addressService.updateAddress(addressId, req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an address
 * DELETE /api/addresses/:addressId
 */
const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const result = await addressService.deleteAddress(addressId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Set address as default
 * POST /api/addresses/:customerId/:addressId/setDefault
 */
const setDefaultAddress = async (req, res, next) => {
  try {
    const { customerId, addressId } = req.params;
    const result = await addressService.setDefaultAddress(customerId, addressId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
