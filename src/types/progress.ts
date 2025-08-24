export interface SkillProgress {
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
}

export interface WeeklyActivity {
  date: string;
  studyMinutes: number;
  lessonsCompleted: number;
  conversationCount: number;
  achievementUnlocks: number;
}

export interface VocabularyStats {
  totalWords: number;
  masteredWords: number;
  recentlyAdded: VocabularyWord[];
  challengingWords: VocabularyWord[];
}

export interface VocabularyWord {
  word: string;
  definition: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  masteryLevel: number;
  nextReview: Date;
}

export interface ConversationStats {
  totalConversations: number;
  averageLength: number;
  topicsDiscussed: string[];
  fluencyImprovement: number[];
  favoriteTypes: Record<string, number>;
  pronunciationScores: number[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface LearningGoal {
  type: 'ielts' | 'conversation' | 'business' | 'general';
  targetScore?: number;
  currentScore: number;
  estimatedCompletion: Date;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  completed: boolean;
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  streakData: Array<{
    date: string;
    studyMinutes: number;
    intensity: 'none' | 'light' | 'medium' | 'high';
  }>;
}

export interface ProgressAnalytics {
  skillProgress: SkillProgress;
  weeklyActivity: WeeklyActivity[];
  vocabularyStats: VocabularyStats;
  conversationStats: ConversationStats;
  achievements: Achievement[];
  learningGoal: LearningGoal;
  studyStreak: StudyStreak;
  overallCompletion: number;
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}