import { supabase } from '@/integrations/supabase/client';

// Core interfaces
export interface UserProfile {
  name: string;
  currentLevel: string;
  daysActive: number;
  totalMinutes: number;
  performanceTrend: string;
  grammarAccuracy: number;
  vocabularyRange: number;
  speakingConfidence: number;
  culturalComfort: number;
  pronunciationScore: number;
  sessionFrequency: string;
  avgSessionDuration: number;
  challengeComfort: number;
  explorationScore: number;
  helpRequests: number;
  recentLessons: RecentLesson[];
  topStrengths: string[];
  interests: string[];
  learningGoal: string;
}

export interface RecentLesson {
  date: string;
  objective: string;
  successRate: number;
  engagement: number;
  confidence: number;
  challenges: string;
  breakthroughs: string;
}

export interface FeatureDefinition {
  name: string;
  category: string;
  difficulty: string;
  requirements: string[];
  successFactors: string[];
  historicalSuccess: number;
  avgEngagement: number;
  completionRate: number;
  satisfaction: number;
  userExperience: string;
}

export interface ReadinessScore {
  overall: number;
  confidence: number;
  breakdown: {
    skillPrerequisites: number;
    engagementReadiness: number;
    confidencePsychology: number;
    culturalAlignment: number;
    optimalTiming: number;
  };
  evidence: string[];
  recommendation: 'unlock' | 'wait';
  timeline?: string;
  primaryGap?: string;
  completedCriteria?: string[];
  inProgressCriteria?: string[];
  futureCriteria?: string[];
  currentProgress?: number;
  nextSteps?: string[];
  estimatedTimeline?: string;
}

export interface UnlockMessage {
  type: 'ready' | 'not_ready';
  title: string;
  message: string;
  actionText?: string;
  requirements?: {
    completed: string[];
    inProgress: Array<{ text: string; progress: number }>;
    pending: string[];
  };
}

export class IntelligentUnlockSystem {
  
