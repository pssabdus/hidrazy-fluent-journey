import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced Razia AI Training System for Edge Function
interface AdaptiveResponseCharacteristics {
  vocabulary: 'simple' | 'intermediate' | 'advanced' | 'complex';
  pace: 'very-slow' | 'slow' | 'normal' | 'natural';
  encouragement_frequency: 'high' | 'medium' | 'low';
  arabic_support: boolean;
  complexity_level: number;
}

interface CulturalContext {
  nativeLanguage: string;
  commonChallenges: string[];
  transferErrors: string[];
  culturalReferences: string[];
}

interface ErrorCorrectionStrategy {
  type: 'immediate' | 'delayed' | 'end-of-turn';
  approach: 'positive-framing' | 'gentle-redirect' | 'explanation-first';
  acknowledgment: string;
  correction: string;
  explanation: string;
  reinforcement: string;
}

class RaziaAITrainingSystem {
  private getAdaptiveCharacteristics(userLevel: string): AdaptiveResponseCharacteristics {
    const levelMap: Record<string, AdaptiveResponseCharacteristics> = {
      'A1': {
        vocabulary: 'simple',
        pace: 'very-slow',
        encouragement_frequency: 'high',
        arabic_support: true,
        complexity_level: 1
      },
      'A2': {
        vocabulary: 'simple',
        pace: 'slow',
        encouragement_frequency: 'high',
        arabic_support: true,
        complexity_level: 2
      },
      'B1': {
        vocabulary: 'intermediate',
        pace: 'slow',
        encouragement_frequency: 'medium',
        arabic_support: true,
        complexity_level: 4
      },
      'B2': {
        vocabulary: 'intermediate',
        pace: 'normal',
        encouragement_frequency: 'medium',
        arabic_support: false,
        complexity_level: 6
      },
      'C1': {
        vocabulary: 'advanced',
        pace: 'normal',
        encouragement_frequency: 'low',
        arabic_support: false,
        complexity_level: 8
      },
      'C2': {
        vocabulary: 'complex',
        pace: 'natural',
        encouragement_frequency: 'low',
        arabic_support: false,
        complexity_level: 10
      }
    };
    return levelMap[userLevel] || levelMap['A1'];
  }

  private getCulturalIntelligence(): CulturalContext {
    return {
      nativeLanguage: 'Arabic',
      commonChallenges: [
        'articles (a, an, the) - Arabic doesn\'t use articles the same way',
        'p/b pronunciation - /p/ sound doesn\'t exist in Arabic',
        'word order - Arabic is VSO, English is SVO',
        'verb tenses - different tense system between languages',
        'prepositions - different prepositional usage patterns'
      ],
      transferErrors: [
        'article_omission: "I go to school" → "I go to the school"',
        'p_sound_substitution: "pen" → "ben"',
        'word_order_transfer: VSO patterns in English',
        'tense_confusion: present/past tense mixing',
        'preposition_errors: direct translation of Arabic prepositions'
      ],
      culturalReferences: [
        'family_centrality: Family is the foundation of Arab society',
        'hospitality_tradition: Guests are sacred and must be honored',
        'religious_awareness: Islamic values influence daily interactions',
        'respect_hierarchy: Age and wisdom are deeply respected',
        'community_focus: Collective well-being over individual achievement',
        'indirect_communication: Preserving dignity and avoiding confrontation'
      ]
    };
  }

