export interface Scenario {
  id: string;
  title: string;
  category: 'daily_life' | 'work' | 'travel' | 'social';
  description: string;
  context: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedDuration: number; // in minutes
  vocabularyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  image: string;
  learningObjectives: string[];
  keyVocabulary: string[];
  culturalTips: string[];
  character: RaziaCharacter;
  isCompleted: boolean;
  isPremium: boolean;
}

export interface RaziaCharacter {
  role: string;
  personality: string;
  speakingStyle: 'casual' | 'formal' | 'professional' | 'friendly';
  avatarStyle: string;
  greeting: string;
  commonPhrases: string[];
}

export interface RolePlayMessage {
  id: string;
  type: 'razia' | 'user' | 'system' | 'suggestion';
  content: string;
  timestamp: number;
  audioUrl?: string;
  suggestions?: string[];
  corrections?: Array<{
    original: string;
    suggestion: string;
    explanation: string;
  }>;
}

export interface PerformanceMetrics {
  fluency: number; // 0-100
  accuracy: number; // 0-100
  appropriateness: number; // 0-100
  confidence: number; // 0-100
  vocabularyUsed: string[];
  mistakeCount: number;
  responseTime: number; // average in seconds
}

export interface ScenarioProgress {
  scenarioId: string;
  userId: string;
  isCompleted: boolean;
  attempts: number;
  bestScore: number;
  lastPlayed: Date;
  metrics: PerformanceMetrics;
  conversationHistory: RolePlayMessage[];
}