#!/bin/bash
# Start script for Render deployment

# Install dependencies
pip install -r requirements.txt

# Run database migrations (if using Alembic)
# alembic upgrade head

# Start the application
uvicorn main:app --host 0.0.0.0 --port $PORT
