import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RAZIA_PERSONALITY = `You are Razia, a warm and encouraging English teacher from Libya who specializes in teaching English to Arabic speakers. You have a friendly, patient personality and always provide constructive feedback.

Key traits:
- Warm, encouraging, and supportive
- Expert in English grammar and pronunciation
- Understands Arabic language and culture
- Provides gentle corrections with explanations
- Celebrates student progress
- Uses contextual examples
- Adapts teaching style to student level
- Incorporates cultural insights when relevant

When responding:
1. Stay in character as Razia
2. Be encouraging and positive
3. Provide corrections gently with explanations
4. Use appropriate difficulty level for the student
5. Include cultural context when helpful
6. End with a question or prompt to continue conversation`;

interface ConversationMessage {
  id: string;
  type: 'razia' | 'user' | 'system';
  content: string;
  timestamp: number;
}

interface LessonContext {
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userMessage, lessonType, lessonContext, conversationHistory } = await req.json();

    if (!userMessage) {
      throw new Error('User message is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating Razia response for:', userMessage.substring(0, 50) + '...');

    // Build conversation context
    const contextualPrompt = `${RAZIA_PERSONALITY}

Current lesson: ${lessonContext.title} (${lessonType})
Student level: ${lessonContext.difficulty}
Lesson progress: ${lessonContext.progress}%

Recent conversation:
${conversationHistory.map((msg: ConversationMessage) => 
  `${msg.type === 'user' ? 'Student' : 'Razia'}: ${msg.content}`
).join('\n')}

Student just said: "${userMessage}"

Respond as Razia. Provide:
1. A natural, encouraging response
2. Any grammar corrections needed (be gentle)
3. Vocabulary help if appropriate
4. A follow-up question to continue the conversation

If there are corrections, format them as an array in your response.`;

    // Generate response with GPT
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: contextualPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
        functions: [
          {
            name: 'respond_as_razia',
            description: 'Respond as Razia with corrections if needed',
            parameters: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Razia\'s response message'
                },
                corrections: {
                  type: 'array',
                  description: 'Grammar or vocabulary corrections',
                  items: {
                    type: 'object',
                    properties: {
                      original: { type: 'string' },
                      suggestion: { type: 'string' },
                      explanation: { type: 'string' }
                    }
                  }
                },
                emotion: {
                  type: 'string',
                  enum: ['neutral', 'encouraging', 'thinking', 'excited', 'corrective'],
                  description: 'Emotional tone for voice synthesis'
                }
              },
              required: ['message']
            }
          }
        ],
        function_call: { name: 'respond_as_razia' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    let raziaResponse;
    if (data.choices[0].function_call) {
      raziaResponse = JSON.parse(data.choices[0].function_call.arguments);
    } else {
      // Fallback if function calling doesn't work
      raziaResponse = {
        message: data.choices[0].message.content,
        emotion: 'encouraging'
      };
    }

    console.log('Generated Razia response:', raziaResponse.message.substring(0, 50) + '...');

    return new Response(
      JSON.stringify(raziaResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in razia-conversation function:', error);
    return new Response(
      JSON.stringify({ 
        message: "I'm sorry, I'm having trouble understanding right now. Could you please try again?",
        emotion: 'neutral'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});