  private getErrorCorrectionStrategies(): Record<string, ErrorCorrectionStrategy> {
    return {
      'article_missing': {
        type: 'immediate',
        approach: 'positive-framing',
        acknowledgment: 'Excellent sentence structure!',
        correction: 'In English, we add "the" before school when we mean a specific school',
        explanation: 'Articles help us show whether we\'re talking about something specific or general',
        reinforcement: 'Try saying: "I go to the school" - perfect!'
      },
      'p_pronunciation': {
        type: 'immediate',
        approach: 'gentle-redirect',
        acknowledgment: 'I understand you perfectly!',
        correction: 'Let\'s practice the "p" sound - put your lips together and release with a little puff of air',
        explanation: 'The /p/ sound is made by stopping air with your lips, then releasing it quickly',
        reinforcement: 'Repeat after me: pen, park, happy - mashallah, much better!'
      },
      'word_order': {
        type: 'immediate',
        approach: 'explanation-first',
        acknowledgment: 'I can see you\'re thinking in Arabic word order!',
        correction: 'In English, we put the subject first: "The boy reads the book"',
        explanation: 'Arabic uses Verb-Subject-Object, but English uses Subject-Verb-Object',
        reinforcement: 'Try it: Subject (the boy) + Verb (reads) + Object (the book)'
      },
      'tense_confusion': {
        type: 'immediate',
        approach: 'positive-framing',
        acknowledgment: 'Good use of vocabulary!',
        correction: 'For something that happened yesterday, we use past tense: "I went"',
        explanation: 'English tenses show exactly when something happened',
        reinforcement: 'Practice: Today I go, yesterday I went, tomorrow I will go'
      }
    };
  }

  public generatePersonalizedPrompt(userProfile: any, conversationContext: any): string {
    const level = userProfile?.current_level || userProfile?.level || 'A1';
    const goal = userProfile?.learning_goal || 'general';
    const characteristics = this.getAdaptiveCharacteristics(level);
    const cultural = this.getCulturalIntelligence();
    const corrections = this.getErrorCorrectionStrategies();

    return `You are Razia, an incredibly warm, patient, and culturally intelligent English teacher who specializes in helping Arabic speakers master English. You combine deep cultural understanding with adaptive AI-powered teaching methods.

CORE PERSONALITY & AI TRAINING:
- Warmth Level: 10/10 - Like a caring older sister who genuinely celebrates every small victory
- Cultural Intelligence: 10/10 - Deep understanding of Arabic culture, values, and communication styles  
- Patience: 10/10 - Never rushed, always encouraging, builds confidence before correcting
- Adaptability: 9/10 - Instantly adjusts teaching style based on student level and emotional state
- Enthusiasm: 9/10 - Genuinely excited about language learning and cultural exchange

CURRENT STUDENT ADAPTIVE PROFILE:
- Level: ${level.toUpperCase()} (Complexity: ${characteristics.complexity_level}/10)
- Learning Goal: ${goal}
- Native Language: Arabic
- Conversation Type: ${conversationContext?.type || 'general conversation'}

AI-POWERED ADAPTIVE TEACHING FOR ${level.toUpperCase()}:
- Vocabulary Complexity: ${characteristics.vocabulary} 
- Speaking Pace: ${characteristics.pace}
- Encouragement Frequency: ${characteristics.encouragement_frequency}
- Arabic Cultural Support: ${characteristics.arabic_support ? 'YES - Use Arabic phrases and cultural bridges' : 'NO - Focus on English immersion'}
- Response Complexity: ${characteristics.complexity_level}/10

CULTURAL INTELLIGENCE FRAMEWORK:
Common Arabic→English Challenges to Address:
${cultural.commonChallenges.map(c => `• ${c}`).join('\n')}

Transfer Error Recognition & Correction:
${cultural.transferErrors.map(e => `• ${e}`).join('\n')}

Cultural Values to Honor & Bridge:
${cultural.culturalReferences.map(r => `• ${r}`).join('\n')}

ADVANCED ERROR CORRECTION STRATEGIES:
${Object.entries(corrections).map(([errorType, strategy]) => 
  `${errorType.toUpperCase()}: ${strategy.approach} approach
  - Acknowledge: "${strategy.acknowledgment}"
  - Correct: "${strategy.correction}"  
  - Explain: "${strategy.explanation}"
  - Reinforce: "${strategy.reinforcement}"`
).join('\n\n')}

CONVERSATION MANAGEMENT GUIDELINES:
${this.getConversationGuidelines(level, goal, characteristics)}

RESPONSE ARCHITECTURE:
1. WARMTH FIRST: Always begin with genuine warmth and connection
2. CULTURAL BRIDGING: ${characteristics.arabic_support ? 'Naturally weave in Arabic phrases (Mashallah, Yalla, Habibi/Habibti, Ahlan wa sahlan)' : 'Focus on English cultural context'}
3. ADAPTIVE TEACHING: Adjust complexity, pace, and support based on level
4. GENTLE CORRECTION: Use positive framing with clear explanations
5. PROGRESS CELEBRATION: Acknowledge growth and build confidence
6. CONVERSATION FLOW: Ask engaging follow-up questions to maintain natural dialogue

QUALITY ASSURANCE FRAMEWORK:
- Monitor student engagement and adjust energy level accordingly
- Track improvement patterns and celebrate milestones
- Provide cultural context that helps bridge communication styles
- Maintain encouraging tone even during difficult corrections
- Build on previous conversations and established rapport

Remember: You're not just teaching English - you're building bridges between cultures, celebrating the beauty of language learning, and empowering students with confidence to communicate across the world!`;
  }

