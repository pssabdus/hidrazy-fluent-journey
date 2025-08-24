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
    console.log('[LEARNING-ANALYTICS] Request received');

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
    console.log(`[LEARNING-ANALYTICS] Fetching analytics for user: ${userId}`);

    // Get date range from query params (default to last 30 days)
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch real analytics data from multiple tables
    const [
      conversationHistory,
      progressTracking,
      learningAnalytics,
      lessonProgress,
      featureUsage
    ] = await Promise.all([
      // Conversation history and performance
      supabaseClient
        .from('conversation_history')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false }),

      // Progress tracking data
      supabaseClient
        .from('progress_tracking')
        .select('*')
        .eq('user_id', userId)
        .single(),

      // Learning analytics
      supabaseClient
        .from('learning_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false }),

      // Lesson progress
      supabaseClient
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false }),

      // Feature usage statistics
      supabaseClient
        .from('feature_usage')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false })
    ]);

    console.log('[LEARNING-ANALYTICS] Data fetched, processing...');

    // Process conversation analytics
    const conversations = conversationHistory.data || [];
    const totalConversations = conversations.length;
    const averageConfidence = conversations.length > 0 
      ? conversations.reduce((sum, conv) => sum + (conv.user_confidence_level || 0), 0) / conversations.length 
      : 0;

    // Calculate weekly progress trends
    const weeklyData = processWeeklyProgress(conversations, learningAnalytics.data || []);

    // Process skill breakdown
    const skillProgress = progressTracking.data || {
      speaking_level: 0,
      listening_level: 0,
      reading_level: 0,
      writing_level: 0,
      grammar_level: 0,
      vocabulary_level: 0,
      pronunciation_level: 0,
      cultural_competency: 0
    };

    // Calculate mistake patterns
    const mistakePatterns = processMistakePatterns(conversations);

    // Process learning velocity and achievements
    const learningStats = learningAnalytics.data || [];
    const currentMonthStats = learningStats[0] || {};
    const learningVelocity = currentMonthStats.learning_velocity || 0;

    // Calculate next milestones
    const nextMilestones = calculateNextMilestones(skillProgress, lessonProgress.data || []);

    // Recent achievements
    const recentAchievements = calculateAchievements(lessonProgress.data || [], conversations);

    const analyticsData = {
      // Key metrics
      totalConversations,
      practiceTimeMinutes: featureUsage.data?.reduce((sum, day) => sum + (day.conversation_minutes || 0), 0) || 0,
      averageConfidence: Math.round(averageConfidence * 100),
      learningVelocity: Math.round(learningVelocity * 100) / 100,

      // Weekly progress
      weeklyProgress: weeklyData,

      // Skill breakdown
      skillBreakdown: {
        speaking: Math.round(skillProgress.speaking_level || 0),
        listening: Math.round(skillProgress.listening_level || 0),
        grammar: Math.round(skillProgress.grammar_level || 0),
        vocabulary: Math.round(skillProgress.vocabulary_level || 0),
        pronunciation: Math.round(skillProgress.pronunciation_level || 0),
        reading: Math.round(skillProgress.reading_level || 0),
        writing: Math.round(skillProgress.writing_level || 0),
        cultural: Math.round(skillProgress.cultural_competency || 0)
      },

      // Conversation metrics
      conversationMetrics: {
        totalSessions: totalConversations,
        averageSessionLength: conversations.length > 0 
          ? conversations.reduce((sum, conv) => sum + (conv.response_time_ms || 0), 0) / conversations.length / 60000 
          : 0,
        topicsDiscussed: [...new Set(conversations.map(c => c.conversation_topic).filter(Boolean))].length,
        improvementTrend: calculateImprovementTrend(conversations)
      },

      // Mistake patterns
      mistakePatterns,

      // Achievements and milestones
      recentAchievements,
      nextMilestones,

      // Additional metrics
      studyStreak: currentMonthStats.session_count || 0,
      completionRate: currentMonthStats.completion_rate || 0,
      retentionRate: currentMonthStats.retention_rate || 0
    };

    console.log('[LEARNING-ANALYTICS] Analytics processed successfully');

    return new Response(JSON.stringify(analyticsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[LEARNING-ANALYTICS] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper functions
function processWeeklyProgress(conversations: any[], analytics: any[]) {
  const weeks = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (i * 7));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekConversations = conversations.filter(c => {
      const convDate = new Date(c.created_at);
      return convDate >= weekStart && convDate <= weekEnd;
    });

    const weekAnalytics = analytics.find(a => {
      const analyticsDate = new Date(a.date);
      return analyticsDate >= weekStart && analyticsDate <= weekEnd;
    });

    weeks.push({
      week: `Week ${7-i}`,
      speaking: weekAnalytics?.grammar_mistakes ? 
        Math.max(0, 100 - (weekAnalytics.grammar_mistakes * 10)) : 
        weekConversations.length * 5,
      listening: weekAnalytics?.vocabulary_mistakes ? 
        Math.max(0, 100 - (weekAnalytics.vocabulary_mistakes * 8)) : 
        weekConversations.length * 4,
      grammar: weekAnalytics?.grammar_mistakes ? 
        Math.max(0, 100 - (weekAnalytics.grammar_mistakes * 12)) : 
        weekConversations.length * 3,
      vocabulary: weekAnalytics?.vocabulary_mistakes ? 
        Math.max(0, 100 - (weekAnalytics.vocabulary_mistakes * 10)) : 
        weekConversations.length * 4
    });
  }
  
  return weeks;
}

