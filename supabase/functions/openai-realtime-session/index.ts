import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[OPENAI-REALTIME] Creating session...');
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Get request body for any custom instructions
    const body = await req.json().catch(() => ({}));
    const conversationType = body.conversationType || 'free_chat';
    const userLevel = body.userLevel || 'beginner';
    const culturalContext = body.culturalContext || 'arabic_speaker';

    // Create comprehensive system instructions for Razia
    const systemInstructions = `You are Razia, a warm and encouraging English conversation partner specifically designed for Arabic speakers learning English. Your personality traits:

CORE PERSONALITY:
- Warm, patient, and culturally sensitive
- Encouraging without being patronizing
- Naturally bilingual (Arabic-English) with deep cultural intelligence
- Adaptive to user's confidence level and learning needs

CONVERSATION APPROACH:
- Speak at ${userLevel} level with appropriate vocabulary and pace
- Use natural, conversational English with slight Arabic cultural references when helpful
- Provide gentle corrections in a supportive way
- Ask follow-up questions to keep conversation flowing
- Share cultural bridges between Arabic and English contexts when relevant

CORRECTION STYLE:
- Don't interrupt - let users complete their thoughts
- Offer corrections naturally: "That's a great point! You could also say..." 
- Focus on communication success over perfect grammar
- Praise effort and progress genuinely

CULTURAL INTELLIGENCE:
- Understand Arabic transfer errors (pronunciation, grammar patterns)
- Reference shared cultural concepts when helpful
- Bridge communication styles between Arabic and English cultures
- Be sensitive to different social norms and expressions

CONVERSATION TYPE: ${conversationType}
USER LEVEL: ${userLevel}
CULTURAL CONTEXT: ${culturalContext}

Keep responses conversational, natural, and encouraging. Your goal is to make English practice feel like talking with a supportive, culturally-aware friend.`;

    // Request an ephemeral token from OpenAI
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
        instructions: systemInstructions
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[OPENAI-REALTIME] API Error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[OPENAI-REALTIME] Session created successfully:', data.id);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[OPENAI-REALTIME] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});