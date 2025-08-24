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

    // Get user from auth
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { action, data: requestData } = await req.json();

    console.log(`[CONTENT-RECOMMENDATION] Processing action: ${action} for user: ${user.id}`);

    switch (action) {
      case 'generate_recommendations': {
        // Fetch user data for personalization
        const [userData, analyticsData, progressData, personalizationData] = await Promise.all([
          supabase.from('users').select('*').eq('id', user.id).single(),
          supabase.from('learning_analytics').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(7),
          supabase.from('progress_tracking').select('*').eq('user_id', user.id).single(),
          supabase.from('personalization_data').select('*').eq('user_id', user.id).single()
        ]);

        const recommendations = await generatePersonalizedRecommendations({
          user: userData.data,
          analytics: analyticsData.data,
          progress: progressData.data,
          personalization: personalizationData.data,
          openaiApiKey
        });

        // Store recommendations in database
        const { error: insertError } = await supabase
          .from('content_recommendations')
          .insert(recommendations.map(rec => ({
            user_id: user.id,
            ...rec,
            created_at: new Date().toISOString()
          })));

        if (insertError) throw insertError;

        return new Response(JSON.stringify({ recommendations }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'prioritize_vocabulary': {
        const { current_level, learning_goal, interests } = requestData;
        
        const vocabularyPriorities = await prioritizeVocabulary({
          currentLevel: current_level,
          learningGoal: learning_goal,
          interests: interests,
          openaiApiKey
        });

        return new Response(JSON.stringify(vocabularyPriorities), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'suggest_practice_activities': {
        // Fetch recent performance data
        const { data: recentActivities } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        const { data: weakAreas } = await supabase
          .from('progress_tracking')
          .select('weak_areas')
          .eq('user_id', user.id)
          .single();

        const practiceActivities = await suggestPracticeActivities({
          recentActivities: recentActivities || [],
          weakAreas: weakAreas?.weak_areas || [],
          openaiApiKey
        });

        return new Response(JSON.stringify(practiceActivities), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'optimize_spaced_repetition': {
        // Get current recommendations that need review
        const { data: currentRecommendations } = await supabase
          .from('content_recommendations')
          .select('*')
          .eq('user_id', user.id)
          .lt('next_review_due', new Date().toISOString())
          .order('priority_score', { ascending: false });

        const optimizedSchedule = optimizeSpacedRepetition(currentRecommendations || []);

        // Update the review schedules
        for (const item of optimizedSchedule) {
          await supabase
            .from('content_recommendations')
            .update({
              next_review_due: item.next_review_due,
              spaced_repetition_interval: item.interval
            })
            .eq('id', item.id);
        }

        return new Response(JSON.stringify({ optimized_schedule: optimizedSchedule }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'cultural_content_suggestions': {
        const { data: userProfile } = await supabase
          .from('users')
          .select('country, learning_goal, current_level')
          .eq('id', user.id)
          .single();

        const culturalContent = await generateCulturalContent({
          country: userProfile?.country || 'Libya',
          learningGoal: userProfile?.learning_goal,
          currentLevel: userProfile?.current_level,
          openaiApiKey
        });

        return new Response(JSON.stringify(culturalContent), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('[CONTENT-RECOMMENDATION] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Main recommendation generation function
async function generatePersonalizedRecommendations({ user, analytics, progress, personalization, openaiApiKey }: any) {
  const prompt = createRecommendationPrompt(user, analytics, progress, personalization);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        {
          role: 'system',
          content: `You are an advanced English learning recommendation engine for Arabic speakers. 
          Generate personalized learning recommendations based on user data.
          Return recommendations as a JSON array with the following structure:
          {
            "recommendation_type": "lesson|vocabulary|practice|conversation_topic|cultural_content",
            "priority_score": 0.0-1.0,
            "content_title": "string",
            "content_description": "string",
            "difficulty_level": "A1|A2|B1|B2|C1|C2",
            "estimated_duration_minutes": number,
            "recommendation_reasoning": {
              "learning_gaps": ["array of gaps"],
              "user_interests": ["array of interests"],
              "optimal_timing": "reason for timing"
            },
            "cultural_relevance_score": 0.0-1.0,
            "user_interest_alignment": 0.0-1.0,
            "predicted_engagement": 0.0-1.0,
            "predicted_success_rate": 0.0-1.0,
            "learning_objectives": ["array of objectives"]
          }`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: 2000,
      temperature: 0.7
    })
  });

  const aiResponse = await response.json();
  const recommendationsText = aiResponse.choices[0].message.content;
  
  try {
    const recommendations = JSON.parse(recommendationsText);
    return Array.isArray(recommendations) ? recommendations : [recommendations];
  } catch (parseError) {
    console.error('Failed to parse AI recommendations:', parseError);
    return generateFallbackRecommendations(user, progress);
  }
}

function createRecommendationPrompt(user: any, analytics: any, progress: any, personalization: any) {
  return `
Generate 5-7 personalized learning recommendations for this Arabic-speaking English learner:

USER PROFILE:
- Current Level: ${user?.current_level || 'beginner'}
- Learning Goal: ${user?.learning_goal || 'general'}
- Country: ${user?.country || 'Libya'}
- Target IELTS Band: ${user?.target_ielts_band || 'N/A'}

RECENT ANALYTICS (Last 7 days):
${analytics?.map((a: any, i: number) => `
Day ${i + 1}: 
- Study Duration: ${a.study_duration_minutes || 0} minutes
- Engagement Score: ${a.engagement_score || 0.5}
- Mistakes: Grammar(${a.grammar_mistakes || 0}), Vocabulary(${a.vocabulary_mistakes || 0}), Pronunciation(${a.pronunciation_mistakes || 0})
- Learning Efficiency: ${a.learning_efficiency || 0.5}
- Cultural Confidence: ${a.cultural_confidence_level || 0.5}
`).join('') || 'No recent analytics available'}

PROGRESS DATA:
- Speaking Level: ${progress?.speaking_level || 0.5}
- Listening Level: ${progress?.listening_level || 0.5}
- Grammar Level: ${progress?.grammar_level || 0.5}
- Vocabulary Level: ${progress?.vocabulary_level || 0.5}
- Cultural Competency: ${progress?.cultural_competency || 0.5}
- Weak Areas: ${JSON.stringify(progress?.weak_areas || [])}
- Strength Areas: ${JSON.stringify(progress?.strength_areas || [])}

PERSONALIZATION:
- Learning Style: ${personalization?.preferred_learning_style || 'mixed'}
- Optimal Lesson Length: ${personalization?.optimal_lesson_length_minutes || 15} minutes
- Arabic Proficiency: ${personalization?.arabic_proficiency_level || 'native'}
- AI Personality Preference: ${personalization?.ai_personality_preference || 'warm_encouraging'}
- Correction Style: ${personalization?.correction_style_preference || 'gentle'}

Focus on:
1. Arabic-specific challenges and cultural bridges
2. Addressing identified weak areas
3. Building on strengths
4. Optimal timing and engagement
5. Cultural sensitivity and relevance
6. Progressive difficulty appropriate to current level

Generate recommendations that will maximally benefit this learner's English journey.
  `;
}

// Vocabulary prioritization function
async function prioritizeVocabulary({ currentLevel, learningGoal, interests, openaiApiKey }: any) {
  const prompt = `
Create a prioritized vocabulary list for an Arabic-speaking English learner:

Current Level: ${currentLevel}
Learning Goal: ${learningGoal}
Interests: ${JSON.stringify(interests)}

Generate a JSON response with:
{
  "high_priority": [
    {
      "word": "string",
      "definition": "string",
      "arabic_equivalent": "string",
      "usage_example": "string",
      "cultural_context": "string",
      "frequency_score": 0.0-1.0,
      "difficulty_level": "A1-C2",
      "learning_value": 0.0-1.0
    }
  ],
  "medium_priority": [...],
  "cultural_bridge_words": [...],
  "professional_vocabulary": [...] (if business goal)
}

Focus on:
1. High-frequency words for the level
2. Words that bridge Arabic-English cultural concepts
3. Goal-specific vocabulary (business, IELTS, travel)
4. Words that unlock other learning opportunities
5. Common Arabic-to-English transfer challenges
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are a vocabulary expert for Arabic-speaking English learners.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 1500
    })
  });

  const aiResponse = await response.json();
  try {
    return JSON.parse(aiResponse.choices[0].message.content);
  } catch {
    return generateFallbackVocabulary(currentLevel, learningGoal);
  }
}

// Practice activities suggestion
async function suggestPracticeActivities({ recentActivities, weakAreas, openaiApiKey }: any) {
  const prompt = `
Suggest targeted practice activities based on recent performance:

Recent Activities:
${recentActivities.map((a: any) => `
- ${a.lesson_type}: Score ${a.score}, Mistakes: ${JSON.stringify(a.mistakes_json)}
`).join('')}

Identified Weak Areas: ${JSON.stringify(weakAreas)}

Generate JSON response:
{
  "immediate_practice": [
    {
      "activity_type": "string",
      "title": "string",
      "description": "string",
      "target_skill": "string",
      "difficulty": "string",
      "estimated_time": number,
      "cultural_elements": "string"
    }
  ],
  "reinforcement_activities": [...],
  "challenge_activities": [...]
}

Focus on addressing specific weaknesses while building confidence.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are a practice activity designer for Arabic-speaking English learners.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 1200
    })
  });

  const aiResponse = await response.json();
  try {
    return JSON.parse(aiResponse.choices[0].message.content);
  } catch {
    return generateFallbackActivities(weakAreas);
  }
}

// Cultural content generation
async function generateCulturalContent({ country, learningGoal, currentLevel, openaiApiKey }: any) {
  const prompt = `
Generate culturally relevant English learning content for someone from ${country}:

Learning Goal: ${learningGoal}
Current Level: ${currentLevel}

Generate JSON response:
{
  "cultural_bridge_topics": [
    {
      "topic": "string",
      "english_perspective": "string",
      "arabic_cultural_context": "string",
      "bridge_explanation": "string",
      "conversation_starters": ["array"],
      "vocabulary_focus": ["array"]
    }
  ],
  "cultural_communication_patterns": {
    "directness_differences": "string",
    "politeness_strategies": "string",
    "business_etiquette": "string"
  },
  "practical_scenarios": [...]
}

Focus on bridging cultural understanding while learning English.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are a cultural bridge expert for Arabic-English learning.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 1500
    })
  });

  const aiResponse = await response.json();
  try {
    return JSON.parse(aiResponse.choices[0].message.content);
  } catch {
    return generateFallbackCulturalContent(country);
  }
}

// Spaced repetition optimization
function optimizeSpacedRepetition(recommendations: any[]) {
  return recommendations.map(rec => {
    const timeSinceLastReview = rec.last_reviewed 
      ? (Date.now() - new Date(rec.last_reviewed).getTime()) / (1000 * 60 * 60 * 24)
      : 0;
    
    let newInterval = rec.spaced_repetition_interval || 1;
    
    // Adjust interval based on effectiveness
    if (rec.effectiveness_score > 0.8) {
      newInterval = Math.min(newInterval * 2, 30); // Max 30 days
    } else if (rec.effectiveness_score < 0.5) {
      newInterval = Math.max(newInterval * 0.7, 1); // Min 1 day
    }
    
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
    
    return {
      id: rec.id,
      next_review_due: nextReviewDate.toISOString(),
      interval: newInterval
    };
  });
}

// Fallback functions
function generateFallbackRecommendations(user: any, progress: any) {
  return [
    {
      recommendation_type: 'lesson',
      priority_score: 0.8,
      content_title: 'Arabic-English Cultural Bridge Conversations',
      content_description: 'Practice common conversation topics with cultural context',
      difficulty_level: user?.current_level || 'A2',
      estimated_duration_minutes: 15,
      recommendation_reasoning: {
        learning_gaps: ['cultural_understanding'],
        user_interests: ['conversation'],
        optimal_timing: 'Cultural bridges help with confidence'
      },
      cultural_relevance_score: 0.9,
      user_interest_alignment: 0.7,
      predicted_engagement: 0.8,
      predicted_success_rate: 0.75,
      learning_objectives: ['cultural_competency', 'conversation_skills']
    }
  ];
}

function generateFallbackVocabulary(currentLevel: string, learningGoal: string) {
  return {
    high_priority: [
      {
        word: 'communicate',
        definition: 'to share or exchange information',
        arabic_equivalent: 'يتواصل',
        usage_example: 'We communicate through email',
        cultural_context: 'Used in both formal and informal settings',
        frequency_score: 0.9,
        difficulty_level: 'B1',
        learning_value: 0.85
      }
    ],
    medium_priority: [],
    cultural_bridge_words: [],
    professional_vocabulary: []
  };
}

function generateFallbackActivities(weakAreas: string[]) {
  return {
    immediate_practice: [
      {
        activity_type: 'pronunciation',
        title: 'Arabic-English Sound Bridges',
        description: 'Practice sounds that are challenging for Arabic speakers',
        target_skill: 'pronunciation',
        difficulty: 'beginner',
        estimated_time: 10,
        cultural_elements: 'Focus on sounds not present in Arabic'
      }
    ],
    reinforcement_activities: [],
    challenge_activities: []
  };
}

function generateFallbackCulturalContent(country: string) {
  return {
    cultural_bridge_topics: [
      {
        topic: 'Greeting Customs',
        english_perspective: 'Handshakes and brief greetings',
        arabic_cultural_context: 'Extended greetings and family inquiries',
        bridge_explanation: 'Understanding when to use each approach',
        conversation_starters: ['How are you?', 'Nice to meet you'],
        vocabulary_focus: ['greetings', 'politeness', 'formality']
      }
    ],
    cultural_communication_patterns: {
      directness_differences: 'English tends to be more direct',
      politeness_strategies: 'Please, thank you, excuse me usage',
      business_etiquette: 'Punctuality and brief meetings'
    },
    practical_scenarios: []
  };
}