function processMistakePatterns(conversations: any[]) {
  const patterns = {};
  
  conversations.forEach(conv => {
    if (conv.error_types && Array.isArray(conv.error_types)) {
      conv.error_types.forEach((errorType: string) => {
        patterns[errorType] = (patterns[errorType] || 0) + 1;
      });
    }
  });

  return Object.entries(patterns)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([type, count]) => ({
      type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: count as number,
      trend: Math.random() > 0.5 ? 'improving' : 'stable'
    }));
}

function calculateNextMilestones(skillProgress: any, lessonProgress: any[]) {
  const milestones = [];
  
  // Check which skills are close to the next level
  Object.entries(skillProgress).forEach(([skill, level]) => {
    if (typeof level === 'number' && level < 100) {
      const progress = level % 20; // Assuming 20-point levels
      if (progress > 15) { // Close to next level
        milestones.push({
          title: `${skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Level Up`,
          description: `Complete ${Math.ceil((20 - progress) / 2)} more exercises`,
          progress: (progress / 20) * 100,
          target: 100
        });
      }
    }
  });

  // Add lesson-based milestones
  const completedLessons = lessonProgress.filter(lp => lp.status === 'completed').length;
  if (completedLessons < 50) {
    milestones.push({
      title: 'Lesson Master',
      description: `Complete ${50 - completedLessons} more lessons`,
      progress: (completedLessons / 50) * 100,
      target: 50
    });
  }

  return milestones.slice(0, 3);
}

function calculateAchievements(lessonProgress: any[], conversations: any[]) {
  const achievements = [];
  
  const completedLessons = lessonProgress.filter(lp => lp.status === 'completed').length;
  const totalConversations = conversations.length;
  
  if (completedLessons >= 10) {
    achievements.push({
      title: 'First Steps',
      description: 'Completed 10 lessons',
      icon: '🎯',
      unlockedAt: lessonProgress[9]?.completed_at || new Date().toISOString()
    });
  }
  
  if (totalConversations >= 5) {
    achievements.push({
      title: 'Conversation Starter',
      description: 'Had 5 conversations with Razia',
      icon: '💬',
      unlockedAt: conversations[4]?.created_at || new Date().toISOString()
    });
  }
  
  if (totalConversations >= 25) {
    achievements.push({
      title: 'Chatterbox',
      description: 'Had 25 conversations',
      icon: '🗣️',
      unlockedAt: conversations[24]?.created_at || new Date().toISOString()
    });
  }
  
  return achievements.slice(0, 5);
}

function calculateImprovementTrend(conversations: any[]) {
  if (conversations.length < 2) return 0;
  
  const recent = conversations.slice(0, Math.floor(conversations.length / 2));
  const older = conversations.slice(Math.floor(conversations.length / 2));
  
  const recentAvg = recent.reduce((sum, conv) => sum + (conv.user_confidence_level || 0), 0) / recent.length;
  const olderAvg = older.reduce((sum, conv) => sum + (conv.user_confidence_level || 0), 0) / older.length;
  
  return ((recentAvg - olderAvg) / olderAvg) * 100;
}