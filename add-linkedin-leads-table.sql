-- Add LinkedIn Leads Table for Landing Page Lead Capture
-- This table stores leads from the LinkedIn analysis form on the landing page

-- LinkedIn Leads Table
CREATE TABLE IF NOT EXISTS public.linkedin_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    linkedin_url TEXT NOT NULL,
    target_role VARCHAR(100) NOT NULL,
    experience_level VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending_analysis',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analysis_completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    follow_up_date DATE,
    lead_source VARCHAR(100) DEFAULT 'landing_page_linkedin_analysis'
);

-- Enable Row Level Security
ALTER TABLE public.linkedin_leads ENABLE ROW LEVEL SECURITY;

-- Create policies for LinkedIn leads
-- Note: These leads are public submissions, so we'll allow public access for inserts
-- but restrict viewing to admin users only

-- Allow anyone to insert leads (public form submissions)
CREATE POLICY "Allow public to insert LinkedIn leads" ON public.linkedin_leads
    FOR INSERT WITH CHECK (true);

-- Only authenticated users can view leads (for admin purposes)
CREATE POLICY "Authenticated users can view LinkedIn leads" ON public.linkedin_leads
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update leads
CREATE POLICY "Authenticated users can update LinkedIn leads" ON public.linkedin_leads
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete leads
CREATE POLICY "Authenticated users can delete LinkedIn leads" ON public.linkedin_leads
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_linkedin_leads_email ON public.linkedin_leads(email);
CREATE INDEX IF NOT EXISTS idx_linkedin_leads_status ON public.linkedin_leads(status);
CREATE INDEX IF NOT EXISTS idx_linkedin_leads_created_at ON public.linkedin_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_linkedin_leads_target_role ON public.linkedin_leads(target_role);
CREATE INDEX IF NOT EXISTS idx_linkedin_leads_experience_level ON public.linkedin_leads(experience_level);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_linkedin_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_linkedin_leads_updated_at
    BEFORE UPDATE ON public.linkedin_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_linkedin_leads_updated_at();

-- Add some sample data (optional - remove in production)
-- INSERT INTO public.linkedin_leads (first_name, email, linkedin_url, target_role, experience_level) VALUES
-- ('John Doe', 'john@example.com', 'https://linkedin.com/in/johndoe', 'SDR', '2-3'),
-- ('Jane Smith', 'jane@example.com', 'https://linkedin.com/in/janesmith', 'BDR', '0-1');

-- Grant necessary permissions
GRANT INSERT ON public.linkedin_leads TO anon;
GRANT SELECT, UPDATE, DELETE ON public.linkedin_leads TO authenticated;
