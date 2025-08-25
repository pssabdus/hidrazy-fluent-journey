import { supabase } from '@/integrations/supabase/client';

// Core Data Structures
export interface SkillLevelData {
  grammar: number;
  speaking: number;
  listening: number;
  writing: number;
  vocabulary: number;
  pronunciation: number;
  culturalBridge: number;
  weeklyChanges: SkillChange[];
}

export interface SkillChange {
  skillName: string;
  beforeScore: number;
  afterScore: number;
  improvementAmount: number;
  consistencyRating: number;
  evidence: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'skill' | 'confidence' | 'cultural' | 'consistency' | 'learning';
  achieved: boolean;
  achievedDate?: Date;
  evidence: string;
  celebrationMessage: string;
  nextMilestone?: string;
}

export interface WeeklySummary {
  weekNumber: number;
  activeDays: number;
  totalMinutes: number;
  conversationCount: number;
  skillHighlights: SkillHighlight[];
  achievements: Milestone[];
  goalProgress: GoalProgress;
  motivationalMessage: string;
  nextWeekFocus: string;
  culturalMoments: string[];
}

export interface SkillHighlight {
  name: string;
  startWeek: number;
  endWeek: number;
  weeklyGain: number;
  consistencyScore: number;
  breakthroughs: string[];
}

export interface GoalProgress {
  primaryGoal: string;
  currentProgress: number;
  weeklyProgress: number;
  timelineAdjustment?: string;
  milestoneCompletion: string;
}

export interface ProgressInsight {
  type: 'breakthrough' | 'strength' | 'challenge' | 'cultural' | 'comparison' | 'focus';
  message: string;
  evidence: string;
  actionable: boolean;
}

export interface ProgressMetrics {
  currentLevel: string;
  progressToNext: number;
  streakDays: number;
  skillLevels: SkillLevelData;
  recentMilestones: Milestone[];
  weeklyInsights: ProgressInsight[];
}

// Main IntelligentProgressTracker Service
export class IntelligentProgressTracker {
  
  /**
   * MILESTONE RECOGNITION ENGINE
   * Detects achievements and generates celebrations using AI
   */
  static async detectMilestones(userId: string): Promise<Milestone[]> {
    try {
      // Gather user activity data
      const userActivity = await this.getUserActivityData(userId);
      const skillChanges = await this.getSkillChanges(userId);
      const conversationData = await this.getConversationData(userId);

      const response = await supabase.functions.invoke('progress-sync', {
        body: {
          action: 'detect_milestones',
          user_id: userId,
          user_activity: userActivity,
          skill_changes: skillChanges,
          conversation_data: conversationData
        }
      });

      if (response.error) {
        console.error('Error detecting milestones:', response.error);
        return [];
      }

      return response.data?.milestones || [];
    } catch (error) {
      console.error('Error in detectMilestones:', error);
      return [];
    }
  }

  /**
   * WEEKLY PROGRESS SUMMARY GENERATOR
   * Creates comprehensive weekly progress reports using AI
   */
  static async generateWeeklyProgress(userId: string): Promise<WeeklySummary> {
    try {
      const weekData = await this.getWeeklyData(userId);
      const userGoals = await this.getUserGoals(userId);
      const previousWeeks = await this.getPreviousWeeksData(userId, 4);

      const response = await supabase.functions.invoke('progress-sync', {
        body: {
          action: 'generate_weekly_summary',
          user_id: userId,
          week_data: weekData,
          user_goals: userGoals,
          previous_weeks: previousWeeks
        }
      });

      if (response.error) {
        console.error('Error generating weekly progress:', response.error);
        return this.getDefaultWeeklySummary();
      }

      return response.data?.weekly_summary || this.getDefaultWeeklySummary();
    } catch (error) {
      console.error('Error in generateWeeklyProgress:', error);
      return this.getDefaultWeeklySummary();
    }
  }

