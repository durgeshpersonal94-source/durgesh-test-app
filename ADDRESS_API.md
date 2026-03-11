# Address Management API Documentation

## Overview
Complete REST API for managing customer addresses in the Shopify app using Node.js, Express, and MongoDB with Mongoose.

## Base URL
```
http://localhost:8000/api/addresses
```

## Authentication
Currently no authentication implemented. In production, add Shopify Admin API authentication middleware.

---

## Endpoints

### 1. Create a New Address
**POST** `/api/addresses`

Creates a new address for a customer.

**Request Body:**
```json
{
  "customerId": "gid://shopify/Customer/123456789",
  "first_name": "John",
  "last_name": "Doe",
  "address1": "123 Main Street",
  "address2": "Apt 4B",
  "city": "New York",
  "province": "NY",
  "country": "United States",
  "zip": "10001",
  "phone": "+1-212-555-0123",
  "isDefault": false
}
```

**Field Validation:**
- `customerId`: Required, Shopify customer GID
- `first_name`: Required, 2-50 characters
- `last_name`: Required, 2-50 characters
- `address1`: Required, 5-100 characters (street address)
- `address2`: Optional, max 100 characters (apartment/suite)
- `city`: Required, 2-50 characters
- `province`: Required, 2-50 characters (state/province)
- `country`: Required, 2-50 characters
- `zip`: Required, 3-20 alphanumeric characters with hyphens allowed
- `phone`: Optional, max 20 characters
- `isDefault`: Optional, defaults to false

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "customerId": "gid://shopify/Customer/123456789",
    "first_name": "John",
    "last_name": "Doe",
    "address1": "123 Main Street",
    "address2": "Apt 4B",
    "city": "New York",
    "province": "NY",
    "country": "United States",
    "zip": "10001",
    "phone": "+1-212-555-0123",
    "isDefault": false,
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "first_name": "First name must be between 2 and 50 characters",
    "zip": "Zip code must be 3-20 alphanumeric characters"
  }
}
```

---

### 2. Get All Addresses for a Customer
**GET** `/api/addresses/:customerId`

Retrieves all addresses for a specific customer, sorted by default status and creation date.

**Parameters:**
- `customerId` (path): Shopify customer GID (required)

**Query Parameters:**
- `sortBy`: Optional, 'recent' | 'oldest' | 'default' (defaults to default)
- `limit`: Optional, max number of addresses to return

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "customerId": "gid://shopify/Customer/123456789",
      "first_name": "John",
      "last_name": "Doe",
      "address1": "123 Main Street",
      "address2": "Apt 4B",
      "city": "New York",
      "province": "NY",
      "country": "United States",
      "zip": "10001",
      "phone": "+1-212-555-0123",
      "isDefault": true,
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "customerId": "gid://shopify/Customer/123456789",
      "first_name": "Jane",
      "last_name": "Smith",
      "address1": "456 Oak Avenue",
      "address2": null,
      "city": "Los Angeles",
      "province": "CA",
      "country": "United States",
      "zip": "90001",
      "phone": null,
      "isDefault": false,
      "createdAt": "2024-03-14T08:15:00.000Z",
      "updatedAt": "2024-03-14T08:15:00.000Z"
    }
  ],
  "count": 2
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Customer ID is required",
  "error": "Missing customerId"
}
```

---

### 3. Get a Single Address
**GET** `/api/addresses/address/:addressId`

Retrieves a specific address by its ID.

