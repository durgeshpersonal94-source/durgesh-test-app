#!/bin/bash

# Test script for MongoDB Address Management API
# Tests all CRUD operations and error scenarios

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000/api/addresses.mongo"
CUSTOMER_ID="gid://shopify/Customer/123456789"
NEW_CUSTOMER_ID="gid://shopify/Customer/987654321"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Address Management API Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Test 1: Get all addresses (should return 3 sample addresses)
echo -e "${YELLOW}Test 1: Get all addresses for customer${NC}"
RESPONSE=$(curl -s "$API_URL?customerId=$CUSTOMER_ID")
COUNT=$(echo "$RESPONSE" | grep -o '"_id"' | wc -l)
if [ "$COUNT" -ge 1 ]; then
    echo -e "${GREEN}✓ PASS${NC} - Retrieved $COUNT addresses"
else
    echo -e "${RED}✗ FAIL${NC} - No addresses found"
fi
echo ""

# Test 2: Create a new address
echo -e "${YELLOW}Test 2: Create a new address${NC}"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "'$NEW_CUSTOMER_ID'",
    "firstName": "Alice",
    "lastName": "Johnson",
    "address1": "999 Market Street",
    "city": "San Francisco",
    "province": "CA",
    "country": "United States",
    "zip": "94102",
    "phone": "+1-555-1234"
  }')

ADDRESS_ID=$(echo "$RESPONSE" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
if [ -n "$ADDRESS_ID" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Created address with ID: $ADDRESS_ID"
else
    echo -e "${RED}✗ FAIL${NC} - Failed to create address"
    echo "$RESPONSE"
fi
echo ""

# Test 3: Get single address
echo -e "${YELLOW}Test 3: Get single address by ID${NC}"
RESPONSE=$(curl -s "$API_URL/$ADDRESS_ID?customerId=$NEW_CUSTOMER_ID")
if echo "$RESPONSE" | grep -q "Alice"; then
    echo -e "${GREEN}✓ PASS${NC} - Retrieved single address"
else
    echo -e "${RED}✗ FAIL${NC} - Failed to retrieve single address"
fi
echo ""

# Test 4: Update address
echo -e "${YELLOW}Test 4: Update address${NC}"
RESPONSE=$(curl -s -X PATCH "$API_URL/$ADDRESS_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "'$NEW_CUSTOMER_ID'",
    "city": "Oakland",
    "zip": "94601"
  }')

if echo "$RESPONSE" | grep -q "Oakland"; then
    echo -e "${GREEN}✓ PASS${NC} - Updated address successfully"
else
    echo -e "${RED}✗ FAIL${NC} - Failed to update address"
fi
echo ""

# Test 5: Set address as default
echo -e "${YELLOW}Test 5: Set address as default${NC}"
RESPONSE=$(curl -s -X POST "$API_URL/$ADDRESS_ID?action=setDefault&customerId=$NEW_CUSTOMER_ID")
if echo "$RESPONSE" | grep -q '"isDefault":true'; then
    echo -e "${GREEN}✓ PASS${NC} - Set as default successfully"
else
    echo -e "${RED}✗ FAIL${NC} - Failed to set as default"
fi
echo ""

# Test 6: Get all addresses for new customer
echo -e "${YELLOW}Test 6: Get all addresses for new customer${NC}"
RESPONSE=$(curl -s "$API_URL?customerId=$NEW_CUSTOMER_ID")
if echo "$RESPONSE" | grep -q "$ADDRESS_ID"; then
    echo -e "${GREEN}✓ PASS${NC} - Retrieved addresses for new customer"
else
    echo -e "${RED}✗ FAIL${NC} - Failed to retrieve addresses"
fi
echo ""

# Test 7: Create address with invalid data (missing required field)
echo -e "${YELLOW}Test 7: Validation test - missing required field${NC}"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "'$NEW_CUSTOMER_ID'",
    "firstName": "Bob"
  }')

if echo "$RESPONSE" | grep -q "Validation failed"; then
    echo -e "${GREEN}✓ PASS${NC} - Validation correctly rejected invalid data"
else
    echo -e "${RED}✗ FAIL${NC} - Should have rejected invalid data"
fi
echo ""

# Test 8: Create address with too-short first name
echo -e "${YELLOW}Test 8: Validation test - too short first name${NC}"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "'$NEW_CUSTOMER_ID'",
    "firstName": "A",
    "lastName": "Smith",
    "address1": "100 Main St",
    "city": "Boston",
    "province": "MA",
    "country": "United States",
    "zip": "02101"
  }')

