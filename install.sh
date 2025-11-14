#!/bin/bash

echo "========================================="
echo "TODO App Installation Script"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Install python3-venv
echo -e "${YELLOW}Step 1: Installing python3-venv...${NC}"
sudo apt update
sudo apt install -y python3.12-venv python3-full

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install python3-venv. Please run manually:${NC}"
    echo "sudo apt install python3.12-venv python3-full"
    exit 1
fi

echo -e "${GREEN}✓ python3-venv installed${NC}"
echo ""

# Step 2: Create virtual environment
echo -e "${YELLOW}Step 2: Creating virtual environment...${NC}"
cd "/home/pavel/To Do/todo-app/backend"
python3 -m venv venv

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create virtual environment${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Virtual environment created${NC}"
echo ""

# Step 3: Activate and install dependencies
echo -e "${YELLOW}Step 3: Installing Python packages...${NC}"
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install packages${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Packages installed${NC}"
echo ""

# Success message
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✓ Installation complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "To start the server:"
echo "  cd \"/home/pavel/To Do/todo-app/backend\""
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "Then open: http://localhost:8000"
