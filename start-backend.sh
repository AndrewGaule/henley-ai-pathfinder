#!/bin/bash

# Start the backend API server

cd "$(dirname "$0")/server"

# Ensure data directory exists
mkdir -p data

echo "🚀 Starting Backend API Server..."
echo ""
node src/index.js
