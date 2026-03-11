/**
 * Validation Middleware
 * Validates address input data
 */

const validateAddressInput = (req, res, next) => {
  const { first_name, last_name, address1, address2, city, province, country, zip, phone, customerId } = req.body;

  const errors = {};

  // Validate customerId
  if (!customerId || !customerId.trim()) {
    errors.customerId = 'Customer ID is required';
  }

  // Validate first_name
  if (!first_name || !first_name.trim()) {
    errors.first_name = 'First name is required';
  } else if (first_name.length < 2) {
    errors.first_name = 'First name must be at least 2 characters';
  } else if (first_name.length > 50) {
    errors.first_name = 'First name must not exceed 50 characters';
  }

  // Validate last_name
  if (!last_name || !last_name.trim()) {
    errors.last_name = 'Last name is required';
  } else if (last_name.length < 2) {
    errors.last_name = 'Last name must be at least 2 characters';
  } else if (last_name.length > 50) {
    errors.last_name = 'Last name must not exceed 50 characters';
  }

  // Validate address1
  if (!address1 || !address1.trim()) {
    errors.address1 = 'Street address is required';
  } else if (address1.length < 5) {
    errors.address1 = 'Street address must be at least 5 characters';
  } else if (address1.length > 100) {
    errors.address1 = 'Street address must not exceed 100 characters';
  }

  // Validate address2 (optional)
  if (address2 && address2.length > 100) {
    errors.address2 = 'Apartment/Suite must not exceed 100 characters';
  }

  // Validate city
  if (!city || !city.trim()) {
    errors.city = 'City is required';
  } else if (city.length < 2) {
    errors.city = 'City must be at least 2 characters';
  } else if (city.length > 50) {
    errors.city = 'City must not exceed 50 characters';
  }

  // Validate province
  if (!province || !province.trim()) {
    errors.province = 'State/Province is required';
  } else if (province.length < 2) {
    errors.province = 'State/Province must be at least 2 characters';
  } else if (province.length > 50) {
    errors.province = 'State/Province must not exceed 50 characters';
  }

  // Validate country
  if (!country || !country.trim()) {
    errors.country = 'Country is required';
  } else if (country.length < 2) {
    errors.country = 'Country must be at least 2 characters';
  } else if (country.length > 50) {
    errors.country = 'Country must not exceed 50 characters';
  }

  // Validate zip
  if (!zip || !zip.trim()) {
    errors.zip = 'ZIP/Postal code is required';
  } else if (zip.length < 3) {
    errors.zip = 'ZIP/Postal code must be at least 3 characters';
  } else if (zip.length > 20) {
    errors.zip = 'ZIP/Postal code must not exceed 20 characters';
  } else if (!/^[a-zA-Z0-9\-\s]+$/.test(zip)) {
    errors.zip = 'ZIP/Postal code format is invalid';
  }

  // Validate phone (optional)
  if (phone && phone.length > 20) {
    errors.phone = 'Phone must not exceed 20 characters';
  }

  // If there are errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Proceed to next middleware/route handler
  next();
};

export {
  validateAddressInput,
};
