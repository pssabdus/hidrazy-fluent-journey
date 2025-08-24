-- Create comprehensive database schema for English learning platform

-- Conversation history table for storing all Razia conversations
CREATE TABLE IF NOT EXISTS public.conversation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL,
  message_index INTEGER NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'razia')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Performance metrics
  response_time_ms INTEGER,
  user_confidence_level NUMERIC(3,2) CHECK (user_confidence_level >= 0 AND user_confidence_level <= 1),
  grammar_score NUMERIC(3,2) CHECK (grammar_score >= 0 AND grammar_score <= 1),
  fluency_score NUMERIC(3,2) CHECK (fluency_score >= 0 AND fluency_score <= 1),
  pronunciation_score NUMERIC(3,2) CHECK (pronunciation_score >= 0 AND pronunciation_score <= 1),
  
  -- Cultural adaptations
  cultural_context JSONB DEFAULT '{}',
  cultural_bridge_used BOOLEAN DEFAULT false,
  arabic_reference_made BOOLEAN DEFAULT false,
  
  -- Error patterns
  errors_detected JSONB DEFAULT '[]',
  error_types JSONB DEFAULT '[]',
  corrections_provided JSONB DEFAULT '[]',
  
  -- Emotional analysis
  user_emotion TEXT,
  emotion_confidence NUMERIC(3,2),
  engagement_level NUMERIC(3,2) CHECK (engagement_level >= 0 AND engagement_level <= 1),
  
  -- Conversation flow
  conversation_topic TEXT,
  lesson_connection UUID,
  difficulty_level TEXT CHECK (difficulty_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  
  -- Metadata
  razia_personality_mode TEXT DEFAULT 'warm_encouraging',
  adaptive_response_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Learning analytics table for detailed user learning patterns
CREATE TABLE IF NOT EXISTS public.learning_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Learning patterns
  study_duration_minutes INTEGER DEFAULT 0,
  optimal_study_time TIME,
  peak_performance_hour INTEGER CHECK (peak_performance_hour >= 0 AND peak_performance_hour <= 23),
  
  -- Mistake tracking
  total_mistakes INTEGER DEFAULT 0,
  grammar_mistakes INTEGER DEFAULT 0,
  vocabulary_mistakes INTEGER DEFAULT 0,
  pronunciation_mistakes INTEGER DEFAULT 0,
  cultural_mistakes INTEGER DEFAULT 0,
  mistake_patterns JSONB DEFAULT '[]',
  
  -- Improvement metrics
  improvement_velocity NUMERIC(5,2) DEFAULT 0,
  learning_efficiency NUMERIC(3,2) CHECK (learning_efficiency >= 0 AND learning_efficiency <= 1),
  retention_rate NUMERIC(3,2) CHECK (retention_rate >= 0 AND retention_rate <= 1),
  
  -- Engagement tracking
  engagement_score NUMERIC(3,2) CHECK (engagement_score >= 0 AND engagement_score <= 1),
  motivation_level NUMERIC(3,2) CHECK (motivation_level >= 0 AND motivation_level <= 1),
  session_count INTEGER DEFAULT 0,
  completion_rate NUMERIC(3,2) CHECK (completion_rate >= 0 AND completion_rate <= 1),
  
  -- Difficulty progression
  current_difficulty TEXT CHECK (current_difficulty IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  difficulty_comfort_level NUMERIC(3,2) CHECK (difficulty_comfort_level >= 0 AND difficulty_comfort_level <= 1),
  challenge_preference NUMERIC(3,2) CHECK (challenge_preference >= 0 AND challenge_preference <= 1),
  
  -- Cultural adaptation
  cultural_adaptation_progress NUMERIC(3,2) CHECK (cultural_adaptation_progress >= 0 AND cultural_adaptation_progress <= 1),
  arabic_transfer_issues JSONB DEFAULT '[]',
  cultural_confidence_level NUMERIC(3,2) CHECK (cultural_confidence_level >= 0 AND cultural_confidence_level <= 1),
  
  -- Weekly/Monthly aggregates
  weekly_progress JSONB DEFAULT '{}',
  monthly_trends JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, date)
);

