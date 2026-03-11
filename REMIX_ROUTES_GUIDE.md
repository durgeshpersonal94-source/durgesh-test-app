# Complete Address Management - Remix Routes

**Status:** ✅ FULLY IMPLEMENTED AND READY

All address CRUD operations are now available as separate Remix routes with full UI forms and actions.

---

## 📍 Route Structure

### Main Routes

```
/addresses                    - List all addresses (main page)
/addresses/new               - Create new address form
/addresses/[id]/edit         - SEPARATE route for editing address
/addresses/[id]/setDefault   - Set address as default
```

### Route File Locations

```
app/routes/
├── addresses.tsx                    # Layout wrapper
├── addresses._index.tsx             # List & Delete
├── addresses.new.tsx                # Create new
├── addresses.[id].edit.tsx          # Edit (SEPARATE route as requested)
└── addresses.[id].setDefault.tsx    # Set default
```

---

## 🎯 What Each Route Does

### 1. **GET /addresses** (addresses._index.tsx)
**List all customer addresses**

Features:
- ✅ Fetches all addresses for customer from Express API
- ✅ Displays in card grid layout
- ✅ Shows address details with default badge
- ✅ "Edit" button → links to edit route
- ✅ "Delete" button → inline confirmation then POST delete
- ✅ "Set Default" button → links to setDefault route
- ✅ "+ Add New Address" button → links to /addresses/new

**Action:** POST (handles delete)

---

### 2. **GET /addresses/new** (addresses.new.tsx)
**Create new address form**

Features:
- ✅ Empty form with all required fields
- ✅ Fields: customerId (hidden), first_name, last_name, address1, address2, city, province, country, zip, phone, isDefault checkbox
- ✅ Form validation with error display
- ✅ Submit button: "Create Address"
- ✅ Cancel button: Back to list
- ✅ Calls Express API: POST /api/addresses

**Action:** POST (handles create)

---

### 3. **GET /addresses/[id]/edit** (addresses.[id].edit.tsx) - **SEPARATE ROUTE**
**Edit existing address form - DEDICATED ROUTE FOR EDITING**

Features:
- ✅ Pre-loads address from Express API
- ✅ Form populated with current values
- ✅ All fields editable (except customerId)
- ✅ Shows metadata: Address ID, Created date, Last updated
- ✅ Submit button: "Update Address"
- ✅ Cancel button: Back to list
- ✅ Calls Express API: PUT /api/addresses/[id]

**Action:** POST (handles update)

---

### 4. **POST /addresses/[id]/setDefault** (addresses.[id].setDefault.tsx)
**Set address as default for customer**

Features:
- ✅ No form, direct action
- ✅ Called via link from addresses list
- ✅ Calls Express API: POST /api/addresses/:customerId/:addressId/setDefault
- ✅ Redirects back to /addresses after success

---

## 🔄 API Integration

All routes connect to your Express backend at `http://localhost:8000/api/addresses`

### Endpoint Mapping

| Operation | Remix Route | HTTP Method | Express Endpoint | Express Method |
|-----------|-------------|-------------|------------------|----------------|
| List | GET /addresses | - | `/api/addresses/:customerId` | GET |
| Create | GET /addresses/new | - | `/api/addresses` | POST |
| Create Submit | - | POST | `/api/addresses` | POST |
| Edit Form | GET /addresses/[id]/edit | - | `/api/addresses/address/:id` | GET |
| Update | - | POST | `/api/addresses/:id` | PUT |
| Delete | - | POST | `/api/addresses/:id` | DELETE |
| Set Default | - | POST | `/api/addresses/:customerId/:id/setDefault` | POST |

---

## 📝 Form Fields

All forms include these fields (from your specification):

```
✓ customerId          (hidden, auto-populated)
✓ first_name          (required, 2-50 chars)
✓ last_name           (required, 2-50 chars)
✓ address1            (required, 5-100 chars)
✓ address2            (optional)
✓ city                (required, 2-50 chars)
✓ province            (required, 2-50 chars)
✓ country             (required, 2-50 chars)
✓ zip                 (required, 3-20 alphanumeric)
✓ phone               (optional)
✓ isDefault           (checkbox, optional)
```

---

## 🧪 Testing the Routes

### 1. Start Stack
```powershell
# Terminal 1: MongoDB
mongod

# Terminal 2: Express API
npm run server

# Terminal 3: Remix dev server
npm run dev
```

