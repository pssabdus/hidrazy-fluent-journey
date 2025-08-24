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

interface FeatureUnlockCriteria {
  name: string;
  category: string;
  difficulty: string;
  requirements: string[];
  success_factors: string[];
  historical_success: number;
}

const AVAILABLE_FEATURES: FeatureUnlockCriteria[] = [
  {
    name: "Role-Play Scenarios",
    category: "conversation_practice",
    difficulty: "intermediate",
    requirements: [
      "Conversational confidence ≥ 70%",
      "Grammar accuracy ≥ 65%", 
      "Cultural comfort ≥ 75%",
      "At least 10 successful conversations with Razia"
    ],
    success_factors: [
      "Enjoys conversation practice over grammar drills",
      "Shows curiosity about cultural differences",
      "Demonstrates resilience when corrected"
    ],
    historical_success: 85
  },
  {
    name: "Business English",
    category: "professional",
    difficulty: "advanced",
    requirements: [
      "Minimum B1 level overall competency",
      "Professional vocabulary comfort ≥ 60%",
      "Formal register awareness",
      "Cross-cultural business sensitivity"
    ],
    success_factors: [
      "Has mentioned career/business goals",
      "Comfortable with formal conversation topics",
      "Can explain professional concepts"
    ],
    historical_success: 78
  },
  {
    name: "IELTS Preparation",
    category: "academic",
    difficulty: "advanced",
    requirements: [
      "Minimum A2+ with B1 potential",
      "Academic English exposure comfort",
      "Test preparation mindset",
      "Specific IELTS goals and timeline"
    ],
    success_factors: [
      "Has mentioned university/immigration goals",
      "Shows analytical thinking",
      "Comfortable with direct feedback",
      "Demonstrates study discipline"
    ],
    historical_success: 82
  },
  {
    name: "Advanced Grammar Workshop",
    category: "skill_building",
    difficulty: "intermediate",
    requirements: [
      "Grammar accuracy ≥ 60%",
      "Shows interest in structure improvement",
      "Can handle direct grammar feedback",
      "Completed basic grammar modules"
    ],
    success_factors: [
      "Asks grammar questions during conversation",
      "Self-corrects when speaking",
      "Shows analytical learning preference"
    ],
    historical_success: 90
  },
  {
    name: "Cultural Bridge Mastery",
    category: "cultural",
    difficulty: "intermediate",
    requirements: [
      "Cultural comfort ≥ 80%",
      "Successfully explains Arab concepts in English",
      "Shows pride in cultural identity",
      "Demonstrates cross-cultural awareness"
    ],
    success_factors: [
      "Regularly brings up cultural topics",
      "Enjoys explaining traditions",
      "Shows interest in cultural differences"
    ],
    historical_success: 88
  }
];

const generateFeatureReadinessPrompt = (userProfile: any, proposedFeature: FeatureUnlockCriteria, userHistory: any) => {
  return `
FEATURE UNLOCK READINESS ASSESSMENT:

USER PROFILE ANALYSIS:
Current Level: ${userProfile.current_level}
Days Active: ${userProfile.days_active}
Total Conversation Time: ${userProfile.total_minutes}
Recent Performance Trend: ${userProfile.performance_trend}

SKILL COMPETENCY BREAKDOWN:
Grammar Accuracy: ${userProfile.grammar_accuracy}%
Vocabulary Range: ${userProfile.vocabulary_range}%  
Speaking Confidence: ${userProfile.speaking_confidence}%
Cultural Bridge Comfort: ${userProfile.cultural_comfort}%
Pronunciation Clarity: ${userProfile.pronunciation_score}%

ENGAGEMENT PATTERNS:
Session Frequency: ${userProfile.session_frequency}
Average Session Duration: ${userProfile.avg_session_duration}
Feature Exploration Tendency: ${userProfile.exploration_score}
Challenge Tolerance: ${userProfile.challenge_comfort}%
Help-Seeking Behavior: ${userProfile.help_requests}

RECENT LEARNING HISTORY (Last 14 days):
${userHistory.recent_lessons?.map((lesson: any) => `
Date: ${lesson.date}
Focus: ${lesson.objective}
Performance: ${lesson.success_rate}%
Engagement: ${lesson.engagement}/10
Confidence: ${lesson.confidence}/10
Struggles: ${lesson.challenges}
Breakthroughs: ${lesson.successes}
`).join('\n') || 'No recent lesson data'}

PROPOSED FEATURE UNLOCK:
Feature: ${proposedFeature.name}
Type: ${proposedFeature.category} 
Difficulty Level: ${proposedFeature.difficulty}
Prerequisites: ${proposedFeature.requirements.join(', ')}
Success Predictors: ${proposedFeature.success_factors.join(', ')}

HISTORICAL SUCCESS DATA:
Users with similar profiles who unlocked this feature:
- Success Rate: ${proposedFeature.historical_success}%
- Average Engagement: 7.5/10
- Completion Rate: 75%
- User Satisfaction: 4.2/5

COMPREHENSIVE READINESS ASSESSMENT:

1. SKILL PREREQUISITE ANALYSIS (40% weight):
   - Does user meet minimum competency thresholds?
   - Are foundational skills solidly established?
   - Any critical gaps that would impede success?

2. ENGAGEMENT READINESS (25% weight):
   - Is user consistently active and motivated?
   - Do they explore and adopt new features well?
   - Will this feature enhance or overwhelm their experience?

3. CONFIDENCE & PSYCHOLOGICAL READINESS (20% weight):
   - Is user's confidence level appropriate for challenge?
   - Do they handle mistakes and challenges well?
   - Will this feature build or diminish confidence?

4. CULTURAL & PERSONAL ALIGNMENT (10% weight):
   - Does feature align with user's stated goals?
   - Is cultural integration appropriate and comfortable?
   - Personal interest and relevance indicators?

5. OPTIMAL TIMING FACTORS (5% weight):
   - Recent lesson performance momentum
   - User schedule and engagement patterns
   - Feature introduction sequencing logic

DECISION FRAMEWORK:
Calculate weighted readiness score (0-100%)
Only recommend unlock if score ≥ 85%

REQUIRED OUTPUT:
1. Overall readiness score with confidence level
2. Detailed breakdown by assessment category
3. Specific evidence supporting/opposing unlock
4. If not ready: exact criteria to wait for and estimated timeline
5. If ready: optimal introduction strategy and success prediction
6. Personalized unlock messaging for transparent user communication

Provide definitive recommendation with pedagogical reasoning.
`;
};