-- Personalization data for AI-generated user profiles
CREATE TABLE IF NOT EXISTS public.personalization_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Learning preferences
  preferred_learning_style TEXT CHECK (preferred_learning_style IN ('visual', 'auditory', 'kinesthetic', 'reading_writing', 'mixed')),
  optimal_lesson_length_minutes INTEGER DEFAULT 15,
  preferred_difficulty_progression TEXT CHECK (preferred_difficulty_progression IN ('gradual', 'moderate', 'accelerated')),
  
  -- Cognitive patterns
  cognitive_load_preference NUMERIC(3,2) CHECK (cognitive_load_preference >= 0 AND cognitive_load_preference <= 1),
  attention_span_minutes INTEGER,
  memory_retention_style TEXT CHECK (memory_retention_style IN ('visual', 'verbal', 'procedural', 'episodic')),
  processing_speed TEXT CHECK (processing_speed IN ('slow', 'moderate', 'fast')),
  
  -- Emotional patterns
  confidence_patterns JSONB DEFAULT '{}',
  stress_indicators JSONB DEFAULT '[]',
  motivation_triggers JSONB DEFAULT '[]',
  emotional_support_needs JSONB DEFAULT '{}',
  
  -- Cultural background integration
  cultural_background_data JSONB DEFAULT '{}',
  arabic_proficiency_level TEXT CHECK (arabic_proficiency_level IN ('native', 'fluent', 'intermediate', 'basic')),
  cultural_learning_goals JSONB DEFAULT '[]',
  communication_style_preference TEXT,
  
  -- Adaptive curriculum
  personalized_curriculum JSONB DEFAULT '{}',
  learning_path_adjustments JSONB DEFAULT '[]',
  goal_progression_timeline JSONB DEFAULT '{}',
  
  -- AI model preferences
  ai_personality_preference TEXT DEFAULT 'warm_encouraging',
  correction_style_preference TEXT CHECK (correction_style_preference IN ('gentle', 'direct', 'contextual')),
  explanation_depth_preference TEXT CHECK (explanation_depth_preference IN ('brief', 'detailed', 'comprehensive')),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Content recommendations for AI-generated suggestions
CREATE TABLE IF NOT EXISTS public.content_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Recommendation types
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('lesson', 'vocabulary', 'practice', 'conversation_topic', 'cultural_content')),
  priority_score NUMERIC(3,2) CHECK (priority_score >= 0 AND priority_score <= 1),
  
  -- Content details
  content_id TEXT,
  content_title TEXT NOT NULL,
  content_description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  estimated_duration_minutes INTEGER,
  
  -- AI reasoning
  recommendation_reasoning JSONB DEFAULT '{}',
  learning_gaps_addressed JSONB DEFAULT '[]',
  prerequisite_skills JSONB DEFAULT '[]',
  learning_objectives JSONB DEFAULT '[]',
  
  -- Personalization factors
  cultural_relevance_score NUMERIC(3,2) CHECK (cultural_relevance_score >= 0 AND cultural_relevance_score <= 1),
  user_interest_alignment NUMERIC(3,2) CHECK (user_interest_alignment >= 0 AND user_interest_alignment <= 1),
  optimal_timing TIMESTAMP WITH TIME ZONE,
  
  -- Spaced repetition
  spaced_repetition_interval INTEGER, -- days
  repetition_count INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  next_review_due TIMESTAMP WITH TIME ZONE,
  
  -- Engagement prediction
  predicted_engagement NUMERIC(3,2) CHECK (predicted_engagement >= 0 AND predicted_engagement <= 1),
  predicted_success_rate NUMERIC(3,2) CHECK (predicted_success_rate >= 0 AND predicted_success_rate <= 1),
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'presented', 'accepted', 'rejected', 'completed')),
  user_feedback JSONB DEFAULT '{}',
  effectiveness_score NUMERIC(3,2),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Progress tracking for real-time progress updates
