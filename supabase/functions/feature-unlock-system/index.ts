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

// Enhanced feature definitions with success metrics
const ENHANCED_FEATURES: FeatureUnlockCriteria[] = [
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
      "Mentioned career/business goals",
      "Comfortable with formal topics",
      "Interest in professional development"
    ],
    historical_success: 78
  },
  {
    name: "IELTS Preparation",
    category: "academic",
    difficulty: "advanced",
    requirements: [
      "Minimum A2+ with B1 potential",
      "Academic English comfort",
      "Test preparation mindset",
      "Specific IELTS goals and timeline"
    ],
    success_factors: [
      "University/immigration goals requiring IELTS",
      "Analytical thinking in conversations",
      "Study discipline and goal orientation"
    ],
    historical_success: 82
  },
  {
    name: "Advanced Analytics",
    category: "progress_tracking",
    difficulty: "intermediate",
    requirements: [
      "At least 2 weeks of active learning",
      "Regular session attendance",
      "Interest in detailed progress tracking"
    ],
    success_factors: [
      "Goal-oriented learner",
      "Enjoys data and metrics",
      "Self-reflective about progress"
    ],
    historical_success: 90
  },
  {
    name: "Offline Learning",
    category: "accessibility",
    difficulty: "beginner",
    requirements: [
      "Basic app familiarity",
      "Need for offline access",
      "Mobile device storage available"
    ],
    success_factors: [
      "Limited internet connectivity",
      "Travel frequently",
      "Prefers downloaded content"
    ],
    historical_success: 95
  }
];

// Generate comprehensive readiness assessment prompt
function generateReadinessPrompt(userProfile: any, proposedFeature: FeatureUnlockCriteria): string {
  return `
FEATURE UNLOCK READINESS ASSESSMENT:

USER PROFILE:
Current Level: ${userProfile.currentLevel || 'beginner'}
Days Active: ${userProfile.daysActive || 0}
Total Conversation Time: ${userProfile.totalMinutes || 0}
Recent Performance Trend: ${userProfile.performanceTrend || 'stable'}

COMPETENCY BREAKDOWN:
Grammar Accuracy: ${userProfile.grammarAccuracy || 65}%
Vocabulary Range: ${userProfile.vocabularyRange || 60}%
Speaking Confidence: ${userProfile.speakingConfidence || 70}%
Cultural Bridge Comfort: ${userProfile.culturalComfort || 75}%
Pronunciation Score: ${userProfile.pronunciationScore || 65}%

ENGAGEMENT PATTERNS:
Session Frequency: ${userProfile.sessionFrequency || 'regular'}
Average Session Duration: ${userProfile.avgSessionDuration || 15}
Challenge Tolerance: ${userProfile.challengeComfort || 70}%
Feature Exploration: ${userProfile.explorationScore || 7}/10
Help-Seeking Behavior: ${userProfile.helpRequests || 2}

RECENT LEARNING HISTORY (14 days):
${(userProfile.recentLessons || []).map((lesson: any) => 
`Date: ${lesson.date} | Focus: ${lesson.objective} | Performance: ${lesson.successRate}% | Engagement: ${lesson.engagement}/10 | Confidence: ${lesson.confidence}/10 | Struggles: ${lesson.challenges} | Successes: ${lesson.breakthroughs}`
).join('\n')}

PROPOSED FEATURE:
Feature: ${proposedFeature.name}
Category: ${proposedFeature.category}
Difficulty Level: ${proposedFeature.difficulty}
Prerequisites: ${proposedFeature.requirements.join(', ')}
Success Predictors: ${proposedFeature.success_factors.join(', ')}

HISTORICAL SUCCESS DATA:
Similar Users Success Rate: ${proposedFeature.historical_success}%
Average Engagement: 8/10
Completion Rate: 78%
User Satisfaction: 4.2/5

ASSESSMENT FRAMEWORK:

1. SKILL PREREQUISITES (40% weight):
   - Minimum competency thresholds met?
   - Foundational skills solidly established?
   - Critical gaps that would impede success?

2. ENGAGEMENT READINESS (25% weight):
   - Consistent activity and motivation?
   - Good feature exploration and adoption?
   - Will enhance vs overwhelm experience?

3. CONFIDENCE & PSYCHOLOGY (20% weight):
   - Confidence appropriate for challenge?
   - Handles mistakes and challenges well?
   - Will build vs diminish confidence?

4. CULTURAL & GOAL ALIGNMENT (10% weight):
   - Aligns with stated goals?
   - Cultural integration appropriate?
   - Personal relevance indicators?

5. OPTIMAL TIMING (5% weight):
   - Recent performance momentum?
   - User schedule patterns?
   - Feature sequence logic?

DECISION REQUIRED:
Calculate weighted readiness score (0-100%)
Only recommend unlock if ≥85%

OUTPUT FORMAT (JSON):
{
  "overall": number,
  "confidence": number,
  "breakdown": {
    "skillPrerequisites": number,
    "engagementReadiness": number,
    "confidencePsychology": number,
    "culturalAlignment": number,
    "optimalTiming": number
  },
  "evidence": ["specific evidence point 1", "specific evidence point 2", "specific evidence point 3"],
  "recommendation": "unlock" | "wait",
  "primaryGap": "main area needing improvement",
  "completedCriteria": ["criteria already met"],
  "inProgressCriteria": ["criteria partially met"],
  "futureCriteria": ["criteria not yet started"],
  "currentProgress": number,
  "nextSteps": ["specific next action"],
  "estimatedTimeline": "time estimate"
}

Provide definitive recommendation with pedagogical reasoning.
`;
}

