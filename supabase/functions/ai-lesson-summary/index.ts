import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { conversationHistory, userLevel, lessonTitle, lessonId } = await req.json();

    if (!conversationHistory || conversationHistory.length === 0) {
      throw new Error('Conversation history is required');
    }

    // Extract conversation content for analysis
    const conversationText = conversationHistory
      .map((msg: any) => `${msg.type === 'user' ? 'Student' : 'Razia'}: ${msg.content}`)
      .join('\n');

    // Extract corrections from conversation
    const corrections = conversationHistory
      .filter((msg: any) => msg.corrections && msg.corrections.length > 0)
      .flatMap((msg: any) => msg.corrections);

    console.log('Generating lesson summary for:', lessonTitle);
    console.log('User level:', userLevel);
    console.log('Conversation length:', conversationHistory.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Razia, a warm Arabic-speaking English teacher creating lesson summaries for students. 
            
            Create a friendly, encouraging lesson summary based on the conversation. Focus on:
            1. What the student achieved today
            2. Grammar corrections to remember
            3. New vocabulary learned
            4. Cultural moments or insights
            5. Specific practice guidance
            
            Keep the tone warm, encouraging, and culturally sensitive. Use some Arabic phrases where appropriate.
            Be specific about what the student learned and practiced.`
          },
          {
            role: 'user',
            content: `Create a lesson summary for this conversation:

Lesson: ${lessonTitle}
Student Level: ${userLevel}
Conversation:
${conversationText}

Generate a friendly summary in this format:

**📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - ${lessonTitle}**

**🎯 What you achieved today:**
• [Achievement 1]
• [Achievement 2] 
• [Achievement 3]

**📝 Corrections to remember:**
• You said: "[mistake]" → Try: "[correction]"
• [Add more as needed]

**📚 New words you learned:**
• **[Word]** - [Definition]
• [Add more as needed]

**🌍 Cultural moment:**
[Any cultural insights or Arabic-English connections discussed]

**💪 Keep practicing:**
[Specific practice guidance for this student]

Use encouraging, warm tone. Keep it simple and actionable. Include "mashallah" or "habibi" where natural.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate lesson summary');
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    console.log('Generated lesson summary successfully');

    // Extract structured data from the conversation for vocabulary and corrections
    const vocabulary = await extractVocabulary(conversationText, userLevel);
    const structuredCorrections = await extractCorrections(corrections);
    const achievements = await extractAchievements(conversationText, userLevel);
    const culturalMoments = await extractCulturalMoments(conversationText);
    
    // Generate Arabic explanations for 12-year-olds
    const arabicExplanation = await generateArabicExplanation(conversationText, lessonTitle, userLevel);
    const practiceGuidanceArabic = await generateArabicPracticeGuidance(lessonTitle, userLevel);

    return new Response(JSON.stringify({
      summary,
      vocabulary,
      corrections: structuredCorrections,
      achievements,
      culturalMoments,
      practiceGuidance: `Continue practicing ${lessonTitle.toLowerCase()} conversations. Focus on using the new vocabulary words in daily situations. Remember to practice the corrected grammar patterns!`,
      arabicExplanation,
      practiceGuidanceArabic
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-lesson-summary function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      summary: `**📅 ${new Date().toLocaleDateString()} - Lesson Complete**\n\n**🎯 Great work today!**\nYou practiced English conversation with dedication. Keep up the excellent progress, habibi!\n\n**💪 Keep practicing:**\nContinue having conversations and don't worry about mistakes - they help you learn!`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function extractVocabulary(conversationText: string, userLevel: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Extract new vocabulary words that a student at this level likely learned from this conversation. Include Arabic translations to help Arabic speakers understand better.'
          },
          {
            role: 'user',
            content: `Level: ${userLevel}\nConversation: ${conversationText}\n\nExtract 3-5 key vocabulary words in JSON format: [{"term": "word", "definition": "simple definition", "pronunciation": "phonetic", "exampleSentence": "example", "arabicTranslation": "الترجمة العربية", "arabicExample": "مثال بالعربية"}]`
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      try {
        return JSON.parse(data.choices[0].message.content);
      } catch {
        return [];
      }
    }
    return [];
  } catch {
    return [];
  }
}

async function generateArabicExplanation(conversationText: string, lessonTitle: string, userLevel: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are explaining English lessons to a 12-year-old Arabic speaker. Use simple, clear Arabic that a child would understand. Be encouraging and use child-friendly examples from daily life.`
          },
          {
            role: 'user',
            content: `Explain this English lesson "${lessonTitle}" and what was practiced in this conversation in Arabic, as if talking to a 12-year-old child. Make it fun and relatable:

Conversation: ${conversationText}

Write a short, encouraging explanation (max 3-4 sentences) in Arabic that:
1. Explains what they learned in simple terms
2. Connects it to their daily life 
3. Encourages them to keep practicing
4. Uses examples a 12-year-old would understand

Keep it warm, simple, and motivating!`
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0].message.content;
    }
    return "أحسنت! لقد تعلمت اليوم كلمات وجمل جديدة باللغة الإنجليزية. استمر في الممارسة وستصبح أفضل كل يوم!";
  } catch {
    return "أحسنت! لقد تعلمت اليوم كلمات وجمل جديدة باللغة الإنجليزية. استمر في الممارسة وستصبح أفضل كل يوم!";
  }
}

async function generateArabicPracticeGuidance(lessonTitle: string, userLevel: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Give practice advice in Arabic for a 12-year-old learning English. Use simple, encouraging language that a child would understand and find motivating.`
          },
          {
            role: 'user',
            content: `Give practice advice in Arabic for someone learning "${lessonTitle}" at ${userLevel} level. Write as if talking to a 12-year-old child - make it fun, simple, and actionable. Include specific activities they can do at home or with family.

Keep it 2-3 sentences maximum, use encouraging words, and make it feel like a game or fun activity rather than homework.`
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0].message.content;
    }
    return "جرب أن تتحدث باللغة الإنجليزية مع أصدقائك أو عائلتك كل يوم لمدة ١٠ دقائق. اجعلها لعبة ممتعة!";
  } catch {
    return "جرب أن تتحدث باللغة الإنجليزية مع أصدقائك أو عائلتك كل يوم لمدة ١٠ دقائق. اجعلها لعبة ممتعة!";
  }
}