  /**
   * PROGRESS INSIGHTS GENERATOR
   * Creates personalized learning insights using AI
   */
  static async generateProgressInsights(userId: string): Promise<ProgressInsight[]> {
    try {
      const currentData = await this.getCurrentProgressData(userId);
      const historicalData = await this.getHistoricalProgressData(userId);

      const response = await supabase.functions.invoke('progress-sync', {
        body: {
          action: 'generate_insights',
          user_id: userId,
          current_data: currentData,
          historical_data: historicalData
        }
      });

      if (response.error) {
        console.error('Error generating insights:', response.error);
        return [];
      }

      return response.data?.insights || [];
    } catch (error) {
      console.error('Error in generateProgressInsights:', error);
      return [];
    }
  }

  /**
   * PROGRESS METRICS CALCULATOR
   * Calculates comprehensive progress metrics
   */
  static async calculateProgressMetrics(userId: string): Promise<ProgressMetrics> {
    try {
      const [skillLevels, milestones, insights] = await Promise.all([
        this.getSkillLevels(userId),
        this.detectMilestones(userId),
        this.generateProgressInsights(userId)
      ]);

      const userLevel = await this.getCurrentLevel(userId);
      const streakData = await this.getStreakData(userId);

      return {
        currentLevel: userLevel.level,
        progressToNext: userLevel.progressToNext,
        streakDays: streakData.currentStreak,
        skillLevels,
        recentMilestones: milestones.slice(0, 5),
        weeklyInsights: insights
      };
    } catch (error) {
      console.error('Error calculating progress metrics:', error);
      return this.getDefaultProgressMetrics();
    }
  }

  /**
   * UPDATE SKILL PROGRESS
   * Updates user's skill progression data
   */
  static async updateSkillProgress(userId: string, skillData: Partial<SkillLevelData>): Promise<void> {
    try {
      const { error } = await supabase
        .from('progress_tracking')
        .upsert({
          user_id: userId,
          grammar_level: skillData.grammar,
          speaking_level: skillData.speaking,
          listening_level: skillData.listening,
          writing_level: skillData.writing,
          vocabulary_level: skillData.vocabulary,
          pronunciation_level: skillData.pronunciation,
          cultural_competency: skillData.culturalBridge,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating skill progress:', error);
      }
    } catch (error) {
      console.error('Error in updateSkillProgress:', error);
    }
  }

  // Helper Methods
  private static async getUserActivityData(userId: string) {
    const { data, error } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching user activity:', error);
      return {};
    }

    return {
      recentLessons: data?.slice(0, 10) || [],
      studyMinutes: data?.reduce((sum, day) => sum + (day.study_duration_minutes || 0), 0) || 0,
      sessionCount: data?.length || 0
    };
  }

  private static async getSkillChanges(userId: string): Promise<SkillChange[]> {
    const { data, error } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(2);

    if (error || !data || data.length < 2) {
      return [];
    }

    const [current, previous] = data;
    const skills = ['grammar_level', 'speaking_level', 'listening_level', 'writing_level', 'vocabulary_level', 'pronunciation_level'];
    
    return skills.map(skill => ({
      skillName: skill.replace('_level', '').replace('_', ' '),
      beforeScore: previous[skill] || 0,
      afterScore: current[skill] || 0,
      improvementAmount: (current[skill] || 0) - (previous[skill] || 0),
      consistencyRating: 8, // Mock data
      evidence: 'Recent conversation performance'
    }));
  }

  private static async getConversationData(userId: string) {
    const { data, error } = await supabase
      .from('conversation_history')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching conversation data:', error);
      return { recentConversations: [] };
    }

