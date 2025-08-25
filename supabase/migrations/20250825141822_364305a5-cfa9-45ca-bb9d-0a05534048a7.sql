-- Create table for AI usage logging and cost monitoring
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  model_used TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  estimated_cost DECIMAL(10,6) DEFAULT 0.000000,
  request_type TEXT,
  conversation_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own AI usage logs" 
ON public.ai_usage_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert AI usage logs" 
ON public.ai_usage_logs 
FOR INSERT 
WITH CHECK (true);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_timestamp ON public.ai_usage_logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_model ON public.ai_usage_logs(model_used);

-- Create function to clean old logs (keep only last 3 months)
CREATE OR REPLACE FUNCTION public.cleanup_old_ai_usage_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.ai_usage_logs 
  WHERE timestamp < (CURRENT_DATE - INTERVAL '3 months');
END;
$$;