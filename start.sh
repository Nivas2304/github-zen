#!/bin/bash

echo "🚀 Starting GitHub Zen Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r backend/requirements.txt

# Start the FastAPI application
echo "🔥 Starting FastAPI server..."
python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT
