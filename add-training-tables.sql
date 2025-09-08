-- Add Training Progress Tables to Existing SDR MVP Database
-- Run this in your Supabase SQL Editor

-- Training Camp Progress Table (if not exists)
CREATE TABLE IF NOT EXISTS public.training_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- User Achievements Table (if not exists)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100),
    achievement_name VARCHAR(200),
    achievement_description TEXT,
    points_earned INTEGER DEFAULT 0,
    badge_icon VARCHAR(100),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Training Progress Policies
CREATE POLICY "Users can view own training progress" ON public.training_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training progress" ON public.training_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training progress" ON public.training_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own training progress" ON public.training_progress
    FOR DELETE USING (auth.uid() = user_id);

-- User Achievements Policies
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements" ON public.user_achievements
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own achievements" ON public.user_achievements
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_training_progress_user_id ON public.training_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_module_name ON public.training_progress(module_name);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON public.user_achievements(achievement_type);

-- Add some sample achievements for testing
INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, achievement_description, points_earned, badge_icon)
SELECT 
    auth.uid(),
    'welcome',
    'Welcome to Training Camp',
    'Started your SDR training journey',
    10,
    'star'
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Training progress tables created successfully!' as message;
