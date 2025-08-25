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

interface UserProfile {
  name: string;
  current_level: string;
  level_description: string;
  learning_goal: string;
  cultural_region: string;
  cultural_notes: string;
  learning_preferences: string;
  confidence_score: number;
  recent_lessons: any[];
  skill_strengths: string[];
  skill_gaps: string[];
  grammar_score: number;
  vocabulary_level: string;
  pronunciation_score: number;
  cultural_competence: number;
  speaking_confidence: number;
  next_level: string;
  advancement_criteria: string[];
  timeline_estimate: string;
  priority_development_areas: string[];
  ielts_current_band?: number;
  ielts_target_band?: number;
  test_date?: string;
  ielts_weak_areas?: string[];
  industry?: string;
  job_level?: string;
  business_objectives?: string[];
}

const generateMasterTeachingPrompt = (userProfile: UserProfile, lessonContext: any, category: string) => {
  return `
You are Razia, an expert English conversation teacher specializing in Arabic speakers. You have PhD-level expertise in:
- CEFR progression standards and optimal sequencing
- Arabic-English linguistic transfer patterns  
- Second language acquisition methodology
- Cultural bridge pedagogy for Arab learners
- Personalized learning optimization

LEARNER PROFILE:
Name: ${userProfile.name}
Current Level: ${userProfile.current_level} (${userProfile.level_description})
Target Goal: ${userProfile.learning_goal}
Cultural Background: ${userProfile.cultural_region} - ${userProfile.cultural_notes}
Learning Style: ${userProfile.learning_preferences}
Confidence Level: ${userProfile.confidence_score}/10

RECENT LEARNING HISTORY (Last 7 lessons):
${userProfile.recent_lessons.map(lesson => `
Date: ${lesson.date}
Focus: ${lesson.focus_area}  
Performance: ${lesson.performance_summary}
Struggles: ${lesson.identified_struggles}
Successes: ${lesson.breakthrough_moments}
Confidence: ${lesson.confidence_rating}/10
Cultural Moments: ${lesson.cultural_interactions}
`).join('\n')}

CURRENT COMPETENCY ANALYSIS:
Strengths: ${userProfile.skill_strengths.join(', ')}
Primary Struggles: ${userProfile.skill_gaps.join(', ')}
Grammar Accuracy: ${userProfile.grammar_score}%
Vocabulary Range: ${userProfile.vocabulary_level}
Pronunciation Clarity: ${userProfile.pronunciation_score}%
Cultural Bridge Ability: ${userProfile.cultural_competence}%
Speaking Confidence: ${userProfile.speaking_confidence}%

PROGRESSION REQUIREMENTS:
Next Level: ${userProfile.next_level}
Requirements for Advancement: ${userProfile.advancement_criteria.join(', ')}
Estimated Timeline: ${userProfile.timeline_estimate}
Priority Skills to Develop: ${userProfile.priority_development_areas.join(', ')}

${category === 'general' ? `
GENERAL ENGLISH FOCUS:
- Prioritize natural communication and confidence building
- Integrate Arab cultural topics and comparisons
- Balance all four skills through meaningful conversation
- Address common Arabic→English interference patterns
- Build systematic progression toward conversational fluency
` : ''}

${category === 'ielts' ? `
IELTS PREPARATION FOCUS:
Current Band Estimate: ${userProfile.ielts_current_band}
Target Band: ${userProfile.ielts_target_band}  
Test Date: ${userProfile.test_date}
Weakest IELTS Skills: ${userProfile.ielts_weak_areas?.join(', ')}

- Focus on academic English and formal register
- Address specific IELTS task requirements and strategies
- Include Arabic cultural examples in writing tasks
- Practice under appropriate time pressure
- Build test-taking confidence alongside language skills
` : ''}

${category === 'business' ? `
BUSINESS ENGLISH FOCUS:
Industry: ${userProfile.industry}
Professional Level: ${userProfile.job_level}
Specific Business Needs: ${userProfile.business_objectives?.join(', ')}

- Develop professional communication skills
- Practice cross-cultural business interactions
- Compare Arab vs Western business practices
- Build confidence in international business contexts  
- Include industry-specific vocabulary and scenarios
` : ''}

CULTURAL INTEGRATION REQUIREMENTS:
- Reference ${userProfile.cultural_region} cultural context when relevant
- Create opportunities to explain Arab traditions in English
- Address cultural differences in communication styles
- Build confidence in cross-cultural interactions
- Maintain cultural pride while developing English fluency

LESSON CONTEXT:
Today's Focus Theme: ${lessonContext.theme || 'General Communication'}
Session Duration: ${lessonContext.duration || '20 minutes'}
Previous Session Outcome: ${lessonContext.previous_outcome || 'First session'}
User's Energy Level: ${lessonContext.energy_level || 'Medium'}
Specific Request: ${lessonContext.user_request || 'None'}

TASK: Based on this comprehensive learner analysis, create today's lesson plan that:
1. Identifies the highest-priority skill development area
2. Explains why this is the optimal next step pedagogically
3. Designs a conversation-based teaching approach
4. Includes 2-3 cultural bridge moments
5. Defines clear success criteria for the lesson
6. Adapts to the learner's confidence level and learning style
7. Prepares them systematically for next-level advancement

Structure your response as a complete, actionable teaching plan with:
- Lesson Overview (2-3 sentences)
- Primary Learning Objective
- Cultural Integration Points (2-3 specific moments)
- Conversation Flow (step-by-step guide)
- Key Vocabulary/Grammar Focus
- Assessment Criteria
- Homework/Follow-up Suggestions

Keep the tone warm, encouraging, and culturally sensitive while maintaining high pedagogical standards.
`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, category = 'general', lesson_context = {}, custom_prompt } = await req.json();

    console.log('Generating AI lesson for user:', user_id, 'category:', category, 'custom:', !!custom_prompt);

    // Fetch comprehensive user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      throw new Error('Failed to fetch user profile');
    }

    // Fetch recent lesson history
    const { data: recentLessons, error: lessonsError } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(7);

    // Fetch learning analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1);

    // Fetch progress tracking
    const { data: progress, error: progressError } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', user_id)
      .single();

    // Build comprehensive user profile
    const userProfile: UserProfile = {
      name: userData.email?.split('@')[0] || 'Student',
      current_level: userData.current_level || 'beginner',
      level_description: getLevelDescription(userData.current_level || 'beginner'),
      learning_goal: userData.learning_goal || 'general',
      cultural_region: userData.country || 'Libya',
      cultural_notes: getCulturalNotes(userData.country || 'Libya'),
      learning_preferences: userData.explanation_preference || 'detailed explanations',
      confidence_score: analytics?.[0]?.confidence_level || 5,
      recent_lessons: recentLessons?.map(lesson => ({
        date: lesson.created_at,
        focus_area: lesson.competency,
        performance_summary: `${lesson.score}/100 score`,
        identified_struggles: lesson.mistakes_json || [],
        breakthrough_moments: lesson.feedback_json?.successes || [],
        confidence_rating: 6,
        cultural_interactions: lesson.feedback_json?.cultural_moments || []
      })) || [],
      skill_strengths: progress?.strength_areas || ['listening comprehension', 'pronunciation'],
      skill_gaps: progress?.weak_areas || ['grammar structures', 'vocabulary range'],
      grammar_score: analytics?.[0]?.grammar_mistakes ? Math.max(0, 100 - (analytics[0].grammar_mistakes * 10)) : 70,
      vocabulary_level: getVocabularyLevel(userData.current_level || 'beginner'),
      pronunciation_score: 75,
      cultural_competence: analytics?.[0]?.cultural_confidence_level || 60,
      speaking_confidence: analytics?.[0]?.confidence_level || 65,
      next_level: getNextLevel(userData.current_level || 'beginner'),
      advancement_criteria: getAdvancementCriteria(userData.current_level || 'beginner'),
      timeline_estimate: getTimelineEstimate(userData.current_level || 'beginner'),
      priority_development_areas: ['conversational fluency', 'cultural communication'],
      ielts_current_band: userData.target_ielts_band ? userData.target_ielts_band - 0.5 : undefined,
      ielts_target_band: userData.target_ielts_band,
      test_date: lesson_context.test_date,
      ielts_weak_areas: ['writing task 2', 'speaking part 3'],
      industry: lesson_context.industry,
      job_level: lesson_context.job_level,
      business_objectives: ['presentations', 'email communication']
    };

    // Use custom prompt if provided, otherwise generate the master teaching prompt
    const finalPrompt = custom_prompt || generateMasterTeachingPrompt(userProfile, lesson_context, category);

    console.log('Using prompt type:', custom_prompt ? 'custom' : 'generated', 'length:', finalPrompt.length);

    // Call OpenAI with the comprehensive prompt
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
            content: 'You are Razia, an expert English teacher for Arabic speakers. Create detailed, culturally-sensitive lesson plans that build confidence and fluency.' 
          },
          { role: 'user', content: finalPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const lessonPlan = data.choices[0].message.content;

    console.log('Generated lesson plan length:', lessonPlan.length);

    // Store the generated lesson
    const { data: storedLesson, error: storeError } = await supabase
      .from('generated_content')
      .insert({
        user_id: user_id,
        content_type: 'ai_lesson',
        title: `AI Lesson - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        description: `Personalized lesson generated for ${userProfile.current_level} level`,
        level: userProfile.current_level,
        content_data: {
          lesson_plan: lessonPlan,
          user_profile_snapshot: userProfile,
          generation_timestamp: new Date().toISOString(),
          category: category,
          lesson_context: lesson_context
        },
        cultural_context: `${userProfile.cultural_region} - Arabic speaker`,
        learning_objectives: userProfile.priority_development_areas
      })
      .select()
      .single();

    if (storeError) {
      console.error('Error storing lesson:', storeError);
    }

    return new Response(JSON.stringify({ 
      lesson_plan: lessonPlan,
      lesson_id: storedLesson?.id,
      user_profile: userProfile,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-lesson-generator function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions
function getLevelDescription(level: string): string {
  const descriptions = {
    'beginner': 'A1-A2: Building foundation skills and basic communication',
    'intermediate': 'B1-B2: Developing conversational fluency and complex expression',
    'advanced': 'C1-C2: Mastering nuanced communication and cultural competence'
  };
  return descriptions[level as keyof typeof descriptions] || 'Learning English systematically';
}

function getCulturalNotes(country: string): string {
  const notes = {
    'Libya': 'Transitional society blending traditional Arab values with modern aspirations',
    'Egypt': 'Rich cultural heritage with diverse linguistic influences from Arabic dialects',
    'Saudi Arabia': 'Traditional Islamic culture with rapid modernization initiatives',
    'UAE': 'Cosmopolitan environment with strong Emirati cultural identity',
    'Jordan': 'Hospitable culture with Palestinian and Bedouin influences'
  };
  return notes[country as keyof typeof notes] || 'Arabic cultural background with rich traditions';
}

function getVocabularyLevel(level: string): string {
  const vocab = {
    'beginner': 'Building core 1000-word vocabulary for daily communication',
    'intermediate': 'Expanding to 3000+ words including idiomatic expressions',
    'advanced': 'Mastering 5000+ words including academic and professional terminology'
  };
  return vocab[level as keyof typeof vocab] || 'Developing essential vocabulary';
}

function getNextLevel(level: string): string {
  const progression = {
    'beginner': 'intermediate',
    'intermediate': 'advanced', 
    'advanced': 'native-like fluency'
  };
  return progression[level as keyof typeof progression] || 'next level';
}

function getAdvancementCriteria(level: string): string[] {
  const criteria = {
    'beginner': ['Complete basic conversation flows', 'Master present/past tense', 'Build confidence in daily topics'],
    'intermediate': ['Handle complex conversations', 'Master conditional structures', 'Express opinions confidently'],
    'advanced': ['Achieve native-like fluency', 'Master cultural nuances', 'Communicate professionally']
  };
  return criteria[level as keyof typeof criteria] || ['Continue practicing regularly'];
}

function getTimelineEstimate(level: string): string {
  const timelines = {
    'beginner': '6-8 months with consistent practice',
    'intermediate': '8-12 months for advanced proficiency',
    'advanced': '12+ months for native-like mastery'
  };
  return timelines[level as keyof typeof timelines] || '6-12 months';
}