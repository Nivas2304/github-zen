#!/bin/bash

echo "🚀 Starting GitHub Zen Backend..."

# Install dependencies if not already installed
if [ ! -d "backend/venv" ]; then
    echo "📦 Installing dependencies..."
    cd backend
    pip install -r requirements.txt
    cd ..
fi

# Start the FastAPI application
echo "🔥 Starting FastAPI server..."
cd backend
uvicorn main:app --host 0.0.0.0 --port $PORT
