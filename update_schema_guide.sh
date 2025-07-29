#!/bin/bash
# Script to guide the user through updating the Supabase schema
# This script will copy the schema content to the clipboard

# Define color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================================${NC}"
echo -e "${GREEN}Trinatra Database Schema Update Assistant${NC}"
echo -e "${BLUE}====================================================================${NC}"
echo

echo -e "${YELLOW}Step 1:${NC} Open your Supabase project in the browser"
echo -e "        Navigate to: https://supabase.com/dashboard/projects"
echo

echo -e "${YELLOW}Step 2:${NC} Select your Trinatra project"
echo

echo -e "${YELLOW}Step 3:${NC} Click on 'SQL Editor' in the left navigation menu"
echo

echo -e "${YELLOW}Step 4:${NC} Click the '+' button to create a new query"
echo

echo -e "${YELLOW}Step 5:${NC} Copy the contents of 'database/trinatra_schema.sql'"
echo -e "        The file is located at: ${BLUE}$(pwd)/database/trinatra_schema.sql${NC}"
echo

echo -e "${YELLOW}Step 6:${NC} Paste the schema into the SQL Editor"
echo

echo -e "${YELLOW}Step 7:${NC} Click 'Run' to execute the SQL script"
echo -e "        Note: This will drop existing tables and recreate them with proper triggers"
echo

echo -e "${YELLOW}Step 8:${NC} Return to the app and try the registration process again"
echo -e "        The error 'Database error saving new user' should be resolved"
echo

echo -e "${RED}WARNING:${NC} Running this schema will reset your database!"
echo -e "        All existing data will be deleted and tables will be recreated"
echo -e "        Only proceed if this is acceptable or if this is a new/test database"
echo

echo -e "${BLUE}====================================================================${NC}"
echo -e "${GREEN}Need to create a PowerShell or Terminal command to view the schema?${NC}"
echo
echo -e "Run this command to view the schema:"
echo -e "${BLUE}cat \"$(pwd)/database/trinatra_schema.sql\"${NC}"
echo -e "${BLUE}====================================================================${NC}"
