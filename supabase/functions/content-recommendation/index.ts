import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[CONTENT-RECOMMENDATION] Request received');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error('Invalid authentication');
    }

    const userId = userData.user.id;
    console.log(`[CONTENT-RECOMMENDATION] Generating recommendations for user: ${userId}`);

    // Get user's current progress and preferences
    const [userProfile, progressData, completedLessons, conversationHistory] = await Promise.all([
      supabaseClient.from('users').select('*').eq('id', userId).single(),
      supabaseClient.from('progress_tracking').select('*').eq('user_id', userId).single(),
      supabaseClient.from('lesson_progress').select('*').eq('user_id', userId),
      supabaseClient.from('conversation_history').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10)
    ]);

    const user = userProfile.data;
    const progress = progressData.data;
    const lessons = completedLessons.data || [];
    const conversations = conversationHistory.data || [];

    if (!user) {
      throw new Error('User profile not found');
    }

    console.log(`[CONTENT-RECOMMENDATION] User level: ${user.current_level}, Goal: ${user.learning_goal}`);

    // Generate AI-powered recommendations based on user data
    const recommendations = await generateSmartRecommendations({
      user,
      progress,
      completedLessons: lessons,
      recentConversations: conversations
    });

    // Save recommendations to database
    const savedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        const { data } = await supabaseClient
          .from('content_recommendations')
          .insert({
            user_id: userId,
            content_title: rec.title,
            content_description: rec.description,
            recommendation_type: rec.type,
            difficulty_level: rec.difficulty,
            priority_score: rec.priority,
            estimated_duration_minutes: rec.duration,
            learning_objectives: rec.objectives,
            recommendation_reasoning: rec.reasoning,
            cultural_relevance_score: rec.culturalRelevance
          })
          .select()
          .single();
        
        return data;
      })
    );

    console.log(`[CONTENT-RECOMMENDATION] Generated ${recommendations.length} recommendations`);

    return new Response(JSON.stringify({
      recommendations: savedRecommendations,
      total: recommendations.length,
      userLevel: user.current_level,
      lastUpdated: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[CONTENT-RECOMMENDATION] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

interface UserData {
  user: any;
  progress: any;
  completedLessons: any[];
  recentConversations: any[];
}

async function generateSmartRecommendations(data: UserData) {
  const { user, progress, completedLessons, recentConversations } = data;
  const recommendations = [];

  // Analyze user's weak areas from progress data
  const weakAreas = identifyWeakAreas(progress);
  const completedLessonTypes = new Set(completedLessons.map(l => l.lesson_type));
  const conversationTopics = recentConversations.map(c => c.conversation_topic).filter(Boolean);

  // 1. Skill-based recommendations
  if (weakAreas.includes('speaking') || user.learning_goal === 'conversation') {
    recommendations.push({
      title: 'Daily Conversation Practice',
      description: 'Practice speaking with Razia about everyday topics to build confidence',
      type: 'conversation',
      difficulty: user.current_level,
      priority: 0.9,
      duration: 15,
      objectives: ['improve_fluency', 'build_confidence', 'natural_expression'],
      reasoning: { weak_area: 'speaking', goal_alignment: 'high' },
      culturalRelevance: 0.8
    });
  }

  if (weakAreas.includes('grammar') || weakAreas.includes('writing')) {
    recommendations.push({
      title: 'Grammar Fundamentals',
      description: 'Master essential grammar patterns for clear communication',
      type: 'exercise',
      difficulty: user.current_level,
      priority: 0.8,
      duration: 20,
      objectives: ['grammar_accuracy', 'sentence_structure', 'tense_usage'],
      reasoning: { weak_area: 'grammar', completion_rate: 'low' },
      culturalRelevance: 0.6
    });
  }

  if (weakAreas.includes('listening')) {
    recommendations.push({
      title: 'Listening Comprehension',
      description: 'Improve understanding of natural English conversations',
      type: 'lesson',
      difficulty: user.current_level,
      priority: 0.7,
      duration: 25,
      objectives: ['listening_skills', 'accent_recognition', 'comprehension'],
      reasoning: { weak_area: 'listening', progress_trend: 'slow' },
      culturalRelevance: 0.7
    });
  }

  // 2. Goal-specific recommendations
  if (user.learning_goal === 'ielts_preparation') {
    recommendations.push({
      title: 'IELTS Speaking Mock Test',
      description: 'Practice IELTS speaking tasks with AI assessment',
      type: 'assessment',
      difficulty: 'intermediate',
      priority: 0.95,
      duration: 45,
      objectives: ['ielts_speaking', 'test_strategy', 'band_improvement'],
      reasoning: { goal_alignment: 'perfect', test_preparation: true },
      culturalRelevance: 0.5
    });
  }

  if (user.learning_goal === 'business_english') {
    recommendations.push({
      title: 'Business Meeting Roleplay',
      description: 'Practice professional conversations and presentations',
      type: 'roleplay',
      difficulty: 'intermediate',
      priority: 0.85,
      duration: 30,
      objectives: ['professional_communication', 'meeting_skills', 'presentation'],
      reasoning: { goal_alignment: 'high', career_relevance: true },
      culturalRelevance: 0.6
    });
  }

  // 3. Cultural bridge recommendations for Arabic speakers
  if (recentConversations.some(c => c.cultural_bridge_used === false)) {
    recommendations.push({
      title: 'Cultural Communication Patterns',
      description: 'Learn how communication styles differ between Arabic and English cultures',
      type: 'lesson',
      difficulty: user.current_level,
      priority: 0.6,
      duration: 20,
      objectives: ['cultural_awareness', 'communication_styles', 'social_norms'],
      reasoning: { cultural_gap: true, arabic_speaker: true },
      culturalRelevance: 0.95
    });
  }

  // 4. Progressive difficulty recommendations
  const userLevelNum = getLevelNumber(user.current_level);
  if (userLevelNum < 6) { // Not yet advanced
    recommendations.push({
      title: `${getNextLevel(user.current_level)} Preparation`,
      description: `Get ready for the next level with targeted practice`,
      type: 'lesson',
      difficulty: getNextLevel(user.current_level),
      priority: 0.7,
      duration: 35,
      objectives: ['level_progression', 'skill_advancement', 'confidence_building'],
      reasoning: { level_progression: true, readiness_score: 'high' },
      culturalRelevance: 0.5
    });
  }

  // 5. Personalized topic recommendations based on conversation history
  const suggestedTopics = generateTopicRecommendations(conversationTopics, user.current_level);
  if (suggestedTopics.length > 0) {
    recommendations.push({
      title: `Conversation: ${suggestedTopics[0]}`,
      description: `Explore new vocabulary and expressions about ${suggestedTopics[0].toLowerCase()}`,
      type: 'conversation',
      difficulty: user.current_level,
      priority: 0.6,
      duration: 20,
      objectives: ['vocabulary_expansion', 'topic_fluency', 'natural_conversation'],
      reasoning: { topic_variety: true, interest_based: true },
      culturalRelevance: 0.7
    });
  }

  // Sort by priority and return top recommendations
  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6);
}

function identifyWeakAreas(progress: any): string[] {
  if (!progress) return ['speaking', 'listening']; // Default weak areas

  const skills = {
    speaking: progress.speaking_level || 0,
    listening: progress.listening_level || 0,
    reading: progress.reading_level || 0,
    writing: progress.writing_level || 0,
    grammar: progress.grammar_level || 0,
    vocabulary: progress.vocabulary_level || 0,
    pronunciation: progress.pronunciation_level || 0
  };

  const averageLevel = Object.values(skills).reduce((sum, level) => sum + level, 0) / Object.values(skills).length;
  
  return Object.entries(skills)
    .filter(([skill, level]) => level < averageLevel * 0.8) // 20% below average
    .map(([skill]) => skill);
}

function getLevelNumber(level: string): number {
  const levels = { 'beginner': 1, 'elementary': 2, 'intermediate': 3, 'upper-intermediate': 4, 'advanced': 5, 'proficient': 6 };
  return levels[level] || 1;
}

function getNextLevel(currentLevel: string): string {
  const progression = {
    'beginner': 'elementary',
    'elementary': 'intermediate', 
    'intermediate': 'upper-intermediate',
    'upper-intermediate': 'advanced',
    'advanced': 'proficient',
    'proficient': 'proficient'
  };
  return progression[currentLevel] || 'intermediate';
}

function generateTopicRecommendations(recentTopics: string[], level: string): string[] {
  const topicsByLevel = {
    beginner: ['Family', 'Food', 'Hobbies', 'Daily Routine', 'Weather'],
    elementary: ['Travel', 'Shopping', 'Health', 'Technology', 'Education'],
    intermediate: ['Career', 'Environment', 'Culture', 'Current Events', 'Relationships'],
    advanced: ['Philosophy', 'Economics', 'Politics', 'Science', 'Global Issues']
  };

  const availableTopics = topicsByLevel[level] || topicsByLevel.intermediate;
  const usedTopics = new Set(recentTopics);
  
  return availableTopics.filter(topic => !usedTopics.has(topic));
}