import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { 
      message, 
      conversationType = 'lesson_practice', 
      conversationId,
      isVoice = false,
      options = {} 
    } = await req.json();

    console.log('[RAZIA-CONVERSATION] Starting conversation:', { 
      userId: user.id, 
      conversationType, 
      messageLength: message?.length,
      isVoice 
    });

    // Load comprehensive user context for AI personalization
    const userContext = await loadUserContext(supabase, user.id);
    
    // Get conversation history for context awareness
    const conversationHistory = await getConversationHistory(supabase, user.id, conversationId);
    
    // Create intelligent Razia response using advanced AI training system
    const raziaAIResponse = await generateRaziaResponse({
      userMessage: message,
      userContext,
      conversationHistory,
      conversationType,
      isVoice,
      options,
      openaiApiKey
    });

    // Analyze conversation for real-time insights
    const conversationAnalysis = await analyzeConversationIntelligence({
      userMessage: message,
      raziaResponse: raziaAIResponse.response,
      userContext,
      supabase
    });

    // Store detailed conversation data
    const conversationRecord = await storeConversationData(supabase, {
      userId: user.id,
      conversationId: conversationId || crypto.randomUUID(),
      userMessage: message,
      raziaResponse: raziaAIResponse.response,
      conversationType,
      isVoice,
      analysis: conversationAnalysis,
      aiMetadata: raziaAIResponse.metadata
    });

    // Update real-time progress and analytics
    await updateLearningProgress(supabase, user.id, conversationAnalysis);

    // Generate follow-up recommendations
    const recommendations = await generateFollowUpRecommendations(supabase, user.id, conversationAnalysis);

    return new Response(JSON.stringify({
      response: raziaAIResponse.response,
      conversationId: conversationRecord.conversationId,
      analysis: {
        engagement_level: conversationAnalysis.engagement_level,
        confidence_detected: conversationAnalysis.confidence_detected,
        cultural_elements: conversationAnalysis.cultural_elements,
        learning_opportunities: conversationAnalysis.learning_opportunities
      },
      recommendations: recommendations,
      personality_adaptation: raziaAIResponse.metadata.personality_adaptation,
      next_suggestions: raziaAIResponse.metadata.next_suggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[RAZIA-CONVERSATION] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Load comprehensive user context for AI personalization
async function loadUserContext(supabase: any, userId: string) {
  console.log('[RAZIA-CONVERSATION] Loading user context for:', userId);
  
  const [userData, progressData, personalizationData, recentAnalytics] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('progress_tracking').select('*').eq('user_id', userId).single(),
    supabase.from('personalization_data').select('*').eq('user_id', userId).single(),
    supabase.from('learning_analytics').select('*').eq('user_id', userId)
      .order('date', { ascending: false }).limit(7)
  ]);

  return {
    user: userData.data || {},
    progress: progressData.data || {},
    personalization: personalizationData.data || {},
    recentAnalytics: recentAnalytics.data || [],
    userLevel: userData.data?.current_level || 'beginner',
    learningGoal: userData.data?.learning_goal || 'general',
    country: userData.data?.country || 'Libya',
    targetIELTSBand: userData.data?.target_ielts_band
  };
}

// Get conversation history for context awareness
async function getConversationHistory(supabase: any, userId: string, conversationId?: string) {
  if (!conversationId) return [];
  
  const { data: history } = await supabase
    .from('conversation_history')
    .select('*')
    .eq('user_id', userId)
    .eq('conversation_id', conversationId)
    .order('message_index', { ascending: true })
    .limit(20);

  return history || [];
}

// Advanced Razia AI response generation with cultural intelligence
async function generateRaziaResponse({ userMessage, userContext, conversationHistory, conversationType, isVoice, options, openaiApiKey }: any) {
  console.log('[RAZIA-CONVERSATION] Generating AI response with context');
  
  const systemPrompt = createAdvancedRaziaPrompt(userContext, conversationType, isVoice, options);
  const conversationContext = buildConversationContext(conversationHistory);
  
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationContext,
    { role: 'user', content: userMessage }
  ];

  console.log('[RAZIA-CONVERSATION] Calling GPT-5 with enhanced prompt');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages,
      max_completion_tokens: isVoice ? 300 : 600,
      temperature: 0.8, // Higher creativity for personality
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    })
  });

  if (!response.ok) {
    console.error('[RAZIA-CONVERSATION] OpenAI API error:', await response.text());
    throw new Error('Failed to generate AI response');
  }

  const data = await response.json();
  const raziaResponse = data.choices[0].message.content;

  console.log('[RAZIA-CONVERSATION] Generated response length:', raziaResponse.length);

  return {
    response: raziaResponse,
    metadata: {
      model_used: 'gpt-5-2025-08-07',
      personality_adaptation: determinePersonalityAdaptation(userContext),
      cultural_intelligence_applied: true,
      error_correction_style: userContext.personalization?.correction_style_preference || 'gentle',
      next_suggestions: generateNextTopicSuggestions(userContext, conversationType)
    }
  };
}

