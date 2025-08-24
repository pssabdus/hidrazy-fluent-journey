export interface OnboardingData {
  // Step 1: Personal Info
  ageGroup: 'teen' | 'young-adult' | 'professional' | 'career' | 'lifelong' | null;
  gender: 'male' | 'female' | 'other' | null;
  country: string;

  // Step 2: Learning Goals
  learningGoal: 'general' | 'ielts' | 'business' | 'travel' | null;
  ieltsTargetBand?: number;
  ieltsTimeline?: '3-months' | '6-months' | '12-months';

  // Step 3: English Background
  currentLevel: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | null;
  challenges: Array<'speaking' | 'listening' | 'grammar' | 'pronunciation' | 'reading' | 'writing'>;
  previousExperience: Array<'school' | 'self-study' | 'private-lessons' | 'work' | 'media'>;

  // Step 4: Learning Preferences
  accentPreference: 'british' | 'american' | null;
  explanationLanguage: 'english-only' | 'arabic-when-stuck' | 'mix-both' | null;
  dailyGoalMinutes: number;
  studyTimePreference: 'morning' | 'afternoon' | 'evening' | 'night' | null;
}

export interface OnboardingStep {
  id: number;
  title: string;
  isValid: (data: OnboardingData) => boolean;
  isOptional?: boolean;
}

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}