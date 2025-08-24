-- Comprehensive SDR Roadmap Database Schema
-- Supports AI-powered onboarding, training, and job placement

-- User Profiles (Enhanced)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    current_position VARCHAR(100),
    experience_years VARCHAR(50),
    resume_url TEXT,
    linkedin_url TEXT,
    
    -- AI Personality & Skills
    sales_persona VARCHAR(50), -- Connector, Analyst, Storyteller, Challenger, Architect
    personality_quiz_answers JSONB,
    parsed_skills TEXT[],
    parsed_achievements TEXT[],
    parsed_industries TEXT[],
    parsed_tools TEXT[],
    
    -- Career Goals
    career_goal VARCHAR(100),
    timeline VARCHAR(50),
    preferred_industry VARCHAR(100),
    salary_expectation VARCHAR(50),
    work_style VARCHAR(50),
    
    -- Skill Assessment
    skill_benchmarks JSONB, -- Radar chart data
    skill_gaps TEXT[],
    top_skills_to_develop TEXT[],
    current_skill_score INTEGER DEFAULT 0,
    
    -- Target Companies & Industries
    target_industries TEXT[],
    recommended_companies JSONB,
    interview_probability_timeline VARCHAR(100),
    
    -- Onboarding Status
    onboarding_completed BOOLEAN DEFAULT FALSE,
    training_camp_completed BOOLEAN DEFAULT FALSE,
    current_week INTEGER DEFAULT 0,
    current_day INTEGER DEFAULT 0,
    
    -- Additional Info
    challenges TEXT,
    motivation TEXT,
    availability VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Camp Progress
CREATE TABLE IF NOT EXISTS public.training_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    module_name VARCHAR(100) NOT NULL,
    module_type VARCHAR(50), -- prospecting, outreach, objection_handling, crm
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    completed BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    badges_earned TEXT[],
    streak_count INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Missions & Outreach
CREATE TABLE IF NOT EXISTS public.daily_missions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    mission_date DATE NOT NULL,
    week_number INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    
    -- Job Postings
    job_postings JSONB, -- Array of job data from APIs
    
    -- Outreach Activity
    outreach_targets JSONB, -- Hiring managers + ICPs
    outreach_messages JSONB, -- Drafted and personalized messages
    video_recording_url TEXT,
    
    -- Mission Status
    mission_completed BOOLEAN DEFAULT FALSE,
    touches_completed INTEGER DEFAULT 0,
    target_touches INTEGER DEFAULT 5,
    
    -- AI Feedback
    ai_feedback JSONB,
    skill_drill_assigned VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outreach Tracking
CREATE TABLE IF NOT EXISTS public.outreach_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES public.daily_missions(id) ON DELETE CASCADE,
    
    -- Contact Info
    contact_name VARCHAR(200),
    contact_email VARCHAR(255),
    contact_linkedin VARCHAR(500),
    company_name VARCHAR(200),
    role_type VARCHAR(100), -- hiring_manager, icp
    
    -- Outreach Details
    outreach_type VARCHAR(50), -- email, linkedin, video
    message_content TEXT,
    personalization_level VARCHAR(50), -- low, medium, high
    
    -- Tracking
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    linkedin_accepted BOOLEAN DEFAULT FALSE,
    interview_booked BOOLEAN DEFAULT FALSE,
    
    -- AI Analysis
    ai_score INTEGER,
    ai_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KPI Tracking
