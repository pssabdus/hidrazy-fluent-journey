import { OnboardingData } from '@/types/onboarding';

export const initialOnboardingData: OnboardingData = {
  ageGroup: null,
  gender: null,
  country: 'Libya',
  learningGoal: null,
  currentLevel: null,
  challenges: [],
  previousExperience: [],
  accentPreference: null,
  explanationLanguage: null,
  dailyGoalMinutes: 30,
  studyTimePreference: null,
};

export const ageGroups = [
  {
    id: 'teen',
    title: '13-17 Teen Learner',
    description: 'Building foundation for future success',
    icon: '🎓',
  },
  {
    id: 'young-adult',
    title: '18-25 Young Adult',
    description: 'University and early career focus',
    icon: '🚀',
  },
  {
    id: 'professional',
    title: '26-35 Professional',
    description: 'Career advancement and opportunities',
    icon: '💼',
  },
  {
    id: 'career',
    title: '36-45 Career Focus',
    description: 'Leadership and business communication',
    icon: '🎯',
  },
  {
    id: 'lifelong',
    title: '46+ Lifelong Learner',
    description: 'Personal enrichment and growth',
    icon: '📚',
  },
] as const;

export const genderOptions = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
] as const;

export const learningGoals = [
  {
    id: 'general',
    title: 'General English',
    description: 'Improve overall English for daily life',
    icon: '💬',
    badge: 'Most Popular',
  },
  {
    id: 'ielts',
    title: 'IELTS Preparation',
    description: 'Achieve your target band score',
    icon: '🏆',
  },
  {
    id: 'business',
    title: 'Business English',
    description: 'Excel in professional communication',
    icon: '🤝',
  },
  {
    id: 'travel',
    title: 'Travel English',
    description: 'Speak confidently anywhere',
    icon: '✈️',
  },
] as const;

export const ieltsTargetBands = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0] as const;

export const ieltsTimelines = [
  { id: '3-months', label: '3 Months', description: 'Intensive study', icon: '⚡' },
  { id: '6-months', label: '6 Months', description: 'Balanced approach', icon: '📊' },
  { id: '12-months', label: '12 Months', description: 'Gradual improvement', icon: '🌱' },
] as const;

export const englishLevels = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting out', level: 1 },
  { id: 'elementary', label: 'Elementary', description: 'Basic understanding', level: 2 },
  { id: 'intermediate', label: 'Intermediate', description: 'Good foundation', level: 3 },
  { id: 'upper-intermediate', label: 'Upper Intermediate', description: 'Strong skills', level: 4 },
  { id: 'advanced', label: 'Advanced', description: 'Near fluent', level: 5 },
] as const;

export const challenges = [
  { id: 'speaking', label: 'Speaking', icon: '🎤' },
  { id: 'listening', label: 'Listening', icon: '👂' },
  { id: 'grammar', label: 'Grammar', icon: '📖' },
  { id: 'pronunciation', label: 'Pronunciation', icon: '🔊' },
  { id: 'reading', label: 'Reading', icon: '📰' },
  { id: 'writing', label: 'Writing', icon: '✍️' },
] as const;

export const previousExperiences = [
  { id: 'school', label: 'School/University', icon: '🏫' },
  { id: 'self-study', label: 'Self-Study', icon: '📚' },
  { id: 'private-lessons', label: 'Private Lessons', icon: '👩‍🏫' },
  { id: 'work', label: 'Work Environment', icon: '💼' },
  { id: 'media', label: 'Movies/Music', icon: '🎬' },
] as const;

export const accentPreferences = [
  { id: 'british', label: 'British English', flag: '🇬🇧', description: 'Traditional, formal style' },
  { id: 'american', label: 'American English', flag: '🇺🇸', description: 'Casual, widely used' },
] as const;

export const explanationLanguages = [
  { id: 'english-only', title: 'English Only', description: 'Full immersion experience', icon: '🇬🇧' },
  { id: 'arabic-when-stuck', title: 'Arabic When Stuck', description: 'Support when needed', icon: '🔄' },
  { id: 'mix-both', title: 'Mix Both', description: 'Balanced approach', icon: '🌍' },
] as const;

export const studyTimes = [
  { id: 'morning', label: 'Morning', description: '6AM - 12PM', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', description: '12PM - 6PM', icon: '☀️' },
  { id: 'evening', label: 'Evening', description: '6PM - 10PM', icon: '🌆' },
  { id: 'night', label: 'Night', description: '10PM - 12AM', icon: '🌙' },
] as const;

export const countries = [
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
] as const;