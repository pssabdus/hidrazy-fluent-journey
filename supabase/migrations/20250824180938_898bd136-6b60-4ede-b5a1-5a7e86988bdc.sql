-- Create lessons table for content management
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  level VARCHAR(10) NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  category VARCHAR(50) NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  audio_url TEXT,
  video_url TEXT,
  difficulty_score INTEGER DEFAULT 1 CHECK (difficulty_score BETWEEN 1 AND 10),
  estimated_duration INTEGER DEFAULT 15, -- in minutes
  tags TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

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

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lessons
CREATE POLICY "Lessons are viewable by everyone" 
ON public.lessons 
FOR SELECT 
USING (true);

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

-- Add trigger for updated_at
CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample lesson content
INSERT INTO public.lessons (title, description, level, category, content, difficulty_score, estimated_duration, tags, is_premium) VALUES
('Basic Greetings', 'Learn essential greeting phrases for daily conversations', 'A1', 'Daily Conversations', '{"phrases": ["Hello", "Good morning", "How are you?"], "examples": [{"english": "Hello, how are you?", "arabic": "مرحبا، كيف حالك؟"}]}', 1, 10, ARRAY['greetings', 'basic'], false),
('Shopping Vocabulary', 'Essential vocabulary for shopping and making purchases', 'A2', 'Daily Life', '{"vocabulary": ["price", "expensive", "cheap", "discount"], "scenarios": ["At the supermarket", "Buying clothes"]}', 3, 15, ARRAY['shopping', 'vocabulary'], false),
('Business Meeting English', 'Professional language for business meetings', 'B2', 'Business English', '{"phrases": ["I would like to propose", "Could we discuss", "In my opinion"], "scenarios": ["Presenting ideas", "Negotiating"]}', 7, 25, ARRAY['business', 'meetings', 'professional'], true),
('IELTS Writing Task 1', 'Academic writing skills for IELTS Task 1', 'B2', 'IELTS Preparation', '{"structure": ["Introduction", "Overview", "Body paragraphs"], "examples": ["Graph description", "Chart analysis"]}', 8, 30, ARRAY['ielts', 'writing', 'academic'], true),
('Travel Conversations', 'Essential phrases for traveling and tourism', 'B1', 'Travel English', '{"situations": ["At the airport", "Hotel check-in", "Asking for directions"], "phrases": ["Excuse me, where is...", "I have a reservation"]}', 5, 20, ARRAY['travel', 'tourism', 'conversations'], false);

-- Create analytics_events table for real analytics
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

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
CREATE INDEX idx_lessons_level ON public.lessons(level);
CREATE INDEX idx_lessons_category ON public.lessons(category);
CREATE INDEX idx_lesson_completions_user_id ON public.lesson_completions(user_id);
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);