**Parameters:**
- `addressId` (path): MongoDB address ID (required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Address retrieved successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "customerId": "gid://shopify/Customer/123456789",
    "first_name": "John",
    "last_name": "Doe",
    "address1": "123 Main Street",
    "address2": "Apt 4B",
    "city": "New York",
    "province": "NY",
    "country": "United States",
    "zip": "10001",
    "phone": "+1-212-555-0123",
    "isDefault": true,
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Address not found",
  "error": "Address with this ID does not exist"
}
```

---

### 4. Update an Address
**PUT** `/api/addresses/:addressId`

Updates an existing address. All fields except `customerId` can be updated.

**Parameters:**
- `addressId` (path): MongoDB address ID (required)

**Request Body:** (same as create, only include fields to update)
```json
{
  "first_name": "Jonathan",
  "last_name": "Doe",
  "city": "Boston",
  "province": "MA"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "customerId": "gid://shopify/Customer/123456789",
    "first_name": "Jonathan",
    "last_name": "Doe",
    "address1": "123 Main Street",
    "address2": "Apt 4B",
    "city": "Boston",
    "province": "MA",
    "country": "United States",
    "zip": "10001",
    "phone": "+1-212-555-0123",
    "isDefault": true,
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T12:45:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "city": "City must be between 2 and 50 characters"
  }
}
```

---

### 5. Delete an Address
**DELETE** `/api/addresses/:addressId`

Permanently deletes an address.

**Parameters:**
- `addressId` (path): MongoDB address ID (required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Address not found",
  "error": "Address with this ID does not exist"
}
```

---

### 6. Set Address as Default
**POST** `/api/addresses/:customerId/:addressId/setDefault`

Sets a specific address as the default for a customer. Automatically unsets any previous default.

**Parameters:**
- `customerId` (path): Shopify customer GID (required)
- `addressId` (path): MongoDB address ID (required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Default address set successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "customerId": "gid://shopify/Customer/123456789",
    "first_name": "Jane",
    "last_name": "Smith",
    "address1": "456 Oak Avenue",
    "address2": null,
    "city": "Los Angeles",
    "province": "CA",
    "country": "United States",
    "zip": "90001",
    "phone": null,
    "isDefault": true,
    "createdAt": "2024-03-14T08:15:00.000Z",
    "updatedAt": "2024-03-15T13:20:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Address does not belong to this customer",
  "error": "Authorization failed"
}
```

---

## Error Codes & Messages

| Status | Message | Cause |
|--------|---------|-------|
| 400 | Validation failed | Input validation error |
| 400 | Missing required fields | Required fields not provided |
| 400 | Address does not belong to this customer | Authorization check failed |
| 404 | Address not found | Address ID does not exist |
| 500 | Internal server error | Unexpected server error |

---

## Usage Examples

### Create Address with cURL
```bash
curl -X POST http://localhost:8000/api/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/123456789",
    "first_name": "John",
    "last_name": "Doe",
    "address1": "123 Main Street",
    "city": "New York",
    "province": "NY",
    "country": "United States",
    "zip": "10001"
  }'
```

### Get All Addresses with cURL
```bash
curl http://localhost:8000/api/addresses/gid://shopify/Customer/123456789
```

### Update Address with cURL
```bash
curl -X PUT http://localhost:8000/api/addresses/65a1b2c3d4e5f6g7h8i9j0k1 \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jonathan",
    "city": "Boston"
  }'
```

### Delete Address with cURL
```bash
curl -X DELETE http://localhost:8000/api/addresses/65a1b2c3d4e5f6g7h8i9j0k1
```

---

## Testing

### Using Postman
1. Import the API endpoints into Postman
2. Set `{{base_url}}` = `http://localhost:8000/api/addresses`
3. Create an environment with `customerId` and `addressId` variables

### Using fetch() in JavaScript
```javascript
// Create address
fetch('http://localhost:8000/api/addresses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customerId: 'gid://shopify/Customer/123456789',
    first_name: 'John',
    last_name: 'Doe',
    address1: '123 Main Street',
    city: 'New York',
    province: 'NY',
    country: 'United States',
    zip: '10001'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Database Connection Info
- **Database Name**: customize-checkout-address-details
- **MongoDB URI**: mongodb://localhost:27017/customize-checkout-address-details
- **Collection**: addresses

---

## Notes
- All timestamps are in ISO 8601 format (UTC)
- Customer IDs should be Shopify GraphQL GIDs (e.g., gid://shopify/Customer/123456789)
- Phone numbers are optional but validated if provided
- Only one address per customer can be set as default
- Fields use snake_case in API (first_name, last_name, etc.)
