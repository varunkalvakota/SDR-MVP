-- Create missing ai_analysis_results table
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

-- Enable RLS on the table
ALTER TABLE public.ai_analysis_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_analysis_results
CREATE POLICY "Users can view own analysis results" ON public.ai_analysis_results
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own analysis results" ON public.ai_analysis_results
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own analysis results" ON public.ai_analysis_results
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own analysis results" ON public.ai_analysis_results
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create trigger for updated_at
CREATE TRIGGER update_ai_analysis_results_updated_at
    BEFORE UPDATE ON public.ai_analysis_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();









