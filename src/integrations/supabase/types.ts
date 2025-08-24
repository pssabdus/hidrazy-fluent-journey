export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_training_data: {
        Row: {
          adaptation_strategy: Json | null
          anonymized: boolean | null
          arabic_reference_context: string | null
          consent_given: boolean | null
          conversation_quality_score: number | null
          conversation_sample: Json
          correction_effectiveness: number | null
          correction_provided: string | null
          created_at: string
          cultural_bridge_example: string | null
          cultural_context: string | null
          cultural_sensitivity_score: number | null
          dataset_type: string
          educational_value: number | null
          engagement_factor: number | null
          error_type: string | null
          follow_up_needed: boolean | null
          id: string
          learning_objective_met: boolean | null
          personality_mode: string | null
          razia_response: string | null
          response_relevance: number | null
          skill_improvement_evidence: Json | null
          training_approved: boolean | null
          updated_at: string
          user_confidence_level: number | null
          user_input: string | null
          user_level: string | null
        }
        Insert: {
          adaptation_strategy?: Json | null
          anonymized?: boolean | null
          arabic_reference_context?: string | null
          consent_given?: boolean | null
          conversation_quality_score?: number | null
          conversation_sample: Json
          correction_effectiveness?: number | null
          correction_provided?: string | null
          created_at?: string
          cultural_bridge_example?: string | null
          cultural_context?: string | null
          cultural_sensitivity_score?: number | null
          dataset_type: string
          educational_value?: number | null
          engagement_factor?: number | null
          error_type?: string | null
          follow_up_needed?: boolean | null
          id?: string
          learning_objective_met?: boolean | null
          personality_mode?: string | null
          razia_response?: string | null
          response_relevance?: number | null
          skill_improvement_evidence?: Json | null
          training_approved?: boolean | null
          updated_at?: string
          user_confidence_level?: number | null
          user_input?: string | null
          user_level?: string | null
        }
        Update: {
          adaptation_strategy?: Json | null
          anonymized?: boolean | null
          arabic_reference_context?: string | null
          consent_given?: boolean | null
          conversation_quality_score?: number | null
          conversation_sample?: Json
          correction_effectiveness?: number | null
          correction_provided?: string | null
          created_at?: string
          cultural_bridge_example?: string | null
          cultural_context?: string | null
          cultural_sensitivity_score?: number | null
          dataset_type?: string
          educational_value?: number | null
          engagement_factor?: number | null
          error_type?: string | null
          follow_up_needed?: boolean | null
          id?: string
          learning_objective_met?: boolean | null
          personality_mode?: string | null
          razia_response?: string | null
          response_relevance?: number | null
          skill_improvement_evidence?: Json | null
          training_approved?: boolean | null
          updated_at?: string
          user_confidence_level?: number | null
          user_input?: string | null
          user_level?: string | null
        }
        Relationships: []
      }
      assessments: {
        Row: {
          assessment_data_json: Json | null
          completed_at: string | null
          confidence_score: number | null
          correct_answers: number | null
          created_at: string
          final_level: string | null
          id: string
          questions_answered: number | null
          session_id: string
          status: string | null
          strengths_json: Json | null
          updated_at: string
          user_id: string
          weaknesses_json: Json | null
        }
        Insert: {
          assessment_data_json?: Json | null
          completed_at?: string | null
          confidence_score?: number | null
          correct_answers?: number | null
          created_at?: string
          final_level?: string | null
          id?: string
          questions_answered?: number | null
          session_id: string
          status?: string | null
          strengths_json?: Json | null
          updated_at?: string
          user_id: string
          weaknesses_json?: Json | null
        }
        Update: {
          assessment_data_json?: Json | null
          completed_at?: string | null
          confidence_score?: number | null
          correct_answers?: number | null
          created_at?: string
          final_level?: string | null
          id?: string
          questions_answered?: number | null
          session_id?: string
          status?: string | null
          strengths_json?: Json | null
          updated_at?: string
          user_id?: string
          weaknesses_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      competency_framework: {
        Row: {
          category: string
          competency_id: string
          competency_name: string
          created_at: string
          description: string
          examples_json: Json | null
          id: string
          level: number
          prerequisites_json: Json | null
          world_name: string
        }
        Insert: {
          category: string
          competency_id: string
          competency_name: string
          created_at?: string
          description: string
          examples_json?: Json | null
          id?: string
          level: number
          prerequisites_json?: Json | null
          world_name: string
        }
        Update: {
          category?: string
          competency_id?: string
          competency_name?: string
          created_at?: string
          description?: string
          examples_json?: Json | null
          id?: string
          level?: number
          prerequisites_json?: Json | null
          world_name?: string
        }
        Relationships: []
      }
      content_recommendations: {
        Row: {
          content_description: string | null
          content_id: string | null
          content_title: string
          created_at: string
          cultural_relevance_score: number | null
          difficulty_level: string | null
          effectiveness_score: number | null
          estimated_duration_minutes: number | null
          id: string
          last_reviewed: string | null
          learning_gaps_addressed: Json | null
          learning_objectives: Json | null
          next_review_due: string | null
          optimal_timing: string | null
          predicted_engagement: number | null
          predicted_success_rate: number | null
          prerequisite_skills: Json | null
          priority_score: number | null
          recommendation_reasoning: Json | null
          recommendation_type: string
          repetition_count: number | null
          spaced_repetition_interval: number | null
          status: string | null
          updated_at: string
          user_feedback: Json | null
          user_id: string
          user_interest_alignment: number | null
        }
        Insert: {
          content_description?: string | null
          content_id?: string | null
          content_title: string
          created_at?: string
          cultural_relevance_score?: number | null
          difficulty_level?: string | null
          effectiveness_score?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          last_reviewed?: string | null
          learning_gaps_addressed?: Json | null
          learning_objectives?: Json | null
          next_review_due?: string | null
          optimal_timing?: string | null
          predicted_engagement?: number | null
          predicted_success_rate?: number | null
          prerequisite_skills?: Json | null
          priority_score?: number | null
          recommendation_reasoning?: Json | null
          recommendation_type: string
          repetition_count?: number | null
          spaced_repetition_interval?: number | null
          status?: string | null
          updated_at?: string
          user_feedback?: Json | null
          user_id: string
          user_interest_alignment?: number | null
        }
        Update: {
          content_description?: string | null
          content_id?: string | null
          content_title?: string
          created_at?: string
          cultural_relevance_score?: number | null
          difficulty_level?: string | null
          effectiveness_score?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          last_reviewed?: string | null
          learning_gaps_addressed?: Json | null
          learning_objectives?: Json | null
          next_review_due?: string | null
          optimal_timing?: string | null
          predicted_engagement?: number | null
          predicted_success_rate?: number | null
          prerequisite_skills?: Json | null
          priority_score?: number | null
          recommendation_reasoning?: Json | null
          recommendation_type?: string
          repetition_count?: number | null
          spaced_repetition_interval?: number | null
          status?: string | null
          updated_at?: string
          user_feedback?: Json | null
          user_id?: string
          user_interest_alignment?: number | null
        }
        Relationships: []
      }
      conversation_history: {
        Row: {
          adaptive_response_data: Json | null
          arabic_reference_made: boolean | null
          content: string
          conversation_id: string
          conversation_topic: string | null
          corrections_provided: Json | null
          created_at: string
          cultural_bridge_used: boolean | null
          cultural_context: Json | null
          difficulty_level: string | null
          emotion_confidence: number | null
          engagement_level: number | null
          error_types: Json | null
          errors_detected: Json | null
          fluency_score: number | null
          grammar_score: number | null
          id: string
          lesson_connection: string | null
          message_index: number
          pronunciation_score: number | null
          razia_personality_mode: string | null
          response_time_ms: number | null
          sender: string
          timestamp: string
          updated_at: string
          user_confidence_level: number | null
          user_emotion: string | null
          user_id: string
        }
        Insert: {
          adaptive_response_data?: Json | null
          arabic_reference_made?: boolean | null
          content: string
          conversation_id: string
          conversation_topic?: string | null
          corrections_provided?: Json | null
          created_at?: string
          cultural_bridge_used?: boolean | null
          cultural_context?: Json | null
          difficulty_level?: string | null
          emotion_confidence?: number | null
          engagement_level?: number | null
          error_types?: Json | null
          errors_detected?: Json | null
          fluency_score?: number | null
          grammar_score?: number | null
          id?: string
          lesson_connection?: string | null
          message_index: number
          pronunciation_score?: number | null
          razia_personality_mode?: string | null
          response_time_ms?: number | null
          sender: string
          timestamp?: string
          updated_at?: string
          user_confidence_level?: number | null
          user_emotion?: string | null
          user_id: string
        }
        Update: {
          adaptive_response_data?: Json | null
          arabic_reference_made?: boolean | null
          content?: string
          conversation_id?: string
          conversation_topic?: string | null
          corrections_provided?: Json | null
          created_at?: string
          cultural_bridge_used?: boolean | null
          cultural_context?: Json | null
          difficulty_level?: string | null
          emotion_confidence?: number | null
          engagement_level?: number | null
          error_types?: Json | null
          errors_detected?: Json | null
          fluency_score?: number | null
          grammar_score?: number | null
          id?: string
          lesson_connection?: string | null
          message_index?: number
          pronunciation_score?: number | null
          razia_personality_mode?: string | null
          response_time_ms?: number | null
          sender?: string
          timestamp?: string
          updated_at?: string
          user_confidence_level?: number | null
          user_emotion?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string | null
          messages_json: Json | null
          performance_data_json: Json | null
          type: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string | null
          messages_json?: Json | null
          performance_data_json?: Json | null
          type?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string | null
          messages_json?: Json | null
          performance_data_json?: Json | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_usage: {
        Row: {
          advanced_analytics_views: number | null
          business_mode_minutes: number | null
          churn_risk_score: number | null
          conversation_minutes: number | null
          conversations_count: number | null
          conversations_remaining: number | null
          conversion_stage: string | null
          created_at: string
          cultural_intelligence_uses: number | null
          daily_conversation_limit: number | null
          date: string
          features_used_today: Json | null
          id: string
          ielts_practice_sessions: number | null
          offline_content_downloads: number | null
          peak_usage_hour: number | null
          premium_features_attempted: Json | null
          session_duration_avg_minutes: number | null
          subscription_active: boolean | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_tier: string | null
          trial_end_date: string | null
          trial_started: boolean | null
          updated_at: string
          upgrade_prompt_clicks: number | null
          upgrade_prompts_shown: number | null
          user_id: string
        }
        Insert: {
          advanced_analytics_views?: number | null
          business_mode_minutes?: number | null
          churn_risk_score?: number | null
          conversation_minutes?: number | null
          conversations_count?: number | null
          conversations_remaining?: number | null
          conversion_stage?: string | null
          created_at?: string
          cultural_intelligence_uses?: number | null
          daily_conversation_limit?: number | null
          date?: string
          features_used_today?: Json | null
          id?: string
          ielts_practice_sessions?: number | null
          offline_content_downloads?: number | null
          peak_usage_hour?: number | null
          premium_features_attempted?: Json | null
          session_duration_avg_minutes?: number | null
          subscription_active?: boolean | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_tier?: string | null
          trial_end_date?: string | null
          trial_started?: boolean | null
          updated_at?: string
          upgrade_prompt_clicks?: number | null
          upgrade_prompts_shown?: number | null
          user_id: string
        }
        Update: {
          advanced_analytics_views?: number | null
          business_mode_minutes?: number | null
          churn_risk_score?: number | null
          conversation_minutes?: number | null
          conversations_count?: number | null
          conversations_remaining?: number | null
          conversion_stage?: string | null
          created_at?: string
          cultural_intelligence_uses?: number | null
          daily_conversation_limit?: number | null
          date?: string
          features_used_today?: Json | null
          id?: string
          ielts_practice_sessions?: number | null
          offline_content_downloads?: number | null
          peak_usage_hour?: number | null
          premium_features_attempted?: Json | null
          session_duration_avg_minutes?: number | null
          subscription_active?: boolean | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_tier?: string | null
          trial_end_date?: string | null
          trial_started?: boolean | null
          updated_at?: string
          upgrade_prompt_clicks?: number | null
          upgrade_prompts_shown?: number | null
          user_id?: string
        }
        Relationships: []
      }
      learning_analytics: {
        Row: {
          arabic_transfer_issues: Json | null
          challenge_preference: number | null
          completion_rate: number | null
          created_at: string
          cultural_adaptation_progress: number | null
          cultural_confidence_level: number | null
          cultural_mistakes: number | null
          current_difficulty: string | null
          date: string
          difficulty_comfort_level: number | null
          engagement_score: number | null
          grammar_mistakes: number | null
          id: string
          improvement_velocity: number | null
          learning_efficiency: number | null
          mistake_patterns: Json | null
          monthly_trends: Json | null
          motivation_level: number | null
          optimal_study_time: string | null
          peak_performance_hour: number | null
          pronunciation_mistakes: number | null
          retention_rate: number | null
          session_count: number | null
          study_duration_minutes: number | null
          total_mistakes: number | null
          updated_at: string
          user_id: string
          vocabulary_mistakes: number | null
          weekly_progress: Json | null
        }
        Insert: {
          arabic_transfer_issues?: Json | null
          challenge_preference?: number | null
          completion_rate?: number | null
          created_at?: string
          cultural_adaptation_progress?: number | null
          cultural_confidence_level?: number | null
          cultural_mistakes?: number | null
          current_difficulty?: string | null
          date?: string
          difficulty_comfort_level?: number | null
          engagement_score?: number | null
          grammar_mistakes?: number | null
          id?: string
          improvement_velocity?: number | null
          learning_efficiency?: number | null
          mistake_patterns?: Json | null
          monthly_trends?: Json | null
          motivation_level?: number | null
          optimal_study_time?: string | null
          peak_performance_hour?: number | null
          pronunciation_mistakes?: number | null
          retention_rate?: number | null
          session_count?: number | null
          study_duration_minutes?: number | null
          total_mistakes?: number | null
          updated_at?: string
          user_id: string
          vocabulary_mistakes?: number | null
          weekly_progress?: Json | null
        }
        Update: {
          arabic_transfer_issues?: Json | null
          challenge_preference?: number | null
          completion_rate?: number | null
          created_at?: string
          cultural_adaptation_progress?: number | null
          cultural_confidence_level?: number | null
          cultural_mistakes?: number | null
          current_difficulty?: string | null
          date?: string
          difficulty_comfort_level?: number | null
          engagement_score?: number | null
          grammar_mistakes?: number | null
          id?: string
          improvement_velocity?: number | null
          learning_efficiency?: number | null
          mistake_patterns?: Json | null
          monthly_trends?: Json | null
          motivation_level?: number | null
          optimal_study_time?: string | null
          peak_performance_hour?: number | null
          pronunciation_mistakes?: number | null
          retention_rate?: number | null
          session_count?: number | null
          study_duration_minutes?: number | null
          total_mistakes?: number | null
          updated_at?: string
          user_id?: string
          vocabulary_mistakes?: number | null
          weekly_progress?: Json | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          adapted_content: Json | null
          competency: string
          completed_at: string | null
          completion_time_seconds: number | null
          created_at: string
          feedback_json: Json | null
          id: string
          lesson_id: string
          lesson_type: string
          mistakes_json: Json | null
          score: number | null
          status: string | null
          target_level: number
          updated_at: string
          user_id: string
        }
        Insert: {
          adapted_content?: Json | null
          competency: string
          completed_at?: string | null
          completion_time_seconds?: number | null
          created_at?: string
          feedback_json?: Json | null
          id?: string
          lesson_id: string
          lesson_type: string
          mistakes_json?: Json | null
          score?: number | null
          status?: string | null
          target_level: number
          updated_at?: string
          user_id: string
        }
        Update: {
          adapted_content?: Json | null
          competency?: string
          completed_at?: string | null
          completion_time_seconds?: number | null
          created_at?: string
          feedback_json?: Json | null
          id?: string
          lesson_id?: string
          lesson_type?: string
          mistakes_json?: Json | null
          score?: number | null
          status?: string | null
          target_level?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          competency: string
          content_type: string | null
          created_at: string
          duration: number | null
          exercises_json: Json | null
          id: string
          island: string
          level: string
          razia_prompts_json: Json | null
          title: string
          world: string
        }
        Insert: {
          competency: string
          content_type?: string | null
          created_at?: string
          duration?: number | null
          exercises_json?: Json | null
          id?: string
          island: string
          level: string
          razia_prompts_json?: Json | null
          title: string
          world: string
        }
        Update: {
          competency?: string
          content_type?: string | null
          created_at?: string
          duration?: number | null
          exercises_json?: Json | null
          id?: string
          island?: string
          level?: string
          razia_prompts_json?: Json | null
          title?: string
          world?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          id: string
          status: string | null
          stripe_session_id: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          status?: string | null
          stripe_session_id?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          status?: string | null
          stripe_session_id?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      personalization_data: {
        Row: {
          ai_personality_preference: string | null
          arabic_proficiency_level: string | null
          attention_span_minutes: number | null
          cognitive_load_preference: number | null
          communication_style_preference: string | null
          confidence_patterns: Json | null
          correction_style_preference: string | null
          created_at: string
          cultural_background_data: Json | null
          cultural_learning_goals: Json | null
          emotional_support_needs: Json | null
          explanation_depth_preference: string | null
          goal_progression_timeline: Json | null
          id: string
          learning_path_adjustments: Json | null
          memory_retention_style: string | null
          motivation_triggers: Json | null
          optimal_lesson_length_minutes: number | null
          personalized_curriculum: Json | null
          preferred_difficulty_progression: string | null
          preferred_learning_style: string | null
          processing_speed: string | null
          stress_indicators: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_personality_preference?: string | null
          arabic_proficiency_level?: string | null
          attention_span_minutes?: number | null
          cognitive_load_preference?: number | null
          communication_style_preference?: string | null
          confidence_patterns?: Json | null
          correction_style_preference?: string | null
          created_at?: string
          cultural_background_data?: Json | null
          cultural_learning_goals?: Json | null
          emotional_support_needs?: Json | null
          explanation_depth_preference?: string | null
          goal_progression_timeline?: Json | null
          id?: string
          learning_path_adjustments?: Json | null
          memory_retention_style?: string | null
          motivation_triggers?: Json | null
          optimal_lesson_length_minutes?: number | null
          personalized_curriculum?: Json | null
          preferred_difficulty_progression?: string | null
          preferred_learning_style?: string | null
          processing_speed?: string | null
          stress_indicators?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_personality_preference?: string | null
          arabic_proficiency_level?: string | null
          attention_span_minutes?: number | null
          cognitive_load_preference?: number | null
          communication_style_preference?: string | null
          confidence_patterns?: Json | null
          correction_style_preference?: string | null
          created_at?: string
          cultural_background_data?: Json | null
          cultural_learning_goals?: Json | null
          emotional_support_needs?: Json | null
          explanation_depth_preference?: string | null
          goal_progression_timeline?: Json | null
          id?: string
          learning_path_adjustments?: Json | null
          memory_retention_style?: string | null
          motivation_triggers?: Json | null
          optimal_lesson_length_minutes?: number | null
          personalized_curriculum?: Json | null
          preferred_difficulty_progression?: string | null
          preferred_learning_style?: string | null
          processing_speed?: string | null
          stress_indicators?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      progress_tracking: {
        Row: {
          assessment_frequency_days: number | null
          challenge_completion_rate: number | null
          consistency_score: number | null
          created_at: string
          cultural_competency: number | null
          current_milestone_progress: number | null
          estimated_milestone_date: string | null
          goal_completion_rate: number | null
          grammar_level: number | null
          id: string
          in_progress_competencies: Json | null
          last_assessment_date: string | null
          learning_velocity: number | null
          listening_level: number | null
          long_term_goals: Json | null
          mastered_competencies: Json | null
          milestones_achieved: Json | null
          next_assessment_due: string | null
          next_milestone: string | null
          overall_proficiency: number | null
          pronunciation_level: number | null
          reading_level: number | null
          short_term_goals: Json | null
          speaking_level: number | null
          strength_areas: Json | null
          updated_at: string
          user_id: string
          vocabulary_level: number | null
          weak_areas: Json | null
          writing_level: number | null
        }
        Insert: {
          assessment_frequency_days?: number | null
          challenge_completion_rate?: number | null
          consistency_score?: number | null
          created_at?: string
          cultural_competency?: number | null
          current_milestone_progress?: number | null
          estimated_milestone_date?: string | null
          goal_completion_rate?: number | null
          grammar_level?: number | null
          id?: string
          in_progress_competencies?: Json | null
          last_assessment_date?: string | null
          learning_velocity?: number | null
          listening_level?: number | null
          long_term_goals?: Json | null
          mastered_competencies?: Json | null
          milestones_achieved?: Json | null
          next_assessment_due?: string | null
          next_milestone?: string | null
          overall_proficiency?: number | null
          pronunciation_level?: number | null
          reading_level?: number | null
          short_term_goals?: Json | null
          speaking_level?: number | null
          strength_areas?: Json | null
          updated_at?: string
          user_id: string
          vocabulary_level?: number | null
          weak_areas?: Json | null
          writing_level?: number | null
        }
        Update: {
          assessment_frequency_days?: number | null
          challenge_completion_rate?: number | null
          consistency_score?: number | null
          created_at?: string
          cultural_competency?: number | null
          current_milestone_progress?: number | null
          estimated_milestone_date?: string | null
          goal_completion_rate?: number | null
          grammar_level?: number | null
          id?: string
          in_progress_competencies?: Json | null
          last_assessment_date?: string | null
          learning_velocity?: number | null
          listening_level?: number | null
          long_term_goals?: Json | null
          mastered_competencies?: Json | null
          milestones_achieved?: Json | null
          next_assessment_due?: string | null
          next_milestone?: string | null
          overall_proficiency?: number | null
          pronunciation_level?: number | null
          reading_level?: number | null
          short_term_goals?: Json | null
          speaking_level?: number | null
          strength_areas?: Json | null
          updated_at?: string
          user_id?: string
          vocabulary_level?: number | null
          weak_areas?: Json | null
          writing_level?: number | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          ends_at: string | null
          features_unlocked_json: Json | null
          id: string
          starts_at: string | null
          status: string | null
          tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          features_unlocked_json?: Json | null
          id?: string
          starts_at?: string | null
          status?: string | null
          tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          features_unlocked_json?: Json | null
          id?: string
          starts_at?: string | null
          status?: string | null
          tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          conversation_count: number | null
          created_at: string
          id: string
          island_name: string
          lessons_completed: number | null
          mastery_score: number | null
          strengths_json: Json | null
          updated_at: string
          user_id: string
          voice_recordings_used: number | null
          weaknesses_json: Json | null
          world_name: string
        }
        Insert: {
          conversation_count?: number | null
          created_at?: string
          id?: string
          island_name: string
          lessons_completed?: number | null
          mastery_score?: number | null
          strengths_json?: Json | null
          updated_at?: string
          user_id: string
          voice_recordings_used?: number | null
          weaknesses_json?: Json | null
          world_name: string
        }
        Update: {
          conversation_count?: number | null
          created_at?: string
          id?: string
          island_name?: string
          lessons_completed?: number | null
          mastery_score?: number | null
          strengths_json?: Json | null
          updated_at?: string
          user_id?: string
          voice_recordings_used?: number | null
          weaknesses_json?: Json | null
          world_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          accent_preference: string | null
          age_group: string | null
          assessed_level: number | null
          assessment_completed: boolean | null
          country: string | null
          created_at: string
          current_level: string | null
          daily_goal_minutes: number | null
          email: string
          explanation_preference: string | null
          gender: string | null
          id: string
          journey_unlocked: boolean | null
          learning_goal: string | null
          onboarding_completed: boolean | null
          subscription_status: string | null
          target_ielts_band: number | null
          updated_at: string
          worlds_unlocked: number | null
        }
        Insert: {
          accent_preference?: string | null
          age_group?: string | null
          assessed_level?: number | null
          assessment_completed?: boolean | null
          country?: string | null
          created_at?: string
          current_level?: string | null
          daily_goal_minutes?: number | null
          email: string
          explanation_preference?: string | null
          gender?: string | null
          id?: string
          journey_unlocked?: boolean | null
          learning_goal?: string | null
          onboarding_completed?: boolean | null
          subscription_status?: string | null
          target_ielts_band?: number | null
          updated_at?: string
          worlds_unlocked?: number | null
        }
        Update: {
          accent_preference?: string | null
          age_group?: string | null
          assessed_level?: number | null
          assessment_completed?: boolean | null
          country?: string | null
          created_at?: string
          current_level?: string | null
          daily_goal_minutes?: number | null
          email?: string
          explanation_preference?: string | null
          gender?: string | null
          id?: string
          journey_unlocked?: boolean | null
          learning_goal?: string | null
          onboarding_completed?: boolean | null
          subscription_status?: string | null
          target_ielts_band?: number | null
          updated_at?: string
          worlds_unlocked?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: { admin_email: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      make_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
      cefr_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      subscription_status: "trial" | "active" | "expired" | "cancelled"
      user_role: "student" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cefr_level: ["A1", "A2", "B1", "B2", "C1", "C2"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      subscription_status: ["trial", "active", "expired", "cancelled"],
      user_role: ["student", "admin"],
    },
  },
} as const
