@echo off
REM Script to guide the user through updating the Supabase schema

SETLOCAL EnableDelayedExpansion

echo ====================================================================
echo Trinatra Database Schema Update Assistant
echo ====================================================================
echo.

echo Step 1: Open your Supabase project in the browser
echo         Navigate to: https://supabase.com/dashboard/projects
echo.

echo Step 2: Select your Trinatra project
echo.

echo Step 3: Click on 'SQL Editor' in the left navigation menu
echo.

echo Step 4: Click the '+' button to create a new query
echo.

echo Step 5: Copy the contents of 'database/trinatra_schema.sql'
echo         The file is located at: %CD%\database\trinatra_schema.sql
echo.

echo Step 6: Paste the schema into the SQL Editor
echo.

echo Step 7: Click 'Run' to execute the SQL script
echo         Note: This will drop existing tables and recreate them with proper triggers
echo.

echo Step 8: Return to the app and try the registration process again
echo         The error 'Database error saving new user' should be resolved
echo.

echo WARNING: Running this schema will reset your database!
echo          All existing data will be deleted and tables will be recreated
echo          Only proceed if this is acceptable or if this is a new/test database
echo.

echo ====================================================================
echo Need to create a PowerShell or Command Prompt command to view the schema?
echo.
echo Run this command to view the schema:
echo type "%CD%\database\trinatra_schema.sql"
echo ====================================================================
