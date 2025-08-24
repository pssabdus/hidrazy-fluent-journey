export type ExerciseType = 
  | 'vocabulary' 
  | 'grammar' 
  | 'listening' 
  | 'speaking' 
  | 'reading' 
  | 'conversation';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  title: string;
  instructions: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // in minutes
  points: number;
  completed: boolean;
  progress: number; // 0-100
}

// Vocabulary Exercise Types
export interface VocabularyFlashcard {
  id: string;
  word: string;
  definition: string;
  example: string;
  imageUrl?: string;
  audioUrl?: string;
  phonetic?: string;
  partOfSpeech: string;
}

export interface VocabularyExercise extends BaseExercise {
  type: 'vocabulary';
  flashcards: VocabularyFlashcard[];
  spacedRepetition: {
    interval: number;
    nextReview: Date;
    confidence: number; // 1-5
  }[];
}

// Grammar Exercise Types
export interface GrammarRule {
  id: string;
  title: string;
  explanation: string;
  examples: string[];
}

export interface DragDropItem {
  id: string;
  text: string;
  correctPosition: number;
}

export interface FillInBlank {
  id: string;
  sentence: string;
  blanks: Array<{
    position: number;
    correctAnswer: string;
    options?: string[];
    hint?: string;
  }>;
}

export interface GrammarExercise extends BaseExercise {
  type: 'grammar';
  rule: GrammarRule;
  exercises: Array<{
    type: 'drag-drop' | 'fill-blank' | 'correction' | 'timeline';
    data: DragDropItem[] | FillInBlank | any;
  }>;
}

// Listening Exercise Types
export interface ListeningComprehension extends BaseExercise {
  type: 'listening';
  audioUrl: string;
  transcript: string;
  speaker: {
    name: string;
    accent: string;
    gender: string;
  };
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer';
    options?: string[];
    correctAnswer: string;
    timestamp?: number; // where in audio this relates to
  }>;
  playbackControls: {
    allowSlowDown: boolean;
    allowRewind: boolean;
    showTranscript: boolean;
  };
}

// Speaking Exercise Types
export interface SpeakingExercise extends BaseExercise {
  type: 'speaking';
  prompt: string;
  targetAudio?: string; // native speaker reference
  phoneticTarget?: string;
  criteria: {
    pronunciation: boolean;
    fluency: boolean;
    intonation: boolean;
    pace: boolean;
  };
  feedback: {
    overallScore: number;
    pronunciation: number;
    fluency: number;
    suggestions: string[];
  };
}

// Reading Exercise Types
export interface ReadingPassage extends BaseExercise {
  type: 'reading';
  passage: {
    title: string;
    content: string;
    wordCount: number;
    readingLevel: string;
    vocabulary: Array<{
      word: string;
      definition: string;
      position: number;
    }>;
  };
  questions: Array<{
    id: string;
    question: string;
    type: 'comprehension' | 'vocabulary' | 'inference' | 'summary';
    correctAnswer: string;
    explanation: string;
  }>;
  readingMetrics: {
    startTime: number;
    endTime: number;
    wordsPerMinute: number;
    comprehensionScore: number;
  };
}

// Conversation Exercise Types
export interface ConversationBranch {
  id: string;
  speakerText: string;
  options: Array<{
    id: string;
    text: string;
    nextBranchId?: string;
    appropriatenessScore: number;
    culturalNote?: string;
  }>;
  context?: string;
  feedback?: string;
}

export interface ConversationExercise extends BaseExercise {
  type: 'conversation';
  scenario: string;
  character: {
    name: string;
    role: string;
    personality: string;
    avatarUrl?: string;
  };
  branches: ConversationBranch[];
  startBranchId: string;
  learningObjectives: string[];
}

// Assessment and Progress Types
export interface PerformanceMetrics {
  totalTime: number;
  accuracy: number;
  attemptsCount: number;
  hintsUsed: number;
  mistakePatterns: string[];
  strongAreas: string[];
  weakAreas: string[];
}

export interface ExerciseResult {
  exerciseId: string;
  userId: string;
  score: number;
  completedAt: Date;
  timeSpent: number;
  metrics: PerformanceMetrics;
  feedback: string[];
}

// Gamification Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: string;
  points: number;
  unlockedAt?: Date;
}

export interface Streak {
  current: number;
  longest: number;
  lastActivity: Date;
}

export interface UserProgress {
  userId: string;
  totalXP: number;
  level: number;
  streaks: {
    daily: Streak;
    weekly: Streak;
  };
  achievements: Achievement[];
  skillPoints: {
    vocabulary: number;
    grammar: number;
    listening: number;
    speaking: number;
    reading: number;
    conversation: number;
  };
}