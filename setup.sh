#!/bin/bash

# AI Workshop Survey App - Quick Start Script

echo "🚀 Starting AI Workshop Survey Application..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server && npm install && cd ..
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application, run these commands in SEPARATE terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo "Admin panel: http://localhost:5173/admin (credentials: admin/admin)"
