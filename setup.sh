#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  WTraderWeb - Setup Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Backend setup
echo -e "${GREEN}Setting up Backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo -e "${GREEN}Backend setup complete!${NC}"
echo ""

# Frontend setup
cd ../frontend

echo -e "${GREEN}Setting up Frontend...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo -e "${GREEN}Frontend setup complete!${NC}"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Setup Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "To start the application:"
echo "1. Terminal 1: cd backend && source venv/bin/activate && python main.py"
echo "2. Terminal 2: cd frontend && npm run dev"
echo ""
