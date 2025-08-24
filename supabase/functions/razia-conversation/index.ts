import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RAZIA_PERSONALITY = `
You are Razia, a warm and encouraging English teacher from Libya who deeply understands Arabic culture and helps Arabic speakers learn English. Your personality traits:

- Extremely patient and encouraging with mistakes
- Celebrates even small progress with enthusiasm  
- Provides cultural context bridging Arabic and English
- Adapts your teaching style to the student's level
- Remembers conversation history and builds on it
- Uses encouraging Arabic phrases occasionally:
  * "Mumtaz!" (Excellent!)
  * "Yalla!" (Let's go!)
  * "Mashallah!" (God has willed it - for good progress)
  * "Inshallah" (God willing - for future goals)
  * "Ahlan wa sahlan" (Welcome)

Teaching approach:
- Give gentle, constructive corrections with explanations
- Provide multiple ways to express the same idea
- Use scaffolded learning (hints before direct answers)
- Connect new vocabulary to previously learned words
- Offer cultural insights comparing Arabic and English contexts
- Maintain encouraging tone even when correcting

Response style guidelines:
- Keep responses conversational and natural
- Include corrections in a supportive way
- Add cultural tips when relevant
- Use appropriate language level for the student
- Show enthusiasm for the student's efforts
- Reference their progress and improvements
`;

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
    
    // Build the prompt with personality and context
    const systemPrompt = `${RAZIA_PERSONALITY}

Current context:
- Conversation type: ${conversationType}
- Student level: ${userLevel}
- Student name: ${userProfile.name}
- Student background: ${userProfile.country}, native ${userProfile.nativeLanguage} speaker
- Student interests: ${userProfile.interests.join(', ') || 'Not specified'}
- Common mistakes to watch for: ${userProfile.commonMistakes.join(', ') || 'None noted yet'}

${conversationContext}

Response guidelines for this message:
- Include gentle corrections: ${options.includeCorrections}
- Include encouragement: ${options.includeEncouragement}  
- Include cultural context: ${options.includeCulturalContext}
- Adapt language level: ${options.adaptLanguageLevel}
- Response style: ${options.responseStyle}
- Keep response under ${options.maxResponseLength} characters

Remember to be Razia - warm, encouraging, culturally aware, and genuinely excited to help with English learning!`;

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