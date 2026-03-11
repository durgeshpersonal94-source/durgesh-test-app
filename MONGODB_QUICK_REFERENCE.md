# MongoDB & Shopify Address Management - Quick Reference

Save this file in your browser or terminal for quick lookups.

## 🚀 First Time Setup

### macOS/Linux
```bash
chmod +x scripts/setup-local-mongodb.sh
./scripts/setup-local-mongodb.sh
```

### Windows
```bash
scripts\setup-local-mongodb.bat
```

## 📋 Essential Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart MongoDB
```bash
docker-compose restart mongodb
```

### View Logs
```bash
docker-compose logs -f mongodb
```

### Check Health
```bash
docker-compose ps
```

## 🔗 Connection Info

**MongoDB Connection String:**
```
mongodb://shopify_user:shopify_password@localhost:27017/shopify-app?authSource=admin&retryWrites=true&w=majority
```

**Details:**
- Host: `localhost`
- Port: `27017`
- Username: `shopify_user`
- Password: `shopify_password`
- Database: `shopify-app`

## 🌐 Web Interfaces

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| App | http://localhost:3000 | - | - |
| MongoDB Express | http://localhost:8081 | admin | admin |

## 🧪 Quick API Tests

### Get All Addresses
```bash
curl "http://localhost:3000/api/addresses.mongo?customerId=gid://shopify/Customer/123456789"
```

### Create Address
```bash
curl -X POST http://localhost:3000/api/addresses.mongo \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/123456789",
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "New York",
    "province": "NY",
    "country": "United States",
    "zip": "10001"
  }'
```

### Get Single Address
```bash
curl "http://localhost:3000/api/addresses.mongo/[ADDRESS_ID]?customerId=gid://shopify/Customer/123456789"
```

### Update Address
```bash
curl -X PATCH "http://localhost:3000/api/addresses.mongo/[ADDRESS_ID]" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/123456789",
    "city": "Los Angeles"
  }'
```

### Delete Address
```bash
curl -X DELETE "http://localhost:3000/api/addresses.mongo/[ADDRESS_ID]?customerId=gid://shopify/Customer/123456789"
```

### Set as Default
```bash
curl -X POST "http://localhost:3000/api/addresses.mongo/[ADDRESS_ID]?action=setDefault&customerId=gid://shopify/Customer/123456789"
```

## 💻 Development Workflow

```bash
# 1. Start MongoDB
docker-compose up -d

# 2. Install dependencies
npm install

# 3. Update .env.local with Shopify credentials
# SHOPIFY_API_KEY=...
# SHOPIFY_API_SECRET=...

# 4. Start dev server
npm run dev

# 5. Test API in another terminal
curl "http://localhost:3000/api/addresses.mongo?customerId=test"

# 6. Stop services
docker-compose down
```

## 🗄️ MongoDB Shell Snippets

```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh

# Inside mongosh:

# Use database
use shopify-app

# Show collections
show collections

# Count addresses
db.addresses.countDocuments()

# Find all addresses
db.addresses.find()

# Find by customer
db.addresses.find({ customerId: "gid://shopify/Customer/123456789" })

# Find default address
db.addresses.findOne({ isDefault: true, customerId: "..." })

# Show indexes
db.addresses.getIndexes()

# Exit
exit
```

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Port 27017 in use | Kill process or use different port in docker-compose.yml |
| MongoDB won't start | Check Docker is running, restart: `docker-compose restart mongodb` |
| Connection refused | Verify MongoDB is healthy: `docker-compose ps` |
| Can't find .env.local | Copy from template: `cp .env.local.example .env.local` |
| Can't connect from app | Check MONGODB_URI in .env.local and Docker is running |

## 📚 Documentation Files

- **Setup Guide:** [LOCAL_MONGODB_SETUP.md](LOCAL_MONGODB_SETUP.md)
- **API Reference:** [docs/ADDRESS_MONGODB_API.md](docs/ADDRESS_MONGODB_API.md)
- **This File:** [MONGODB_QUICK_REFERENCE.md](MONGODB_QUICK_REFERENCE.md)

## 🔐 Default Credentials (Development Only)

- MongoDB: `shopify_user` / `shopify_password`
- MongoDB Express: `admin` / `admin`

## 📊 Sample Data

Three addresses are pre-loaded for customer `gid://shopify/Customer/123456789`:
1. New York (Default)
2. Los Angeles
3. Chicago

Test APIs against this customer ID.

## ⚡ Useful Aliases

Add to your shell profile:

```bash
# MongoDB commands
alias mongo-start='docker-compose up -d'
alias mongo-stop='docker-compose down'
alias mongo-logs='docker-compose logs -f mongodb'
alias mongo-shell='docker-compose exec mongodb mongosh'
alias mongo-health='docker-compose exec mongodb mongosh --eval "db.adminCommand('"'"'ping'"'"')"'

# App commands
alias app-dev='npm run dev'
alias app-install='npm install'
```

## 🔗 Useful Links

- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- Docker Docs: https://docs.docker.com/
- Shopify Dev: https://shopify.dev/
- Remix Docs: https://remix.run/

---

**Version:** 1.0.0 | **Last Updated:** March 11, 2026
