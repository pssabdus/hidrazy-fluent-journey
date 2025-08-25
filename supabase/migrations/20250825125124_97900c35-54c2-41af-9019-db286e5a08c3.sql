-- Create lesson notebooks table for storing lesson summaries and notes
CREATE TABLE public.lesson_notebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id TEXT NOT NULL,
  lesson_title TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  auto_notes TEXT,
  personal_notes TEXT,
  vocabulary_json JSONB DEFAULT '[]'::jsonb,
  corrections_json JSONB DEFAULT '[]'::jsonb,
  achievements_json JSONB DEFAULT '[]'::jsonb,
  cultural_moments_json JSONB DEFAULT '[]'::jsonb,
  practice_guidance TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lesson_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.lesson_notebooks ENABLE ROW LEVEL SECURITY;

-- Create policies for lesson notebooks
CREATE POLICY "Users can view their own lesson notebooks" 
ON public.lesson_notebooks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson notebooks" 
ON public.lesson_notebooks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson notebooks" 
ON public.lesson_notebooks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lesson notebooks" 
ON public.lesson_notebooks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_lesson_notebooks_updated_at
BEFORE UPDATE ON public.lesson_notebooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_lesson_notebooks_user_lesson ON public.lesson_notebooks(user_id, lesson_id);
CREATE INDEX idx_lesson_notebooks_created_at ON public.lesson_notebooks(created_at DESC);