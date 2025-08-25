import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Complete 12-question stealth assessment flow
const stealthAssessmentFlow = {
  razia_greeting: `Marhaba! I'm Razia, and I'm absolutely thrilled to meet you! 😊

Think of me as your English conversation partner and cultural bridge friend. Before we start our learning adventure together, I'd love to just chat and get to know you better - no pressure, no tests, just a normal conversation between friends!

I'm curious about your story and how I can help you achieve your English goals. Ready to chat?`,
  
  assessment_questions: [
    // A1-A2 Level (Comfort Zone)
    {
      id: 1,
      question: "So, tell me about yourself! What's your name and where are you from?",
      level: "A1-A2",
      hidden_assessment: "Basic vocabulary, present tense, pronunciation, confidence",
      follow_up: "That's wonderful! What do you love most about your region?",
      cultural_bridge: "I'd love to learn more about your area!"
    },
    {
      id: 2,
      question: "What do you enjoy doing in your free time? Any hobbies or interests?",
      level: "A1-A2",
      hidden_assessment: "Hobby vocabulary, present simple usage, sentence complexity",
      follow_up: "How did you get interested in that?",
      cultural_bridge: "Are there any traditional activities you enjoy too?"
    },
    {
      id: 3,
      question: "Can you describe a typical day for you? What time do you usually wake up?",
      level: "A2",
      hidden_assessment: "Daily routine vocabulary, time expressions, sequential language",
      follow_up: "How does your routine change during different seasons?",
      cultural_bridge: "How does your routine change during Ramadan?"
    },
    // A2-B1 Level (Gentle Challenge)
    {
      id: 4,
      question: "Tell me about a happy memory from this past year. What made it special?",
      level: "A2-B1",
      hidden_assessment: "Past tense accuracy, narrative ability, emotional vocabulary",
      follow_up: "What made that moment so meaningful to you?",
      cultural_bridge: "Was this related to any family traditions or celebrations?"
    },
    {
      id: 5,
      question: "What's something about Arab culture that you think English speakers should understand better?",
      level: "B1",
      hidden_assessment: "Cultural vocabulary, explanation skills, complex structures",
      follow_up: "How would you help someone understand that concept?",
      cultural_bridge: "This is exactly what I love helping with - cultural bridges!"
    },
    {
      id: 6,
      question: "If you could visit any English-speaking country, where would you go and why?",
      level: "B1",
      hidden_assessment: "Conditional structures, reasoning ability, future planning",
      follow_up: "What would you want to experience there?",
      cultural_bridge: "How do you think it would be different from home?"
    },
    // B1-B2 Level (Comfortable Stretch)
    {
      id: 7,
      question: "What do you think about social media's impact on how people communicate today?",
      level: "B1-B2",
      hidden_assessment: "Opinion expression, abstract thinking, complex vocabulary",
      follow_up: "Have you noticed any changes in your own communication?",
      cultural_bridge: "Are there differences in how it's used in different cultures?"
    },
    {
      id: 8,
      question: "Describe a challenge in your community and how you think it could be addressed.",
      level: "B2",
      hidden_assessment: "Problem-solution language, advanced vocabulary, analytical thinking",
      follow_up: "What role could individuals play in solving this?",
      cultural_bridge: "Have you seen successful solutions in other places?"
    },
    {
      id: 9,
      question: "How has learning or using English changed your perspective on anything?",
      level: "B2",
      hidden_assessment: "Metacognitive awareness, present perfect, abstract reflection",
      follow_up: "What has surprised you most about this experience?",
      cultural_bridge: "How do you balance maintaining your identity while learning English?"
    },
    // B2+ Level (Advanced Assessment)
    {
      id: 10,
      question: "Can you explain something from your field of work or study to someone unfamiliar with it?",
      level: "B2+",
      hidden_assessment: "Technical vocabulary, explanation skills, register awareness",
      follow_up: "What's the most challenging part about explaining your field?",
      cultural_bridge: "How does your field differ across different countries?"
    },
    {
      id: 11,
      question: "What role do you think technology should play in preserving cultural traditions?",
      level: "B2+",
      hidden_assessment: "Advanced structures, hypothetical thinking, cultural intelligence",
      follow_up: "Can you think of any examples where this has worked well?",
      cultural_bridge: "How has technology affected Arab cultural traditions?"
    },
    {
      id: 12,
      question: "If you were building bridges between Arabic and English-speaking cultures, what would be most important to focus on?",
      level: "B2+",
      hidden_assessment: "Sophisticated vocabulary, cultural competence, visionary thinking",
      follow_up: "What misconceptions would you most want to address?",
      cultural_bridge: "This is exactly what we'll work on together!"
    }
  ]
};

