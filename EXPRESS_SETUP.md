# Express Address API - Setup & Installation Guide

## Overview

Complete Address Management Express.js backend server for Shopify app with MongoDB and Mongoose.

**Architecture:**
- Frontend: Remix React app (runs on port 3000)
- Backend API: Express.js server (runs on port 8000)
- Database: MongoDB 7.0+ (runs on port 27017)

---

## 📋 Prerequisites

1. **MongoDB 7.0+** - Running locally on `localhost:27017`
2. **Node.js 20+** - Runtime environment
3. **npm 10+** - Package manager
4. **.env.local** - Configured with `MONGODB_URI`

### Verify Prerequisites

```powershell
# Check Node.js
node --version

# Check npm
npm --version

# Check MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

---

## 🚀 Installation

### Step 1: Install Dependencies

The required npm packages are already in your `package.json`:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables

Verify they're installed:

```powershell
npm list express mongoose cors dotenv
```

If missing, install:

```powershell
npm install express mongoose cors dotenv
```

### Step 2: Verify MongoDB Connection

Ensure MongoDB is running and contains test data:

```powershell
# Start MongoDB (if not running)
mongod

# In a new terminal, connect to MongoDB
mongosh

# Check if database exists
show databases

# Switch to the address database
use customize-checkout-address-details

# Check if collection exists
db.addresses.find().limit(2)
```

Expected output should show 2 sample addresses for customer `gid://shopify/Customer/123456789`.

### Step 3: Verify Environment Configuration

Check `.env.local` for correct MongoDB URI:

```env
MONGODB_URI=mongodb://localhost:27017/customize-checkout-address-details
```

---

## 📁 Project Structure

```
server/
├── index.js                    # Main Express app entry point
├── config/
│   └── database.js            # MongoDB connection setup
├── models/
│   └── Address.js             # Mongoose schema & model
├── controllers/
│   └── addressController.js   # Route handler functions
├── routes/
│   └── address.routes.js      # Express routes/endpoints
├── middleware/
│   ├── errorHandler.js        # Centralized error handling
│   └── validation.js          # Input validation middleware
└── services/
    └── addressService.js      # Business logic layer
```

### File Descriptions

| File | Purpose | Created |
|------|---------|---------|
| `server/index.js` | Main Express app, starts server on port 8000 | ✓ |
| `server/config/database.js` | MongoDB connection & pooling | ✓ |
| `server/models/Address.js` | Mongoose Address schema with validation | ✓ |
| `server/controllers/addressController.js` | CRUD handler functions | ✓ |
| `server/routes/address.routes.js` | REST API endpoints | ✓ |
| `server/services/addressService.js` | Business logic for addresses | ✓ |
| `server/middleware/validation.js` | Input validation middleware | ✓ |
| `server/middleware/errorHandler.js` | Error formatting middleware | ✓ |
| `app/components/AddressManager.tsx` | Frontend React component | ✓ |
| `ADDRESS_API.md` | API documentation | ✓ |

---

## 🎯 Running the Server

### Option 1: Direct Node.js

```powershell
cd d:\projects\shopify-app-template-remix

# Start the Express server
node server/index.js
```

Expected output:
```
╔════════════════════════════════════╗
║   Address Management API Server   ║
╚════════════════════════════════════╝

✓ Server is running on port 8000
✓ Health check: http://localhost:8000/health
✓ API docs: http://localhost:8000/api
✓ Base URL: http://localhost:8000/api/addresses

✓ MongoDB connected successfully
✓ Database: customize-checkout-address-details
```

### Option 2: Add npm Script (Recommended)

Update `package.json`:

```json
{
  "scripts": {
    "dev": "remix dev",
    "build": "remix build",
    "start": "remix-serve ./build/index.js",
    "server": "node server/index.js",
    "server:watch": "nodemon server/index.js"
  }
}
```

Then run:

```powershell
npm run server
```

### Option 3: Run Multiple Services (Concurrently)

Install concurrently:

```powershell
npm install --save-dev concurrently
```

Update `package.json`:

```json
{
  "scripts": {
    "dev": "remix dev",
    "dev:full": "concurrently \"npm run dev\" \"npm run server\"",
    "server": "node server/index.js"
  }
}
```

Run both simultaneously:

```powershell
npm run dev:full
```

---

## ✅ Testing the API

### 1. Health Check

```powershell
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

### 2. API Documentation

```powershell
curl http://localhost:8000/api
```

### 3. Test Create Address

```powershell
$headers = @{
    'Content-Type' = 'application/json'
}

$body = @{
    customerId = 'gid://shopify/Customer/123456789'
    first_name = 'Jane'
    last_name = 'Smith'
    address1 = '456 Oak Avenue'
    city = 'Boston'
    province = 'MA'
    country = 'United States'
    zip = '02101'
} | ConvertTo-Json

Invoke-WebRequest -Uri 'http://localhost:8000/api/addresses' `
    -Method POST `
    -Headers $headers `
    -Body $body
```

### 4. Test Get Addresses

```powershell
curl "http://localhost:8000/api/addresses/gid://shopify/Customer/123456789"
```

### 5. Using Postman

1. **Import Collection:**
   - Create new request
   - Set method: POST
   - URL: `http://localhost:8000/api/addresses`
   - Body tab → raw → JSON
   - Paste address data

2. **Test all endpoints:**
   - POST: Create address
   - GET: Fetch all addresses
   - PUT: Update address
   - DELETE: Remove address

---

## 🔍 Debugging

### Check MongoDB Connection