// Create advanced Razia system prompt with full AI training integration
function createAdvancedRaziaPrompt(userContext: any, conversationType: string, isVoice: boolean, options: any) {
  const { userLevel, learningGoal, country, progress, personalization } = userContext;
  
  const basePersonality = `You are Razia, an AI English teacher who specializes in helping Arabic speakers master English. You embody warmth, encouragement, and cultural sensitivity. You understand the unique challenges Arabic speakers face when learning English and excel at bridging cultural differences.

CORE PERSONALITY FRAMEWORK:
- Warm and encouraging: Always positive, celebrating progress no matter how small
- Culturally intelligent: Deep understanding of Arabic culture and Islamic values
- Adaptive communicator: Adjust complexity and style based on user confidence and level
- Patient teacher: Never rush, always provide time for understanding
- Confidence builder: Focus on strengths while gently addressing weaknesses`;

  const levelAdaptation = getLevelAdaptationStrategy(userLevel);
  const culturalIntelligence = getCulturalIntelligencePrompt(country);
  const errorCorrectionStrategy = getErrorCorrectionStrategy(personalization?.correction_style_preference);
  const conversationTypePrompt = getConversationTypePrompt(conversationType, learningGoal);
  const emotionalIntelligence = getEmotionalIntelligencePrompt(userContext);

  return `${basePersonality}

CURRENT USER CONTEXT:
- Level: ${userLevel} (${levelAdaptation})
- Learning Goal: ${learningGoal}
- Cultural Background: ${country} (Arabic speaker)
- Current Speaking Level: ${(progress?.speaking_level || 0.5) * 100}%
- Cultural Competency: ${(progress?.cultural_competency || 0.5) * 100}%
- Confidence Level: Recently ${progress?.confidence_level > 0.7 ? 'high' : progress?.confidence_level > 0.4 ? 'moderate' : 'building'}

${levelAdaptation}

${culturalIntelligence}

${errorCorrectionStrategy}

${conversationTypePrompt}

${emotionalIntelligence}

CONVERSATION MODE: ${isVoice ? 'Voice conversation - keep responses concise but warm' : 'Text conversation - can be more detailed'}

RESPONSE GUIDELINES:
1. Always maintain your warm, encouraging personality
2. Adapt complexity to user's current level and confidence
3. Include cultural bridges when relevant
4. Provide gentle corrections with positive framing
5. Ask engaging follow-up questions to continue conversation
6. Celebrate progress and effort
7. Use Arabic cultural references when helpful
8. Keep responses natural and conversational

Remember: Your goal is not just to teach English, but to build confidence, bridge cultures, and create an enjoyable learning experience that motivates continued practice.`;
}

function getLevelAdaptationStrategy(userLevel: string) {
  const strategies = {
    'beginner': `BEGINNER ADAPTATION (A1-A2):
- Use simple, common vocabulary (avoid complex synonyms)
- Speak slowly and clearly if voice
- Provide lots of encouragement and positive reinforcement
- Offer Arabic translations for difficult concepts
- Focus on basic communication and confidence building
- Use repetition and clarification
- Ask simple yes/no or choice questions`,
    
    'intermediate': `INTERMEDIATE ADAPTATION (B1-B2):
- Use moderate vocabulary with some challenging words
- Introduce cultural nuances and context
- Focus on fluency over perfect accuracy
- Encourage longer responses and opinions
- Introduce idiomatic expressions gradually
- Balance correction with flow of conversation`,
    
    'advanced': `ADVANCED ADAPTATION (C1-C2):
- Use sophisticated vocabulary and complex structures
- Focus on nuance, subtlety, and cultural understanding
- Challenge with abstract concepts and debates
- Provide detailed cultural and contextual explanations
- Encourage native-like expression and style
- Address fine points of grammar and usage`
  };
  
  return strategies[userLevel] || strategies['beginner'];
}