CREATE TABLE IF NOT EXISTS public.kpi_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    date_range DATERANGE NOT NULL,
    
    -- Core KPIs
    linkedin_acceptance_rate DECIMAL(5,2),
    email_open_rate DECIMAL(5,2),
    reply_rate DECIMAL(5,2),
    interview_rate DECIMAL(5,2),
    icp_conversation_rate DECIMAL(5,2),
    video_watch_percentage DECIMAL(5,2),
    
    -- Volume Metrics
    total_outreach INTEGER DEFAULT 0,
    total_emails INTEGER DEFAULT 0,
    total_linkedin_messages INTEGER DEFAULT 0,
    total_videos_sent INTEGER DEFAULT 0,
    
    -- Benchmarks
    industry_benchmarks JSONB,
    performance_gap DECIMAL(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Coach Sessions
CREATE TABLE IF NOT EXISTS public.ai_coach_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    
    -- Daily Standup
    kpi_highlights JSONB,
    top_tasks JSONB,
    mission_planner_tasks JSONB,
    
    -- Feedback
    message_reviews JSONB,
    tone_analysis JSONB,
    clarity_score INTEGER,
    proof_points_score INTEGER,
    
    -- Daily Retro
    daily_win TEXT,
    improvement_tip TEXT,
    targeted_drill VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Human Coach Sessions
CREATE TABLE IF NOT EXISTS public.human_coach_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    coach_id UUID, -- Will reference coaches table when implemented
    
    -- Interview Prep
    company_name VARCHAR(200),
    role_title VARCHAR(200),
    interview_date TIMESTAMP WITH TIME ZONE,
    interview_type VARCHAR(50), -- phone, video, onsite
    
    -- Prep Materials
    company_research JSONB,
    star_stories JSONB,
    common_qa JSONB,
    key_differentiators TEXT[],
    
    -- Session Details
    session_duration INTEGER, -- minutes
    session_notes TEXT,
    mock_interview_score INTEGER,
    
    -- Follow-up
    thank_you_email_draft TEXT,
    follow_up_reminders JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Integration Logs
CREATE TABLE IF NOT EXISTS public.api_integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    api_name VARCHAR(100), -- repvue, linkedin, indeed, etc.
    endpoint VARCHAR(500),
    request_data JSONB,
    response_data JSONB,
    status_code INTEGER,
    success BOOLEAN,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Analysis Results Storage
CREATE TABLE IF NOT EXISTS public.ai_analysis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    analysis_type VARCHAR(100) NOT NULL, -- masterAnalysis, advancedAnalysis, skillAnalysis, etc.
    analysis_title VARCHAR(200),
    analysis_content TEXT NOT NULL,
    resume_version VARCHAR(100), -- to track which resume version was analyzed
    metadata JSONB, -- store additional data like scores, recommendations, etc.
    is_favorite BOOLEAN DEFAULT FALSE,
    tags TEXT[], -- for categorizing analyses
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamification & Achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100),
    achievement_name VARCHAR(200),
    achievement_description TEXT,
    points_earned INTEGER DEFAULT 0,
    badge_icon VARCHAR(100),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.human_coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- User can view own data
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Training progress policies
CREATE POLICY "Users can view own training progress" ON public.training_progress
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own training progress" ON public.training_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own training progress" ON public.training_progress
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Daily missions policies
CREATE POLICY "Users can view own missions" ON public.daily_missions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own missions" ON public.daily_missions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own missions" ON public.daily_missions
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Outreach activities policies
CREATE POLICY "Users can view own outreach" ON public.outreach_activities
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own outreach" ON public.outreach_activities
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own outreach" ON public.outreach_activities
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- KPI metrics policies
CREATE POLICY "Users can view own KPIs" ON public.kpi_metrics
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own KPIs" ON public.kpi_metrics
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- AI coach sessions policies
CREATE POLICY "Users can view own AI sessions" ON public.ai_coach_sessions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own AI sessions" ON public.ai_coach_sessions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Human coach sessions policies
CREATE POLICY "Users can view own human sessions" ON public.human_coach_sessions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own human sessions" ON public.human_coach_sessions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- API integrations policies
CREATE POLICY "Users can view own API logs" ON public.api_integrations
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own API logs" ON public.api_integrations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- AI Analysis Results policies
CREATE POLICY "Users can view own analysis results" ON public.ai_analysis_results
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own analysis results" ON public.ai_analysis_results
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own analysis results" ON public.ai_analysis_results
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own analysis results" ON public.ai_analysis_results
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Achievements policies
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false),
       ('videos', 'videos', false),
       ('recordings', 'recordings', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own resumes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resumes" ON storage.objects
    FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own videos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own videos" ON storage.objects
    FOR SELECT USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own recordings" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own recordings" ON storage.objects
    FOR SELECT USING (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
