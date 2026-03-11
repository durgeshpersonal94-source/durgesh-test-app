# Address Management with MongoDB - Complete Setup Guide

This guide provides complete setup instructions for using MongoDB with Mongoose for address management in your Shopify app.

## Overview

This implementation provides a complete CRUD system for managing customer addresses using:
- **MongoDB 7.0** - NoSQL document database
- **Mongoose 8.0.0** - ODM for schema validation and database operations
- **Remix** - Web framework for API endpoints
- **Docker Compose** - Local development environment

## Features

✅ Add multiple addresses for each customer  
✅ Update existing addresses  
✅ Delete addresses  
✅ Fetch all addresses for a customer  
✅ Set/fetch default address  
✅ Full input validation with detailed error messages  
✅ Proper error handling  
✅ REST API endpoints  
✅ Local MongoDB with Docker  
✅ Sample data included  

## Prerequisites

- **Docker Desktop** - https://www.docker.com/products/docker-desktop
- **Node.js 20.19+** - Already installed
- **npm** - Already installed

## Quick Start (5 minutes)

### 1. Start MongoDB

**On macOS/Linux:**
```bash
chmod +x scripts/setup-local-mongodb.sh
./scripts/setup-local-mongodb.sh
```

**On Windows:**
```bash
scripts\setup-local-mongodb.bat
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Shopify Credentials
Edit `.env.local`:
```env
SHOPIFY_API_KEY=your_key_here
SHOPIFY_API_SECRET=your_secret_here
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test API
```bash
curl "http://localhost:3000/api/addresses.mongo?customerId=gid://shopify/Customer/123456789"
```

## Database Schema

### Address Document Structure

```javascript
{
  _id: ObjectId,
  customerId: String,        // Shopify customer ID
  firstName: String,         // 2-50 characters
  lastName: String,          // 2-50 characters
  address1: String,          // Main street address (5-100 chars)
  address2: String,          // Optional apartment/suite
  city: String,              // 2-50 characters
  province: String,          // State/Province (2-50 chars)
  country: String,           // Country (2-50 chars)
  zip: String,               // ZIP/Postal code (3-20 chars)
  phone: String,             // Optional (max 20 chars)
  isDefault: Boolean,        // Mark as default address
  createdAt: Date,           // Automatically set
  updatedAt: Date            // Automatically set
}
```

### Indexes

The following indexes are created for performance:
- `customerId` - Fast customer lookups
- `customerId + isDefault` - Quick default address queries
- `customerId + createdAt` - Ordered address listings

## API Endpoints

### 1. Get All Addresses for Customer

```http
GET /api/addresses.mongo?customerId=gid://shopify/Customer/123456789
```

**Response:**
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
      "city": "New York",
      "province": "NY",
      "country": "United States",
      "zip": "10001",
      "phone": "+1-555-0100",
      "isDefault": true,
      "createdAt": "2026-03-11T10:00:00.000Z",
      "updatedAt": "2026-03-11T10:00:00.000Z"
    }
  ]
}
```

### 2. Create New Address

```http
POST /api/addresses.mongo
Content-Type: application/json

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

**Response (201):**
```json
{
  "success": true,
  "message": "Address created successfully",
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
    "isDefault": false,
    "createdAt": "2026-03-11T10:00:00.000Z",
    "updatedAt": "2026-03-11T10:00:00.000Z"
  }
}
```

### 3. Get Single Address

```http
GET /api/addresses.mongo/507f1f77bcf86cd799439011?customerId=gid://shopify/Customer/123456789
```

**Response:**
```json
{
  "success": true,
  "message": "Address retrieved successfully",
  "data": { /* address object */ }
}
```

### 4. Update Address

```http
PATCH /api/addresses.mongo/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "customerId": "gid://shopify/Customer/123456789",
  "city": "Los Angeles",
  "province": "CA",
  "zip": "90001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": { /* updated address object */ }
}
```

### 5. Delete Address

```http
DELETE /api/addresses.mongo/507f1f77bcf86cd799439011?customerId=gid://shopify/Customer/123456789
```

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

### 6. Set as Default Address

```http
POST /api/addresses.mongo/507f1f77bcf86cd799439011?action=setDefault&customerId=gid://shopify/Customer/123456789
```

**Response:**
```json
{
  "success": true,
  "message": "Default address set successfully",
  "data": { /* address object */ }
}
```

## MongoDB Connection

### Connection String
```
mongodb://shopify_user:shopify_password@localhost:27017/shopify-app?authSource=admin&retryWrites=true&w=majority
```

### Connection Details
| Property | Value |
|----------|-------|
| Host | localhost |
| Port | 27017 |
| Username | shopify_user |
| Password | shopify_password |
| Database | shopify-app |
| Auth Database | admin |