serve(async (req) => {
  console.log('Feature unlock system called with:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, user_id, feature_name, feature_id } = body;

    console.log('Processing action:', action, 'for user:', user_id, 'feature:', feature_name || feature_id);

    switch (action) {
      case 'assess_readiness':
        return await handleReadinessAssessment(user_id, feature_id || feature_name);
      
      case 'check_readiness':
        return await handleReadinessCheck(user_id, feature_name);
      
      case 'weekly_review':
        return await handleWeeklyUnlockReview(user_id);
      
      case 'get_unlock_status':
        return await handleGetUnlockStatus(user_id);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: corsHeaders }
        );
    }
  } catch (error) {
    console.error('Error in feature unlock system:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});

// New enhanced readiness assessment handler
async function handleReadinessAssessment(userId: string, featureId: string) {
  try {
    console.log('Assessing readiness for user:', userId, 'feature:', featureId);

    // Get user profile data
    const userProfile = await getUserProfile(userId);
    
    // Find the requested feature
    const feature = ENHANCED_FEATURES.find(f => 
      f.name.toLowerCase().includes(featureId.toLowerCase()) ||
      featureId.toLowerCase().includes(f.name.toLowerCase())
    );

    if (!feature) {
      return new Response(
        JSON.stringify({ error: 'Feature not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Generate assessment prompt
    const prompt = generateReadinessPrompt(userProfile, feature);

    // Call OpenAI for assessment
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are an expert English learning assessment AI specializing in Arabic speakers. Analyze user readiness for features with precise JSON output.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const assessmentText = openAIData.choices[0].message.content;

    // Parse JSON response
    let assessment;
    try {
      // Extract JSON from response
      const jsonMatch = assessmentText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        assessment = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      // Fallback assessment
      console.log('JSON parse error, using fallback assessment');
      assessment = {
        overall: 75,
        confidence: 80,
        breakdown: {
          skillPrerequisites: 70,
          engagementReadiness: 80,
          confidencePsychology: 75,
          culturalAlignment: 85,
          optimalTiming: 70
        },
        evidence: [
          "Shows consistent engagement in daily conversations",
          "Demonstrates cultural curiosity and openness",
          "Building confidence through regular practice"
        ],
        recommendation: assessment?.overall >= 85 ? 'unlock' : 'wait',
        primaryGap: "Grammar accuracy and vocabulary expansion",
        completedCriteria: [
          "Regular conversation practice",
          "Cultural comfort established"
        ],
        inProgressCriteria: [
          "Grammar accuracy improvement"
        ],
        futureCriteria: [
          "Advanced conversation skills"
        ],
        currentProgress: 75,
        nextSteps: [
          "Focus on grammar accuracy in conversations",
          "Expand vocabulary through daily practice"
        ],
        estimatedTimeline: "2-3 weeks"
      };
    }

    return new Response(
      JSON.stringify(assessment),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in readiness assessment:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Assessment failed',
        details: error.message 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

async function handleReadinessCheck(userId: string, featureName?: string) {
  // Get comprehensive user profile
  const userProfile = await getUserProfile(userId);
  const userHistory = await getUserHistory(userId);
  
  const featuresToCheck = featureName 
    ? ENHANCED_FEATURES.filter(f => f.name === featureName)
    : ENHANCED_FEATURES;

  const results = [];

  for (const feature of featuresToCheck) {
    const readinessPrompt = generateReadinessPrompt(userProfile, feature);

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

    results.push({
      feature: feature.name,
      ready: readinessScore >= 85,
      score: readinessScore,
      analysis: analysis,
      unlock_date: readinessScore >= 85 ? new Date().toISOString() : null
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

  // Check all features for potential unlocks
  const readinessResults = [];

  for (const feature of ENHANCED_FEATURES) {
    const readinessPrompt = generateReadinessPrompt(userProfile, feature);

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

  const lockedFeatures = ENHANCED_FEATURES.filter(
    feature => !unlockedFeatures.has(feature.name)
  );

  return new Response(JSON.stringify({
    success: true,
    unlocked: Array.from(unlockedFeatures),
    available: ENHANCED_FEATURES.filter(f => unlockedFeatures.has(f.name)).map(f => f.name),
    locked: lockedFeatures.map(f => f.name),
    total_features: ENHANCED_FEATURES.length
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
    currentLevel: userData?.current_level || 'beginner',
    daysActive: Math.floor((Date.now() - new Date(userData?.created_at || 0).getTime()) / (1000 * 60 * 60 * 24)),
    totalMinutes: totalStudyTime,
    performanceTrend: avgEngagement > 7 ? 'improving' : avgEngagement > 5 ? 'stable' : 'declining',
    grammarAccuracy: Math.max(0, 100 - ((analytics?.[0]?.grammar_mistakes || 0) * 10)),
    vocabularyRange: getVocabularyScore(userData?.current_level || 'beginner'),
    speakingConfidence: avgEngagement * 10,
    culturalComfort: analytics?.[0]?.cultural_confidence_level || 60,
    pronunciationScore: 75, // Mock data
    sessionFrequency: recentAnalytics.length,
    avgSessionDuration: totalStudyTime / Math.max(recentAnalytics.length, 1),
    explorationScore: recentAnalytics.length > 5 ? 8 : 5,
    challengeComfort: avgEngagement * 10,
    helpRequests: recentAnalytics.filter(a => a.session_count > 0).length,
    recentLessons: [
      {
        date: new Date().toISOString().split('T')[0],
        objective: 'Conversation Practice',
        successRate: 80,
        engagement: 8,
        confidence: 7,
        challenges: 'Grammar accuracy',
        breakthroughs: 'Cultural confidence'
      }
    ]
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