# 🚀 Quick Start - Address Management System

**Everything is ready!** Follow these steps to get the Address Management API running.

---

## ⚡ 5-Minute Setup

### Prerequisites ✅
- MongoDB 7.0+ running locally (`mongod` command)
- Node.js 20+ installed
- npm installed

### Step 1: Verify Dependencies (30 seconds)

```powershell
# One-time setup - install new packages
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-origin support
- `dotenv` - Environment configuration
- `nodemon` - Auto-reload for development
- `concurrently` - Run multiple scripts

### Step 2: Start MongoDB (30 seconds)

Open a terminal and run:

```powershell
mongod
```

**Expected output:**
```
[mongod] waiting for connections on port 27017
```

**Verify it's working:**
```powershell
mongosh --eval "db.adminCommand('ping')"
# { ok: 1 }
```

### Step 3: Start Express Server (1 minute)

Open a **new terminal** and run:

```powershell
npm run server
```

**Expected output:**
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

### Step 4: Start Remix Frontend (1 minute)

Open a **third terminal** and run:

```powershell
npm run dev
```

This starts the Shopify app preview on `http://localhost:3000`.

### Step 5: Test API (1 minute)

In a **fourth terminal**, run:

```bash
# Health check
curl http://localhost:8000/health

# Get all sample addresses
curl "http://localhost:8000/api/addresses/gid://shopify/Customer/123456789"
```

**✅ Done!** Your system is running.

---

## 🎯 Quick Commands

### Development

```powershell
# Terminal 1: MongoDB
mongod

# Terminal 2: Express Backend
npm run server

# Terminal 3: Remix Frontend
npm run dev

# Terminal 4: Testing
curl http://localhost:8000/health
```

### All-in-One (requires concurrently)

Run both Remix and Express together:

```powershell
npm run dev:full
```

### Development with Auto-Reload

```powershell
npm run server:dev  # Auto-reloads on file changes
```

---

## 📍 URL Reference

| Service | URL | Purpose |
|---------|-----|---------|
| **Remix Frontend** | http://localhost:3000 | Web UI (Shopify preview) |
| **Express API** | http://localhost:8000 | REST API server |
| **Health Check** | http://localhost:8000/health | Server status |
| **API Docs** | http://localhost:8000/api | Endpoint list |
| **MongoDB** | localhost:27017 | Database |

---

## 🧪 Test the API

### Create an Address

```bash
curl -X POST http://localhost:8000/api/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/123456789",
    "first_name": "Alice",
    "last_name": "Johnson",
    "address1": "789 Elm Street",
    "city": "Chicago",
    "province": "IL",
    "country": "United States",
    "zip": "60601"
  }'
```

**Expected:** Status 201 with new address data

### Get All Addresses

```bash
curl "http://localhost:8000/api/addresses/gid://shopify/Customer/123456789"
```

**Expected:** Status 200 with array of addresses

### Update an Address

```bash
# Replace ADDRESSID with actual ID
curl -X PUT http://localhost:8000/api/addresses/ADDRESSID \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Boston",
    "province": "MA"
  }'
```

**Expected:** Status 200 with updated address

### Delete an Address

```bash
# Replace ADDRESSID with actual ID
curl -X DELETE http://localhost:8000/api/addresses/ADDRESSID
```

**Expected:** Status 200 with success message

---

## 🎨 Frontend Integration

Use the AddressManager component in any Remix route:

```typescript
// app/routes/addresses.tsx
import AddressManager from '~/components/AddressManager';

export default function AddressesPage() {
  const customerId = 'gid://shopify/Customer/123456789'; // From Shopify
  
  return (
    <div>
      <h1>Manage Your Addresses</h1>
      <AddressManager customerId={customerId} />
    </div>
  );
}
```

---

## 📂 File Structure

```
server/
├── index.js                    # Main Express app ⭐
├── config/database.js          # MongoDB connection
├── models/Address.js           # Data schema
├── controllers/addressController.js  # Business logic
├── routes/address.routes.js    # API endpoints
├── services/addressService.js  # Reusable functions
└── middleware/                 # Validation & errors

app/components/
└── AddressManager.tsx          # React component ⭐
```

---

## 🔍 Debugging

### Check if MongoDB is Running

```powershell
mongosh
db.adminCommand('ping')
# Should return: { ok: 1 }
```

### View Sample Data

```powershell
mongosh
use customize-checkout-address-details
db.addresses.find().pretty()
```