### Environment Variable
```env
MONGODB_URI=mongodb://shopify_user:shopify_password@localhost:27017/shopify-app?authSource=admin&retryWrites=true&w=majority
```

## MongoDB Express Web UI

Access the MongoDB management interface:
- **URL:** http://localhost:8081
- **Username:** admin
- **Password:** admin

Features:
- Browse collections
- View/edit documents
- Manage indexes
- Monitor database stats
- Execute queries

## Docker Commands

### Start Containers
```bash
docker-compose up -d
```

### Stop Containers
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f mongodb
```

### Check Status
```bash
docker-compose ps
```

### Reset Database (Delete All Data)
```bash
docker-compose down -v
docker-compose up -d
```

### Access MongoDB Shell
```bash
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

## Troubleshooting

### MongoDB Not Starting

**Error:** Connection refused

**Solution:**
1. Ensure Docker Desktop is running
2. Check port 27017 is not in use: `lsof -i :27017` (macOS/Linux)
3. Restart containers: `docker-compose restart mongodb`

### Port Already in Use

**Error:** Port 27017 is already allocated

**Solution:**
1. Find process using port and kill it
2. Or edit `docker-compose.yml` to use different port:
   ```yaml
   ports:
     - "27018:27017"  # Map to different port
   ```

### Connection Failed

**Error:** Authentication failed

**Verify:**
- Connection string has correct credentials
- `authSource=admin` is included
- MongoDB container is running and healthy

### Can't Access MongoDB Express

**Solution:**
1. Verify MongoDB is healthy first
2. Check port 8081 is free
3. Restart service: `docker-compose restart mongoexpress`

### Data Not Persisting

**Solution:**
- MongoDB data is stored in Docker volume
- If deleted with `docker-compose down -v`, all data is lost
- For development, use `docker-compose down` (preserves data)

## Node.js Integration

### Connection Management

The app uses global connection caching to avoid creating multiple connections:

```javascript
import { connectDB, getDB } from '~/lib/mongodb.server';

// Connect to MongoDB
const db = await connectDB();

// Later, get cached connection
const db = await getDB();
```

### Address Service

All CRUD operations are available from the service:

```javascript
import {
  addAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress
} from '~/services/addressMongo.server';

// Use any function
const result = await addAddress({
  customerId: 'gid://shopify/Customer/123456789',
  firstName: 'John',
  // ... other fields
});

if (result.success) {
  console.log(result.data); // Address object
} else {
  console.log(result.errors); // Validation errors
}
```

## Environment Configuration

### Required Variables

```env
# MongoDB
MONGODB_URI=mongodb://shopify_user:shopify_password@localhost:27017/shopify-app?authSource=admin&retryWrites=true&w=majority

# Shopify
SHOPIFY_API_KEY=your_key
SHOPIFY_API_SECRET=your_secret
SHOPIFY_APP_URL=http://localhost:3000
SCOPES=write_customers,read_customers

# Session
DATABASE_URL=file:./dev.sqlite
SESSION_SECRET=your-secret-key
```

### Optional Variables

```env
# Logging
DEBUG=shopify:*

# CORS
CORS_ORIGIN=*

# MongoDB Options
MONGODB_MAX_POOL_SIZE=10
MONGODB_SOCKET_TIMEOUT=45000
```

## File Structure

```
app/
  lib/
    mongodb.server.ts          # Connection management
  models/
    Address.server.ts          # Mongoose schema
  services/
    addressMongo.server.ts     # Business logic
  routes/
    api.addresses.mongo.tsx    # List/Create endpoints
    api.addresses.mongo.$id.tsx # Single operation endpoints

scripts/
  mongo-init.js                # MongoDB initialization
  setup-local-mongodb.sh       # Linux/macOS setup
  setup-local-mongodb.bat      # Windows setup

docker-compose.yml             # Docker services
.env.local.example             # Configuration template
```

## Next Steps

1. ✅ Run setup script to start MongoDB
2. ✅ Install npm dependencies
3. ✅ Update .env.local with Shopify credentials
4. ✅ Start development server
5. ✅ Test API endpoints
6. ✅ Read API documentation (docs/ADDRESS_MONGODB_API.md)

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review MongoDB logs: `docker-compose logs mongodb`
3. Check app logs in terminal output
4. Read MongoDB documentation: https://docs.mongodb.com/

## Technology Stack

- MongoDB 7.0
- Mongoose 8.0.0
- Node.js 20+
- Remix 2.16.1
- Docker Compose
- Shopify App Framework

---

**Last Updated:** March 11, 2026