async function extractCorrections(corrections: any[]) {
  if (!corrections || corrections.length === 0) return [];
  
  return corrections.slice(0, 3).map(correction => ({
    original: correction.original || correction.mistake || '',
    corrected: correction.corrected || correction.suggestion || '',
    explanation: correction.explanation || 'Grammar improvement',
    rule: correction.rule || 'Grammar rule'
  }));
}

async function extractAchievements(conversationText: string, userLevel: string) {
  const achievements = [
    'Completed a full conversation in English',
    'Practiced new vocabulary words',
    'Improved pronunciation and fluency'
  ];
  
  if (conversationText.includes('question')) {
    achievements.push('Asked thoughtful questions');
  }
  
  if (userLevel === 'beginner') {
    achievements.push('Built confidence in basic English communication');
  } else if (userLevel === 'intermediate') {
    achievements.push('Developed more complex sentence structures');
  } else {
    achievements.push('Refined advanced language skills');
  }
  
  return achievements.slice(0, 4);
}

async function extractCulturalMoments(conversationText: string) {
  const culturalKeywords = ['culture', 'arabic', 'libya', 'tradition', 'custom', 'different', 'similar'];
  const hasCulturalContent = culturalKeywords.some(keyword => 
    conversationText.toLowerCase().includes(keyword)
  );
  
  if (hasCulturalContent) {
    return ['Explored cultural differences and similarities between Arabic and English-speaking cultures'];
  }
  
  return ['Practice makes perfect - every conversation brings you closer to fluency, mashallah!'];
}