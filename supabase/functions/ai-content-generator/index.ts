import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentRequest {
  user_id: string;
  content_type: 'lesson' | 'conversation' | 'roleplay' | 'ielts' | 'pronunciation' | 'assessment';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  topic?: string;
  cultural_context?: string;
  learning_objectives?: string[];
  duration_minutes?: number;
}

interface GeneratedContent {
  id: string;
  title: string;
  description: string;
  content: any;
  metadata: any;
}

const LEVEL_REQUIREMENTS = {
  A1: {
    vocabulary_size: 500,
    grammar_topics: ['present_simple', 'basic_adjectives', 'numbers', 'basic_questions'],
    skills: ['introduce_yourself', 'basic_greetings', 'express_needs'],
    assessment_criteria: {
      vocabulary_score: 70,
      grammar_score: 70,
      speaking_fluency: 60,
      listening_comprehension: 65
    }
  },
  A2: {
    vocabulary_size: 1000,
    grammar_topics: ['past_simple', 'future_simple', 'comparatives', 'prepositions'],
    skills: ['describe_routine', 'express_preferences', 'make_requests'],
    assessment_criteria: {
      vocabulary_score: 75,
      grammar_score: 75,
      speaking_fluency: 65,
      listening_comprehension: 70
    }
  },
  B1: {
    vocabulary_size: 2000,
    grammar_topics: ['present_perfect', 'conditionals', 'passive_voice', 'reported_speech'],
    skills: ['express_opinions', 'describe_experiences', 'give_advice'],
    assessment_criteria: {
      vocabulary_score: 80,
      grammar_score: 80,
      speaking_fluency: 70,
      listening_comprehension: 75
    }
  },
  B2: {
    vocabulary_size: 4000,
    grammar_topics: ['advanced_conditionals', 'subjunctive', 'complex_tenses', 'discourse_markers'],
    skills: ['argue_persuasively', 'analyze_complex_topics', 'academic_writing'],
    assessment_criteria: {
      vocabulary_score: 85,
      grammar_score: 85,
      speaking_fluency: 80,
      listening_comprehension: 80
    }
  },
  C1: {
    vocabulary_size: 8000,
    grammar_topics: ['advanced_grammar', 'stylistic_variations', 'register_awareness'],
    skills: ['professional_communication', 'academic_discourse', 'nuanced_expression'],
    assessment_criteria: {
      vocabulary_score: 90,
      grammar_score: 90,
      speaking_fluency: 85,
      listening_comprehension: 85
    }
  },
  C2: {
    vocabulary_size: 15000,
    grammar_topics: ['mastery_level', 'idiomatic_expressions', 'cultural_nuances'],
    skills: ['native_like_fluency', 'sophisticated_argumentation', 'creative_expression'],
    assessment_criteria: {
      vocabulary_score: 95,
      grammar_score: 95,
      speaking_fluency: 90,
      listening_comprehension: 90
    }
  }
};