### Check Server Logs

Look for console output:
- `✓ Server is running on port 8000` ✅ Server started
- `✓ MongoDB connected successfully` ✅ Database connected
- Error messages tell you what went wrong

### Port Already in Use?

If port 8000 is already used:

```powershell
# Find process on port 8000
netstat -ano | findstr :8000

# Kill it (replace PID)
taskkill /PID <PID> /F
```

Or change port in `server/index.js`:
```javascript
const PORT = 8001; // Change to 8001
```

---

## 📚 Documentation

For detailed information, see:

| Document | Purpose |
|----------|---------|
| **ADDRESS_API.md** | Complete API reference with all endpoints |
| **EXPRESS_SETUP.md** | Installation & configuration guide |
| **API_TESTING_GUIDE.md** | Testing scenarios & cURL examples |
| **ADDRESS_MANAGEMENT_README.md** | Overview & integration guide |

---

## ✅ Verification Checklist

- [ ] MongoDB running: `mongosh --eval "db.adminCommand('ping')"`
- [ ] Express started: `npm run server` shows port 8000 ✓
- [ ] Health check passes: `curl http://localhost:8000/health`
- [ ] Remix dev running: `npm run dev` shows preview
- [ ] Can create address: POST `http://localhost:8000/api/addresses`
- [ ] Can fetch addresses: GET `http://localhost:8000/api/addresses/{customerId}`
- [ ] Sample data exists in MongoDB

---

## 🎯 Common Tasks

### Test Create Address

```bash
curl -X POST http://localhost:8000/api/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/123456789",
    "first_name": "Test",
    "last_name": "User",
    "address1": "123 Test St",
    "city": "Testville",
    "province": "TS",
    "country": "Test Country",
    "zip": "12345"
  }'
```

### View Addresses in Database

```powershell
mongosh customize-checkout-address-details
db.addresses.find()
```

### Reset Sample Data

```powershell
mongosh customize-checkout-address-details
db.addresses.deleteMany({})
# Re-run: node scripts/mongo-init.js
```

### Stop Services

```powershell
# Ctrl+C in each terminal to stop:
# - MongoDB
# - Express server
# - Remix dev server
```

---

## 🚨 If Something Goes Wrong

### Express Won't Start

**Problem:** `Cannot find module 'express'`
**Solution:** Run `npm install`

**Problem:** `ECONNREFUSED 127.0.0.1:27017`
**Solution:** Start MongoDB: `mongod`

### API Returns 400 Errors

**Problem:** Validation failed
**Solution:** Check required fields in request body

**Problem:** Address not found (404)
**Solution:** Use correct address ID from database

### Frontend Can't Reach API

**Problem:** CORS error
**Solution:** Ensure Express is running on port 8000, check CORS config

---

## 💡 Pro Tips

1. **Keep Terminal Windows Visible**
   - Terminal 1: MongoDB (watch for connection issues)
   - Terminal 2: Express (watch for request logs)
   - Terminal 3: Remix (watch for dev server issues)
   - Terminal 4: Testing (run commands)

2. **Use curl with -v flag for debugging**
   ```bash
   curl -v http://localhost:8000/api/addresses/xxx
   # Shows headers, status codes, response body
   ```

3. **Check server logs first** when something breaks
   - Express logs show which routes were called
   - MongoDB logs show connection issues
   - Remix logs show frontend errors

4. **Restart in this order** if things get stuck
   1. Kill Remix (`Ctrl+C`)
   2. Kill Express (`Ctrl+C`)
   3. Kill MongoDB (`Ctrl+C`)
   4. Start MongoDB again: `mongod`
   5. Start Express: `npm run server`
   6. Start Remix: `npm run dev`

---

## 📞 Need Help?

1. Check **EXPRESS_SETUP.md** for detailed troubleshooting
2. Review **API_TESTING_GUIDE.md** for test examples
3. See **ADDRESS_API.md** for endpoint specifications
4. Check console logs for error messages

---

## 🎉 You're Ready!

```powershell
# Run this in sequence:
mongod                    # Terminal 1
npm run server           # Terminal 2
npm run dev              # Terminal 3
curl http://localhost:8000/health  # Terminal 4
```

**Start building! 🚀**

---

**Status:** ✅ Ready to Use  
**Created:** 2024-03-15  
**Last Updated:** 2024-03-15  
**Version:** 1.0.0
