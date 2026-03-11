#!/bin/bash

# MongoDB Local Setup Script for macOS and Linux
# This script sets up local MongoDB for development

set -e

echo "=========================================="
echo "Shopify App - Local MongoDB Setup"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop:"
    echo "   https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed."
    echo "   Please install Docker Compose:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✓ Docker is installed"
echo "✓ Docker Compose is available"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✓ .env.local created"
    echo ""
    echo "⚠️  IMPORTANT: Update .env.local with your Shopify credentials:"
    echo "   - SHOPIFY_API_KEY"
    echo "   - SHOPIFY_API_SECRET"
    echo "   - SHOPIFY_APP_URL (if different from http://localhost:3000)"
    echo ""
else
    echo "✓ .env.local already exists"
    echo ""
fi

# Check if MongoDB container is already running
if docker ps | grep -q shopify-app-mongodb; then
    echo "ℹ️  MongoDB container is already running"
    echo "   To restart: docker-compose restart"
    echo ""
else
    echo "🚀 Starting MongoDB container..."
    docker-compose up -d mongodb mongoexpress
    
    # Wait for MongoDB to be healthy
    echo "⏳ Waiting for MongoDB to initialize..."
    sleep 5
    
    # Check health
    if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo "✓ MongoDB is healthy and running"
    else
        echo "⚠️  MongoDB may still be initializing, waiting a bit more..."
        sleep 5
    fi
    echo ""
fi

# Display connection info
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📊 MongoDB Access:"
echo "   Connection String: mongodb://shopify_user:shopify_password@localhost:27017/shopify-app?authSource=admin"
echo "   Host: localhost"
echo "   Port: 27017"
echo "   Username: shopify_user"
echo "   Password: shopify_password"
echo "   Database: shopify-app"
echo ""
echo "🔍 MongoDB Express (Web UI):"
echo "   URL: http://localhost:8081"
echo "   Username: admin"
echo "   Password: admin"
echo ""
echo "📦 Running Containers:"
docker-compose ps
echo ""
echo "💡 Next Steps:"
echo "   1. Update .env.local with your Shopify credentials"
echo "   2. Install dependencies: npm install"
echo "   3. Start dev server: npm run dev"
echo "   4. Test API: curl http://localhost:3000/api/addresses.mongo?customerId=test"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: cat QUICKSTART_MONGODB_ADDRESSES.md"
echo "   - Full Docs: cat LOCAL_MONGODB_SETUP.md"
echo "   - API Reference: cat docs/ADDRESS_MONGODB_API.md"
echo ""
echo "🛑 To stop MongoDB:"
echo "   docker-compose down"
echo ""
echo "🗑️  To remove all data:"
echo "   docker-compose down -v"
echo ""