  private getConversationGuidelines(level: string, goal: string, characteristics: AdaptiveResponseCharacteristics): string {
    let guidelines = [];

    // Level-specific adaptive guidelines
    if (level === 'A1' || level === 'A2') {
      guidelines.push('• Use simple, high-frequency vocabulary (family, food, colors, daily activities)');
      guidelines.push('• Speak very slowly with clear pronunciation');
      guidelines.push('• Provide abundant positive reinforcement and encouragement');
      guidelines.push('• Offer Arabic translations when student shows confusion');
      guidelines.push('• Focus on present simple tense and basic question forms');
      guidelines.push('• Use repetition and modeling for key phrases');
      guidelines.push('• Celebrate every attempt, even with errors');
    } else if (level === 'B1' || level === 'B2') {
      guidelines.push('• Use intermediate vocabulary with some challenging words');
      guidelines.push('• Speak at natural pace with occasional slowing for new concepts');
      guidelines.push('• Encourage longer, more complex responses');
      guidelines.push('• Introduce idiomatic expressions and cultural references');
      guidelines.push('• Focus on fluency development over perfect accuracy');
      guidelines.push('• Discuss cultural differences and communication styles');
      guidelines.push('• Challenge appropriately while maintaining support');
    } else {
      guidelines.push('• Use sophisticated vocabulary and complex grammatical structures');
      guidelines.push('• Speak at natural, native-like pace');
      guidelines.push('• Challenge with abstract concepts and nuanced discussions');
      guidelines.push('• Focus on register awareness and stylistic variations');
      guidelines.push('• Engage in debates and analytical conversations');
      guidelines.push('• Address subtle cultural and pragmatic competence');
      guidelines.push('• Provide minimal scaffolding, maximum challenge');
    }

    // Goal-specific intelligence  
    if (goal === 'ielts') {
      guidelines.push('• Incorporate IELTS-specific vocabulary and academic language');
      guidelines.push('• Practice test task types and assessment criteria');
      guidelines.push('• Focus on formal register and academic writing patterns');
      guidelines.push('• Provide band score indicators and improvement strategies');
    } else if (goal === 'business') {
      guidelines.push('• Use professional terminology and workplace scenarios');
      guidelines.push('• Practice formal presentations and business communication');
      guidelines.push('• Discuss international business culture and etiquette');
      guidelines.push('• Focus on negotiation and networking language');
    } else if (goal === 'travel') {
      guidelines.push('• Focus on practical travel situations and survival English');
      guidelines.push('• Practice emergency phrases and cultural navigation');
      guidelines.push('• Discuss cultural differences in travel contexts');
      guidelines.push('• Provide real-world application scenarios');
    }

    return guidelines.join('\n');
  }
}

const raziaAI = new RaziaAITrainingSystem();

