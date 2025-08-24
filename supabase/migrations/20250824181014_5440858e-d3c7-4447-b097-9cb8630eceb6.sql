-- Create lesson_completions table for tracking progress
CREATE TABLE public.lesson_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  time_spent INTEGER DEFAULT 0, -- in seconds
  notes TEXT,
  UNIQUE(user_id, lesson_id)
);

-- Create analytics_events table for real analytics
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for new tables
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lesson_completions
CREATE POLICY "Users can view their own lesson completions" 
ON public.lesson_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson completions" 
ON public.lesson_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson completions" 
ON public.lesson_completions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policy for analytics_events
CREATE POLICY "Users can view their own analytics events" 
ON public.analytics_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_lesson_completions_user_id ON public.lesson_completions(user_id);
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);

-- Add some content to existing lessons table
UPDATE public.lessons SET 
  content_type = 'conversation',
  razia_prompts_json = '[
    "Let''s practice basic greetings. How would you greet someone in the morning?",
    "Try using different greetings for formal and informal situations."
  ]'::jsonb,
  exercises_json = '[
    {"type": "listening", "content": "Listen and repeat the greeting phrases"},
    {"type": "speaking", "content": "Practice greeting in different scenarios"}
  ]'::jsonb
WHERE competency = 'basic_greetings';

-- Insert sample lesson data for testing
INSERT INTO public.lessons (world, island, title, competency, level, content_type, duration, razia_prompts_json, exercises_json) VALUES
('Foundation English', 'Daily Conversations', 'Shopping Vocabulary', 'shopping_basics', 'A2', 'vocabulary', 20, 
 '["Let''s go shopping! What do you need to buy today?", "Practice asking for prices and making purchases"]'::jsonb,
 '[{"type": "vocabulary", "content": "Learn shopping terms"}, {"type": "roleplay", "content": "Shopping scenario practice"}]'::jsonb),
('Business World', 'Professional Communication', 'Meeting Language', 'business_meetings', 'B2', 'conversation', 30,
 '["Welcome to our business meeting practice. Let''s start with introductions.", "Practice presenting your ideas professionally"]'::jsonb,
 '[{"type": "speaking", "content": "Business presentation"}, {"type": "listening", "content": "Meeting scenarios"}]'::jsonb),
('IELTS Preparation', 'Academic Skills', 'Writing Task 1', 'ielts_writing', 'B2', 'writing', 45,
 '["Today we''ll practice describing graphs and charts for IELTS Writing Task 1", "Focus on using appropriate academic vocabulary"]'::jsonb,
 '[{"type": "writing", "content": "Graph description task"}, {"type": "vocabulary", "content": "Academic writing terms"}]'::jsonb);

-- Add email_logs table for tracking email activity
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email_type VARCHAR(50) NOT NULL,
  recipient TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'sent',
  email_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email logs" 
ON public.email_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert email logs" 
ON public.email_logs 
FOR INSERT 
WITH CHECK (true);