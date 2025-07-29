# Troubleshooting Guide: "Database error saving new user"

## Problem
When trying to register a new user in the Trinatra app, you encounter the following error:
```
ERROR Sign up error: Database error saving new user
```

## Cause
This error occurs when the Supabase database doesn't have the proper database triggers set up to automatically create a profile entry when a new user registers. The registration process has two key steps:

1. Create an entry in the `auth.users` table (handled by Supabase Auth)
2. Create a corresponding entry in the `profiles` table (requires a database trigger)

If the trigger isn't present or working correctly, step 2 fails and you get the error.

## Solution

### Step 1: Run the Complete Schema
The most reliable solution is to run the complete schema file that includes all necessary triggers:

1. Open your Supabase project in a web browser
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the ENTIRE contents of `database/trinatra_schema.sql`
5. Run the script

### Step 2: Verify the Triggers
After running the schema, verify that the necessary triggers are in place:

```sql
-- Check if the user creation trigger exists
SELECT 
  trigger_name
FROM 
  information_schema.triggers 
WHERE 
  event_object_table = 'users' 
  AND trigger_name = 'on_auth_user_created';

-- Check if the profile trigger exists
SELECT 
  trigger_name
FROM 
  information_schema.triggers 
WHERE 
  event_object_table = 'profiles' 
  AND trigger_name = 'on_profile_created';
```

Both queries should return the respective trigger names.

### Step 3: Check for Errors in Trigger Function
If the triggers are present but the error persists, there might be an issue in the trigger function. You can check the Supabase logs or run this SQL to test the trigger function manually:

```sql
-- Test the handle_new_user function directly
DO $$
DECLARE
  test_user_id uuid := uuid_generate_v4();
BEGIN
  -- Create a test user in auth.users
  INSERT INTO auth.users (id, email) 
  VALUES (test_user_id, 'test@example.com');
  
  -- Check if a profile was created
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = test_user_id) THEN
    RAISE EXCEPTION 'Profile was not created automatically for test user';
  END IF;
  
  -- Clean up
  DELETE FROM auth.users WHERE id = test_user_id;
END
$$;
```

## Additional Troubleshooting

### Environment Variables
Ensure your `.env` file has the correct Supabase URL and anon key:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Clear Supabase Cache
Sometimes the Supabase client caches authentication errors. Try clearing your app's storage or reinstalling the app.

### Reset the Database
If all else fails, you can reset your Supabase database completely and run the schema again:
1. Go to Supabase Dashboard > Project Settings > Database
2. Scroll down to "Danger Zone"
3. Click "Reset Database"
4. After reset completes, run the complete schema again

### Need More Help?
If you're still encountering issues after trying these steps, check the Supabase logs for more detailed error information or reach out to the project maintainers for assistance.
