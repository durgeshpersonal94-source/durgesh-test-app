# Express API Testing Guide

Quick reference for testing the Address Management API using curl commands.

---

## 🎯 Prerequisites

- Express server running: `http://localhost:8000`
- MongoDB running with sample data
- Git Bash or PowerShell with curl available

---

## 📋 Test Scenarios

### 1. Health Check

Verify the server is running:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-03-15T10:30:00.000Z",
  "uptime": 5.234
}
```

---

### 2. API Documentation

View all available endpoints:

```bash
curl http://localhost:8000/api
```

---

### 3. Create Address

Create a new address for a customer:

```bash
curl -X POST http://localhost:8000/api/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/123456789",
    "first_name": "Jane",
    "last_name": "Smith",
    "address1": "456 Oak Avenue",
    "address2": "",
    "city": "Boston",
    "province": "MA",
    "country": "United States",
    "zip": "02101",
    "phone": "+1-617-555-0123",
    "isDefault": false
  }'
```

**PowerShell Alternative:**

```powershell
$headers = @{ 'Content-Type' = 'application/json' }
$body = @{
    customerId = 'gid://shopify/Customer/123456789'
    first_name = 'Jane'
    last_name = 'Smith'
    address1 = '456 Oak Avenue'
    city = 'Boston'
    province = 'MA'
    country = 'United States'
    zip = '02101'
    phone = '+1-617-555-0123'
    isDefault = $false
} | ConvertTo-Json

Invoke-WebRequest -Uri 'http://localhost:8000/api/addresses' `
    -Method POST `
    -Headers $headers `
    -Body $body
```

Expected response (201 Created):
```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "customerId": "gid://shopify/Customer/123456789",
    "first_name": "Jane",
    "last_name": "Smith",
    "address1": "456 Oak Avenue",
    "address2": "",
    "city": "Boston",
    "province": "MA",
    "country": "United States",
    "zip": "02101",
    "phone": "+1-617-555-0123",
    "isDefault": false,
    "createdAt": "2024-03-15T11:00:00.000Z",
    "updatedAt": "2024-03-15T11:00:00.000Z"
  }
}
```

---

### 4. Get All Addresses (by Customer)

Retrieve all addresses for a specific customer:

```bash
curl "http://localhost:8000/api/addresses/gid://shopify/Customer/123456789"
```

Expected response (200 OK):
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
      "city": "New York",
      "province": "NY",
      "country": "United States",
      "zip": "10001",
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
      "city": "Los Angeles",
      "province": "CA",
      "country": "United States",
      "zip": "90001",
      "isDefault": false,
      "createdAt": "2024-03-14T08:15:00.000Z",
      "updatedAt": "2024-03-14T08:15:00.000Z"
    }
  ],
  "count": 2
}
```

---

### 5. Get Single Address

Retrieve a specific address by ID:

```bash
# Replace with actual address ID
curl "http://localhost:8000/api/addresses/address/65a1b2c3d4e5f6g7h8i9j0k1"
```

Expected response (200 OK):
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

---

### 6. Update Address

Update specific fields of an address:

```bash
# Replace with actual address ID
curl -X PUT http://localhost:8000/api/addresses/65a1b2c3d4e5f6g7h8i9j0k1 \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jonathan",
    "city": "Boston",
    "province": "MA",
    "zip": "02101"
  }'
```

Expected response (200 OK):
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
    "zip": "02101",
    "phone": "+1-212-555-0123",
    "isDefault": true,
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T12:45:00.000Z"
  }
}
```

---

### 7. Delete Address

Remove an address:

```bash
# Replace with actual address ID
curl -X DELETE http://localhost:8000/api/addresses/65a1b2c3d4e5f6g7h8i9j0k1
```

Expected response (200 OK):
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

### 8. Set as Default Address

Set a specific address as the customer's default:

```bash
# Replace with actual customer ID and address ID
curl -X POST "http://localhost:8000/api/addresses/gid://shopify/Customer/123456789/65a1b2c3d4e5f6g7h8i9j0k2/setDefault" \
  -H "Content-Type: application/json"
```

