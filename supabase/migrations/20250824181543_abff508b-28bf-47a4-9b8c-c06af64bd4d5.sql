-- First update existing user levels to match CEFR format
UPDATE public.users 
SET current_level = CASE 
  WHEN current_level = 'beginner' THEN 'A1'
  WHEN current_level = 'elementary' THEN 'A2'
  WHEN current_level = 'intermediate' THEN 'B1'
  WHEN current_level = 'upper_intermediate' THEN 'B2'
  WHEN current_level = 'advanced' THEN 'C1'
  WHEN current_level = 'proficient' THEN 'C2'
  ELSE 'A1'
END;

-- Create generated_content table for AI-generated educational content
CREATE TABLE public.generated_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('lesson', 'conversation', 'roleplay', 'ielts', 'pronunciation', 'assessment')),
  level VARCHAR(10) NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  title TEXT NOT NULL,
  description TEXT,
  content_data JSONB NOT NULL DEFAULT '{}',
  topic TEXT,
  cultural_context TEXT DEFAULT 'Arabic-speaking learners',
  learning_objectives TEXT[] DEFAULT '{}',
  estimated_duration INTEGER DEFAULT 15,
  is_completed BOOLEAN DEFAULT false,
  completion_score INTEGER CHECK (completion_score BETWEEN 0 AND 100),
  completion_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create level_assessments table for tracking level completion requirements
CREATE TABLE public.level_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  level VARCHAR(10) NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  assessment_type VARCHAR(50) NOT NULL,
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  max_score INTEGER DEFAULT 100,
  assessment_data JSONB DEFAULT '{}',
  passed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, level, assessment_type)
);

-- Create level_progression table for tracking overall level progression
CREATE TABLE public.level_progression (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_level VARCHAR(10) NOT NULL DEFAULT 'A1' CHECK (current_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  levels_completed TEXT[] DEFAULT '{}',
  assessment_scores JSONB DEFAULT '{}',
  total_learning_time INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  next_assessment_due DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all new tables
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_progression ENABLE ROW LEVEL SECURITY;

-- RLS Policies for generated_content
CREATE POLICY "Users can view their own generated content" 
ON public.generated_content 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generated content" 
ON public.generated_content 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated content" 
ON public.generated_content 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for level_assessments
CREATE POLICY "Users can view their own level assessments" 
ON public.level_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own level assessments" 
ON public.level_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own level assessments" 
ON public.level_assessments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for level_progression
CREATE POLICY "Users can view their own level progression" 
ON public.level_progression 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own level progression" 
ON public.level_progression 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own level progression" 
ON public.level_progression 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_generated_content_updated_at
BEFORE UPDATE ON public.generated_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_level_progression_updated_at
BEFORE UPDATE ON public.level_progression
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_generated_content_user_level ON public.generated_content(user_id, level);
CREATE INDEX idx_generated_content_type ON public.generated_content(content_type);
CREATE INDEX idx_level_assessments_user_level ON public.level_assessments(user_id, level);

-- Initialize level progression for existing users
INSERT INTO public.level_progression (user_id, current_level)
SELECT id, current_level
FROM public.users
ON CONFLICT (user_id) DO NOTHING;