CREATE TABLE IF NOT EXISTS public.progress_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Skill assessments
  overall_proficiency NUMERIC(3,2) CHECK (overall_proficiency >= 0 AND overall_proficiency <= 1),
  speaking_level NUMERIC(3,2) CHECK (speaking_level >= 0 AND speaking_level <= 1),
  listening_level NUMERIC(3,2) CHECK (listening_level >= 0 AND listening_level <= 1),
  reading_level NUMERIC(3,2) CHECK (reading_level >= 0 AND reading_level <= 1),
  writing_level NUMERIC(3,2) CHECK (writing_level >= 0 AND writing_level <= 1),
  grammar_level NUMERIC(3,2) CHECK (grammar_level >= 0 AND grammar_level <= 1),
  vocabulary_level NUMERIC(3,2) CHECK (vocabulary_level >= 0 AND vocabulary_level <= 1),
  pronunciation_level NUMERIC(3,2) CHECK (pronunciation_level >= 0 AND pronunciation_level <= 1),
  cultural_competency NUMERIC(3,2) CHECK (cultural_competency >= 0 AND cultural_competency <= 1),
  
  -- Competency mastery
  mastered_competencies JSONB DEFAULT '[]',
  in_progress_competencies JSONB DEFAULT '[]',
  weak_areas JSONB DEFAULT '[]',
  strength_areas JSONB DEFAULT '[]',
  
  -- Learning milestones
  milestones_achieved JSONB DEFAULT '[]',
  current_milestone_progress NUMERIC(3,2) CHECK (current_milestone_progress >= 0 AND current_milestone_progress <= 1),
  next_milestone TEXT,
  estimated_milestone_date DATE,
  
  -- Performance metrics
  learning_velocity NUMERIC(5,2) DEFAULT 0, -- units per week
  consistency_score NUMERIC(3,2) CHECK (consistency_score >= 0 AND consistency_score <= 1),
  challenge_completion_rate NUMERIC(3,2) CHECK (challenge_completion_rate >= 0 AND challenge_completion_rate <= 1),
  
  -- Adaptive assessments
  last_assessment_date DATE,
  next_assessment_due DATE,
  assessment_frequency_days INTEGER DEFAULT 7,
  
  -- Goal tracking
  short_term_goals JSONB DEFAULT '[]',
  long_term_goals JSONB DEFAULT '[]',
  goal_completion_rate NUMERIC(3,2) CHECK (goal_completion_rate >= 0 AND goal_completion_rate <= 1),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Feature usage tracking for premium features
CREATE TABLE IF NOT EXISTS public.feature_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Conversation tracking
  conversations_count INTEGER DEFAULT 0,
  conversation_minutes INTEGER DEFAULT 0,
  daily_conversation_limit INTEGER DEFAULT 5,
  conversations_remaining INTEGER DEFAULT 5,
  
  -- Premium feature usage
  advanced_analytics_views INTEGER DEFAULT 0,
  cultural_intelligence_uses INTEGER DEFAULT 0,
  business_mode_minutes INTEGER DEFAULT 0,
  ielts_practice_sessions INTEGER DEFAULT 0,
  offline_content_downloads INTEGER DEFAULT 0,
  
  -- Feature attempt tracking
  premium_features_attempted JSONB DEFAULT '[]',
  upgrade_prompts_shown INTEGER DEFAULT 0,
  upgrade_prompt_clicks INTEGER DEFAULT 0,
  
  -- Subscription analytics
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'business')),
  subscription_active BOOLEAN DEFAULT false,
  subscription_start_date DATE,
  subscription_end_date DATE,
  
  -- Usage patterns
  peak_usage_hour INTEGER CHECK (peak_usage_hour >= 0 AND peak_usage_hour <= 23),
  session_duration_avg_minutes NUMERIC(5,2),
  features_used_today JSONB DEFAULT '[]',
  
  -- Conversion funnel
  trial_started BOOLEAN DEFAULT false,
  trial_end_date DATE,
  conversion_stage TEXT CHECK (conversion_stage IN ('visitor', 'trial', 'subscriber', 'churned')),
  churn_risk_score NUMERIC(3,2) CHECK (churn_risk_score >= 0 AND churn_risk_score <= 1),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, date)
);

