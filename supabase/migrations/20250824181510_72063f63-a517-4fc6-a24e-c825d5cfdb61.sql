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
  total_learning_time INTEGER DEFAULT 0, -- in minutes
  streak_days INTEGER DEFAULT 0,
  next_assessment_due DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_interactions table for tracking user engagement
CREATE TABLE public.content_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_id UUID NOT NULL REFERENCES public.generated_content(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL,
  interaction_data JSONB DEFAULT '{}',
  time_spent INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all new tables
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_interactions ENABLE ROW LEVEL SECURITY;

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

-- RLS Policies for content_interactions
CREATE POLICY "Users can view their own content interactions" 
ON public.content_interactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content interactions" 
ON public.content_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

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
CREATE INDEX idx_content_interactions_user_content ON public.content_interactions(user_id, content_id);

-- Function to check level completion requirements
CREATE OR REPLACE FUNCTION public.check_level_completion(target_user_id UUID, target_level TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  required_assessments TEXT[] := ARRAY['vocabulary', 'grammar', 'speaking', 'listening'];
  assessment_count INTEGER;
  passing_count INTEGER;
BEGIN
  -- Count total assessments for this level
  SELECT COUNT(*) INTO assessment_count
  FROM level_assessments
  WHERE user_id = target_user_id 
    AND level = target_level 
    AND assessment_type = ANY(required_assessments);
  
  -- Count passing assessments
  SELECT COUNT(*) INTO passing_count
  FROM level_assessments
  WHERE user_id = target_user_id 
    AND level = target_level 
    AND assessment_type = ANY(required_assessments)
    AND passed = true;
  
  -- Must have all 4 assessments and all must be passing
  RETURN assessment_count >= 4 AND passing_count >= 4;
END;
$$;

-- Function to unlock next level
CREATE OR REPLACE FUNCTION public.unlock_next_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_level TEXT;
  next_level TEXT;
  level_map JSONB := '{"A1": "A2", "A2": "B1", "B1": "B2", "B2": "C1", "C1": "C2"}';
  can_progress BOOLEAN;
BEGIN
  -- Only proceed if assessment passed
  IF NEW.passed = true THEN
    -- Get user's current level
    SELECT current_level INTO current_user_level
    FROM level_progression
    WHERE user_id = NEW.user_id;
    
    -- Check if user can progress from current level
    IF NEW.level = current_user_level THEN
      -- Check if all requirements for current level are met
      SELECT check_level_completion(NEW.user_id, NEW.level) INTO can_progress;
      
      IF can_progress THEN
        -- Get next level
        next_level := level_map ->> NEW.level;
        
        -- Update user progression if next level exists
        IF next_level IS NOT NULL THEN
          UPDATE level_progression 
          SET 
            current_level = next_level,
            levels_completed = array_append(levels_completed, NEW.level),
            assessment_scores = jsonb_set(
              assessment_scores, 
              ARRAY[NEW.level], 
              to_jsonb(NEW.score)
            ),
            next_assessment_due = CURRENT_DATE + INTERVAL '7 days',
            updated_at = NOW()
          WHERE user_id = NEW.user_id;
        END IF;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for level progression
CREATE TRIGGER check_level_progression_trigger
AFTER INSERT OR UPDATE ON public.level_assessments
FOR EACH ROW
EXECUTE FUNCTION public.unlock_next_level();

-- Initialize level progression for existing users
INSERT INTO public.level_progression (user_id, current_level)
SELECT id, COALESCE(current_level, 'A1')
FROM public.users
WHERE id NOT IN (SELECT user_id FROM public.level_progression)
ON CONFLICT (user_id) DO NOTHING;