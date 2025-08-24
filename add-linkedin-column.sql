-- Add linkedin_url column to existing user_profiles table
-- Run this in your Supabase SQL Editor

-- Add the linkedin_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'linkedin_url'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN linkedin_url TEXT;
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'linkedin_url';
