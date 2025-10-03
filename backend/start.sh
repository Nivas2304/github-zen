#!/bin/bash
# Start script for Render deployment

# Upgrade pip first
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Create tables if they don't exist
python -c "from database import create_tables; create_tables(); print('✅ Database tables ready')"

# Start the application
uvicorn main:app --host 0.0.0.0 --port $PORT
