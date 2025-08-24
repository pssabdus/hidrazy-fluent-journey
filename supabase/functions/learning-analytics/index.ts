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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { action, data: requestData } = await req.json();

    console.log(`[LEARNING-ANALYTICS] Processing action: ${action} for user: ${user.id}`);

    switch (action) {
      case 'analyze_learning_patterns': {
        // Fetch recent learning analytics data
        const { data: analytics, error } = await supabase
          .from('learning_analytics')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(30);

        if (error) throw error;

        // Analyze patterns
        const patterns = {
          optimal_study_times: analyzeOptimalStudyTimes(analytics),
          mistake_patterns: analyzeMistakePatterns(analytics),
          improvement_velocity: calculateImprovementVelocity(analytics),
          engagement_trends: analyzeEngagementTrends(analytics),
          difficulty_progression: analyzeDifficultyProgression(analytics),
          cultural_adaptation: analyzeCulturalAdaptation(analytics),
          performance_prediction: predictPerformance(analytics),
          intervention_recommendations: generateInterventions(analytics)
        };

        return new Response(JSON.stringify(patterns), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update_daily_analytics': {
        const today = new Date().toISOString().split('T')[0];
        
        // Upsert daily analytics
        const { error } = await supabase
          .from('learning_analytics')
          .upsert({
            user_id: user.id,
            date: today,
            ...requestData
          });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'generate_insights': {
        // Fetch comprehensive data for insights
        const [analyticsData, conversationData, progressData] = await Promise.all([
          supabase.from('learning_analytics').select('*').eq('user_id', user.id),
          supabase.from('conversation_history').select('*').eq('user_id', user.id).limit(100),
          supabase.from('progress_tracking').select('*').eq('user_id', user.id).single()
        ]);

        const insights = {
          learning_efficiency: calculateLearningEfficiency(analyticsData.data),
          retention_analysis: analyzeRetention(analyticsData.data),
          engagement_optimization: optimizeEngagement(analyticsData.data),
          cultural_intelligence_progress: analyzeCulturalProgress(conversationData.data),
          skill_development: analyzeSkillDevelopment(progressData.data),
          personalized_recommendations: generatePersonalizedRecommendations(
            analyticsData.data, 
            conversationData.data, 
            progressData.data
          )
        };

        return new Response(JSON.stringify(insights), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('[LEARNING-ANALYTICS] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Analytics functions
function analyzeOptimalStudyTimes(analytics: any[]) {
  if (!analytics?.length) return { optimal_hour: 19, confidence: 0.5 };
  
  const hourPerformance = new Map();
  
  analytics.forEach(session => {
    if (session.peak_performance_hour !== null) {
      const hour = session.peak_performance_hour;
      const current = hourPerformance.get(hour) || { count: 0, efficiency: 0 };
      hourPerformance.set(hour, {
        count: current.count + 1,
        efficiency: current.efficiency + (session.learning_efficiency || 0)
      });
    }
  });

  let bestHour = 19;
  let bestScore = 0;
  
  for (const [hour, data] of hourPerformance) {
    const avgEfficiency = data.efficiency / data.count;
    const score = avgEfficiency * Math.log(data.count + 1);
    if (score > bestScore) {
      bestScore = score;
      bestHour = hour;
    }
  }

  return {
    optimal_hour: bestHour,
    confidence: Math.min(bestScore / 3, 1),
    hourly_performance: Object.fromEntries(hourPerformance)
  };
}

function analyzeMistakePatterns(analytics: any[]) {
  if (!analytics?.length) return { patterns: [], recommendations: [] };

  const mistakeTypes = ['grammar', 'vocabulary', 'pronunciation', 'cultural'];
  const patterns = {};

  mistakeTypes.forEach(type => {
    const mistakes = analytics.map(a => a[`${type}_mistakes`] || 0);
    const trend = calculateTrend(mistakes);
    patterns[type] = {
      total: mistakes.reduce((a, b) => a + b, 0),
      average: mistakes.reduce((a, b) => a + b, 0) / mistakes.length,
      trend: trend,
      improvement_rate: trend < 0 ? Math.abs(trend) : 0
    };
  });

  return {
    patterns,
    recommendations: generateMistakeRecommendations(patterns)
  };
}

function calculateImprovementVelocity(analytics: any[]) {
  if (!analytics?.length) return { velocity: 0, trend: 'stable' };

  const velocities = analytics.map(a => a.improvement_velocity || 0);
  const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
  const trend = calculateTrend(velocities);

  return {
    velocity: avgVelocity,
    trend: trend > 0.1 ? 'accelerating' : trend < -0.1 ? 'decelerating' : 'stable',
    weekly_change: trend
  };
}

function analyzeEngagementTrends(analytics: any[]) {
  if (!analytics?.length) return { trend: 'stable', score: 0.5 };

  const engagement = analytics.map(a => a.engagement_score || 0.5);
  const trend = calculateTrend(engagement);
  const avgEngagement = engagement.reduce((a, b) => a + b, 0) / engagement.length;

  return {
    trend: trend > 0.05 ? 'increasing' : trend < -0.05 ? 'decreasing' : 'stable',
    score: avgEngagement,
    change_rate: trend,
    factors: analyzeEngagementFactors(analytics)
  };
}

function analyzeDifficultyProgression(analytics: any[]) {
  if (!analytics?.length) return { progression: 'steady', comfort: 0.5 };

  const comfort = analytics.map(a => a.difficulty_comfort_level || 0.5);
  const avgComfort = comfort.reduce((a, b) => a + b, 0) / comfort.length;
  const trend = calculateTrend(comfort);

  return {
    progression: avgComfort > 0.7 ? 'ready_for_increase' : avgComfort < 0.3 ? 'needs_support' : 'steady',
    comfort: avgComfort,
    trend: trend,
    recommendation: avgComfort > 0.8 ? 'increase_difficulty' : avgComfort < 0.4 ? 'reduce_difficulty' : 'maintain'
  };
}

function analyzeCulturalAdaptation(analytics: any[]) {
  if (!analytics?.length) return { progress: 0.5, confidence: 0.5 };

  const cultural = analytics.map(a => a.cultural_adaptation_progress || 0.5);
  const confidence = analytics.map(a => a.cultural_confidence_level || 0.5);
  
  return {
    progress: cultural.reduce((a, b) => a + b, 0) / cultural.length,
    confidence: confidence.reduce((a, b) => a + b, 0) / confidence.length,
    trend: calculateTrend(cultural),
    issues: analytics.flatMap(a => a.arabic_transfer_issues || [])
  };
}

function predictPerformance(analytics: any[]) {
  if (!analytics?.length) return { prediction: 'stable', confidence: 0.5 };

  const efficiency = analytics.map(a => a.learning_efficiency || 0.5);
  const retention = analytics.map(a => a.retention_rate || 0.5);
  const engagement = analytics.map(a => a.engagement_score || 0.5);

  const efficiencyTrend = calculateTrend(efficiency);
  const retentionTrend = calculateTrend(retention);
  const engagementTrend = calculateTrend(engagement);

  const overallTrend = (efficiencyTrend + retentionTrend + engagementTrend) / 3;
  
  return {
    prediction: overallTrend > 0.05 ? 'improving' : overallTrend < -0.05 ? 'declining' : 'stable',
    confidence: Math.min(analytics.length / 14, 1), // More data = higher confidence
    factors: {
      efficiency: efficiencyTrend,
      retention: retentionTrend,
      engagement: engagementTrend
    },
    risk_factors: identifyRiskFactors(analytics)
  };
}

function generateInterventions(analytics: any[]) {
  const interventions = [];
  
  if (!analytics?.length) {
    return [{ type: 'data_collection', priority: 'high', message: 'Need more learning data to provide interventions' }];
  }

  const latest = analytics[0];
  
  // Engagement intervention
  if (latest.engagement_score < 0.4) {
    interventions.push({
      type: 'engagement',
      priority: 'high',
      message: 'Low engagement detected - consider varying lesson types',
      actions: ['introduce_gamification', 'adjust_difficulty', 'cultural_content']
    });
  }

  // Learning efficiency intervention
  if (latest.learning_efficiency < 0.3) {
    interventions.push({
      type: 'efficiency',
      priority: 'medium',
      message: 'Learning efficiency is low - optimize study methods',
      actions: ['adjust_session_length', 'spaced_repetition', 'personalized_content']
    });
  }

  // Cultural adaptation intervention
  if (latest.cultural_confidence_level < 0.3) {
    interventions.push({
      type: 'cultural',
      priority: 'medium',
      message: 'Cultural confidence needs support',
      actions: ['cultural_bridge_exercises', 'arabic_context_integration', 'confidence_building']
    });
  }

  return interventions;
}

// Helper functions
function calculateTrend(values: number[]) {
  if (values.length < 2) return 0;
  
  const n = values.length;
  const sumX = n * (n - 1) / 2;
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((val, idx) => val + idx * val, 0);
  const sumX2 = n * (n - 1) * (2 * n - 1) / 6;
  
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
}

function generateMistakeRecommendations(patterns: any) {
  const recommendations = [];
  
  Object.entries(patterns).forEach(([type, data]: [string, any]) => {
    if (data.trend > 0) {
      recommendations.push({
        type,
        message: `Increasing ${type} mistakes detected`,
        action: `Focus on ${type} exercises and targeted practice`
      });
    }
  });

  return recommendations;
}

function analyzeEngagementFactors(analytics: any[]) {
  return {
    session_length_correlation: calculateCorrelation(
      analytics.map(a => a.study_duration_minutes || 0),
      analytics.map(a => a.engagement_score || 0.5)
    ),
    difficulty_engagement_correlation: calculateCorrelation(
      analytics.map(a => a.difficulty_comfort_level || 0.5),
      analytics.map(a => a.engagement_score || 0.5)
    )
  };
}

function calculateCorrelation(x: number[], y: number[]) {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((val, idx) => val + y[idx] * val, 0);
  const sumX2 = x.reduce((val) => val + val * val, 0);
  const sumY2 = y.reduce((val) => val + val * val, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

function identifyRiskFactors(analytics: any[]) {
  const risks = [];
  const latest = analytics[0];
  
  if (latest.engagement_score < 0.3) risks.push('low_engagement');
  if (latest.completion_rate < 0.5) risks.push('low_completion');
  if (latest.retention_rate < 0.4) risks.push('poor_retention');
  
  return risks;
}

// Placeholder functions for comprehensive analysis
function calculateLearningEfficiency(data: any) {
  return { efficiency: 0.75, factors: ['consistent_practice', 'appropriate_difficulty'] };
}

function analyzeRetention(data: any) {
  return { retention_rate: 0.8, improvement_areas: ['vocabulary', 'grammar_rules'] };
}

function optimizeEngagement(data: any) {
  return { recommendations: ['gamification', 'cultural_content', 'shorter_sessions'] };
}

function analyzeCulturalProgress(data: any) {
  return { progress: 0.7, confidence: 0.8 };
}

function analyzeSkillDevelopment(data: any) {
  return { strengths: ['listening', 'vocabulary'], weaknesses: ['speaking', 'grammar'] };
}

function generatePersonalizedRecommendations(analytics: any, conversations: any, progress: any) {
  return [
    { type: 'lesson', content: 'Arabic-English cultural bridge exercises' },
    { type: 'practice', content: 'Pronunciation drills for Arabic speakers' },
    { type: 'conversation', content: 'Business English scenarios' }
  ];
}