```powershell
node -e "
const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/customize-checkout-address-details';
mongoose.connect(uri).then(() => {
  console.log('✓ Connection successful');
  process.exit(0);
}).catch(err => {
  console.error('✗ Connection failed:', err.message);
  process.exit(1);
});
"
```

### View Server Logs

Enable verbose logging in `server/config/database.js`:

```javascript
await mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  loggerLevel: 'debug', // Add this for verbose logs
});
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB not running. Start with `mongod` |
| `Error: connect ECONNREFUSED` | Check `MONGODB_URI` in `.env.local` |
| `ValidationError` | Validate input fields against schema in `server/models/Address.js` |
| `Cannot find module 'express'` | Run `npm install` |
| `Port 8000 already in use` | Kill process on port 8000 or change port in `server/index.js` |

---

## 🔌 CORS Configuration

The server allows requests from:
- `http://localhost:3000` (Remix dev server)
- `http://localhost:3100`
- `http://localhost:8000`
- `process.env.SHOPIFY_APP_URL` (if set)

To add more origins, edit `server/index.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3100',
    'http://localhost:8000',
    'https://your-production-domain.com', // Add here
    process.env.SHOPIFY_APP_URL,
  ].filter(Boolean),
  credentials: true,
}));
```

---

## 📝 API Endpoints Reference

See `ADDRESS_API.md` for complete endpoint documentation.

### Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/addresses` | Create address |
| GET | `/api/addresses/:customerId` | Get all customer addresses |
| GET | `/api/addresses/address/:addressId` | Get single address |
| PUT | `/api/addresses/:addressId` | Update address |
| DELETE | `/api/addresses/:addressId` | Delete address |
| POST | `/api/addresses/:customerId/:addressId/setDefault` | Set as default |

---

## 🎨 Frontend Integration

### Using AddressManager Component

The component is ready at `app/components/AddressManager.tsx`.

**Import in your route:**

```typescript
import AddressManager from '~/components/AddressManager';

export default function AddressesPage() {
  const customerId = 'gid://shopify/Customer/123456789'; // Get from Shopify context
  
  return (
    <div>
      <h1>Manage Addresses</h1>
      <AddressManager customerId={customerId} />
    </div>
  );
}
```

### Using fetch() Directly

```typescript
// Create address
const response = await fetch('http://localhost:8000/api/addresses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: 'gid://shopify/Customer/123456789',
    first_name: 'John',
    last_name: 'Doe',
    address1: '123 Main St',
    city: 'New York',
    province: 'NY',
    country: 'United States',
    zip: '10001'
  })
});
const data = await response.json();
console.log(data);
```

---

## 📦 Environment Variables

Create or update `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/customize-checkout-address-details

# Express Server
EXPRESS_PORT=8000
NODE_ENV=development

# Shopify
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://your-shopify-dev-domain.ngrok.io

# Session
SESSION_SECRET=your_session_secret

# Database (Prisma - for sessions)
DATABASE_URL=file:./dev.sqlite
```

---

## 🧪 Unit Testing (Optional)

Install Jest:

```powershell
npm install --save-dev jest @types/jest
```

Create `server/__tests__/addresses.test.js`:

```javascript
const addressService = require('../services/addressService');

describe('Address Service', () => {
  test('should create address', async () => {
    const result = await addressService.createAddress({
      customerId: 'gid://shopify/Customer/test123',
      first_name: 'Test',
      last_name: 'User',
      address1: '123 Test St',
      city: 'Testville',
      province: 'TS',
      country: 'Test Country',
      zip: '12345'
    });

    expect(result.success).toBe(true);
    expect(result.data._id).toBeDefined();
  });
});
```

Run tests:

```powershell
npm test
```

---

## 🚀 Deployment Considerations

### For Production:

1. **Environment Variables:**
   - Use secure .env.prod
   - Never commit secrets to git

2. **MongoDB Atlas:**
   - Use managed MongoDB instead of local
   - Update `MONGODB_URI` to Atlas connection string

3. **API Security:**
   - Add authentication (Shopify Admin API)
   - Implement rate limiting
   - Add request logging

4. **Performance:**
   - Enable compression middleware
   - Use caching for frequently accessed data
   - Monitor database indexes

5. **Monitoring:**
   - Add error tracking (Sentry)
   - Monitor server health
   - Log important operations

---

## 📚 Additional Resources

- **Express.js**: https://expressjs.com/
- **Mongoose**: https://mongoosejs.com/
- **MongoDB**: https://docs.mongodb.com/
- **API Documentation**: See `ADDRESS_API.md`
- **Shopify Admin API**: https://shopify.dev/api/admin-rest

---

## ✨ Quick Start Summary

```powershell
# 1. Verify MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# 2. Check dependencies installed
npm list express mongoose cors

# 3. Start Express server
node server/index.js

# 4. Test health endpoint
curl http://localhost:8000/health

# 5. Start Remix dev server (in another terminal)
npm run dev

# 6. Visit frontend in browser
# Use AddressManager component in your routes
```

---

## 🆘 Support

If you encounter issues:

1. Check MongoDB is running: `mongosh`
2. Verify `.env.local` has correct MONGODB_URI
3. Check server logs for error messages
4. Review `ADDRESS_API.md` for endpoint details
5. Ensure Node.js dependencies are installed: `npm install`

---

**Server Status:** Ready to use! 🎉

All files created:
- ✅ server/index.js
- ✅ server/config/database.js
- ✅ server/models/Address.js
- ✅ server/controllers/addressController.js
- ✅ server/routes/address.routes.js
- ✅ server/services/addressService.js
- ✅ server/middleware/validation.js
- ✅ server/middleware/errorHandler.js
- ✅ app/components/AddressManager.tsx