const generateAssessmentAnalysisPrompt = (userResponse: string, questionLevel: string, questionFocus: string) => {
  return `
STEALTH ASSESSMENT ANALYSIS:

Question Level: ${questionLevel}
Assessment Focus: ${questionFocus}
User Response: "${userResponse}"

COMPREHENSIVE ANALYSIS REQUIRED:

LINGUISTIC COMPETENCY:
1. Grammar accuracy (0-100%): Identify specific errors and correct usage
2. Vocabulary range (0-100%): Assess breadth and sophistication of word choice
3. Sentence complexity (0-100%): Simple, compound, complex structure usage
4. Fluency indicators (0-100%): Natural flow vs hesitation patterns

COMMUNICATION EFFECTIVENESS:
5. Task completion (0-100%): How well did they address the question
6. Coherence (0-100%): Logical organization and idea connection
7. Register appropriateness (0-100%): Formal/informal language matching context

CULTURAL COMPETENCE:
8. Cultural bridge ability (0-100%): Comfort explaining cultural concepts
9. Cross-cultural awareness (0-100%): Understanding of cultural differences
10. Identity integration (0-100%): Maintaining Arab identity while using English

ARABIC-SPECIFIC PATTERNS:
11. Identify any Arabic→English transfer errors (word order, articles, etc.)
12. Note cultural references and comfort level with cultural topics
13. Assess pronunciation challenges typical for Arabic speakers

LEARNING PROFILE INDICATORS:
14. Confidence level (1-10): Based on language choices and response length
15. Risk-taking tendency: Willingness to use complex structures
16. Error self-correction ability: Did they catch and fix mistakes?
17. Learning style clues: Visual, analytical, communicative preferences

Provide specific evidence for each assessment and recommend optimal question difficulty for next response.
`;
};

