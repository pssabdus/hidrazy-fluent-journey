// Core conversation types and interfaces
export interface RaziaPersonality {
  traits: {
    patience: number; // 1-10
    encouragement: number; // 1-10
    culturalAwareness: number; // 1-10
    adaptability: number; // 1-10
  };
  expressions: {
    thinking: string;
    speaking: string;
    encouraging: string;
    correcting: string;
    celebrating: string;
  };
  phrases: {
    arabic: string[];
    encouragement: string[];
    corrections: string[];
    cultural: string[];
  };
}

export interface ConversationMessage {
  id: string;
  type: 'user' | 'razia' | 'correction' | 'cultural-tip' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    corrections?: GrammarCorrection[];
    culturalContext?: CulturalTip;
    emotionalTone?: 'encouraging' | 'neutral' | 'corrective' | 'celebratory';
    audioUrl?: string;
    pronunciation?: PronunciationFeedback;
  };
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
  rule: string;
  examples: string[];
  severity: 'minor' | 'major' | 'critical';
}

export interface CulturalTip {
  title: string;
  description: string;
  arabicContext: string;
  englishContext: string;
  examples: string[];
}

export interface PronunciationFeedback {
  overall: number; // 0-100
  phonemes: Array<{
    phoneme: string;
    accuracy: number;
    recommendation: string;
  }>;
  rhythm: number;
  intonation: number;
  fluency: number;
}

export interface ConversationContext {
  userId: string;
  currentLevel: string;
  learningGoals: string[];
  lessonObjectives?: string[];
  conversationType: 'lesson-practice' | 'free-chat' | 'role-play' | 'assessment' | 'cultural-bridge';
  userProfile: {
    name: string;
    country: string;
    nativeLanguage: string;
    interests: string[];
    commonMistakes: string[];
    progressMilestones: string[];
  };
  conversationHistory: ConversationMessage[];
  sessionMetrics: {
    startTime: number;
    messagesExchanged: number;
    mistakesCorrected: number;
    newVocabulary: string[];
    fluencyScore: number;
  };
}

export interface AIResponseOptions {
  includeCorrections: boolean;
  includeEncouragement: boolean;
  includeCulturalContext: boolean;
  adaptLanguageLevel: boolean;
  responseStyle: 'conversational' | 'instructional' | 'assessment';
  maxResponseLength: number;
}

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  accent: string;
  speed: number;
  pitch: number;
  emotionalTone: string;
}

export interface ConversationSettings {
  voice: VoiceSettings;
  corrections: {
    immediate: boolean;
    gentle: boolean;
    explanations: boolean;
  };
  encouragement: {
    frequency: 'low' | 'medium' | 'high';
    arabicPhrases: boolean;
  };
  cultural: {
    tips: boolean;
    comparisons: boolean;
  };
}

export interface ConversationState {
  isActive: boolean;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  currentTopic: string;
  raziaExpression: string;
  context: ConversationContext;
  settings: ConversationSettings;
  error?: {
    type: string;
    message: string;
    retryable: boolean;
  };
}