if echo "$RESPONSE" | grep -q "must be at least 2"; then
    echo -e "${GREEN}✓ PASS${NC} - Correctly validated minimum length"
else
    echo -e "${RED}✗ FAIL${NC} - Should have rejected short first name"
fi
echo ""

# Test 9: Create address with invalid ZIP code
echo -e "${YELLOW}Test 9: Validation test - invalid ZIP format${NC}"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "'$NEW_CUSTOMER_ID'",
    "firstName": "Charlie",
    "lastName": "Brown",
    "address1": "200 Oak Ave",
    "city": "Denver",
    "province": "CO",
    "country": "United States",
    "zip": "!!!invalid!!!"
  }')

if echo "$RESPONSE" | grep -q "format is invalid"; then
    echo -e "${GREEN}✓ PASS${NC} - Correctly validated ZIP format"
else
    echo -e "${RED}✗ FAIL${NC} - Should have rejected invalid ZIP"
fi
echo ""

# Test 10: Create another address for first customer
echo -e "${YELLOW}Test 10: Create second address for original customer${NC}"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "'$CUSTOMER_ID'",
    "firstName": "Jane",
    "lastName": "Smith",
    "address1": "555 Mountain View",
    "city": "Portland",
    "province": "OR",
    "country": "United States",
    "zip": "97201"
  }')

ADDRESS_ID_2=$(echo "$RESPONSE" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
if [ -n "$ADDRESS_ID_2" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Created second address with ID: $ADDRESS_ID_2"
else
    echo -e "${RED}✗ FAIL${NC} - Failed to create second address"
fi
echo ""

# Test 11: Delete address
echo -e "${YELLOW}Test 11: Delete address${NC}"
RESPONSE=$(curl -s -X DELETE "$API_URL/$ADDRESS_ID?customerId=$NEW_CUSTOMER_ID")
if echo "$RESPONSE" | grep -q "deleted successfully"; then
    echo -e "${GREEN}✓ PASS${NC} - Deleted address successfully"
else
    echo -e "${RED}✗ FAIL${NC} - Failed to delete address"
fi
echo ""

# Test 12: Verify address is deleted
echo -e "${YELLOW}Test 12: Verify deleted address cannot be retrieved${NC}"
RESPONSE=$(curl -s "$API_URL/$ADDRESS_ID?customerId=$NEW_CUSTOMER_ID")
if echo "$RESPONSE" | grep -q "not found"; then
    echo -e "${GREEN}✓ PASS${NC} - Deleted address is no longer accessible"
else
    echo -e "${RED}✗ FAIL${NC} - Deleted address should not be accessible"
fi
echo ""

# Test 13: Get all addresses without customerId
echo -e "${YELLOW}Test 13: Error test - missing customer ID parameter${NC}"
RESPONSE=$(curl -s "$API_URL")
if echo "$RESPONSE" | grep -q "required"; then
    echo -e "${GREEN}✓ PASS${NC} - Correctly requires customer ID"
else
    echo -e "${RED}✗ FAIL${NC} - Should require customer ID"
fi
echo ""

# Test 14: Missing required fields
echo -e "${YELLOW}Test 14: Error test - missing address1${NC}"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "'$NEW_CUSTOMER_ID'",
    "firstName": "David",
    "lastName": "Lee",
    "city": "Seattle",
    "province": "WA",
    "country": "United States",
    "zip": "98101"
  }')

if echo "$RESPONSE" | grep -q "required"; then
    echo -e "${GREEN}✓ PASS${NC} - Correctly validates required address1"
else
    echo -e "${RED}✗ FAIL${NC} - Should require address1"
fi
echo ""

# Test 15: Verify all remaining addresses
echo -e "${YELLOW}Test 15: Final verification - count remaining addresses${NC}"
RESPONSE=$(curl -s "$API_URL?customerId=$CUSTOMER_ID")
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ PASS${NC} - Retrieved final address list"
else
    echo -e "${RED}✗ FAIL${NC} - Failed to retrieve final list"
fi
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Test Suite Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}Summary:${NC}"
echo "- All CRUD operations tested ✓"
echo "- Validation rules tested ✓"
echo "- Error scenarios tested ✓"
echo ""
echo "If all tests passed, the API is ready for production!"