const generateUnlockCommunicationPrompt = (readinessDecision: any, feature: FeatureUnlockCriteria) => {
  return `
TRANSPARENT UNLOCK COMMUNICATION:

AI Decision: ${readinessDecision.recommendation}
Feature: ${feature.name}
User Readiness Score: ${readinessDecision.score}%

CREATE USER-FRIENDLY UNLOCK MESSAGE:

IF READY FOR UNLOCK (score ≥ 85%):
Create enthusiastic unlock message that:
1. Celebrates user's progress that led to this unlock
2. Explains why they're ready (specific achievements mentioned)
3. Previews what they'll experience in this feature
4. Builds excitement while managing expectations
5. Includes cultural connection or personal relevance

Example tone: "Mashallah! I've been watching your progress, and you're absolutely 
ready for ${feature.name}! Your confidence in [specific strength] plus your curiosity 
about [interest area] makes this perfect timing..."

IF NOT READY (score < 85%):
Create supportive guidance message that:
1. Acknowledges their interest and validates their motivation
2. Explains specific, achievable criteria needed (transparently)
3. Shows exact progress toward unlock requirements
4. Provides estimated realistic timeline
5. Builds anticipation while maintaining motivation
6. Offers alternative activities that build toward readiness

Example tone: "I love that you're interested in ${feature.name}! You're making great 
progress - just need to build confidence in [specific area]. Here's exactly 
what we're working toward..."

UNLOCK REQUIREMENTS DISPLAY:
Show user progress toward unlock criteria:
✅ Completed requirements (green checkmarks)
🔄 In progress requirements (with progress percentages)  
⏳ Future requirements (with clear descriptions)

Include motivational messaging and estimated timeline to completion.
`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, action, feature_name } = await req.json();
    
    console.log('Feature unlock action:', action, 'for user:', user_id);

    switch (action) {
      case 'check_readiness':
        return handleReadinessCheck(user_id, feature_name);
      
      case 'weekly_review':
        return handleWeeklyUnlockReview(user_id);
      
      case 'get_unlock_status':
        return handleGetUnlockStatus(user_id);
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in feature-unlock-system function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleReadinessCheck(userId: string, featureName?: string) {
  // Get comprehensive user profile
  const userProfile = await getUserProfile(userId);
  const userHistory = await getUserHistory(userId);
  
  const featuresToCheck = featureName 
    ? AVAILABLE_FEATURES.filter(f => f.name === featureName)
    : AVAILABLE_FEATURES;

  const results = [];

  for (const feature of featuresToCheck) {
    const readinessPrompt = generateFeatureReadinessPrompt(userProfile, feature, userHistory);

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
            content: 'You are an expert learning progression analyst. Provide precise readiness assessments with specific evidence and recommendations.' 
          },
          { role: 'user', content: readinessPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.2,
      }),
    });

    const aiData = await response.json();
    const analysis = aiData.choices[0].message.content;

    // Extract readiness score (simplified - would need more sophisticated parsing)
    const scoreMatch = analysis.match(/readiness score[:\s]*(\d+)%/i);
    const readinessScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    const readinessDecision = {
      recommendation: readinessScore >= 85 ? 'UNLOCK' : 'WAIT',
      score: readinessScore,
      analysis: analysis
    };

    // Generate user communication
    const communicationPrompt = generateUnlockCommunicationPrompt(readinessDecision, feature);
    
    const commResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are Razia, creating encouraging and transparent communication about feature unlocks. Be warm, specific, and motivational.' 
          },
          { role: 'user', content: communicationPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const commData = await commResponse.json();
    const userMessage = commData.choices[0].message.content;

    results.push({
      feature: feature.name,
      ready: readinessScore >= 85,
      score: readinessScore,
      analysis: analysis,
      user_message: userMessage,
      unlock_date: readinessScore >= 85 ? new Date().toISOString() : null
    });

    // Store unlock decision
    await supabase
      .from('feature_usage')
      .upsert({
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        features_used_today: [feature.name],
        premium_features_attempted: readinessScore >= 85 ? [feature.name] : []
      }, {
        onConflict: 'user_id,date'
      });
  }

  return new Response(JSON.stringify({
    success: true,
    results: results,
    profile_snapshot: userProfile
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleWeeklyUnlockReview(userId: string) {
  const userProfile = await getUserProfile(userId);
  const userHistory = await getUserHistory(userId);

  // Check all features for potential unlocks
  const readinessResults = [];

  for (const feature of AVAILABLE_FEATURES) {
    const readinessPrompt = generateFeatureReadinessPrompt(userProfile, feature, userHistory);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'Analyze feature unlock readiness systematically.' },
          { role: 'user', content: readinessPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.2,
      }),
    });

    const aiData = await response.json();
    const analysis = aiData.choices[0].message.content;
    
    const scoreMatch = analysis.match(/readiness score[:\s]*(\d+)%/i);
    const readinessScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    readinessResults.push({
      feature: feature.name,
      score: readinessScore,
      ready: readinessScore >= 85,
      analysis: analysis
    });
  }

  // Sort by readiness score and recommend top candidates
  readinessResults.sort((a, b) => b.score - a.score);
  
  const recommendations = readinessResults
    .filter(r => r.ready)
    .slice(0, 1); // Maximum 1 unlock per week

  return new Response(JSON.stringify({
    success: true,
    weekly_recommendations: recommendations,
    all_features_status: readinessResults,
    next_review_date: getNextWeeklyReview()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleGetUnlockStatus(userId: string) {
  // Get current feature unlock status
  const { data: featureUsage, error } = await supabase
    .from('feature_usage')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(7);

  if (error) throw error;

  const unlockedFeatures = new Set();
  featureUsage?.forEach(usage => {
    usage.premium_features_attempted?.forEach((feature: string) => {
      unlockedFeatures.add(feature);
    });
  });

  const lockedFeatures = AVAILABLE_FEATURES.filter(
    feature => !unlockedFeatures.has(feature.name)
  );

  return new Response(JSON.stringify({
    success: true,
    unlocked_features: Array.from(unlockedFeatures),
    locked_features: lockedFeatures.map(f => f.name),
    total_features: AVAILABLE_FEATURES.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getUserProfile(userId: string) {
  // Aggregate user data from multiple sources
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  const { data: analytics } = await supabase
    .from('learning_analytics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(7);

  const { data: progress } = await supabase
    .from('progress_tracking')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Calculate derived metrics
  const recentAnalytics = analytics?.slice(0, 7) || [];
  const avgEngagement = recentAnalytics.reduce((acc, a) => acc + (a.engagement_score || 0), 0) / Math.max(recentAnalytics.length, 1);
  const totalStudyTime = recentAnalytics.reduce((acc, a) => acc + (a.study_duration_minutes || 0), 0);

  return {
    current_level: userData?.current_level || 'beginner',
    days_active: Math.floor((Date.now() - new Date(userData?.created_at || 0).getTime()) / (1000 * 60 * 60 * 24)),
    total_minutes: totalStudyTime,
    performance_trend: avgEngagement > 7 ? 'improving' : avgEngagement > 5 ? 'stable' : 'declining',
    grammar_accuracy: Math.max(0, 100 - ((analytics?.[0]?.grammar_mistakes || 0) * 10)),
    vocabulary_range: getVocabularyScore(userData?.current_level || 'beginner'),
    speaking_confidence: avgEngagement * 10,
    cultural_comfort: analytics?.[0]?.cultural_confidence_level || 60,
    pronunciation_score: 75, // Mock data
    session_frequency: recentAnalytics.length,
    avg_session_duration: totalStudyTime / Math.max(recentAnalytics.length, 1),
    exploration_score: recentAnalytics.length > 5 ? 8 : 5,
    challenge_comfort: avgEngagement * 10,
    help_requests: recentAnalytics.filter(a => a.session_count > 0).length
  };
}

async function getUserHistory(userId: string) {
  const { data: lessons } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(14);

  return {
    recent_lessons: lessons?.map(lesson => ({
      date: lesson.created_at,
      objective: lesson.competency,
      success_rate: lesson.score || 0,
      engagement: 7, // Mock data
      confidence: 6, // Mock data
      challenges: lesson.mistakes_json || [],
      successes: lesson.feedback_json?.successes || []
    })) || []
  };
}

function getVocabularyScore(level: string): number {
  const scores = {
    'beginner': 40,
    'intermediate': 65,
    'advanced': 85
  };
  return scores[level as keyof typeof scores] || 40;
}

function getNextWeeklyReview(): string {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 7);
  return nextDate.toISOString();
}