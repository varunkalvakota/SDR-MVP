-- Update LinkedIn Leads Table to include last_name and analysis_results fields
-- Run this in your Supabase SQL Editor

-- Add last_name column if it doesn't exist
ALTER TABLE public.linkedin_leads 
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Add analysis_results column to store the analysis data
ALTER TABLE public.linkedin_leads 
ADD COLUMN IF NOT EXISTS analysis_results JSONB;

-- Update the table to make last_name required for new inserts
-- (This won't affect existing records)
ALTER TABLE public.linkedin_leads 
ALTER COLUMN last_name SET NOT NULL;

-- Create an index on analysis_results for better query performance
CREATE INDEX IF NOT EXISTS idx_linkedin_leads_analysis_results 
ON public.linkedin_leads USING GIN (analysis_results);

-- Update any existing records that might have NULL last_name
-- (Replace with a default value or update as needed)
UPDATE public.linkedin_leads 
SET last_name = 'Unknown' 
WHERE last_name IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'linkedin_leads' 
AND table_schema = 'public'
ORDER BY ordinal_position;
