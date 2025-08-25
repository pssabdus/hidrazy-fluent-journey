// AI Cost Optimization Utilities
// Target: Reduce monthly AI costs from $200+ to under $5 per active user

export interface UsageLimits {
  dailyConversationTurns: number; // Max 50 per day
  monthlyGPT4Calls: number; // Max 20 GPT-4.1 calls per month
  monthlyTTSCharacters: number; // Max 10,000 characters per month
}

export interface CostOptimizationContext {
  userMessage: string;
  conversationType: string;
  userLevel: string;
  messageType?: string;
  userPreferences?: {
    autoTTS?: boolean;
    smartMode?: boolean;
  };
}

// Smart model selection - Use expensive GPT-4.1 ONLY for complex reasoning (10% of cases)
export const selectOptimalModel = (context: CostOptimizationContext) => {
  const { userMessage, conversationType, userLevel } = context;
  
  // Keywords that indicate complex reasoning needed
  const complexReasoningKeywords = [
    'explain culture', 'why is this wrong', 'help me understand', 
    'cultural difference', 'grammar rule', 'pronunciation', 'ielts',
    'business etiquette', 'professional', 'formal', 'academic'
  ];
  
  // Complex scenarios that need advanced AI
  const complexScenarios = [
    'cultural_explanation', 'advanced_grammar', 'ielts_assessment', 
    'business_coaching', 'cultural_bridge', 'pronunciation_correction'
  ];
  
  // Check if user message contains complex reasoning indicators
  const hasComplexKeywords = complexReasoningKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword)
  );
  
  // Check conversation type complexity
  const isComplexConversationType = complexScenarios.includes(conversationType) ||
    conversationType === 'ielts_practice' ||
    conversationType === 'business_english' ||
    userLevel === 'advanced';
  
  // Use expensive GPT-4.1 ONLY for complex reasoning (10% of cases)
  if (hasComplexKeywords || isComplexConversationType) {
    console.log('[COST-OPTIMIZATION] Using GPT-4.1 for complex reasoning:', { conversationType, userLevel });
    return 'gpt-4.1-2025-04-14'; // Expensive but necessary
  }
  
  // Use cheap GPT-4o-mini for 90% of conversations (70% cheaper)
  console.log('[COST-OPTIMIZATION] Using GPT-4o-mini for standard conversation');
  return 'gpt-4o-mini'; // 70% cheaper than GPT-4.1
};

// Smart TTS decision logic - Only use TTS when it adds real value
export const shouldUseTTS = (messageType: string, content: string, userPreferences?: any) => {
  // Always TTS for these high-value cases
  const alwaysTTS = [
    'new_vocabulary_word',
    'pronunciation_correction', 
    'cultural_phrase',
    'grammar_example',
    'ielts_speaking_practice'
  ];
  
  // Never TTS for these (saves money)
  const neverTTS = [
    'simple_acknowledgment', // "Good job!", "I understand"
    'repeat_response', // Same response as before
    'system_message',
    'error_message'
  ];
  
  if (alwaysTTS.includes(messageType)) {
    console.log('[COST-OPTIMIZATION] Using TTS for high-value case:', messageType);
    return true;
  }
  
  if (neverTTS.includes(messageType)) {
    console.log('[COST-OPTIMIZATION] Skipping TTS for low-value case:', messageType);
    return false;
  }
  
  // For main responses: only if user explicitly requests audio or it's enabled
  const shouldUse = userPreferences?.autoTTS === true;
  console.log('[COST-OPTIMIZATION] TTS decision for main response:', shouldUse);
  return shouldUse;
};

// Generate cache key for response caching
export const generateCacheKey = (userInput: string, userLevel: string, conversationContext: string) => {
  // Normalize input for caching
  const normalizedInput = userInput.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 50); // Limit length
    
  return `response_${normalizedInput}_${userLevel}_${conversationContext}`;
};

// Common patterns that can be cached to reduce AI calls
export const commonPatterns = [
  'how_to_use_articles_a_an_the',
  'past_tense_explanation', 
  'present_perfect_vs_simple_past',
  'basic_greeting_responses',
  'encouragement_phrases',
  'common_mistake_corrections',
  'pronunciation_tips_p_b_sounds',
  'cultural_small_talk_explanation',
  'job_interview_preparation_basics'
];

// Cost estimation for different models (per 1K tokens)
export const modelCosts = {
  'gpt-5-2025-08-07': { input: 0.01, output: 0.03 }, // Most expensive
  'gpt-4.1-2025-04-14': { input: 0.005, output: 0.015 }, // Expensive
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 }, // Very cheap
  'tts-1': { per_char: 0.000015 }, // TTS cost per character
  'whisper-1': { per_minute: 0.006 } // Whisper cost per minute
};

// Calculate estimated cost for an AI call
export const calculateCost = (model: string, inputTokens: number, outputTokens: number = 0) => {
  const costs = modelCosts[model as keyof typeof modelCosts];
  if (!costs || typeof costs === 'object' && 'per_char' in costs) return 0;
  
  const cost = costs as { input: number; output: number };
  return ((inputTokens * cost.input) + (outputTokens * cost.output)) / 1000;
};

// Default usage limits per user
export const defaultUsageLimits: UsageLimits = {
  dailyConversationTurns: 50, // Max 50 conversations per day
  monthlyGPT4Calls: 20, // Max 20 expensive GPT-4.1 calls per month
  monthlyTTSCharacters: 10000 // Max 10,000 TTS characters per month
};

// Check if user has exceeded usage limits
export const checkUsageLimits = async (userId: string, requestType: string, currentUsage: any) => {
  if (requestType === 'gpt-4.1' && currentUsage.gpt4Calls >= defaultUsageLimits.monthlyGPT4Calls) {
    return { 
      allowed: false, 
      fallback: 'gpt-4o-mini',
      message: 'Monthly GPT-4.1 limit reached, using efficient model instead'
    };
  }
  
  if (requestType === 'tts' && currentUsage.ttsCharacters >= defaultUsageLimits.monthlyTTSCharacters) {
    return { 
      allowed: false, 
      message: 'Monthly TTS limit reached. Click 🔊 for on-demand audio.' 
    };
  }
  
  if (currentUsage.dailyTurns >= defaultUsageLimits.dailyConversationTurns) {
    return {
      allowed: false,
      message: 'Daily conversation limit reached. See you tomorrow! 😊'
    };
  }
  
  return { allowed: true };
};

// Personalize cached responses to feel natural
export const personalizeCachedResponse = (cachedResponse: string, userName?: string) => {
  if (!userName) return cachedResponse;
  
  // Add personal touches to cached responses
  const personalizations = [
    `${userName}, ${cachedResponse}`,
    `Great question, ${userName}! ${cachedResponse}`,
    `${cachedResponse} Hope this helps, ${userName}! 😊`
  ];
  
  return personalizations[Math.floor(Math.random() * personalizations.length)];
};