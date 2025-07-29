@echo off
REM Script to apply the updated SQL schema to Supabase

REM Instructions:
REM 1. Log in to your Supabase account
REM 2. Navigate to the SQL Editor
REM 3. Create a new query
REM 4. Copy and paste the contents of database/trinatra_schema.sql
REM 5. Run the query

REM Alternative approach:
REM If you have the Supabase CLI installed, you can use:
REM supabase db reset -p <project-id>

REM After applying the schema, restart your app to test the changes

echo Follow the instructions in this script to update your Supabase database schema.
echo The correct schema is located in: database/trinatra_schema.sql
