import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[TTS] Processing text-to-speech request...');
    
    const { text, voice, model, messageType, userPreferences } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    // Smart TTS decision logic - Only use TTS when it adds real value
    const shouldUseTTS = (messageType: string, content: string, prefs?: any) => {
      // Always TTS for these high-value cases
      const alwaysTTS = [
        'new_vocabulary_word', 'pronunciation_correction', 'cultural_phrase',
        'grammar_example', 'ielts_speaking_practice'
      ];
      
      // Never TTS for these (saves money)
      const neverTTS = [
        'simple_acknowledgment', 'repeat_response', 'system_message', 'error_message'
      ];
      
      if (alwaysTTS.includes(messageType)) {
        console.log('[COST-OPTIMIZATION] Using TTS for high-value case:', messageType);
        return true;
      }
      
      if (neverTTS.includes(messageType)) {
        console.log('[COST-OPTIMIZATION] Skipping TTS for low-value case:', messageType);
        return false;
      }
      
      // For main responses: only if user explicitly requests audio
      const shouldUse = prefs?.autoTTS === true || prefs?.onDemandTTS === true;
      console.log('[COST-OPTIMIZATION] TTS decision for main response:', shouldUse);
      return shouldUse;
    };

    if (!shouldUseTTS(messageType || 'main_response', text, userPreferences)) {
      console.log('[COST-OPTIMIZATION] TTS skipped for cost optimization');
      return new Response(
        JSON.stringify({ 
          audioContent: null,
          audioUrl: null,
          skipped: true,
          reason: 'Cost optimization - use 🔊 button for on-demand audio'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Generate speech from text using OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'tts-1',
        input: text,
        voice: voice || 'alloy',
        response_format: 'mp3',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[TTS] OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status} - ${error}`)
    }

    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer()
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    )

    console.log('[TTS] Audio generated successfully, size:', arrayBuffer.byteLength);

    // Create audio URL from base64
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        audioUrl: audioUrl 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('[TTS] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})