Expected response (200 OK):
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
    "city": "Los Angeles",
    "province": "CA",
    "country": "United States",
    "zip": "90001",
    "isDefault": true,
    "createdAt": "2024-03-14T08:15:00.000Z",
    "updatedAt": "2024-03-15T13:20:00.000Z"
  }
}
```

---

## ❌ Error Scenarios

### Missing Required Fields

```bash
curl -X POST http://localhost:8000/api/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John"
  }'
```

Expected response (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "customerId": "Customer ID is required",
    "last_name": "Last name is required",
    "address1": "Street address is required",
    "city": "City is required",
    "province": "Province/State is required",
    "country": "Country is required",
    "zip": "ZIP code is required"
  }
}
```

### Invalid ZIP Code Format

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
    "zip": "123"
  }'
```

Expected response (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "zip": "ZIP code must be 3-20 alphanumeric characters"
  }
}
```

### Address Not Found

```bash
curl "http://localhost:8000/api/addresses/address/invalid123"
```

Expected response (404 Not Found):
```json
{
  "success": false,
  "message": "Address not found",
  "error": "Address with this ID does not exist"
}
```

---

## 🧪 Complete Test Workflow

Run through a complete CRUD cycle:

```bash
# 1. Create an address
echo "Creating address..."
ADDRESS_RESPONSE=$(curl -s -X POST http://localhost:8000/api/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/987654321",
    "first_name": "Test",
    "last_name": "User",
    "address1": "999 Test Street",
    "city": "Testville",
    "province": "TS",
    "country": "Test Country",
    "zip": "99999"
  }')

echo $ADDRESS_RESPONSE

# Extract ID (requires jq for JSON parsing)
# ADDRESS_ID=$(echo $ADDRESS_RESPONSE | jq -r '.data._id')

# 2. List all addresses for customer
echo "Fetching all addresses..."
curl -s "http://localhost:8000/api/addresses/gid://shopify/Customer/987654321"

# 3. Update the address (use actual ID)
# echo "Updating address..."
# curl -X PUT http://localhost:8000/api/addresses/$ADDRESS_ID \
#   -H "Content-Type: application/json" \
#   -d '{"city": "TestCity Updated"}'

# 4. Delete the address (use actual ID)
# echo "Deleting address..."
# curl -X DELETE http://localhost:8000/api/addresses/$ADDRESS_ID
```

---

## 📊 Monitoring & Debugging

### View Server Logs

Watch server output for:

```
✓ MongoDB connected successfully
✓ Database: customize-checkout-address-details
Request: POST /api/addresses
Response: 201 Created
```

### Check MongoDB Directly

```bash
mongosh

use customize-checkout-address-details

db.addresses.find({customerId: "gid://shopify/Customer/123456789"}).pretty()
```

### Performance Testing

Generate multiple requests:

```bash
for i in {1..10}; do
  curl -X POST http://localhost:8000/api/addresses \
    -H "Content-Type: application/json" \
    -d "{
      \"customerId\": \"gid://shopify/Customer/test$i\",
      \"first_name\": \"User\",
      \"last_name\": \"$i\",
      \"address1\": \"123 Street $i\",
      \"city\": \"City\",
      \"province\": \"ST\",
      \"country\": \"Country\",
      \"zip\": \"12345\"
    }"
done
```

---

## 🔗 Related Documentation

- **API Reference**: See `ADDRESS_API.md` for detailed endpoint documentation
- **Setup Guide**: See `EXPRESS_SETUP.md` for installation and configuration
- **Frontend Component**: `app/components/AddressManager.tsx`
- **Source Code**: `server/` directory contains all backend files

---

## 💡 Tips

- Use `curl -v` for verbose output showing headers and response details
- Use `curl -X POST http://url | jq .` to pretty-print JSON responses (requires jq)
- Store frequently used customer ID in a shell variable: `CUST_ID="gid://shopify/Customer/123456789"`
- Test with Postman for a visual interface and history tracking
- Enable server logs to debug request handling

---

## ✅ Success Indicators

✓ All endpoints return 200/201 status codes
✓ Addresses appear in MongoDB when created
✓ Update and delete operations work correctly
✓ Error responses contain helpful validation messages
✓ Performance is fast (responses < 100ms)

**Happy Testing! 🎉**
