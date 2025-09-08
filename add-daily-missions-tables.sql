-- Daily Missions Database Tables
-- Run this in your Supabase SQL Editor

-- Create daily_missions table
CREATE TABLE IF NOT EXISTS daily_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_date DATE NOT NULL,
  mission_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_count INTEGER DEFAULT 1,
  touches_completed INTEGER DEFAULT 0,
  mission_completed BOOLEAN DEFAULT FALSE,
  xp_reward INTEGER DEFAULT 25,
  priority VARCHAR(20) DEFAULT 'medium',
  estimated_time VARCHAR(50),
  tips TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create outreach_activities table
CREATE TABLE IF NOT EXISTS outreach_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  role_type VARCHAR(100),
  outreach_type VARCHAR(50) NOT NULL, -- 'email', 'linkedin', 'phone', 'video'
  message_content TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  replied_at TIMESTAMP WITH TIME ZONE,
  interview_booked BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_mission_stats table
CREATE TABLE IF NOT EXISTS user_mission_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  missions_completed INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_missions_user_date ON daily_missions(user_id, mission_date);
CREATE INDEX IF NOT EXISTS idx_outreach_activities_user ON outreach_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_outreach_activities_sent_at ON outreach_activities(sent_at);
CREATE INDEX IF NOT EXISTS idx_user_mission_stats_user_date ON user_mission_stats(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mission_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for daily_missions
DROP POLICY IF EXISTS "Users can view their own daily missions" ON daily_missions;
CREATE POLICY "Users can view their own daily missions" ON daily_missions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own daily missions" ON daily_missions;
CREATE POLICY "Users can insert their own daily missions" ON daily_missions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own daily missions" ON daily_missions;
CREATE POLICY "Users can update their own daily missions" ON daily_missions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own daily missions" ON daily_missions;
CREATE POLICY "Users can delete their own daily missions" ON daily_missions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for outreach_activities
DROP POLICY IF EXISTS "Users can view their own outreach activities" ON outreach_activities;
CREATE POLICY "Users can view their own outreach activities" ON outreach_activities
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own outreach activities" ON outreach_activities;
CREATE POLICY "Users can insert their own outreach activities" ON outreach_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own outreach activities" ON outreach_activities;
CREATE POLICY "Users can update their own outreach activities" ON outreach_activities
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own outreach activities" ON outreach_activities;
CREATE POLICY "Users can delete their own outreach activities" ON outreach_activities
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_mission_stats
DROP POLICY IF EXISTS "Users can view their own mission stats" ON user_mission_stats;
CREATE POLICY "Users can view their own mission stats" ON user_mission_stats
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own mission stats" ON user_mission_stats;
CREATE POLICY "Users can insert their own mission stats" ON user_mission_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own mission stats" ON user_mission_stats;
CREATE POLICY "Users can update their own mission stats" ON user_mission_stats
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own mission stats" ON user_mission_stats;
CREATE POLICY "Users can delete their own mission stats" ON user_mission_stats
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_daily_missions_updated_at ON daily_missions;
CREATE TRIGGER update_daily_missions_updated_at
    BEFORE UPDATE ON daily_missions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_outreach_activities_updated_at ON outreach_activities;
CREATE TRIGGER update_outreach_activities_updated_at
    BEFORE UPDATE ON outreach_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_mission_stats_updated_at ON user_mission_stats;
CREATE TRIGGER update_user_mission_stats_updated_at
    BEFORE UPDATE ON user_mission_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
