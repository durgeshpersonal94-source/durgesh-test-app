# Quick Start - Address Management with MongoDB

Get up and running in 5 minutes!

## Prerequisites

- Docker Desktop installed
- Node.js 20.19+ installed
- npm installed

## Step 1: Start MongoDB (2 minutes)

### On macOS/Linux:
```bash
chmod +x scripts/setup-local-mongodb.sh
./scripts/setup-local-mongodb.sh
```

### On Windows:
```bash
scripts\setup-local-mongodb.bat
```

✅ **Expected output:**
- MongoDB container started
- MongoDB Express running at http://localhost:8081
- Connection string displayed

## Step 2: Install Dependencies (1 minute)

```bash
npm install
```

## Step 3: Configure Environment (1 minute)

Edit `.env.local`:

```env
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_APP_URL=http://localhost:3000
SCOPES=write_customers,read_customers
```

Get these values from your Shopify Partner Dashboard.

## Step 4: Start Development Server (1 minute)

```bash
npm run dev
```

✅ **Expected output:**
```
✓ Remix dev server listening on http://localhost:3000
✓ MongoDB connected successfully
```

## Step 5: Test the API (immediately!)

Open a new terminal and test:

```bash
# Get sample addresses (3 pre-loaded)
curl "http://localhost:3000/api/addresses.mongo?customerId=gid://shopify/Customer/123456789"
```

✅ **Expected response:**
```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "_id": "...",
      "customerId": "gid://shopify/Customer/123456789",
      "firstName": "John",
      "lastName": "Doe",
      "address1": "123 Main Street",
      "city": "New York",
      "province": "NY",
      "country": "United States",
      "zip": "10001",
      "isDefault": true
    },
    // ... more addresses
  ]
}
```

## Common Tasks

### Create an Address
```bash
curl -X POST http://localhost:3000/api/addresses.mongo \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/123456789",
    "firstName": "Alice",
    "lastName": "Johnson",
    "address1": "999 Market Street",
    "city": "San Francisco",
    "province": "CA",
    "country": "United States",
    "zip": "94102",
    "phone": "+1-555-1234"
  }'
```

### Get All Addresses for a Customer
```bash
curl "http://localhost:3000/api/addresses.mongo?customerId=gid://shopify/Customer/987654321"
```

### Update an Address
```bash
# Get the address ID from create or list response first
curl -X PATCH "http://localhost:3000/api/addresses.mongo/[ADDRESS_ID]" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/123456789",
    "city": "Los Angeles"
  }'
```

### Set as Default Address
```bash
curl -X POST "http://localhost:3000/api/addresses.mongo/[ADDRESS_ID]?action=setDefault&customerId=gid://shopify/Customer/123456789"
```

### Delete an Address
```bash
curl -X DELETE "http://localhost:3000/api/addresses.mongo/[ADDRESS_ID]?customerId=gid://shopify/Customer/123456789"
```

## MongoDB Express Web UI

Access the MongoDB management interface:
- **URL:** http://localhost:8081
- **Username:** admin
- **Password:** admin

Browse collections, view documents, and monitor your database visually.

## Useful Links

- **Full Documentation:** [LOCAL_MONGODB_SETUP.md](LOCAL_MONGODB_SETUP.md)
- **Complete API Reference:** [docs/ADDRESS_MONGODB_API.md](docs/ADDRESS_MONGODB_API.md)
- **Quick Reference:** [MONGODB_QUICK_REFERENCE.md](MONGODB_QUICK_REFERENCE.md)

## Troubleshooting

### MongoDB won't start
```bash
# Make sure Docker is running, then:
docker-compose ps

# If not running:
docker-compose restart mongodb

# Wait 10 seconds and check health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Port 27017 already in use
```bash
# Find what's using it:
lsof -i :27017  # macOS/Linux

# Kill the process or restart Docker
```

### Can't connect from app
1. Check .env.local has MONGODB_URI set
2. Verify MongoDB is running: `docker-compose ps`
3. Restart the dev server: Stop with Ctrl+C, run `npm run dev` again

### Forgotten format of request body?
Check the [API Reference](docs/ADDRESS_MONGODB_API.md#2-create-a-new-address) for examples.

## Next Steps

1. ✅ Read [LOCAL_MONGODB_SETUP.md](LOCAL_MONGODB_SETUP.md) for complete documentation
2. ✅ Read [docs/ADDRESS_MONGODB_API.md](docs/ADDRESS_MONGODB_API.md) for all endpoints
3. ✅ Integrate address management into your app components
4. ✅ Handle API responses in your frontend

## Sample Customer ID for Testing

All sample data uses this customer ID:
```
gid://shopify/Customer/123456789
```

Use this in all test requests.

## Storage

- Database: `shopify-app`
- Collection: `addresses`
- Data persists in Docker volume even after restart (`docker-compose down`)
- Delete all data with: `docker-compose down -v`

## Stack

✅ MongoDB 7.0 - NoSQL database  
✅ Mongoose 8.0.0 - Schema & validation  
✅ Remix 2.16.1 - Web framework  
✅ Node.js 20+ - Runtime  
✅ Docker - Local development  
✅ Shopify Admin API - Authentication  

---

**Ready to start? Run the setup script now! 🚀**