### 2. Navigate to Addresses
- Go to: `http://localhost:3000/addresses`
- Should see list page with sample addresses

### 3. Test Each Operation

**Create:**
- Click "+ Add New Address"
- Fill form
- Submit
- Should redirect to list

**Edit:**
- Click "Edit" on any address
- Change values
- Submit
- Should update and redirect

**Delete:**
- Click "Delete"
- Confirm
- Should remove and stay on list

**Set Default:**
- Click "Set Default"
- Should update and stay on list

---

## 🎨 Error Handling

Each form displays:
- ✅ Top-level error message
- ✅ Field-specific validation errors
- ✅ "Server not running" friendly message
- ✅ Redirects on success

---

## 📂 Complete File Structure

```
app/routes/
├── addresses.tsx
│   └── Layout wrapper for all address routes
│
├── addresses._index.tsx
│   ├── Loader: Fetch all addresses
│   ├── Action: Delete address
│   └── UI: List view with action buttons
│
├── addresses.new.tsx
│   ├── Loader: Get customerId
│   ├── Action: Create new address
│   └── UI: Form with all required fields
│
├── addresses.[id].edit.tsx (SEPARATE ROUTE)
│   ├── Loader: Fetch single address
│   ├── Action: Update address
│   └── UI: Pre-filled form with metadata
│
└── addresses.[id].setDefault.tsx
    ├── No loader
    ├── Action: Set as default
    └── No UI (action only)
```

---

## 🔗 Navigation Flow

```
Start → /addresses (list)
         ├→ Click "+ Add" → /addresses/new → Fill & submit → redirect to /addresses
         ├→ Click "Edit" → /addresses/[id]/edit → Update & submit → redirect to /addresses
         ├→ Click "Delete" → Confirm inline → POST delete → refresh /addresses
         └→ Click "Set Default" → POST setDefault → refresh /addresses
```

---

## ✅ Feature Checklist

- [x] List all addresses for customer
- [x] Create new address (separate route: /addresses/new)
- [x] Edit existing address (SEPARATE ROUTE: /addresses/[id]/edit)
- [x] Delete address
- [x] Set default address
- [x] All required fields included
- [x] Form validation with error messages
- [x] Responsive design
- [x] Error handling
- [x] Success redirects
- [x] Integrated with Express API
- [x] Separate edit route (as requested)

---

## 🚀 Usage Example

In your Shopify app, link to address management:

```typescript
// In any route component:
<a href="/addresses">
  Manage Addresses
</a>
```

Or create a custom page:

```typescript
import { Link } from '@remix-run/react';

export default function AccountPage() {
  return (
    <div>
      <h1>My Account</h1>
      <Link to="/addresses">Manage My Addresses</Link>
    </div>
  );
}
```

---

## 🔑 Key Features

### Separate Edit Route (As Requested)
✅ Dedicated route: `/addresses/[id]/edit`
✅ Not combined with list route
✅ Own form and action handler
✅ Pre-loads current address data
✅ Shows metadata (created/updated times)

### CRUD Operations
✅ **C**reate: /addresses/new → POST /api/addresses
✅ **R**ead: /addresses → GET /api/addresses/:customerId
✅ **U**pdate: /addresses/[id]/edit → PUT /api/addresses/:id
✅ **D**elete: /addresses → DELETE /api/addresses/:id

### Additional
✅ Set Default: /addresses/[id]/setDefault → POST /api/addresses/:customerId/:id/setDefault

---

## ⚠️ Important Notes

1. **customerId is hardcoded**: Currently set to `'gid://shopify/Customer/123456789'`
   - Replace with actual Shopify customer ID from session in production
   - Update in: `addresses._index.tsx`, `addresses.new.tsx`, `addresses.[id].setDefault.tsx`

2. **Requires Express API**: All routes call `http://localhost:8000/api/addresses`
   - Make sure Express server is running
   - Set `EXPRESS_PORT=8000` in .env.local if different

3. **Server must be running**: Both Remix AND Express need to be running
   - Use `npm run dev:full` to run both

---

## 📚 Related Files

- [ADDRESS_API.md](../ADDRESS_API.md) - Express API documentation
- [EXPRESS_SETUP.md](../EXPRESS_SETUP.md) - Backend setup guide
- [API_TESTING_GUIDE.md](../API_TESTING_GUIDE.md) - Testing API endpoints

---

**Status:** ✅ All routes ready to use!

Start with: `npm run dev:full` then navigate to `http://localhost:3000/addresses`
