# Address Management API Reference

Complete API documentation for MongoDB-based address management.

## Base URL

```
http://localhost:3000/api/addresses.mongo
```

## Authentication

All endpoints require Shopify Admin authentication via `authenticate.admin()`.

## Response Format

All responses follow this structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details",
  "errors": {
    "fieldName": "Field-specific error message"
  }
}
```

---

## Endpoints

### 1. Get All Addresses for a Customer

**GET** `/api/addresses.mongo?customerId={customerId}`

Retrieve all addresses associated with a specific customer.

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| customerId | string | Yes | Shopify Customer ID (e.g., `gid://shopify/Customer/123456789`) |

#### Example Request

```bash
curl "http://localhost:3000/api/addresses.mongo?customerId=gid://shopify/Customer/123456789"
```

#### Example Response (200 OK)

```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "customerId": "gid://shopify/Customer/123456789",
      "firstName": "John",
      "lastName": "Doe",
      "address1": "123 Main Street",
      "address2": "Apt 4",
      "city": "New York",
      "province": "NY",
      "country": "United States",
      "zip": "10001",
      "phone": "+1-555-0100",
      "isDefault": true,
      "createdAt": "2026-03-11T10:30:00.000Z",
      "updatedAt": "2026-03-11T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "customerId": "gid://shopify/Customer/123456789",
      "firstName": "John",
      "lastName": "Doe",
      "address1": "456 Oak Avenue",
      "city": "Los Angeles",
      "province": "CA",
      "country": "United States",
      "zip": "90001",
      "phone": "+1-555-0101",
      "isDefault": false,
      "createdAt": "2026-03-11T11:00:00.000Z",
      "updatedAt": "2026-03-11T11:00:00.000Z"
    }
  ]
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Customer ID is required",
  "error": "Missing customer ID"
}
```

---

### 2. Create a New Address

**POST** `/api/addresses.mongo`

Create a new address for a customer.

#### Request Body

```json
{
  "customerId": "gid://shopify/Customer/123456789",
  "firstName": "John",
  "lastName": "Doe",
  "address1": "123 Main Street",
  "address2": "Apt 4",
  "city": "New York",
  "province": "NY",
  "country": "United States",
  "zip": "10001",
  "phone": "+1-555-0100"
}
```

#### Field Validation

| Field | Type | Required | Constraints |
|-------|------|----------|-----------|
| customerId | string | Yes | Customer ID from Shopify |
| firstName | string | Yes | 2-50 characters |
| lastName | string | Yes | 2-50 characters |
| address1 | string | Yes | 5-100 characters |
| address2 | string | No | 0-100 characters |
| city | string | Yes | 2-50 characters |
| province | string | Yes | 2-50 characters (State/Province) |
| country | string | Yes | 2-50 characters |
| zip | string | Yes | 3-20 characters, alphanumeric with hyphens |
| phone | string | No | 0-20 characters, standard phone format |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/addresses.mongo \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/123456789",
    "firstName": "Jane",
    "lastName": "Smith",
    "address1": "789 Pine Road",
    "city": "Chicago",
    "province": "IL",
    "country": "United States",
    "zip": "60601"
  }'
```

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "customerId": "gid://shopify/Customer/123456789",
    "firstName": "Jane",
    "lastName": "Smith",
    "address1": "789 Pine Road",
    "address2": null,
    "city": "Chicago",
    "province": "IL",
    "country": "United States",
    "zip": "60601",
    "phone": null,
    "isDefault": false,
    "createdAt": "2026-03-11T12:30:00.000Z",
    "updatedAt": "2026-03-11T12:30:00.000Z"
  }
}
```

#### Validation Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Invalid address data",
  "errors": {
    "firstName": "First name is required",
    "zip": "ZIP/Postal code must be at least 3 characters"
  }
}
```

---

### 3. Get a Single Address

**GET** `/api/addresses.mongo/{addressId}?customerId={customerId}`

Retrieve a specific address by ID.

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| addressId | string | Yes | MongoDB ObjectId of the address |
| customerId | string | Yes | Shopify Customer ID (for verification) |

#### Example Request

```bash
curl "http://localhost:3000/api/addresses.mongo/507f1f77bcf86cd799439011?customerId=gid://shopify/Customer/123456789"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Address retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "customerId": "gid://shopify/Customer/123456789",
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main Street",
    "address2": "Apt 4",
    "city": "New York",
    "province": "NY",
    "country": "United States",
    "zip": "10001",
    "phone": "+1-555-0100",
    "isDefault": true,
    "createdAt": "2026-03-11T10:30:00.000Z",
    "updatedAt": "2026-03-11T10:30:00.000Z"
  }
}
```

#### Not Found Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Address not found",
  "error": "Address not found"
}
```

---

### 4. Update an Address

**PATCH** `/api/addresses.mongo/{addressId}`

Update one or more fields of an existing address.

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| addressId | string | Yes | MongoDB ObjectId of the address |

#### Request Body

```json
{
  "customerId": "gid://shopify/Customer/123456789",
  "city": "Los Angeles",
  "province": "CA",
  "zip": "90001"
}
```

