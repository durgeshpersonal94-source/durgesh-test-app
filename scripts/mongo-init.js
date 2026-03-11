// MongoDB initialization script
// This script runs automatically when MongoDB container starts

db = db.getSiblingDB('customize-checkout-address-details');

// Enable schema validation on the addresses collection
db.createCollection('addresses', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['customerId', 'firstName', 'lastName', 'address1', 'city', 'province', 'country', 'zip'],
      properties: {
        _id: { bsonType: 'objectId' },
        customerId: { bsonType: 'string', description: 'Customer ID from Shopify' },
        firstName: { bsonType: 'string', minLength: 2, maxLength: 50 },
        lastName: { bsonType: 'string', minLength: 2, maxLength: 50 },
        address1: { bsonType: 'string', minLength: 5, maxLength: 100 },
        address2: { bsonType: 'string', maxLength: 100 },
        city: { bsonType: 'string', minLength: 2, maxLength: 50 },
        province: { bsonType: 'string', minLength: 2, maxLength: 50 },
        country: { bsonType: 'string', minLength: 2, maxLength: 50 },
        zip: { bsonType: 'string', minLength: 3, maxLength: 20 },
        phone: { bsonType: 'string', maxLength: 20 },
        isDefault: { bsonType: 'bool' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' },
      },
    },
  },
});

// Create indexes for performance
db.addresses.createIndex({ customerId: 1, isDefault: -1 });
db.addresses.createIndex({ customerId: 1, createdAt: -1 });
db.addresses.createIndex({ customerId: 1 });
db.addresses.createIndex({ isDefault: 1 });

// Insert sample data for testing
db.addresses.insertMany([
  {
    customerId: 'gid://shopify/Customer/123456789',
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main Street',
    address2: 'Apt 4',
    city: 'New York',
    province: 'NY',
    country: 'United States',
    zip: '10001',
    phone: '+1-555-0100',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    customerId: 'gid://shopify/Customer/123456789',
    firstName: 'John',
    lastName: 'Doe',
    address1: '456 Oak Avenue',
    city: 'Los Angeles',
    province: 'CA',
    country: 'United States',
    zip: '90001',
    phone: '+1-555-0101',
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    customerId: 'gid://shopify/Customer/123456789',
    firstName: 'John',
    lastName: 'Doe',
    address1: '789 Pine Road',
    city: 'Chicago',
    province: 'IL',
    country: 'United States',
    zip: '60601',
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

print('✓ Addresses collection created with schema validation');
print('✓ Indexes created for performance');
print('✓ Sample data inserted for customer: gid://shopify/Customer/123456789');
print('✓ MongoDB initialization completed successfully');