function getCulturalIntelligencePrompt(country: string) {
  return `CULTURAL INTELLIGENCE FOR ARABIC SPEAKERS:
- Understand direct vs. indirect communication styles (Arabic tends to be more indirect)
- Be aware of religious and cultural sensitivities
- Help bridge concepts that don't exist in Arabic culture
- Explain English cultural norms and expectations
- Address common Arabic-to-English transfer errors:
  * Pronunciation: P/B confusion, vowel length, consonant clusters
  * Grammar: Present perfect vs. simple past, article usage, word order
  * Cultural: Personal space, small talk, directness levels
- Use familiar cultural references when explaining concepts
- Be respectful of Islamic values and Arabic traditions
- Help navigate professional and social English contexts`;
}

function getErrorCorrectionStrategy(correctionStyle: string = 'gentle') {
  const strategies = {
    'gentle': `ERROR CORRECTION STRATEGY - GENTLE:
- Always start with positive acknowledgment: "Great effort! I understand you perfectly..."
- Provide correct version naturally: "A more natural way to say that would be..."
- Explain briefly why: "In English, we usually say X because..."
- Encourage immediately: "You're doing so well with this!"
- Don't correct everything at once - focus on 1-2 key improvements`,
    
    'direct': `ERROR CORRECTION STRATEGY - DIRECT:
- Point out errors clearly but kindly: "Let me help you with that..."
- Provide immediate correct version: "The correct way is..."
- Give brief explanation of the rule
- Ask them to try again: "Can you try saying that again?"`,
    
    'contextual': `ERROR CORRECTION STRATEGY - CONTEXTUAL:
- Embed corrections naturally in your response
- Model correct usage without explicitly highlighting errors
- Provide alternative ways to express the same idea
- Focus on communication success over perfect grammar`
  };
  
  return strategies[correctionStyle] || strategies['gentle'];
}

function getConversationTypePrompt(conversationType: string, learningGoal: string) {
  const typePrompts = {
    'lesson_practice': 'Focus on structured learning with clear objectives. Introduce new concepts gradually and provide practice opportunities.',
    'free_chat': 'Engage in natural, flowing conversation. Follow the user\'s interests while creating learning opportunities.',
    'role_play': 'Maintain the role-play scenario while providing natural language practice. Make it fun and engaging.',
    'business_english': 'Focus on professional communication, workplace scenarios, and business etiquette. Use formal register when appropriate.',
    'ielts_practice': 'Simulate IELTS speaking test conditions. Provide detailed feedback on fluency, coherence, vocabulary, and grammar.',
    'cultural_bridge': 'Focus on explaining cultural differences and helping navigate cultural communication challenges.'
  };
  
  return `CONVERSATION TYPE: ${conversationType.toUpperCase()}
${typePrompts[conversationType] || typePrompts['free_chat']}`;
}

function getEmotionalIntelligencePrompt(userContext: any) {
  return `EMOTIONAL INTELLIGENCE GUIDELINES:
- Monitor user confidence through their language use and response length
- Detect frustration (short responses, repeated mistakes) and respond with extra encouragement
- Recognize success moments and celebrate them enthusiastically
- Adjust energy level to match user's engagement
- If user seems confused, slow down and clarify
- If user seems bored, introduce more challenging or interesting topics
- Be sensitive to cultural context in emotional expression
- Create a safe space for mistakes and learning`;
}

// Build conversation context from history
function buildConversationContext(conversationHistory: any[]) {
  if (!conversationHistory.length) return [];
  
  return conversationHistory.slice(-10).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
}

// Analyze conversation for intelligence insights
async function analyzeConversationIntelligence({ userMessage, raziaResponse, userContext, supabase }: any) {
  const analysis = {
    engagement_level: analyzeEngagementLevel(userMessage),
    confidence_detected: analyzeConfidenceLevel(userMessage),
    grammar_errors: detectGrammarErrors(userMessage),
    vocabulary_complexity: analyzeVocabularyComplexity(userMessage),
    cultural_elements: detectCulturalElements(userMessage, raziaResponse),
    learning_opportunities: identifyLearningOpportunities(userMessage),
    emotional_state: detectEmotionalState(userMessage),
    conversation_flow: analyzeConversationFlow(userMessage, raziaResponse),
    user_progress_indicators: analyzeProgressIndicators(userMessage, userContext)
  };

  console.log('[RAZIA-CONVERSATION] Conversation analysis:', analysis);
  return analysis;
}