const CONTENT_TEMPLATES = {
  lesson: {
    system_prompt: `You are Razia, a culturally-aware English learning AI specifically designed for Arabic speakers. Create a comprehensive English lesson that bridges Arabic and English cultures.

Guidelines:
- Reference Arabic language patterns where helpful
- Include cultural context that resonates with Arabic speakers
- Use warm, encouraging tone
- Provide clear examples and practice exercises
- Include pronunciation tips specific to Arabic speakers`,
    
    structure: {
      introduction: "Brief overview and learning objectives",
      vocabulary: "Key vocabulary with Arabic cultural context",
      grammar: "Grammar rules with comparisons to Arabic when helpful",
      practice: "Interactive exercises and examples",
      cultural_notes: "Cultural insights for Arabic speakers",
      assessment: "Quick check exercises"
    }
  },

  conversation: {
    system_prompt: `Create natural conversation scenarios for English learners from Arabic-speaking backgrounds. Focus on real-world situations they'll encounter.

Guidelines:
- Use authentic, natural dialogue
- Include cultural nuances and appropriate register
- Provide alternative expressions and responses
- Consider situations relevant to Arabic speakers (travel, business, daily life)`,
    
    structure: {
      scenario: "Setting and context",
      dialogue: "Natural conversation with multiple participants",
      vocabulary_notes: "Key phrases and expressions",
      cultural_tips: "Social and cultural context",
      variations: "Alternative ways to express ideas",
      practice_prompts: "Guided practice suggestions"
    }
  },

  roleplay: {
    system_prompt: `Design immersive role-play scenarios that help Arabic speakers practice English in realistic contexts.

Guidelines:
- Create engaging, relevant scenarios
- Include clear role descriptions and objectives
- Provide language support and phrases
- Consider cultural sensitivities and preferences`,
    
    structure: {
      scenario_setup: "Background and setting",
      roles: "Character descriptions and objectives",
      language_support: "Useful phrases and expressions",
      cultural_context: "Important cultural considerations",
      success_criteria: "How to evaluate performance",
      extensions: "Ways to expand the scenario"
    }
  },

  ielts: {
    system_prompt: `Create IELTS practice materials specifically tailored for Arabic speakers, addressing common challenges and providing targeted strategies.

Guidelines:
- Follow official IELTS format and criteria
- Address specific challenges Arabic speakers face
- Provide clear band descriptors and scoring guidance
- Include sample answers and detailed feedback`,
    
    structure: {
      task_description: "Clear instructions and requirements",
      sample_question: "Authentic IELTS-style question",
      strategy_tips: "Specific tips for Arabic speakers",
      sample_response: "Model answer with analysis",
      assessment_criteria: "How responses are evaluated",
      practice_variations: "Additional practice opportunities"
    }
  },

  pronunciation: {
    system_prompt: `Create pronunciation guides specifically for Arabic speakers learning English, focusing on sounds that don't exist in Arabic.

Guidelines:
- Target sounds difficult for Arabic speakers (/p/, /v/, vowel distinctions)
- Provide clear phonetic descriptions
- Include practice exercises and techniques
- Use minimal pairs and tongue twisters`,
    
    structure: {
      target_sounds: "Specific sounds to practice",
      phonetic_description: "How to produce the sounds",
      common_mistakes: "Typical errors Arabic speakers make",
      practice_exercises: "Drills and activities",
      minimal_pairs: "Words that differ by target sound",
      sentences: "Connected speech practice"
    }
  },

  assessment: {
    system_prompt: `Create comprehensive assessments to evaluate English proficiency for Arabic speakers at specific CEFR levels.

Guidelines:
- Align with CEFR standards and level requirements
- Include multiple skill areas (listening, reading, speaking, writing)
- Provide clear scoring criteria
- Design culturally appropriate content`,
    
    structure: {
      overview: "Assessment description and objectives",
      sections: "Different skill areas being tested",
      questions: "Specific assessment items",
      scoring_criteria: "How responses are evaluated",
      level_indicators: "What performance indicates level mastery",
      feedback_framework: "Structure for providing results"
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[AI-CONTENT-GEN] Request received');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const requestData: ContentRequest = await req.json();
    
    // Validate request
    if (!requestData.content_type || !requestData.level) {
      throw new Error('content_type and level are required');
    }

    console.log(`[AI-CONTENT-GEN] Generating ${requestData.content_type} content for level ${requestData.level}`);

    // Get user's learning history and progress
    const [progressionData, assessmentData, completedContent, learningAnalytics] = await Promise.all([
      // Get user progression
      supabaseClient
        .from('level_progression')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(),
      
      // Get recent assessments
      supabaseClient
        .from('level_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10),
      
      // Get recently completed content
      supabaseClient
        .from('generated_content')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('updated_at', { ascending: false })
        .limit(20),
      
      // Get learning analytics
      supabaseClient
        .from('learning_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(7)
    ]);

    const userProgression = progressionData.data;
    const userAssessments = assessmentData.data || [];
    const userCompletedContent = completedContent.data || [];
    const userAnalytics = learningAnalytics.data || [];

    console.log(`[AI-CONTENT-GEN] Found user history: ${userCompletedContent.length} completed content, ${userAssessments.length} assessments`);

    // Analyze user's strengths and weaknesses
    const weakAreas = [];
    const strongAreas = [];
    const completedTopics = userCompletedContent.map(c => c.topic).filter(Boolean);
    
    // Check assessment performance
    for (const assessment of userAssessments) {
      const passThreshold = LEVEL_REQUIREMENTS[assessment.level]?.assessment_criteria[assessment.assessment_type] || 70;
      if (assessment.score < passThreshold) {
        weakAreas.push(assessment.assessment_type);
      } else if (assessment.score > passThreshold + 15) {
        strongAreas.push(assessment.assessment_type);
      }
    }

    // Get level requirements and content template
    const levelReqs = LEVEL_REQUIREMENTS[requestData.level];
    const template = CONTENT_TEMPLATES[requestData.content_type];

    if (!template) {
      throw new Error(`Unsupported content type: ${requestData.content_type}`);
    }

    // Prepare adaptive OpenAI prompt with user history
    const adaptiveContext = `
USER LEARNING PROFILE:
${userProgression ? `- Current Level: ${userProgression.current_level}
- Completed Levels: ${userProgression.levels_completed?.join(', ') || 'None'}
- Total Learning Time: ${Math.floor((userProgression.total_learning_time || 0) / 60)}h ${(userProgression.total_learning_time || 0) % 60}m
- Study Streak: ${userProgression.streak_days || 0} days` : '- New learner, no progression data yet'}

RECENT PERFORMANCE:
${weakAreas.length > 0 ? `- Needs improvement in: ${weakAreas.join(', ')}` : '- No weak areas identified'}
${strongAreas.length > 0 ? `- Strong areas: ${strongAreas.join(', ')}` : '- Building foundational skills'}

COMPLETED TOPICS: ${completedTopics.length > 0 ? completedTopics.slice(0, 10).join(', ') : 'None yet'}

RECENT LEARNING PATTERNS:
${userAnalytics.length > 0 ? `- Average study time: ${Math.round(userAnalytics.reduce((sum, a) => sum + (a.study_duration_minutes || 0), 0) / userAnalytics.length)} min/day
- Common mistakes: ${userAnalytics[0]?.mistake_patterns ? Object.keys(userAnalytics[0].mistake_patterns).slice(0, 3).join(', ') : 'None identified'}
- Engagement level: ${userAnalytics[0]?.engagement_score ? (userAnalytics[0].engagement_score * 100).toFixed(0) + '%' : 'Not measured'}` : '- No recent learning data available'}`;

    const prompt = `${template.system_prompt}

CONTENT GENERATION REQUEST:
LEVEL: ${requestData.level}
CONTENT TYPE: ${requestData.content_type}
TOPIC: ${requestData.topic || 'General'}
CULTURAL CONTEXT: ${requestData.cultural_context || 'Arabic-speaking learners'}
DURATION: ${requestData.duration_minutes || 15} minutes

LEVEL REQUIREMENTS:
- Vocabulary size: ${levelReqs.vocabulary_size} words
- Grammar topics: ${levelReqs.grammar_topics.join(', ')}
- Key skills: ${levelReqs.skills.join(', ')}

LEARNING OBJECTIVES: ${requestData.learning_objectives?.join(', ') || 'Not specified'}

${adaptiveContext}

PERSONALIZATION INSTRUCTIONS:
1. If weak areas are identified, focus extra attention on those skills
2. Avoid repeating recently completed topics unless for reinforcement
3. Adjust difficulty based on user's current level vs target level
4. If user has strong areas, use those as confidence builders
5. Consider the user's learning patterns and engagement preferences
6. Build upon previously completed content when relevant

CONTENT STRUCTURE:
${Object.entries(template.structure).map(([key, desc]) => `${key}: ${desc}`).join('\n')}

Please generate comprehensive, engaging content following this structure. Make it specifically helpful for Arabic speakers learning English at the ${requestData.level} level.

Return the content as a well-structured JSON object with the following format:
{
  "title": "Engaging title for the content",
  "description": "Brief description of what learners will achieve",
  "level": "${requestData.level}",
  "estimated_duration": ${requestData.duration_minutes || 15},
  "content": {
    // Structure the content according to the template above
  },
  "metadata": {
    "vocabulary_focus": ["list of key vocabulary"],
    "grammar_focus": ["list of grammar points"],
    "cultural_elements": ["cultural aspects covered"],
    "assessment_criteria": {
      "vocabulary": "How vocabulary is assessed",
      "grammar": "How grammar is assessed",
      "fluency": "How fluency is assessed",
      "comprehension": "How comprehension is assessed"
    }
  }
}`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are Razia, an expert English learning AI for Arabic speakers. Generate high-quality educational content in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 3000,
        response_format: { type: "json_object" }
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('[AI-CONTENT-GEN] OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const openaiData = await openaiResponse.json();
    const generatedContent = JSON.parse(openaiData.choices[0].message.content);

    console.log('[AI-CONTENT-GEN] Content generated successfully');

    // Store generated content in database
    const { data: contentRecord, error: insertError } = await supabaseClient
      .from('generated_content')
      .insert({
        user_id: user.id,
        content_type: requestData.content_type,
        level: requestData.level,
        title: generatedContent.title,
        description: generatedContent.description,
        content_data: generatedContent,
        topic: requestData.topic,
        cultural_context: requestData.cultural_context,
        learning_objectives: requestData.learning_objectives || [],
        estimated_duration: generatedContent.estimated_duration || requestData.duration_minutes || 15
      })
      .select()
      .single();

    if (insertError) {
      console.error('[AI-CONTENT-GEN] Database insert error:', insertError);
      throw new Error('Failed to save generated content');
    }

    console.log('[AI-CONTENT-GEN] Content saved to database:', contentRecord.id);

    return new Response(
      JSON.stringify({
        success: true,
        content: generatedContent,
        content_id: contentRecord.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[AI-CONTENT-GEN] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});