    return {
      recentConversations: data?.map(conv => ({
        date: conv.created_at,
        qualityMetrics: {
          fluency: conv.fluency_score || 0,
          grammar: conv.grammar_score || 0,
          engagement: conv.engagement_level || 0
        },
        culturalSuccesses: conv.cultural_bridge_used ? 1 : 0,
        grammarImprovements: (conv.corrections_provided as any)?.length || 0,
        confidenceSigns: conv.user_confidence_level || 0
      })) || []
    };
  }

  private static async getWeeklyData(userId: string) {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const { data, error } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startOfWeek.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching weekly data:', error);
      return {};
    }

    return {
      activeDays: data?.length || 0,
      totalMinutes: data?.reduce((sum, day) => sum + (day.study_duration_minutes || 0), 0) || 0,
      conversationCount: data?.reduce((sum, day) => sum + (day.session_count || 0), 0) || 0,
      skillChanges: await this.getSkillChanges(userId)
    };
  }

  private static async getUserGoals(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('learning_goal, target_ielts_band')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user goals:', error);
      return {};
    }

    return {
      primary: data.learning_goal || 'General English',
      timeline: 'Next 3 months',
      motivations: ['Career advancement', 'Personal growth']
    };
  }

  private static async getPreviousWeeksData(userId: string, weeks: number) {
    // Mock implementation - in production, fetch actual historical data
    return Array.from({ length: weeks }, (_, i) => ({
      number: weeks - i,
      keyMetrics: `Week ${weeks - i}: Basic metrics`
    }));
  }

  private static async getSkillLevels(userId: string): Promise<SkillLevelData> {
    const { data, error } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching skill levels:', error);
      return this.getDefaultSkillLevels();
    }

    return {
      grammar: data?.grammar_level || 0,
      speaking: data?.speaking_level || 0,
      listening: data?.listening_level || 0,
      writing: data?.writing_level || 0,
      vocabulary: data?.vocabulary_level || 0,
      pronunciation: data?.pronunciation_level || 0,
      culturalBridge: data?.cultural_competency || 0,
      weeklyChanges: []
    };
  }

  private static async getCurrentLevel(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('current_level')
      .eq('id', userId)
      .single();

    if (error) {
      return { level: 'A1 - Beginner', progressToNext: 0 };
    }

    return {
      level: `${data.current_level?.toUpperCase()} - ${this.getLevelDescription(data.current_level)}`,
      progressToNext: 65 // Mock progress
    };
  }

  private static getLevelDescription(level: string): string {
    const descriptions = {
      'a1': 'Beginner',
      'a2': 'Elementary',
      'b1': 'Intermediate',
      'b2': 'Upper Intermediate',
      'c1': 'Advanced',
      'c2': 'Proficient'
    };
    return descriptions[level?.toLowerCase() as keyof typeof descriptions] || 'Beginner';
  }

  private static async getStreakData(userId: string) {
    // Mock implementation - calculate from learning_analytics
    return { currentStreak: 7 };
  }

  private static async getCurrentProgressData(userId: string) {
    return await this.getSkillLevels(userId);
  }

  private static async getHistoricalProgressData(userId: string) {
    // Mock implementation - fetch last 30 days of progress
    return {};
  }

  // Default fallback data
  private static getDefaultSkillLevels(): SkillLevelData {
    return {
      grammar: 65,
      speaking: 70,
      listening: 75,
      writing: 60,
      vocabulary: 80,
      pronunciation: 68,
      culturalBridge: 72,
      weeklyChanges: []
    };
  }

  private static getDefaultWeeklySummary(): WeeklySummary {
    return {
      weekNumber: 1,
      activeDays: 5,
      totalMinutes: 120,
      conversationCount: 8,
      skillHighlights: [],
      achievements: [],
      goalProgress: {
        primaryGoal: 'General English',
        currentProgress: 65,
        weeklyProgress: 5,
        milestoneCompletion: 'Great progress this week!'
      },
      motivationalMessage: 'You\'re doing amazing! Keep up the great work, habibi! 🌟',
      nextWeekFocus: 'Continue building speaking confidence',
      culturalMoments: ['Successfully explained Ramadan traditions in English']
    };
  }

  private static getDefaultProgressMetrics(): ProgressMetrics {
    return {
      currentLevel: 'A2 - Elementary',
      progressToNext: 65,
      streakDays: 7,
      skillLevels: this.getDefaultSkillLevels(),
      recentMilestones: [],
      weeklyInsights: []
    };
  }
}