import { supabase } from '@/integrations/supabase/client';

// Data Structures
export interface UserProfile {
  name: string;
  currentLevel: string;
  levelDescription: string;
  learningGoal: string;
  culturalRegion: string;
  learningStyle: string;
  confidenceScore: number;
  recentLessons: LessonHistory[];
  strengths: string[];
  struggles: string[];
  grammarScore: number;
  vocabularyLevel: string;
  speakingConfidence: number;
  culturalCompetence: number;
  ieltsCurrentBand?: number;
  ieltsTargetBand?: number;
  testDate?: string;
  industry?: string;
  jobLevel?: string;
}

export interface LessonHistory {
  date: string;
  focusArea: string;
  performanceSummary: string;
  struggles: string[];
  successes: string[];
  confidenceRating: number;
  culturalInteractions: string[];
}

export interface TeachingPlan {
  primaryObjective: string;
  conversationScenario: string;
  culturalMoments: string[];
  successCriteria: string[];
  raziaInstructions: string;
  lessonFlow: string;
  keyFocusAreas: string[];
  estimatedDuration: string;
}

export interface PerformanceData {
  engagement: number;
  errors: string[];
  successes: string[];
  confidenceMarkers: string[];
  culturalComfort: number;
  errorAnxiety: number;
}

export interface UserState {
  confidence: number;
  challenges: string[];
  culturalEase: number;
  preferences: string;
  culturalComfort: number;
  culturalInterest: number;
  errorAnxiety: number;
}

export interface LessonData {
  objective: string;
  conversationLog: string;
  duration: number;
  engagement: number;
}

export interface LessonOutcome {
  skillEvidence: string[];
  breakthroughs: string[];
  strugglesObserved: string[];
  culturalIntegration: string[];
  competencyGrowth: number;
  nextRecommendations: string[];
}

export class SmartTeachingEngine {
  
  /**
   * 1. MASTER TEACHING PROMPT GENERATOR
   */
  static generateTeachingPrompt(userProfile: UserProfile, category: 'general' | 'ielts' | 'business'): string {
    return `
You are Razia, an expert English conversation teacher specializing in Arabic speakers. You have PhD-level expertise in CEFR progression, Arabic-English transfer patterns, second language acquisition, and cultural bridge pedagogy.

LEARNER PROFILE:
Name: ${userProfile.name}
Current Level: ${userProfile.currentLevel} (${userProfile.levelDescription})
Target Goal: ${userProfile.learningGoal}
Cultural Background: ${userProfile.culturalRegion}
Learning Style: ${userProfile.learningStyle}
Confidence Level: ${userProfile.confidenceScore}/10

RECENT PERFORMANCE (Last 5 lessons):
${userProfile.recentLessons.map(lesson => 
`Date: ${lesson.date}
Focus: ${lesson.focusArea}
Performance: ${lesson.performanceSummary}
Struggles: ${lesson.struggles.join(', ')}
Successes: ${lesson.successes.join(', ')}
Confidence: ${lesson.confidenceRating}/10`
).join('\n')}

CURRENT COMPETENCY:
Strengths: ${userProfile.strengths.join(', ')}
Struggles: ${userProfile.struggles.join(', ')}
Grammar Accuracy: ${userProfile.grammarScore}%
Vocabulary Range: ${userProfile.vocabularyLevel}
Speaking Confidence: ${userProfile.speakingConfidence}%
Cultural Bridge Ability: ${userProfile.culturalCompetence}%

${category === 'general' ? `
GENERAL ENGLISH FOCUS:
- Prioritize natural communication and confidence building
- Integrate Arab cultural topics and comparisons naturally
- Address Arabic→English interference patterns
- Build systematic progression toward conversational fluency
` : ''}

${category === 'ielts' ? `
IELTS PREPARATION FOCUS:
Current Band: ${userProfile.ieltsCurrentBand}
Target Band: ${userProfile.ieltsTargetBand}
Test Date: ${userProfile.testDate}
- Focus on academic English and test strategies
- Include Arabic cultural examples in writing tasks
- Build test-taking confidence alongside language skills
` : ''}

${category === 'business' ? `
BUSINESS ENGLISH FOCUS:
Industry: ${userProfile.industry}
Professional Level: ${userProfile.jobLevel}
- Develop professional communication skills
- Compare Arab vs Western business practices
- Build confidence in international business contexts
` : ''}

CULTURAL INTEGRATION REQUIREMENTS:
- Reference ${userProfile.culturalRegion} context when relevant
- Create opportunities to explain Arab traditions in English
- Address cultural communication style differences
- Maintain cultural pride while building English fluency

TASK: Create today's lesson plan that:
1. Identifies the highest-priority skill development area
2. Explains why this is optimal pedagogically
3. Designs conversation-based teaching approach
4. Includes 2-3 cultural bridge moments
5. Defines clear success criteria
6. Adapts to learner's confidence and style

Structure as complete teaching plan with conversation prompts and cultural integration.
`;
  }

