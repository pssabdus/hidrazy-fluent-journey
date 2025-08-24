import { supabase } from '@/integrations/supabase/client';

export type ContentType = 'lesson' | 'conversation' | 'roleplay' | 'ielts' | 'pronunciation' | 'assessment';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface ContentRequest {
  content_type: ContentType;
  level: CEFRLevel;
  topic?: string;
  cultural_context?: string;
  learning_objectives?: string[];
  duration_minutes?: number;
}

export interface GeneratedContent {
  id: string;
  title: string;
  description: string;
  level: CEFRLevel;
  estimated_duration: number;
  content: any;
  metadata: {
    vocabulary_focus: string[];
    grammar_focus: string[];
    cultural_elements: string[];
    assessment_criteria: {
      vocabulary: string;
      grammar: string;
      fluency: string;
      comprehension: string;
    };
  };
}

export interface LevelProgression {
  id: string;
  user_id: string;
  current_level: CEFRLevel;
  levels_completed: string[];
  assessment_scores: Record<string, number>;
  total_learning_time: number;
  streak_days: number;
  next_assessment_due: string | null;
}

export interface AssessmentResult {
  id: string;
  level: CEFRLevel;
  assessment_type: string;
  score: number;
  max_score: number;
  passed: boolean;
  assessment_data: any;
}

class AIContentService {
  async generateContent(request: ContentRequest): Promise<GeneratedContent> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: request
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate content');
      }

      if (!data.success) {
        throw new Error(data.error || 'Content generation failed');
      }

      return data.content;
    } catch (error) {
      console.error('AI Content Generation Error:', error);
      throw error;
    }
  }

  async getGeneratedContent(level?: CEFRLevel, contentType?: ContentType) {
    try {
      let query = supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (level) {
        query = query.eq('level', level);
      }

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map(item => {
        const contentData = item.content_data as any;
        return {
          id: item.id,
          title: item.title,
          description: item.description || '',
          level: item.level as CEFRLevel,
          estimated_duration: item.estimated_duration,
          content: contentData?.content || contentData || {},
          metadata: contentData?.metadata || {
            vocabulary_focus: [],
            grammar_focus: [],
            cultural_elements: [],
            assessment_criteria: {
              vocabulary: '',
              grammar: '',
              fluency: '',
              comprehension: ''
            }
          }
        };
      });
    } catch (error) {
      console.error('Error fetching generated content:', error);
      throw error;
    }
  }

  async completeContent(contentId: string, score: number, completionData: any) {
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .update({
          is_completed: true,
          completion_score: score,
          completion_data: completionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error completing content:', error);
      throw error;
    }
  }

  async getUserProgression(): Promise<LevelProgression | null> {
    try {
      const { data, error } = await supabase
        .from('level_progression')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? {
        ...data,
        current_level: data.current_level as CEFRLevel,
        levels_completed: data.levels_completed || [],
        assessment_scores: (data.assessment_scores as Record<string, number>) || {},
        total_learning_time: data.total_learning_time || 0,
        streak_days: data.streak_days || 0,
        next_assessment_due: data.next_assessment_due
      } : null;
    } catch (error) {
      console.error('Error fetching user progression:', error);
      throw error;
    }
  }

  async getLevelAssessments(level?: CEFRLevel): Promise<AssessmentResult[]> {
    try {
      let query = supabase
        .from('level_assessments')
        .select('*')
        .order('completed_at', { ascending: false });

      if (level) {
        query = query.eq('level', level);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map(item => ({
        ...item,
        level: item.level as CEFRLevel
      }));
    } catch (error) {
      console.error('Error fetching level assessments:', error);
      throw error;
    }
  }

  async submitAssessment(
    level: CEFRLevel,
    assessmentType: string,
    score: number,
    maxScore: number = 100,
    assessmentData: any = {}
  ): Promise<AssessmentResult> {
    try {
      const passed = (score / maxScore) * 100 >= this.getPassingScore(level, assessmentType);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('level_assessments')
        .upsert({
          user_id: user.user.id,
          level: level,
          assessment_type: assessmentType,
          score,
          max_score: maxScore,
          assessment_data: assessmentData,
          passed,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        ...data,
        level: data.level as CEFRLevel
      };
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  }

  private getPassingScore(level: CEFRLevel, assessmentType: string): number {
    const requirements = {
      A1: { vocabulary: 70, grammar: 70, speaking: 60, listening: 65 },
      A2: { vocabulary: 75, grammar: 75, speaking: 65, listening: 70 },
      B1: { vocabulary: 80, grammar: 80, speaking: 70, listening: 75 },
      B2: { vocabulary: 85, grammar: 85, speaking: 80, listening: 80 },
      C1: { vocabulary: 90, grammar: 90, speaking: 85, listening: 85 },
      C2: { vocabulary: 95, grammar: 95, speaking: 90, listening: 90 }
    };

    return requirements[level]?.[assessmentType as keyof typeof requirements[typeof level]] || 70;
  }

  async canAccessLevel(targetLevel: CEFRLevel): Promise<boolean> {
    try {
      const progression = await this.getUserProgression();
      if (!progression) return targetLevel === 'A1';

      const levelOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const currentIndex = levelOrder.indexOf(progression.current_level);
      const targetIndex = levelOrder.indexOf(targetLevel);

      // Can access current level and all previous levels
      return targetIndex <= currentIndex;
    } catch (error) {
      console.error('Error checking level access:', error);
      return targetLevel === 'A1';
    }
  }

  async trackContentInteraction(
    contentId: string,
    interactionType: string,
    interactionData: any = {},
    timeSpent: number = 0
  ) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.warn('User not authenticated, skipping interaction tracking');
        return;
      }

      // Note: content_interactions table needs to be created in the database
      // For now, we'll track this in analytics_events instead
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          user_id: user.user.id,
          event_type: 'content_interaction',
          event_data: {
            content_id: contentId,
            interaction_type: interactionType,
            interaction_data: interactionData,
            time_spent: timeSpent
          }
        });

      if (error) {
        console.error('Error tracking content interaction:', error);
      }
    } catch (error) {
      console.error('Error tracking content interaction:', error);
    }
  }

  async initializeUserProgression(): Promise<LevelProgression> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('level_progression')
        .upsert({
          user_id: user.user.id,
          current_level: 'A1',
          levels_completed: [],
          assessment_scores: {},
          total_learning_time: 0,
          streak_days: 0
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        ...data,
        current_level: data.current_level as CEFRLevel,
        levels_completed: data.levels_completed || [],
        assessment_scores: (data.assessment_scores as Record<string, number>) || {},
        total_learning_time: data.total_learning_time || 0,
        streak_days: data.streak_days || 0,
        next_assessment_due: data.next_assessment_due
      };
    } catch (error) {
      console.error('Error initializing user progression:', error);
      throw error;
    }
  }
}

export const aiContentService = new AIContentService();