const generateFinalPlacementPrompt = (allResponses: any[], performanceMetrics: any) => {
  return `
COMPREHENSIVE PLACEMENT ANALYSIS:

Complete Conversation Record: ${JSON.stringify(allResponses)}
Response-by-Response Metrics: ${JSON.stringify(performanceMetrics)}

CEFR LEVEL DETERMINATION:
Based on consistent performance across all responses, determine:
1. Overall CEFR level (A1, A2, B1, B2, C1, C2) with confidence percentage
2. Skill-specific levels:
   - Speaking/Interaction: [level]
   - Grammar accuracy: [level] 
   - Vocabulary range: [level]
   - Pronunciation: [level]
   - Cultural competence: [level]

LEARNER PROFILE CREATION:
3. Primary strengths (top 3 areas of competence)
4. Priority development areas (3 most important gaps)
5. Arabic-specific challenges identified
6. Optimal learning approach recommendations
7. Cultural integration opportunities
8. Confidence building priorities

PERSONALIZED LEARNING PATH:
9. Recommended starting focus area
10. Estimated timeline to next level
11. Suggested learning goal based on demonstrated interests
12. Cultural background integration strategy

RAZIA RELATIONSHIP SETUP:
13. Optimal Razia personality adaptation for this learner
14. Cultural sensitivity considerations
15. Motivational approach recommendations
16. Communication style preferences noted

Create a complete learner profile that will guide all future lesson planning and cultural integration.
`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, action, data } = await req.json();
    
    console.log('Stealth assessment action:', action, 'for user:', user_id);

    switch (action) {
      case 'start_assessment':
        return handleStartAssessment(user_id);
      
      case 'analyze_response':
        return handleResponseAnalysis(user_id, data);
      
      case 'complete_assessment':
        return handleCompleteAssessment(user_id, data);
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in stealth-assessment function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleStartAssessment(userId: string) {
  // Create new assessment session
  const { data: assessment, error } = await supabase
    .from('assessments')
    .insert({
      user_id: userId,
      session_id: `stealth_${Date.now()}`,
      status: 'in_progress',
      assessment_data_json: {
        type: 'stealth_conversation',
        questions: stealthAssessmentFlow.assessment_questions,
        responses: [],
        current_question: 0
      }
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(JSON.stringify({
    success: true,
    assessment_id: assessment.id,
    greeting: stealthAssessmentFlow.razia_greeting,
    first_question: stealthAssessmentFlow.assessment_questions[0]
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleResponseAnalysis(userId: string, responseData: any) {
  const { assessment_id, user_response, question_id } = responseData;
  
  // Get current assessment
  const { data: assessment, error: fetchError } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', assessment_id)
    .single();

  if (fetchError) throw fetchError;

  const currentQuestion = stealthAssessmentFlow.assessment_questions.find(q => q.id === question_id);
  if (!currentQuestion) throw new Error('Question not found');

  // Generate AI analysis
  const analysisPrompt = generateAssessmentAnalysisPrompt(
    user_response,
    currentQuestion.level,
    currentQuestion.hidden_assessment
  );

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert language assessment specialist for Arabic speakers learning English. Provide detailed, objective analysis.' 
        },
        { role: 'user', content: analysisPrompt }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    }),
  });

  const aiData = await response.json();
  const analysis = aiData.choices[0].message.content;

  // Update assessment with response and analysis
  const updatedData = {
    ...assessment.assessment_data_json,
    responses: [
      ...assessment.assessment_data_json.responses,
      {
        question_id,
        user_response,
        analysis,
        timestamp: new Date().toISOString()
      }
    ],
    current_question: assessment.assessment_data_json.current_question + 1
  };

  await supabase
    .from('assessments')
    .update({
      assessment_data_json: updatedData,
      questions_answered: updatedData.responses.length
    })
    .eq('id', assessment_id);

  // Determine next question or completion
  const nextQuestionIndex = updatedData.current_question;
  const isComplete = nextQuestionIndex >= stealthAssessmentFlow.assessment_questions.length;

  if (isComplete) {
    return new Response(JSON.stringify({
      success: true,
      completed: true,
      message: "Thank you for that wonderful conversation! Let me analyze your English journey..."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const nextQuestion = stealthAssessmentFlow.assessment_questions[nextQuestionIndex];
  
  return new Response(JSON.stringify({
    success: true,
    completed: false,
    next_question: nextQuestion,
    razia_response: generateRaziaResponse(analysis, user_response)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleCompleteAssessment(userId: string, completionData: any) {
  const { assessment_id } = completionData;
  
  // Get final assessment data
  const { data: assessment, error: fetchError } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', assessment_id)
    .single();

  if (fetchError) throw fetchError;

  // Generate final placement analysis
  const placementPrompt = generateFinalPlacementPrompt(
    assessment.assessment_data_json.responses,
    { total_questions: assessment.questions_answered }
  );

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert CEFR placement specialist. Provide comprehensive learner analysis and placement recommendation.' 
        },
        { role: 'user', content: placementPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.2,
    }),
  });

  const aiData = await response.json();
  const finalAnalysis = aiData.choices[0].message.content;

  // Extract level and competencies from analysis (simplified - would need more sophisticated parsing)
  const levelMatch = finalAnalysis.match(/Overall CEFR level: ([A-C][1-2])/i);
  const determinedLevel = levelMatch ? levelMatch[1].toLowerCase() : 'a2';

  // Update assessment as completed
  await supabase
    .from('assessments')
    .update({
      status: 'completed',
      final_level: determinedLevel,
      completed_at: new Date().toISOString(),
      assessment_data_json: {
        ...assessment.assessment_data_json,
        final_analysis: finalAnalysis,
        placement_result: determinedLevel
      }
    })
    .eq('id', assessment_id);

  // Update user profile with assessment results
  await supabase
    .from('users')
    .update({
      current_level: determinedLevel,
      assessment_completed: true,
      onboarding_completed: true
    })
    .eq('id', userId);

  // Create initial progress tracking record
  await supabase
    .from('progress_tracking')
    .upsert({
      user_id: userId,
      overall_proficiency: getScoreFromLevel(determinedLevel),
      last_assessment_date: new Date().toISOString().split('T')[0],
      next_assessment_due: getNextAssessmentDate()
    });

  return new Response(JSON.stringify({
    success: true,
    final_level: determinedLevel,
    analysis: finalAnalysis,
    welcome_message: generateWelcomeMessage(determinedLevel, finalAnalysis)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function generateRaziaResponse(analysis: string, userResponse: string): string {
  // Generate natural Razia responses based on analysis
  const responses = [
    "That's wonderful! I can see you have a great connection to your culture.",
    "Mashallah! Your English is really coming along nicely.",
    "I love hearing about your experiences - it helps me understand how to help you better.",
    "That's exactly the kind of sharing that builds strong cultural bridges!",
    "Your perspective is so valuable - this is what makes conversations interesting!"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateWelcomeMessage(level: string, analysis: string): string {
  return `
You know what, habibi? I've really enjoyed getting to know you! 😊

Based on our wonderful conversation, I can see you're at a solid ${level.toUpperCase()} level 
with some really impressive strengths. Your ability to share your thoughts and cultural 
perspectives really impressed me, mashallah!

I also noticed some areas where we can work together to build even more confidence - 
but don't worry, every Arabic speaker I work with has similar patterns, and we'll 
make great progress together!

Here's what I'm thinking for your personalized English journey:
✨ Focus on building conversational confidence
✨ Practice cultural bridge conversations  
✨ Strengthen grammar in natural contexts

The best part? All of this will happen through natural conversations like we just had. 
Ready to start this adventure together? 🚀
`;
}

function getScoreFromLevel(level: string): number {
  const levelScores = {
    'a1': 20,
    'a2': 40, 
    'b1': 60,
    'b2': 80,
    'c1': 90,
    'c2': 95
  };
  return levelScores[level as keyof typeof levelScores] || 40;
}

function getNextAssessmentDate(): string {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 30); // 30 days from now
  return nextDate.toISOString().split('T')[0];
}