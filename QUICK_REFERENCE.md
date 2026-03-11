# Address Management Routes - Quick Reference

## 🚀 Quick Start

```powershell
# Terminal 1
mongod

# Terminal 2
npm run server

# Terminal 3
npm run dev

# Then visit: http://localhost:3000/addresses
```

---

## 📍 Routes Overview

```
GET    /addresses              List all addresses
GET    /addresses/new          Create form
POST   /addresses              Create (submit)
GET    /addresses/[id]/edit    Edit form [SEPARATE ROUTE]
POST   /addresses/[id]/edit    Update (submit)
POST   /addresses              Delete (submit from list)
POST   /addresses/[id]/setDefault Set default
```

---

## 📂 Files

```
app/routes/
├── addresses.tsx
├── addresses._index.tsx
├── addresses.new.tsx
├── addresses.[id].edit.tsx
└── addresses.[id].setDefault.tsx
```

---

## 🎯 CRUD Operations

| Op | Route | File | Form? |
|----|-------|------|-------|
| **C**reate | `/addresses/new` | addresses.new.tsx | Yes |
| **R**ead | `/addresses` | addresses._index.tsx | No |
| **U**pdate | `/addresses/[id]/edit` | addresses.[id].edit.tsx | Yes |
| **D**elete | `/addresses` | addresses._index.tsx | No |
| Bonus | `/addresses/[id]/setDefault` | addresses.[id].setDefault.tsx | No |

---

## 📝 Form Fields

All available in create & edit forms:

```
first_name (required)
last_name (required)
address1 (required)
address2 (optional)
city (required)
province (required)
country (required)
zip (required)
phone (optional)
isDefault (checkbox)
```

---

## ✨ Features

✅ List addresses  
✅ Create address  
✅ Edit address (SEPARATE ROUTE)  
✅ Delete address  
✅ Set default address  
✅ Form validation  
✅ Error messages  
✅ Responsive UI  

---

## 🔗 Links

- List: `/addresses`
- New: `/addresses/new`
- Edit: `/addresses/{addressId}/edit`
- Delete: Button on list page
- Default: Button on list page

---

## 🧪 Manual Testing

```bash
# Create
curl -X POST http://localhost:8000/api/addresses \
  -H "Content-Type: application/json" \
  -d '{"customerId":"gid://shopify/Customer/123456789",...}'

# List
curl http://localhost:8000/api/addresses/gid://shopify/Customer/123456789

# Update
curl -X PUT http://localhost:8000/api/addresses/[id] \
  -H "Content-Type: application/json" \
  -d '{...}'

# Delete
curl -X DELETE http://localhost:8000/api/addresses/[id]
```

---

## ⚙️ Configuration Required

- Express API running: `http://localhost:8000`
- MongoDB running: `mongodb://localhost:27017`
- Remix running: `http://localhost:3000`

---

## 📊 Architecture

```
Remix UI Routes
    ↓
Remix Loaders/Actions
    ↓
Express API (http://localhost:8000)
    ↓
MongoDB
```

---

## 🎨 User Flow

```
/addresses
   ├─ Click "+ Add" → /addresses/new
   ├─ Click "Edit" → /addresses/[id]/edit [SEPARATE]
   ├─ Click "Delete" → Confirm → Delete
   └─ Click "Set Default" → Update
```

---

## 💾 Data Flow

### Create
```
Form → /addresses/new → POST action → Express API → MongoDB → Redirect
```

### Read
```
Route → Loader → API → List Display
```

### Update
```
/addresses/[id]/edit → POST action → Express API → MongoDB → Redirect
```

### Delete
```
List page → POST action → Express API → MongoDB → Refresh
```

---

## ❌ Troubleshooting

| Issue | Solution |
|-------|----------|
| Express 404 | Start with `npm run server` |
| MongoDB error | Start with `mongod` |
| Form won't submit | Check Express server logs |
| No addresses shown | Check if data in MongoDB |
| Wrong URL | Use `/addresses` not `/address` |

---

## 📞 Help

See full documentation:
- `CRUD_ROUTES_COMPLETE.md` - Complete guide
- `REMIX_ROUTES_GUIDE.md` - Detailed breakdown
- `EXPRESS_SETUP.md` - Backend setup
- `ADDRESS_API.md` - API reference

---

**Status:** ✅ Ready to use!