**Note:** Only include fields you want to update. `customerId` is required for authorization.

#### Example Request

```bash
curl -X PATCH "http://localhost:3000/api/addresses.mongo/507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/123456789",
    "firstName": "Jane",
    "city": "San Francisco",
    "zip": "94102"
  }'
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "customerId": "gid://shopify/Customer/123456789",
    "firstName": "Jane",
    "lastName": "Doe",
    "address1": "123 Main Street",
    "address2": "Apt 4",
    "city": "San Francisco",
    "province": "CA",
    "country": "United States",
    "zip": "94102",
    "phone": "+1-555-0100",
    "isDefault": true,
    "createdAt": "2026-03-11T10:30:00.000Z",
    "updatedAt": "2026-03-11T13:45:00.000Z"
  }
}
```

#### Validation Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Invalid address data",
  "errors": {
    "zip": "ZIP/Postal code format is invalid"
  }
}
```

---

### 5. Delete an Address

**DELETE** `/api/addresses.mongo/{addressId}?customerId={customerId}`

Delete an address.

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| addressId | string | Yes | MongoDB ObjectId of the address |
| customerId | string | Yes | Shopify Customer ID (for verification) |

#### Example Request

```bash
curl -X DELETE "http://localhost:3000/api/addresses.mongo/507f1f77bcf86cd799439011?customerId=gid://shopify/Customer/123456789"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

#### Authorization Error Response (403 Forbidden)

```json
{
  "success": false,
  "message": "Address does not belong to this customer",
  "error": "Authorization failed"
}
```

---

### 6. Set Address as Default

**POST** `/api/addresses.mongo/{addressId}?action=setDefault&customerId={customerId}`

Set an address as the default for a customer. Only one address can be default per customer.

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| addressId | string | Yes | MongoDB ObjectId of the address |
| action | string | Yes | Must be `setDefault` |
| customerId | string | Yes | Shopify Customer ID |

#### Example Request

```bash
curl -X POST "http://localhost:3000/api/addresses.mongo/507f1f77bcf86cd799439011?action=setDefault&customerId=gid://shopify/Customer/123456789"
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Default address set successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "customerId": "gid://shopify/Customer/123456789",
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main Street",
    "address2": "Apt 4",
    "city": "New York",
    "province": "NY",
    "country": "United States",
    "zip": "10001",
    "phone": "+1-555-0100",
    "isDefault": true,
    "createdAt": "2026-03-11T10:30:00.000Z",
    "updatedAt": "2026-03-11T14:00:00.000Z"
  }
}
```

---

## HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Successful GET, PATCH, DELETE, POST |
| 201 | Created | Successful POST to create resource |
| 400 | Bad Request | Invalid input, missing required fields, validation errors |
| 401 | Unauthorized | Authentication failed |
| 403 | Forbidden | Authorization failed (e.g., address doesn't belong to customer) |
| 405 | Method Not Allowed | Wrong HTTP method for endpoint |
| 500 | Internal Server Error | Server-side error |

---

## Error Handling

### Common Validation Errors

```json
{
  "errors": {
    "firstName": "First name is required",
    "firstName": "First name must be at least 2 characters",
    "zip": "ZIP/Postal code format is invalid",
    "address1": "Street address must be at least 5 characters"
  }
}
```

### Authentication Error

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Authentication failed"
}
```

---

## Rate Limiting

No rate limiting is currently implemented. Please implement according to your needs.

---

## Examples

### Complete Workflow

```bash
# 1. Get all addresses
curl "http://localhost:3000/api/addresses.mongo?customerId=gid://shopify/Customer/123456789"

# 2. Create new address
ADDRESS_ID=$(curl -X POST http://localhost:3000/api/addresses.mongo \
  -H "Content-Type: application/json" \
  -d '{"customerId":"gid://shopify/Customer/123456789","firstName":"Jane","lastName":"Smith","address1":"789 Oak St","city":"Boston","province":"MA","country":"United States","zip":"02101"}' \
  | jq -r '.data._id')

# 3. Get specific address
curl "http://localhost:3000/api/addresses.mongo/$ADDRESS_ID?customerId=gid://shopify/Customer/123456789"

# 4. Update address
curl -X PATCH "http://localhost:3000/api/addresses.mongo/$ADDRESS_ID" \
  -H "Content-Type: application/json" \
  -d '{"customerId":"gid://shopify/Customer/123456789","city":"Cambridge"}'

# 5. Set as default
curl -X POST "http://localhost:3000/api/addresses.mongo/$ADDRESS_ID?action=setDefault&customerId=gid://shopify/Customer/123456789"

# 6. Delete address
curl -X DELETE "http://localhost:3000/api/addresses.mongo/$ADDRESS_ID?customerId=gid://shopify/Customer/123456789"
```

---

## Implementation Details

- **Database:** MongoDB 7.0
- **ODM:** Mongoose 8.0.0
- **Framework:** Remix 2.16.1
- **Authentication:** Shopify Admin API
- **Timestamps:** ISO 8601 format (UTC)

---

**API Version:** 1.0.0  
**Last Updated:** March 11, 2026
