-- Add LinkedIn Analysis Tables to Existing SDR MVP Database
-- Run this in your Supabase SQL Editor

-- LinkedIn Analysis Results Table
CREATE TABLE IF NOT EXISTS public.linkedin_analysis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    linkedin_url TEXT,
    analysis_type VARCHAR(50) DEFAULT 'comprehensive', -- comprehensive, quick, detailed
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Analysis Results (stored as JSONB for flexibility)
    analysis_data JSONB NOT NULL,
    
    -- Extracted Metrics
    profile_views INTEGER,
    connection_requests INTEGER,
    engagement_rate DECIMAL(5,2),
    recruiter_views INTEGER,
    
    -- Analysis Scores
    sdr_readiness_score INTEGER, -- 0-100
    headline_score INTEGER, -- 0-100
    about_section_score INTEGER, -- 0-100
    skills_score INTEGER, -- 0-100
    experience_score INTEGER, -- 0-100
    
    -- Recommendations and Insights
    strengths TEXT[],
    areas_to_improve TEXT[],
    next_steps JSONB, -- Array of detailed next steps with actions
    
    -- AI Analysis Metadata
    ai_model_version VARCHAR(50),
    analysis_duration_ms INTEGER,
    tokens_used INTEGER,
    
    -- Status and Flags
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LinkedIn Profile Snapshots Table (for tracking changes over time)
CREATE TABLE IF NOT EXISTS public.linkedin_profile_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    linkedin_url TEXT,
    snapshot_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Profile Data
    headline TEXT,
    about_section TEXT,
    current_position TEXT,
    experience_years VARCHAR(50),
    skills TEXT[],
    industries TEXT[],
    
    -- Profile Metrics (if available)
    connections_count INTEGER,
    followers_count INTEGER,
    profile_views_30d INTEGER,
    
    -- Analysis Comparison
    previous_snapshot_id UUID REFERENCES public.linkedin_profile_snapshots(id),
    changes_detected JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LinkedIn Analysis Templates Table (for storing reusable analysis prompts)
CREATE TABLE IF NOT EXISTS public.linkedin_analysis_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_name VARCHAR(200) NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- sdr_focused, general, industry_specific
    description TEXT,
    
    -- Template Configuration
    analysis_prompt TEXT NOT NULL,
    expected_output_format JSONB,
    scoring_criteria JSONB,
    
    -- Template Metadata
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LinkedIn Analysis History Table (for tracking analysis requests)
CREATE TABLE IF NOT EXISTS public.linkedin_analysis_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    analysis_result_id UUID REFERENCES public.linkedin_analysis_results(id) ON DELETE CASCADE,
    
    -- Request Details
    request_type VARCHAR(50), -- new_analysis, re_analysis, comparison
    linkedin_url TEXT,
    analysis_trigger VARCHAR(100), -- user_initiated, scheduled, profile_update
    
    -- Request Metadata
    ip_address INET,
    user_agent TEXT,
    request_duration_ms INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.linkedin_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_profile_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_analysis_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_analysis_history ENABLE ROW LEVEL SECURITY;

-- LinkedIn Analysis Results Policies
CREATE POLICY "Users can view own analysis results" ON public.linkedin_analysis_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis results" ON public.linkedin_analysis_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analysis results" ON public.linkedin_analysis_results
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analysis results" ON public.linkedin_analysis_results
    FOR DELETE USING (auth.uid() = user_id);

-- LinkedIn Profile Snapshots Policies
CREATE POLICY "Users can view own profile snapshots" ON public.linkedin_profile_snapshots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile snapshots" ON public.linkedin_profile_snapshots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile snapshots" ON public.linkedin_profile_snapshots
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile snapshots" ON public.linkedin_profile_snapshots
    FOR DELETE USING (auth.uid() = user_id);

-- LinkedIn Analysis Templates Policies
CREATE POLICY "Users can view public templates" ON public.linkedin_analysis_templates
    FOR SELECT USING (is_public = TRUE OR created_by = auth.uid());

CREATE POLICY "Users can insert own templates" ON public.linkedin_analysis_templates
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own templates" ON public.linkedin_analysis_templates
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete own templates" ON public.linkedin_analysis_templates
    FOR DELETE USING (created_by = auth.uid());

-- LinkedIn Analysis History Policies
CREATE POLICY "Users can view own analysis history" ON public.linkedin_analysis_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis history" ON public.linkedin_analysis_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_linkedin_analysis_user_id ON public.linkedin_analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_analysis_date ON public.linkedin_analysis_results(analysis_date);
CREATE INDEX IF NOT EXISTS idx_linkedin_analysis_favorite ON public.linkedin_analysis_results(is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_linkedin_analysis_type ON public.linkedin_analysis_results(analysis_type);

CREATE INDEX IF NOT EXISTS idx_linkedin_snapshots_user_id ON public.linkedin_profile_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_snapshots_date ON public.linkedin_profile_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_linkedin_snapshots_url ON public.linkedin_profile_snapshots(linkedin_url);

CREATE INDEX IF NOT EXISTS idx_linkedin_templates_type ON public.linkedin_analysis_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_linkedin_templates_active ON public.linkedin_analysis_templates(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_linkedin_templates_public ON public.linkedin_analysis_templates(is_public) WHERE is_public = TRUE;

CREATE INDEX IF NOT EXISTS idx_linkedin_history_user_id ON public.linkedin_analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_history_date ON public.linkedin_analysis_history(created_at);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_linkedin_analysis_results_updated_at
    BEFORE UPDATE ON public.linkedin_analysis_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_linkedin_analysis_templates_updated_at
    BEFORE UPDATE ON public.linkedin_analysis_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default analysis templates
INSERT INTO public.linkedin_analysis_templates (template_name, template_type, description, analysis_prompt, is_public, created_by)
VALUES 
(
    'SDR-Focused Analysis',
    'sdr_focused',
    'Comprehensive analysis specifically tailored for SDR role readiness',
    'Analyze this LinkedIn profile for SDR role readiness. Provide scores for headline, about section, skills, and experience. Include specific recommendations for improvement.',
    TRUE,
    NULL
),
(
    'Quick Profile Review',
    'general',
    'Fast analysis for general profile optimization',
    'Provide a quick review of this LinkedIn profile with key strengths and improvement areas.',
    TRUE,
    NULL
),
(
    'Tech Sales Analysis',
    'industry_specific',
    'Analysis focused on tech sales industry requirements',
    'Analyze this LinkedIn profile for tech sales roles. Focus on sales experience, tech knowledge, and industry-specific skills.',
    TRUE,
    NULL
)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'LinkedIn analysis tables created successfully!' as message;