  /**
   * 2. REAL-TIME LESSON ADAPTATION
   */
  static adaptLessonRealTime(conversationHistory: string, performanceData: PerformanceData, currentLesson: { objective: string }): string {
    return `
LIVE LESSON ADAPTATION:

Current Lesson Objective: ${currentLesson.objective}
Conversation So Far: ${conversationHistory}

Performance Analysis:
- Engagement level: ${performanceData.engagement}/10
- Error patterns: ${performanceData.errors.join(', ')}
- Success indicators: ${performanceData.successes.join(', ')}
- Confidence signals: ${performanceData.confidenceMarkers.join(', ')}

How should Razia adjust to:
1. Address struggles with supportive scaffolding
2. Build on demonstrated successes
3. Maintain optimal challenge level
4. Keep engagement high and anxiety low
5. Still achieve core learning objective

Provide specific conversation adjustments and teaching modifications.
`;
  }

  /**
   * 3. POST-LESSON ANALYSIS
   */
  static analyzeLessonOutcome(lessonData: LessonData, userPerformance: LessonOutcome): string {
    return `
LESSON ANALYSIS:

Completed Lesson: ${lessonData.objective}
Conversation Transcript: ${lessonData.conversationLog}
Performance Metrics: ${userPerformance.skillEvidence.join(', ')}

ANALYSIS REQUIRED:
1. Assess competency development (0-100%)
2. Identify breakthroughs vs continued struggles
3. Evaluate cultural bridge effectiveness
4. Update learner skill profile
5. Determine tomorrow's optimal focus
6. Check readiness for feature unlocks

NEXT LESSON PLANNING:
7. What should tomorrow's primary objective be?
8. Which skills need reinforcement vs new introduction?
9. What cultural elements to emphasize?
10. How should Razia's approach adapt?

Provide updated competency profile and next lesson recommendation.
`;
  }

  /**
   * 4. RAZIA PERSONALITY ADAPTATION
   */
  static adaptRaziaPersonality(userState: UserState, lessonContext: any): string {
    return `
RAZIA PERSONALITY ADAPTATION:

User Context:
- Confidence level: ${userState.confidence}
- Recent struggles: ${userState.challenges.join(', ')}
- Cultural comfort: ${userState.culturalEase}
- Learning style: ${userState.preferences}

PERSONALITY SETTINGS:
1. Energy level: ${userState.confidence > 7 ? 'Enthusiastic' : 'Encouraging and gentle'}
2. Challenge approach: ${userState.confidence > 6 ? 'Stretching' : 'Supportive scaffolding'}
3. Cultural integration: ${userState.culturalEase > 7 ? 'High' : 'Gradual and sensitive'}
4. Correction style: ${userState.confidence > 5 ? 'Direct but kind' : 'Very gentle modeling'}

CONVERSATION GUIDELINES:
- Use Arabic phrases when: ${userState.culturalComfort > 6 ? 'Naturally and frequently' : 'Sparingly and when helpful'}
- Cultural references: ${userState.culturalInterest > 7 ? 'Actively encourage' : 'Follow user lead'}
- Mistake handling: ${userState.errorAnxiety < 4 ? 'Immediate gentle correction' : 'Model correct form in response'}
- Celebration style: ${userState.confidence < 6 ? 'Frequent and specific praise' : 'Meaningful milestone recognition'}

Embody this personality throughout the lesson while maintaining teaching effectiveness.
`;
  }

