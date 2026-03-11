/**
 * Address Routes
 * Define all address-related API endpoints
 */

import express from 'express';
const router = express.Router();
import { createAddress, getAddresses, getAddress, updateAddress, deleteAddress, setDefaultAddress } from '../controllers/addressController.js';
import { validateAddressInput } from '../middleware/validation.js';

/**
 * API Endpoints:
 * POST   /api/addresses                          - Create new address
 * GET    /api/addresses/:customerId              - Get all addresses for customer
 * GET    /api/addresses/address/:addressId       - Get single address
 * PUT    /api/addresses/:addressId               - Update address
 * DELETE /api/addresses/:addressId               - Delete address
 * POST   /api/addresses/:customerId/:addressId/setDefault - Set as default
 */

// Create a new address
router.post('/', validateAddressInput, createAddress);

// Get all addresses for a customer
router.get('/:customerId', getAddresses);

// Get a single address by ID
router.get('/address/:addressId', getAddress);

// Update an address
router.put('/:addressId', validateAddressInput, updateAddress);

// Delete an address
router.delete('/:addressId', deleteAddress);

// Set address as default
router.post(
  '/:customerId/:addressId/setDefault',
  setDefaultAddress
);

export default router;