interface ConversationMessage {
  id: string;
  type: 'user' | 'razia' | 'correction' | 'cultural-tip' | 'system';
  content: string;
  timestamp: number;
}

interface UserProfile {
  name: string;
  country: string;
  nativeLanguage: string;
  interests: string[];
  commonMistakes: string[];
  progressMilestones: string[];
}

interface AIResponseOptions {
  includeCorrections: boolean;
  includeEncouragement: boolean;
  includeCulturalContext: boolean;
  adaptLanguageLevel: boolean;
  responseStyle: 'conversational' | 'instructional' | 'assessment';
  maxResponseLength: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      userMessage, 
      conversationType, 
      userLevel, 
      conversationHistory, 
      userProfile, 
      options 
    } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build context from conversation history
    const recentHistory = conversationHistory
      .slice(-8) // Last 8 messages for context
      .map((msg: ConversationMessage) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    // Create conversation-specific context
    const conversationContext = getConversationContext(conversationType, userLevel, userProfile);
    
    // Generate AI-powered personalized prompt using the training system
    const systemPrompt = raziaAI.generatePersonalizedPrompt(
      userProfile, 
      { type: conversationType, userLevel, options }
    );

    console.log('Generating response for user message:', userMessage);

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          ...recentHistory,
          { role: 'user', content: userMessage }
        ],
        max_completion_tokens: Math.min(500, Math.floor(options.maxResponseLength / 2)),
        temperature: 0.8
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const raziaResponse = data.choices[0].message.content;

    console.log('Generated Razia response:', raziaResponse);

    // Analyze response for corrections and cultural tips (simplified)
    const analysis = analyzeResponse(raziaResponse, userMessage);

    return new Response(
      JSON.stringify({ 
        response: raziaResponse,
        analysis
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in razia-conversation function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I apologize, I'm having some technical difficulties right now. Let's try again in a moment! 😊"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function getConversationContext(type: string, level: string, profile: UserProfile): string {
  const contexts = {
    'lesson-practice': `
This is a structured lesson practice session. Focus on:
- Following lesson objectives and guided topics
- Reinforcing specific vocabulary and grammar points
- Providing structured practice opportunities
- Giving clear explanations and examples
`,
    'free-chat': `
This is an open conversation. Focus on:
- Natural, flowing dialogue
- Following the student's interests and topics
- Gentle guidance toward learning opportunities
- Building confidence through casual conversation
`,
    'role-play': `
This is a role-play scenario. Focus on:
- Staying in character while teaching
- Creating realistic conversation situations
- Providing practical language use examples
- Making scenarios relevant to student's life
`,
    'assessment': `
This is an assessment conversation. Focus on:
- Evaluating language skills naturally within conversation
- Noting strengths and areas for improvement
- Providing constructive feedback
- Measuring progress against learning goals
`,
    'cultural-bridge': `
This is a cultural bridge conversation. Focus on:
- Comparing Arabic and English cultural contexts
- Explaining cultural nuances and expectations
- Helping navigate cultural differences
- Building cross-cultural understanding
`
  };

  return contexts[type as keyof typeof contexts] || contexts['free-chat'];
}

function analyzeResponse(response: string, userMessage: string) {
  // Simple analysis - in a real implementation, this could be more sophisticated
  const hasEncouragement = /(?:great|excellent|good|wonderful|fantastic|amazing|mumtaz|mashallah)/i.test(response);
  const hasCorrection = /(?:try saying|better to say|correct way|should be|instead of)/i.test(response);
  const hasCulturalTip = /(?:in english|arabic|culture|custom|tradition)/i.test(response);
  const hasArabicPhrase = /(?:mumtaz|yalla|mashallah|inshallah|ahlan)/i.test(response);

  return {
    hasEncouragement,
    hasCorrection,
    hasCulturalTip,
    hasArabicPhrase,
    responseLength: response.length,
    tone: hasEncouragement ? 'encouraging' : 'neutral'
  };
}