  /**
   * TECHNICAL IMPLEMENTATION FUNCTIONS
   */

  /**
   * Build comprehensive learner context from database
   */
  static async buildLearnerContext(userId: string): Promise<UserProfile | null> {
    try {
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Fetch recent lessons
      const { data: recentLessons } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch learning analytics
      const { data: analytics } = await supabase
        .from('learning_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      // Fetch progress tracking
      const { data: progress } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('user_id', userId)
        .single();

      const currentAnalytics = analytics?.[0];
      const currentProgress = progress;

      const userProfile: UserProfile = {
        name: userData.email?.split('@')[0] || 'Student',
        currentLevel: userData.current_level || 'beginner',
        levelDescription: this.getLevelDescription(userData.current_level || 'beginner'),
        learningGoal: userData.learning_goal || 'general',
        culturalRegion: userData.country || 'Libya',
        learningStyle: userData.explanation_preference || 'detailed explanations',
        confidenceScore: currentAnalytics?.engagement_score || 5,
        recentLessons: recentLessons?.map(lesson => ({
          date: lesson.created_at.split('T')[0],
          focusArea: lesson.competency,
          performanceSummary: `${lesson.score}/100 score`,
          struggles: Array.isArray(lesson.mistakes_json) ? 
            (lesson.mistakes_json as string[]) : [],
          successes: (lesson.feedback_json as any)?.successes || ['completed lesson'],
          confidenceRating: 6,
          culturalInteractions: (lesson.feedback_json as any)?.cultural_moments || []
        })) || [],
        strengths: Array.isArray(currentProgress?.strength_areas) ? 
          (currentProgress.strength_areas as string[]) : ['listening', 'pronunciation'],
        struggles: Array.isArray(currentProgress?.weak_areas) ? 
          (currentProgress.weak_areas as string[]) : ['grammar', 'vocabulary'],
        grammarScore: currentAnalytics?.grammar_mistakes ? 
          Math.max(0, 100 - (currentAnalytics.grammar_mistakes * 10)) : 70,
        vocabularyLevel: this.getVocabularyLevel(userData.current_level || 'beginner'),
        speakingConfidence: currentAnalytics?.engagement_score || 65,
        culturalCompetence: currentAnalytics?.cultural_confidence_level || 60,
        ieltsCurrentBand: userData.target_ielts_band ? userData.target_ielts_band - 0.5 : undefined,
        ieltsTargetBand: userData.target_ielts_band,
        testDate: undefined,
        industry: undefined,
        jobLevel: undefined
      };

      return userProfile;
    } catch (error) {
      console.error('Error building learner context:', error);
      return null;
    }
  }

  /**
   * Determine teaching category based on user goals
   */
  static selectTeachingCategory(userGoals: string, currentFocus?: string): 'general' | 'ielts' | 'business' {
    if (userGoals?.toLowerCase().includes('ielts') || currentFocus?.includes('ielts')) {
      return 'ielts';
    }
    if (userGoals?.toLowerCase().includes('business') || userGoals?.toLowerCase().includes('work')) {
      return 'business';
    }
    return 'general';
  }

  /**
   * Call GPT-4 with generated prompt
   */
  static async callGPT4WithPrompt(prompt: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-lesson-generator', {
        body: {
          custom_prompt: prompt,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;
      return data.lesson_plan || 'Error generating lesson plan';
    } catch (error) {
      console.error('Error calling GPT-4:', error);
      throw error;
    }
  }

  /**
   * Parse teaching plan from AI response
   */
  static parseTeachingPlan(aiResponse: string): TeachingPlan {
    // Simple parsing - in production, this would be more sophisticated
    const sections = aiResponse.split('\n\n');
    
    return {
      primaryObjective: this.extractSection(aiResponse, 'Primary Learning Objective') || 'Build conversational confidence',
      conversationScenario: this.extractSection(aiResponse, 'Conversation Flow') || 'Natural conversation practice',
      culturalMoments: this.extractListSection(aiResponse, 'Cultural Integration') || ['Share cultural experiences'],
      successCriteria: this.extractListSection(aiResponse, 'Success Criteria') || ['Complete conversation confidently'],
      raziaInstructions: this.extractSection(aiResponse, 'Teaching Approach') || 'Be encouraging and supportive',
      lessonFlow: this.extractSection(aiResponse, 'Lesson Overview') || aiResponse.substring(0, 500),
      keyFocusAreas: this.extractListSection(aiResponse, 'Key Focus') || ['conversation fluency'],
      estimatedDuration: '20 minutes'
    };
  }

  /**
   * Update user profile with lesson outcome
   */
  static async updateUserProfile(userId: string, lessonOutcome: LessonOutcome): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Update learning analytics
      await supabase
        .from('learning_analytics')
        .upsert({
          user_id: userId,
          date: today,
          session_count: 1,
          engagement_score: 8,
          cultural_adaptation_progress: lessonOutcome.culturalIntegration.length * 20,
          confidence_patterns: {
            breakthroughs: lessonOutcome.breakthroughs,
            struggles: lessonOutcome.strugglesObserved
          }
        }, {
          onConflict: 'user_id,date'
        });

      // Update progress tracking
      await supabase
        .from('progress_tracking')
        .upsert({
          user_id: userId,
          strength_areas: lessonOutcome.skillEvidence,
          weak_areas: lessonOutcome.strugglesObserved,
          overall_proficiency: lessonOutcome.competencyGrowth,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }

  /**
   * Generate complete teaching session
   */
  static async generateCompleteTeachingSession(
    userId: string, 
    category?: 'general' | 'ielts' | 'business'
  ): Promise<TeachingPlan | null> {
    try {
      // 1. Build learner context
      const userProfile = await this.buildLearnerContext(userId);
      if (!userProfile) return null;

      // 2. Determine category
      const teachingCategory = category || this.selectTeachingCategory(userProfile.learningGoal);

      // 3. Generate teaching prompt
      const prompt = this.generateTeachingPrompt(userProfile, teachingCategory);

      // 4. Call GPT-4
      const aiResponse = await this.callGPT4WithPrompt(prompt);

      // 5. Parse and return teaching plan
      return this.parseTeachingPlan(aiResponse);

    } catch (error) {
      console.error('Error generating complete teaching session:', error);
      return null;
    }
  }

  // Helper methods
  private static getLevelDescription(level: string): string {
    const descriptions = {
      'beginner': 'A1-A2: Building foundation skills and basic communication',
      'intermediate': 'B1-B2: Developing conversational fluency and complex expression',
      'advanced': 'C1-C2: Mastering nuanced communication and cultural competence'
    };
    return descriptions[level as keyof typeof descriptions] || 'Learning English systematically';
  }

  private static getVocabularyLevel(level: string): string {
    const vocab = {
      'beginner': 'Building core 1000-word vocabulary',
      'intermediate': 'Expanding to 3000+ words with idioms',
      'advanced': 'Mastering 5000+ academic and professional terms'
    };
    return vocab[level as keyof typeof vocab] || 'Developing essential vocabulary';
  }

  private static extractSection(text: string, sectionName: string): string | null {
    const regex = new RegExp(`${sectionName}[:\\s]*([^\\n]+(?:\\n(?!#{1,3}\\s)[^\\n]+)*)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  private static extractListSection(text: string, sectionName: string): string[] | null {
    const section = this.extractSection(text, sectionName);
    if (!section) return null;
    
    return section
      .split(/[-•\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .slice(0, 5); // Limit to 5 items
  }
}