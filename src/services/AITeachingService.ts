import { supabase } from '@/integrations/supabase/client';

export interface LessonContext {
  theme?: string;
  duration?: string;
  previous_outcome?: string;
  energy_level?: 'low' | 'medium' | 'high';
  user_request?: string;
  test_date?: string;
  industry?: string;
  job_level?: string;
}

export interface AILessonPlan {
  lesson_plan: string;
  lesson_id?: string;
  user_profile: any;
  success: boolean;
  error?: string;
}

export class AITeachingService {
  static async generatePersonalizedLesson(
    category: 'general' | 'ielts' | 'business' = 'general',
    lessonContext: LessonContext = {}
  ): Promise<AILessonPlan> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-lesson-generator', {
        body: {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          category,
          lesson_context: lessonContext
        }
      });

      if (error) {
        console.error('Error generating AI lesson:', error);
        throw new Error(error.message || 'Failed to generate lesson');
      }

      return data;
    } catch (error) {
      console.error('AI Teaching Service Error:', error);
      return {
        lesson_plan: this.getFallbackLesson(category),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        user_profile: null
      };
    }
  }

  static async generateDailyTheme(): Promise<string> {
    const themes = [
      "Past Tense Storytelling",
      "Future Dreams and Plans", 
      "Cultural Celebrations and Traditions",
      "Technology in Daily Life",
      "Food and Family Memories",
      "Travel Experiences and Adventures",
      "Work-Life Balance Discussions",
      "Environmental Awareness",
      "Health and Wellness Habits",
      "Entertainment and Hobbies",
      "Friendship and Relationships",
      "City Life vs Rural Life",
      "Learning and Education Journey",
      "Shopping and Consumer Choices",
      "Weather and Seasonal Changes"
    ];
    
    // Simple algorithm to ensure variety
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return themes[dayOfYear % themes.length];
  }

  static async updateLessonProgress(
    lessonId: string,
    completionData: {
      completed: boolean;
      duration_minutes: number;
      confidence_rating: number;
      key_learnings: string[];
      struggles: string[];
      cultural_moments: string[];
    }
  ) {
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          is_completed: completionData.completed,
          completion_data: completionData,
          completion_score: completionData.confidence_rating * 10
        })
        .eq('id', lessonId);

      if (error) throw error;

      // Also update learning analytics
      await this.updateLearningAnalytics(completionData);

    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  }

  private static async updateLearningAnalytics(completionData: any) {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('learning_analytics')
        .upsert({
          user_id: userId,
          date: today,
          session_count: 1,
          study_duration_minutes: completionData.duration_minutes,
          engagement_score: completionData.confidence_rating,
          cultural_adaptation_progress: completionData.cultural_moments.length * 10,
          confidence_patterns: {
            current_session: completionData.confidence_rating,
            struggles: completionData.struggles,
            successes: completionData.key_learnings
          }
        }, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        });

      if (error) console.error('Error updating analytics:', error);
    } catch (error) {
      console.error('Error in analytics update:', error);
    }
  }

  private static getFallbackLesson(category: string): string {
    const fallbacks = {
      general: `
# Today's English Practice Session

## Lesson Overview
Let's have a warm conversation about your daily experiences while focusing on natural English expression and cultural sharing.

## Primary Learning Objective
Build confidence in describing past events using appropriate tenses and cultural context.

## Cultural Integration Points
1. Share a traditional dish from your culture and explain how to prepare it
2. Compare greeting customs between Arab culture and English-speaking countries  
3. Discuss family gathering traditions and their importance

## Conversation Flow
1. **Warm-up** (3 min): How has your day been? What's one thing that made you smile today?
2. **Main Topic** (12 min): Tell me about a memorable meal you had recently. Who was there? What made it special?
3. **Cultural Bridge** (3 min): How do meal times in your culture differ from Western cultures?
4. **Language Focus** (2 min): Practice using past tense with time expressions

## Key Focus Areas
- Past tense usage (was, were, did, had)
- Descriptive vocabulary for food and emotions
- Cultural comparison language

## Success Criteria
- Use past tense accurately in 80% of responses
- Describe cultural practices with confidence
- Ask at least 2 follow-up questions

Let's start! Tell me about your morning - what did you have for breakfast?
      `,
      ielts: `
# IELTS Speaking Practice Session

## Lesson Overview
Structured speaking practice focusing on IELTS Part 2 and 3 format with cultural integration.

## Primary Learning Objective
Develop extended speaking skills with proper organization and cultural examples.

## Today's Topic
"Describe a traditional celebration in your country"

## Speaking Practice Structure
**Part 2** (2 minutes): Describe the celebration, when it happens, how people prepare, and why it's important
**Part 3** (4 minutes): Discuss how celebrations have changed over time

Practice using: 
- Complex sentence structures
- Cultural comparison vocabulary
- Academic language for analysis

Ready to begin your 1-minute preparation time?
      `,
      business: `
# Business English Communication Session

## Lesson Overview
Professional communication practice with cross-cultural business scenarios.

## Primary Learning Objective
Build confidence in international business communication.

## Today's Scenario
You're preparing for a video conference with international colleagues. Practice:
- Professional introductions
- Presenting ideas clearly
- Handling cultural differences respectfully

## Cultural Integration
- Compare business etiquette between Arab and Western cultures
- Practice explaining your professional background
- Discuss time management approaches

Let's start with your professional introduction. How would you introduce yourself in a business context?
      `
    };

    return fallbacks[category as keyof typeof fallbacks] || fallbacks.general;
  }

  static async getRecentLessons(limit: number = 5) {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return [];

      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .eq('user_id', userId)
        .eq('content_type', 'ai_lesson')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent lessons:', error);
      return [];
    }
  }

  static async analyzeLearningProgress() {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return null;

      const { data: analytics, error } = await supabase
        .from('learning_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Analyze trends
      const recentSessions = analytics?.slice(0, 7) || [];
      const avgConfidence = recentSessions.reduce((acc, session) => 
        acc + (session.engagement_score || 0), 0) / Math.max(recentSessions.length, 1);
      
      const totalStudyTime = recentSessions.reduce((acc, session) => 
        acc + (session.study_duration_minutes || 0), 0);

      return {
        weekly_confidence_trend: avgConfidence,
        weekly_study_time: totalStudyTime,
        session_count: recentSessions.length,
        improvement_areas: this.identifyImprovementAreas(analytics || [])
      };
    } catch (error) {
      console.error('Error analyzing progress:', error);
      return null;
    }
  }

  private static identifyImprovementAreas(analytics: any[]): string[] {
    // Simple analysis - in real implementation, this would be more sophisticated
    const areas = [];
    
    const recentAnalytics = analytics.slice(0, 5);
    const avgEngagement = recentAnalytics.reduce((acc, a) => acc + (a.engagement_score || 0), 0) / Math.max(recentAnalytics.length, 1);
    
    if (avgEngagement < 6) areas.push('Building speaking confidence');
    if (recentAnalytics.some(a => a.cultural_adaptation_progress < 50)) {
      areas.push('Cultural communication integration');
    }
    
    areas.push('Conversational fluency');
    
    return areas;
  }
}