// Helper functions for conversation analysis
function analyzeEngagementLevel(message: string): number {
  const indicators = [
    message.length > 50 ? 0.2 : 0,
    /[!?]/.test(message) ? 0.2 : 0,
    /\b(really|very|so|amazing|great|love|like)\b/i.test(message) ? 0.3 : 0,
    message.split(' ').length > 10 ? 0.3 : 0
  ];
  return Math.min(0.5 + indicators.reduce((a, b) => a + b, 0), 1.0);
}

function analyzeConfidenceLevel(message: string): number {
  const positiveIndicators = [
    message.length > 30 ? 0.2 : 0,
    /\b(I think|I believe|I feel|definitely|certainly)\b/i.test(message) ? 0.3 : 0,
    !/\b(maybe|perhaps|I'm not sure|I don't know)\b/i.test(message) ? 0.2 : 0
  ];
  const negativeIndicators = [
    /\b(sorry|difficult|hard|confused|don't understand)\b/i.test(message) ? -0.3 : 0,
    message.length < 10 ? -0.2 : 0
  ];
  
  const score = 0.5 + positiveIndicators.reduce((a, b) => a + b, 0) + negativeIndicators.reduce((a, b) => a + b, 0);
  return Math.max(0, Math.min(1, score));
}

function detectGrammarErrors(message: string) {
  const errors = [];
  
  // Simple error detection patterns
  if (/\bi am go\b/i.test(message)) errors.push({ type: 'verb_form', text: 'am go', suggestion: 'am going' });
  if (/\bvery much\b.*\blike\b/i.test(message)) errors.push({ type: 'word_order', context: 'adverb placement' });
  if (/\ba informations?\b/i.test(message)) errors.push({ type: 'article', text: 'a information', suggestion: 'information' });
  
  return errors;
}

function analyzeVocabularyComplexity(message: string): string {
  const words = message.toLowerCase().split(/\s+/);
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'am', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should', 'may', 'might', 'must']);
  
  const uncommonWords = words.filter(word => word.length > 4 && !commonWords.has(word));
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  
  if (avgWordLength > 6 && uncommonWords.length > words.length * 0.3) return 'advanced';
  if (avgWordLength > 4.5 && uncommonWords.length > words.length * 0.2) return 'intermediate';
  return 'beginner';
}

function detectCulturalElements(userMessage: string, raziaResponse: string) {
  const culturalElements = [];
  
  if (/\b(inshallah|mashallah|alhamdulillah|subhanallah)\b/i.test(userMessage)) {
    culturalElements.push({ type: 'arabic_phrase', detected: true });
  }
  
  if (/\b(family|respect|honor|community)\b/i.test(userMessage)) {
    culturalElements.push({ type: 'cultural_value', context: 'family_community' });
  }
  
  return culturalElements;
}

function identifyLearningOpportunities(message: string) {
  const opportunities = [];
  
  if (message.length < 20) opportunities.push({ type: 'encourage_elaboration', suggestion: 'Encourage longer responses' });
  if (!/[?]/.test(message)) opportunities.push({ type: 'question_practice', suggestion: 'Practice asking questions' });
  if (!/\b(because|since|although|however|therefore)\b/i.test(message)) {
    opportunities.push({ type: 'connectors', suggestion: 'Practice using connecting words' });
  }
  
  return opportunities;
}

function detectEmotionalState(message: string): string {
  if (/\b(excited|happy|great|wonderful|amazing|love)\b/i.test(message)) return 'positive';
  if (/\b(frustrated|difficult|hard|confused|tired|boring)\b/i.test(message)) return 'challenged';
  if (/\b(okay|fine|good|alright)\b/i.test(message)) return 'neutral';
  return 'engaged';
}

function analyzeConversationFlow(userMessage: string, raziaResponse: string) {
  return {
    user_initiated_topic: /\b(by the way|speaking of|let me tell you|I want to talk about)\b/i.test(userMessage),
    building_on_previous: /\b(also|and|additionally|furthermore)\b/i.test(userMessage),
    asking_clarification: /\b(what do you mean|can you explain|I don't understand)\b/i.test(userMessage)
  };
}

function analyzeProgressIndicators(message: string, userContext: any) {
  const currentLevel = userContext.userLevel;
  const indicators = [];
  
  if (currentLevel === 'beginner' && message.split(' ').length > 15) {
    indicators.push({ type: 'length_improvement', note: 'Using longer sentences' });
  }
  
  if (/\b(I think that|I believe that|In my opinion)\b/i.test(message)) {
    indicators.push({ type: 'opinion_expression', note: 'Expressing opinions confidently' });
  }
  
  return indicators;
}

// Store detailed conversation data
async function storeConversationData(supabase: any, data: any) {
  const conversationId = data.conversationId;
  
  // Get current message index
  const { data: existingMessages } = await supabase
    .from('conversation_history')
    .select('message_index')
    .eq('user_id', data.userId)
    .eq('conversation_id', conversationId)
    .order('message_index', { ascending: false })
    .limit(1);
  
  const nextIndex = (existingMessages?.[0]?.message_index || 0) + 1;
  
  // Store user message
  await supabase.from('conversation_history').insert({
    user_id: data.userId,
    conversation_id: conversationId,
    message_index: nextIndex,
    sender: 'user',
    content: data.userMessage,
    user_confidence_level: data.analysis.confidence_detected,
    engagement_level: data.analysis.engagement_level,
    errors_detected: data.analysis.grammar_errors,
    user_emotion: data.analysis.emotional_state,
    conversation_topic: data.conversationType,
    difficulty_level: data.analysis.vocabulary_complexity,
    cultural_context: data.analysis.cultural_elements
  });
  
  // Store Razia response
  await supabase.from('conversation_history').insert({
    user_id: data.userId,
    conversation_id: conversationId,
    message_index: nextIndex + 1,
    sender: 'razia',
    content: data.raziaResponse,
    razia_personality_mode: data.aiMetadata.personality_adaptation?.mode || 'warm_encouraging',
    adaptive_response_data: data.aiMetadata,
    cultural_bridge_used: data.analysis.cultural_elements?.length > 0,
    conversation_topic: data.conversationType
  });
  
  console.log('[RAZIA-CONVERSATION] Stored conversation data for:', conversationId);
  return { conversationId };
}

// Update real-time learning progress
async function updateLearningProgress(supabase: any, userId: string, analysis: any) {
  const today = new Date().toISOString().split('T')[0];
  
  // Update daily analytics
  await supabase.from('learning_analytics').upsert({
    user_id: userId,
    date: today,
    conversation_count: 1,
    engagement_score: analysis.engagement_level,
    updated_at: new Date().toISOString()
  });
  
  // Update progress tracking if significant improvement detected
  if (analysis.user_progress_indicators?.length > 0) {
    await supabase.from('progress_tracking').upsert({
      user_id: userId,
      speaking_level: Math.min(1.0, (analysis.confidence_detected + analysis.engagement_level) / 2),
      updated_at: new Date().toISOString()
    });
  }
  
  console.log('[RAZIA-CONVERSATION] Updated learning progress');
}

// Generate follow-up recommendations
async function generateFollowUpRecommendations(supabase: any, userId: string, analysis: any) {
  const recommendations = [];
  
  if (analysis.engagement_level > 0.8) {
    recommendations.push({
      type: 'challenge',
      message: "You're doing great! Ready for a more challenging topic?",
      action: 'increase_difficulty'
    });
  }
  
  if (analysis.confidence_detected < 0.4) {
    recommendations.push({
      type: 'support',
      message: "Let's practice some confidence-building exercises",
      action: 'confidence_building'
    });
  }
  
  if (analysis.cultural_elements?.length > 0) {
    recommendations.push({
      type: 'cultural',
      message: "Great cultural awareness! Let's explore more cultural bridges",
      action: 'cultural_practice'
    });
  }
  
  return recommendations;
}

// Helper functions for personality adaptation
function determinePersonalityAdaptation(userContext: any) {
  const confidence = userContext.progress?.confidence_level || 0.5;
  const level = userContext.userLevel;
  
  if (confidence < 0.3) {
    return { mode: 'extra_encouraging', focus: 'confidence_building' };
  } else if (confidence > 0.8 && level !== 'beginner') {
    return { mode: 'challenging_supportive', focus: 'skill_advancement' };
  } else {
    return { mode: 'warm_encouraging', focus: 'balanced_growth' };
  }
}

function generateNextTopicSuggestions(userContext: any, conversationType: string) {
  const { learningGoal, userLevel } = userContext;
  
  const suggestions = {
    'general': ['Daily routines', 'Hobbies and interests', 'Travel experiences', 'Food and culture'],
    'business': ['Meeting etiquette', 'Email communication', 'Presentations', 'Networking'],
    'ielts': ['Describe a place', 'Compare and contrast', 'Express opinions', 'Future plans'],
    'travel': ['Airport conversations', 'Hotel check-in', 'Asking for directions', 'Restaurant orders']
  };
  
  return suggestions[learningGoal] || suggestions['general'];
}