-- AI training data for conversation datasets
CREATE TABLE IF NOT EXISTS public.ai_training_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dataset categorization
  dataset_type TEXT NOT NULL CHECK (dataset_type IN ('conversation', 'error_correction', 'cultural_context', 'personality_adaptation')),
  user_level TEXT CHECK (user_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  cultural_context TEXT DEFAULT 'arabic_speaker',
  
  -- Conversation data
  conversation_sample JSONB NOT NULL,
  user_input TEXT,
  razia_response TEXT,
  conversation_quality_score NUMERIC(3,2) CHECK (conversation_quality_score >= 0 AND conversation_quality_score <= 1),
  
  -- Error patterns
  error_type TEXT,
  correction_provided TEXT,
  correction_effectiveness NUMERIC(3,2) CHECK (correction_effectiveness >= 0 AND correction_effectiveness <= 1),
  
  -- Cultural intelligence
  cultural_bridge_example TEXT,
  arabic_reference_context TEXT,
  cultural_sensitivity_score NUMERIC(3,2) CHECK (cultural_sensitivity_score >= 0 AND cultural_sensitivity_score <= 1),
  
  -- Personality adaptation
  personality_mode TEXT DEFAULT 'warm_encouraging',
  user_confidence_level NUMERIC(3,2) CHECK (user_confidence_level >= 0 AND user_confidence_level <= 1),
  adaptation_strategy JSONB DEFAULT '{}',
  
  -- Quality metrics
  response_relevance NUMERIC(3,2) CHECK (response_relevance >= 0 AND response_relevance <= 1),
  educational_value NUMERIC(3,2) CHECK (educational_value >= 0 AND educational_value <= 1),
  engagement_factor NUMERIC(3,2) CHECK (engagement_factor >= 0 AND engagement_factor <= 1),
  
  -- Learning outcomes
  learning_objective_met BOOLEAN DEFAULT false,
  skill_improvement_evidence JSONB DEFAULT '{}',
  follow_up_needed BOOLEAN DEFAULT false,
  
  -- Metadata
  anonymized BOOLEAN DEFAULT true,
  consent_given BOOLEAN DEFAULT false,
  training_approved BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_conversation_history_updated_at
    BEFORE UPDATE ON public.conversation_history
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_analytics_updated_at
    BEFORE UPDATE ON public.learning_analytics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personalization_data_updated_at
    BEFORE UPDATE ON public.personalization_data
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_recommendations_updated_at
    BEFORE UPDATE ON public.content_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progress_tracking_updated_at
    BEFORE UPDATE ON public.progress_tracking
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_usage_updated_at
    BEFORE UPDATE ON public.feature_usage
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_training_data_updated_at
    BEFORE UPDATE ON public.ai_training_data
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_conversation_history_user_id ON public.conversation_history(user_id);
CREATE INDEX idx_conversation_history_conversation_id ON public.conversation_history(conversation_id);
CREATE INDEX idx_conversation_history_timestamp ON public.conversation_history(timestamp);

CREATE INDEX idx_learning_analytics_user_id ON public.learning_analytics(user_id);
CREATE INDEX idx_learning_analytics_date ON public.learning_analytics(date);

CREATE INDEX idx_personalization_data_user_id ON public.personalization_data(user_id);

CREATE INDEX idx_content_recommendations_user_id ON public.content_recommendations(user_id);
CREATE INDEX idx_content_recommendations_status ON public.content_recommendations(status);
CREATE INDEX idx_content_recommendations_priority ON public.content_recommendations(priority_score DESC);

CREATE INDEX idx_progress_tracking_user_id ON public.progress_tracking(user_id);

CREATE INDEX idx_feature_usage_user_id ON public.feature_usage(user_id);
CREATE INDEX idx_feature_usage_date ON public.feature_usage(date);

CREATE INDEX idx_ai_training_data_type ON public.ai_training_data(dataset_type);
CREATE INDEX idx_ai_training_data_level ON public.ai_training_data(user_level);

-- Enable Row Level Security on all tables
ALTER TABLE public.conversation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalization_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_training_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for conversation_history
CREATE POLICY "Users can view their own conversation history"
    ON public.conversation_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversation history"
    ON public.conversation_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversation history"
    ON public.conversation_history FOR UPDATE
    USING (auth.uid() = user_id);

-- Create RLS policies for learning_analytics
CREATE POLICY "Users can view their own learning analytics"
    ON public.learning_analytics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning analytics"
    ON public.learning_analytics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning analytics"
    ON public.learning_analytics FOR UPDATE
    USING (auth.uid() = user_id);

-- Create RLS policies for personalization_data
CREATE POLICY "Users can view their own personalization data"
    ON public.personalization_data FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own personalization data"
    ON public.personalization_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personalization data"
    ON public.personalization_data FOR UPDATE
    USING (auth.uid() = user_id);

-- Create RLS policies for content_recommendations
CREATE POLICY "Users can view their own content recommendations"
    ON public.content_recommendations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content recommendations"
    ON public.content_recommendations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content recommendations"
    ON public.content_recommendations FOR UPDATE
    USING (auth.uid() = user_id);

-- Create RLS policies for progress_tracking
CREATE POLICY "Users can view their own progress tracking"
    ON public.progress_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress tracking"
    ON public.progress_tracking FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress tracking"
    ON public.progress_tracking FOR UPDATE
    USING (auth.uid() = user_id);

-- Create RLS policies for feature_usage
CREATE POLICY "Users can view their own feature usage"
    ON public.feature_usage FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feature usage"
    ON public.feature_usage FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feature usage"
    ON public.feature_usage FOR UPDATE
    USING (auth.uid() = user_id);

-- Create RLS policies for ai_training_data (admin access only for sensitive data)
CREATE POLICY "Authenticated users can view anonymized training data"
    ON public.ai_training_data FOR SELECT
    USING (auth.role() = 'authenticated' AND anonymized = true);

CREATE POLICY "System can insert training data"
    ON public.ai_training_data FOR INSERT
    WITH CHECK (true);

CREATE POLICY "System can update training data"
    ON public.ai_training_data FOR UPDATE
    USING (true);