  // Main readiness assessment function
  static async assessFeatureReadiness(userId: string, featureId: string): Promise<ReadinessScore> {
    try {
      const { data, error } = await supabase.functions.invoke('feature-unlock-system', {
        body: {
          action: 'assess_readiness',
          user_id: userId,
          feature_id: featureId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error assessing feature readiness:', error);
      throw new Error('Failed to assess feature readiness');
    }
  }

  // Generate readiness assessment prompt
  static generateReadinessPrompt(userProfile: UserProfile, proposedFeature: FeatureDefinition): string {
    return `
FEATURE UNLOCK READINESS ASSESSMENT:

USER PROFILE:
Current Level: ${userProfile.currentLevel}
Days Active: ${userProfile.daysActive}
Total Conversation Time: ${userProfile.totalMinutes}
Recent Performance Trend: ${userProfile.performanceTrend}

COMPETENCY BREAKDOWN:
Grammar Accuracy: ${userProfile.grammarAccuracy}%
Vocabulary Range: ${userProfile.vocabularyRange}%
Speaking Confidence: ${userProfile.speakingConfidence}%
Cultural Bridge Comfort: ${userProfile.culturalComfort}%
Pronunciation Score: ${userProfile.pronunciationScore}%

ENGAGEMENT PATTERNS:
Session Frequency: ${userProfile.sessionFrequency}
Average Session Duration: ${userProfile.avgSessionDuration}
Challenge Tolerance: ${userProfile.challengeComfort}%
Feature Exploration: ${userProfile.explorationScore}/10
Help-Seeking Behavior: ${userProfile.helpRequests}

RECENT LEARNING HISTORY (14 days):
${userProfile.recentLessons.map(lesson => 
`Date: ${lesson.date} | Focus: ${lesson.objective} | Performance: ${lesson.successRate}% | Engagement: ${lesson.engagement}/10 | Confidence: ${lesson.confidence}/10 | Struggles: ${lesson.challenges} | Successes: ${lesson.breakthroughs}`
).join('\n')}

PROPOSED FEATURE:
Feature: ${proposedFeature.name}
Category: ${proposedFeature.category}
Difficulty Level: ${proposedFeature.difficulty}
Prerequisites: ${proposedFeature.requirements.join(', ')}
Success Predictors: ${proposedFeature.successFactors.join(', ')}

HISTORICAL SUCCESS DATA:
Similar Users Success Rate: ${proposedFeature.historicalSuccess}%
Average Engagement: ${proposedFeature.avgEngagement}/10
Completion Rate: ${proposedFeature.completionRate}%
User Satisfaction: ${proposedFeature.satisfaction}/5

ASSESSMENT FRAMEWORK:

1. SKILL PREREQUISITES (40% weight):
   - Minimum competency thresholds met?
   - Foundational skills solidly established?
   - Critical gaps that would impede success?

2. ENGAGEMENT READINESS (25% weight):
   - Consistent activity and motivation?
   - Good feature exploration and adoption?
   - Will enhance vs overwhelm experience?

3. CONFIDENCE & PSYCHOLOGY (20% weight):
   - Confidence appropriate for challenge?
   - Handles mistakes and challenges well?
   - Will build vs diminish confidence?

4. CULTURAL & GOAL ALIGNMENT (10% weight):
   - Aligns with stated goals?
   - Cultural integration appropriate?
   - Personal relevance indicators?

5. OPTIMAL TIMING (5% weight):
   - Recent performance momentum?
   - User schedule patterns?
   - Feature sequence logic?

DECISION REQUIRED:
Calculate weighted readiness score (0-100%)
Only recommend unlock if ≥85%

OUTPUT:
1. Overall readiness score with confidence level
2. Breakdown by assessment category with evidence
3. If ready: optimal introduction strategy and success prediction
4. If not ready: specific criteria to wait for and timeline
5. Personalized unlock messaging for transparent communication

Provide definitive recommendation with pedagogical reasoning.
`;
  }

  // Feature-specific assessment templates
  static generateRolePlayPrompt(userProfile: UserProfile): string {
    return `
ROLE-PLAY SCENARIOS READINESS:

Required competencies:
- Conversational confidence ≥70%
- Grammar accuracy ≥65%
- Cultural comfort in English ≥75%
- Mistake tolerance and resilience
- Basic storytelling abilities

Success predictors:
- Enjoys conversation over grammar drills
- Shows cultural curiosity
- Demonstrates resilience when corrected
- Completed 10+ successful Razia conversations

Focus assessment on confidence, cultural comfort, and mistake tolerance rather than perfect accuracy.

User Profile: ${JSON.stringify(userProfile)}

Determine readiness for role-play practice scenarios.
`;
  }

  static generateBusinessPrompt(userProfile: UserProfile): string {
    return `
BUSINESS ENGLISH READINESS:

Required competencies:
- Minimum B1 level overall
- Professional vocabulary comfort ≥60%
- Formal register awareness
- Cross-cultural business sensitivity
- Professional concept explanation ability

Success predictors:
- Mentioned career/business goals
- Comfortable with formal topics
- Interest in professional development
- Can discuss abstract/professional topics
- Demonstrates cultural bridge abilities

User Profile: ${JSON.stringify(userProfile)}

Assess readiness for professional communication training.
`;
  }

  static generateIELTSPrompt(userProfile: UserProfile): string {
    return `
IELTS PREPARATION READINESS:

Required competencies:
- Minimum A2+ with B1 potential
- Academic English comfort
- Test preparation mindset
- Structured feedback tolerance
- Specific IELTS goals and timeline

Success predictors:
- University/immigration/career goals requiring IELTS
- Analytical thinking in conversations
- Comfort with direct feedback
- Study discipline and goal orientation
- Engages with abstract topics beyond daily conversation

User Profile: ${JSON.stringify(userProfile)}

Assess readiness for intensive IELTS-focused learning.
`;
  }

  // Generate unlock messages
  static generateUnlockMessage(readinessScore: ReadinessScore, feature: FeatureDefinition, userProfile: UserProfile): UnlockMessage {
    if (readinessScore.recommendation === 'unlock') {
      return {
        type: 'ready',
        title: `🎉 ${feature.name} Unlocked!`,
        message: `Mashallah! I've been watching your progress, and you're absolutely ready for ${feature.name}! 

Your confidence in ${userProfile.topStrengths[0]} plus your curiosity about ${userProfile.interests[0]} makes this perfect timing.

Here's what you've achieved that shows you're ready:
${readinessScore.evidence.map(point => `✅ ${point}`).join('\n')}

You'll experience: ${feature.userExperience}

This is going to be amazing for your ${userProfile.learningGoal} journey!`,
        actionText: 'Start Now'
      };
    } else {
      return {
        type: 'not_ready',
        title: `Almost Ready for ${feature.name}!`,
        message: `I love that you're interested in ${feature.name}! You're making great progress - we just need to build a bit more confidence in ${readinessScore.primaryGap}. 💪

Estimated time to unlock: ${readinessScore.estimatedTimeline}

Let's focus on ${readinessScore.nextSteps?.[0]} this week - you're closer than you think!`,
        requirements: {
          completed: readinessScore.completedCriteria || [],
          inProgress: readinessScore.inProgressCriteria?.map(criteria => ({
            text: criteria,
            progress: readinessScore.currentProgress || 0
          })) || [],
          pending: readinessScore.futureCriteria || []
        }
      };
    }
  }

  // Weekly unlock review
  static async weeklyUnlockReview(userId: string): Promise<{ recommendations: Array<{ feature: string; readiness: number; action: string }> }> {
    try {
      const { data, error } = await supabase.functions.invoke('feature-unlock-system', {
        body: {
          action: 'weekly_review',
          user_id: userId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error conducting weekly unlock review:', error);
      throw new Error('Failed to conduct weekly review');
    }
  }

  // Get unlock status for all features
  static async getUnlockStatus(userId: string): Promise<{ unlocked: string[]; available: string[]; locked: string[] }> {
    try {
      const { data, error } = await supabase.functions.invoke('feature-unlock-system', {
        body: {
          action: 'get_unlock_status',
          user_id: userId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting unlock status:', error);
      throw new Error('Failed to get unlock status');
    }
  }

  // Build comprehensive learner context
  static async buildLearnerContext(userId: string): Promise<UserProfile> {
    try {
      // Get user data from multiple sources
      const [userResponse, analyticsResponse, progressResponse] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).single(),
        supabase.from('learning_analytics').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(30),
        supabase.from('progress_tracking').select('*').eq('user_id', userId).single()
      ]);

      if (userResponse.error) throw userResponse.error;
      
      const user = userResponse.data;
      const analytics = analyticsResponse.data || [];
      const progress = progressResponse.data;

      // Build comprehensive profile
      return {
        name: user.email.split('@')[0],
        currentLevel: user.current_level || 'beginner',
        daysActive: Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 3600 * 24)),
        totalMinutes: analytics.reduce((sum, a) => sum + (a.study_duration_minutes || 0), 0),
        performanceTrend: this.calculatePerformanceTrend(analytics),
        grammarAccuracy: progress?.grammar_level || 65,
        vocabularyRange: progress?.vocabulary_level || 60,
        speakingConfidence: progress?.speaking_level || 70,
        culturalComfort: progress?.cultural_competency || 75,
        pronunciationScore: progress?.pronunciation_level || 65,
        sessionFrequency: this.calculateSessionFrequency(analytics),
        avgSessionDuration: this.calculateAvgSessionDuration(analytics),
        challengeComfort: progress?.challenge_completion_rate || 70,
        explorationScore: 7,
        helpRequests: 2,
        recentLessons: this.buildRecentLessons(analytics),
        topStrengths: Array.isArray(progress?.strength_areas) ? progress.strength_areas.map(s => String(s)) : ['conversation', 'cultural_understanding'],
        interests: ['cultural_exchange', 'daily_conversation'],
        learningGoal: user.learning_goal || 'general_fluency'
      };
    } catch (error) {
      console.error('Error building learner context:', error);
      throw new Error('Failed to build learner context');
    }
  }

  // Helper methods
  private static calculatePerformanceTrend(analytics: any[]): string {
    if (analytics.length < 2) return 'stable';
    const recent = analytics.slice(0, 5);
    const earlier = analytics.slice(5, 10);
    
    const recentAvg = recent.reduce((sum, a) => sum + (a.engagement_score || 70), 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, a) => sum + (a.engagement_score || 70), 0) / earlier.length;
    
    if (recentAvg > earlierAvg + 5) return 'improving';
    if (recentAvg < earlierAvg - 5) return 'declining';
    return 'stable';
  }

  private static calculateSessionFrequency(analytics: any[]): string {
    const uniqueDays = new Set(analytics.map(a => a.date?.split('T')[0])).size;
    const totalDays = 14; // Last 14 days
    const frequency = uniqueDays / totalDays;
    
    if (frequency > 0.8) return 'daily';
    if (frequency > 0.5) return 'frequent';
    if (frequency > 0.3) return 'regular';
    return 'occasional';
  }

  private static calculateAvgSessionDuration(analytics: any[]): number {
    if (analytics.length === 0) return 15;
    return analytics.reduce((sum, a) => sum + (a.study_duration_minutes || 15), 0) / analytics.length;
  }

  private static buildRecentLessons(analytics: any[]): RecentLesson[] {
    return analytics.slice(0, 5).map(a => ({
      date: a.date || new Date().toISOString().split('T')[0],
      objective: 'Conversation Practice',
      successRate: Math.floor(Math.random() * 20) + 75, // 75-95%
      engagement: a.engagement_score || Math.floor(Math.random() * 3) + 7, // 7-10
      confidence: Math.floor(Math.random() * 3) + 7, // 7-10
      challenges: 'Grammar accuracy, vocabulary range',
      breakthroughs: 'Cultural confidence, natural conversation flow'
    }));
  }
}