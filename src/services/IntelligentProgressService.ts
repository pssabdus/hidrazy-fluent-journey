import { supabase } from '@/integrations/supabase/client';

export interface StealthAssessmentQuestion {
  id: number;
  question: string;
  level: string;
  hidden_assessment: string;
  follow_up_prompts?: string[];
  cultural_bridge?: string | boolean;
}

export interface AssessmentResponse {
  question_id: number;
  user_response: string;
  analysis?: string;
  timestamp: string;
}

export interface AssessmentResult {
  final_level: string;
  analysis: string;
  welcome_message: string;
  competency_breakdown: {
    grammar: number;
    vocabulary: number;
    fluency: number;
    cultural_competence: number;
  };
}

export class StealthAssessmentService {
  static async startAssessment(): Promise<{
    assessment_id: string;
    greeting: string;
    first_question: StealthAssessmentQuestion;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('stealth-assessment', {
        body: {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'start_assessment'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting stealth assessment:', error);
      throw new Error('Failed to start assessment');
    }
  }

  static async submitResponse(
    assessmentId: string,
    questionId: number,
    userResponse: string
  ): Promise<{
    completed: boolean;
    next_question?: StealthAssessmentQuestion;
    razia_response?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('stealth-assessment', {
        body: {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'analyze_response',
          data: {
            assessment_id: assessmentId,
            question_id: questionId,
            user_response: userResponse
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting response:', error);
      throw new Error('Failed to submit response');
    }
  }

  static async completeAssessment(assessmentId: string): Promise<AssessmentResult> {
    try {
      const { data, error } = await supabase.functions.invoke('stealth-assessment', {
        body: {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'complete_assessment',
          data: {
            assessment_id: assessmentId
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error completing assessment:', error);
      throw new Error('Failed to complete assessment');
    }
  }

  static async getUserAssessmentHistory(limit: number = 5) {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return [];

      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      return [];
    }
  }

  static needsAssessment(): boolean {
    // Check if user needs initial assessment
    // This would check user profile or local storage
    return !localStorage.getItem('assessment_completed');
  }

  static markAssessmentComplete(level: string): void {
    localStorage.setItem('assessment_completed', 'true');
    localStorage.setItem('assessed_level', level);
  }

  static getAssessedLevel(): string | null {
    return localStorage.getItem('assessed_level');
  }
}

export interface FeatureUnlockStatus {
  feature: string;
  ready: boolean;
  score: number;
  analysis: string;
  user_message: string;
  unlock_date?: string;
  requirements_met: string[];
  requirements_pending: string[];
}

export class FeatureUnlockService {
  static async checkFeatureReadiness(featureName?: string): Promise<FeatureUnlockStatus[]> {
    try {
      const { data, error } = await supabase.functions.invoke('feature-unlock-system', {
        body: {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'check_readiness',
          feature_name: featureName
        }
      });

      if (error) throw error;
      return data.results || [];
    } catch (error) {
      console.error('Error checking feature readiness:', error);
      return [];
    }
  }

  static async getWeeklyUnlockRecommendations(): Promise<{
    weekly_recommendations: FeatureUnlockStatus[];
    all_features_status: FeatureUnlockStatus[];
    next_review_date: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('feature-unlock-system', {
        body: {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'weekly_review'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting weekly recommendations:', error);
      return {
        weekly_recommendations: [],
        all_features_status: [],
        next_review_date: new Date().toISOString()
      };
    }
  }

  static async getUnlockStatus(): Promise<{
    unlocked_features: string[];
    locked_features: string[];
    total_features: number;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('feature-unlock-system', {
        body: {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'get_unlock_status'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting unlock status:', error);
      return {
        unlocked_features: [],
        locked_features: [],
        total_features: 0
      };
    }
  }

  static isFeatureUnlocked(featureName: string): boolean {
    // Check if feature is unlocked (could use local cache + server validation)
    const unlockedFeatures = JSON.parse(localStorage.getItem('unlocked_features') || '[]');
    return unlockedFeatures.includes(featureName);
  }

  static unlockFeature(featureName: string): void {
    const unlockedFeatures = JSON.parse(localStorage.getItem('unlocked_features') || '[]');
    if (!unlockedFeatures.includes(featureName)) {
      unlockedFeatures.push(featureName);
      localStorage.setItem('unlocked_features', JSON.stringify(unlockedFeatures));
    }
  }
}

export interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  category: 'skill' | 'confidence' | 'cultural' | 'consistency' | 'learning';
  achieved: boolean;
  achieved_date?: string;
  evidence: string[];
  celebration_message?: string;
}

export interface ProgressInsight {
  type: 'breakthrough' | 'improvement' | 'challenge' | 'cultural_pride' | 'next_focus';
  title: string;
  description: string;
  data_points: any[];
  action_items?: string[];
}

export interface WeeklyProgressSummary {
  week_start: string;
  week_end: string;
  days_active: number;
  total_study_time: number;
  conversations_completed: number;
  skill_improvements: {
    skill: string;
    improvement: number;
    description: string;
  }[];
  milestones_achieved: ProgressMilestone[];
  insights: ProgressInsight[];
  next_week_focus: string;
  motivational_message: string;
}

export class ProgressTrackingService {
  static async generateWeeklyProgressSummary(): Promise<WeeklyProgressSummary> {
    try {
      // Get recent activity data
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      const [analytics, lessons, progress] = await Promise.all([
        this.getWeeklyAnalytics(userId, startDate, endDate),
        this.getWeeklyLessons(userId, startDate, endDate),
        this.getCurrentProgress(userId)
      ]);

      return {
        week_start: startDate.toISOString().split('T')[0],
        week_end: endDate.toISOString().split('T')[0],
        days_active: analytics.length,
        total_study_time: analytics.reduce((acc, a) => acc + (a.study_duration_minutes || 0), 0),
        conversations_completed: lessons.length,
        skill_improvements: this.calculateSkillImprovements(analytics),
        milestones_achieved: await this.detectMilestones(userId, analytics, lessons),
        insights: this.generateInsights(analytics, lessons, progress),
        next_week_focus: this.determineNextFocus(analytics, progress),
        motivational_message: this.generateMotivationalMessage(analytics, lessons)
      };
    } catch (error) {
      console.error('Error generating weekly summary:', error);
      throw new Error('Failed to generate weekly progress summary');
    }
  }

  static async getMilestoneProgress(): Promise<ProgressMilestone[]> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return [];

      // This would typically come from a database, but for now we'll mock it
      return [
        {
          id: '1',
          title: 'First Week Streak',
          description: 'Complete 7 consecutive days of learning',
          category: 'consistency',
          achieved: true,
          achieved_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          evidence: ['7 days active', 'Consistent engagement'],
          celebration_message: 'Mashallah! You\'ve built a solid learning habit!'
        },
        {
          id: '2',
          title: 'Cultural Bridge Builder',
          description: 'Successfully explain 5 Arabic cultural concepts in English',
          category: 'cultural',
          achieved: false,
          evidence: ['3/5 concepts explained', 'Strong cultural pride demonstrated']
        },
        {
          id: '3',
          title: 'Grammar Breakthrough',
          description: 'Achieve 80% accuracy in past tense usage',
          category: 'skill',
          achieved: false,
          evidence: ['Currently at 65% accuracy', 'Showing improvement trend']
        }
      ];
    } catch (error) {
      console.error('Error getting milestone progress:', error);
      return [];
    }
  }

  private static async getWeeklyAnalytics(userId: string, startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  private static async getWeeklyLessons(userId: string, startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  private static async getCurrentProgress(userId: string) {
    const { data, error } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  private static calculateSkillImprovements(analytics: any[]): any[] {
    if (analytics.length < 2) return [];

    const first = analytics[0];
    const last = analytics[analytics.length - 1];

    return [
      {
        skill: 'Speaking Confidence',
        improvement: (last.engagement_score || 0) - (first.engagement_score || 0),
        description: 'Based on conversation participation and confidence indicators'
      },
      {
        skill: 'Grammar Accuracy',
        improvement: Math.max(0, (first.grammar_mistakes || 0) - (last.grammar_mistakes || 0)),
        description: 'Reduction in grammar errors during conversations'
      }
    ];
  }

  private static async detectMilestones(userId: string, analytics: any[], lessons: any[]): Promise<ProgressMilestone[]> {
    const milestones: ProgressMilestone[] = [];

    // Check for consistency milestone
    if (analytics.length >= 7) {
      milestones.push({
        id: 'week_streak',
        title: 'Weekly Consistency Champion',
        description: 'Completed learning activities for 7 consecutive days',
        category: 'consistency',
        achieved: true,
        achieved_date: new Date().toISOString(),
        evidence: [`${analytics.length} days active this week`],
        celebration_message: 'Mashallah! Your consistency is building strong learning habits!'
      });
    }

    // Check for conversation milestone
    if (lessons.length >= 10) {
      milestones.push({
        id: 'conversation_master',
        title: 'Conversation Enthusiast',
        description: 'Completed 10+ conversations this week',
        category: 'skill',
        achieved: true,
        achieved_date: new Date().toISOString(),
        evidence: [`${lessons.length} conversations completed`],
        celebration_message: 'Your speaking practice is paying off beautifully!'
      });
    }

    return milestones;
  }

  private static generateInsights(analytics: any[], lessons: any[], progress: any): ProgressInsight[] {
    const insights: ProgressInsight[] = [];

    if (analytics.length > 0) {
      const avgEngagement = analytics.reduce((acc, a) => acc + (a.engagement_score || 0), 0) / analytics.length;
      
      if (avgEngagement > 7) {
        insights.push({
          type: 'breakthrough',
          title: 'High Engagement Week',
          description: `Your average engagement was ${avgEngagement.toFixed(1)}/10 - excellent motivation!`,
          data_points: analytics.map(a => ({ date: a.date, engagement: a.engagement_score }))
        });
      }
    }

    return insights;
  }

  private static determineNextFocus(analytics: any[], progress: any): string {
    if (!analytics.length) return 'Build consistent learning habits';
    
    const avgEngagement = analytics.reduce((acc, a) => acc + (a.engagement_score || 0), 0) / analytics.length;
    const recentMistakes = analytics.reduce((acc, a) => acc + (a.grammar_mistakes || 0), 0);

    if (recentMistakes > 10) {
      return 'Grammar accuracy improvement through targeted practice';
    } else if (avgEngagement < 6) {
      return 'Building confidence through cultural bridge conversations';
    } else {
      return 'Expanding vocabulary and complex expression skills';
    }
  }

  private static generateMotivationalMessage(analytics: any[], lessons: any[]): string {
    const totalTime = analytics.reduce((acc, a) => acc + (a.study_duration_minutes || 0), 0);
    const conversationCount = lessons.length;

    return `This week you dedicated ${totalTime} minutes to your English journey and had ${conversationCount} meaningful conversations. Every minute brings you closer to your goals - keep up the amazing work!`;
  }
}