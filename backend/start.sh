#!/bin/bash
# Start script for Render deployment

# Upgrade pip first
pip install --upgrade pip

# Try multiple requirements files in order of preference
echo "🔧 Installing dependencies..."

if pip install -r requirements-simple.txt; then
    echo "✅ Installed with requirements-simple.txt"
elif pip install -r requirements.txt; then
    echo "✅ Installed with requirements.txt"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create tables if they don't exist
echo "🗄️ Creating database tables..."
python -c "from database import create_tables; create_tables(); print('✅ Database tables ready')"

# Start the application
echo "🚀 Starting FastAPI server..."
uvicorn main:app --host 0.0.0.0 --port $PORT
