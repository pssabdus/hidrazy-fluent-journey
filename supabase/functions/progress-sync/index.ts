import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, user_id, ...requestData } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let result;

    switch (action) {
      case 'detect_milestones':
        result = await detectMilestones(requestData);
        break;
      case 'generate_weekly_summary':
        result = await generateWeeklySummary(requestData);
        break;
      case 'generate_insights':
        result = await generateProgressInsights(requestData);
        break;
      case 'sync_progress':
        result = await syncProgress(supabase, user_id, requestData);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in progress-sync function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// MILESTONE RECOGNITION ENGINE
async function detectMilestones(data: any) {
  const { user_activity, skill_changes, conversation_data } = data;

  if (!openAIApiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const prompt = `
MILESTONE RECOGNITION AND CELEBRATION:

RECENT USER ACTIVITY:
${JSON.stringify(user_activity)}

SKILL PROGRESSION DATA:
${skill_changes.map(change => 
  `${change.skillName}: ${change.beforeScore}% → ${change.afterScore}% | Improvement: ${change.improvementAmount}% | Consistency: ${change.consistencyRating} | Evidence: ${change.evidence}`
).join('\n')}

CONVERSATION ANALYSIS:
${conversation_data.recentConversations.map(conv =>
  `Date: ${conv.date} | Quality: ${JSON.stringify(conv.qualityMetrics)} | Cultural Moments: ${conv.culturalSuccesses} | Grammar Breakthroughs: ${conv.grammarImprovements} | Confidence: ${conv.confidenceSigns}`
).join('\n')}

MILESTONE DETECTION CATEGORIES:

1. SKILL MASTERY MILESTONES:
   - 10+ point improvement in any skill area
   - Crossing major thresholds (50%, 70%, 85%)
   - Consistent performance above new level for 5+ days
   - First successful use of advanced grammar structures
   - Vocabulary expansion milestones (500, 1000, 2000+ words)

2. CONFIDENCE BREAKTHROUGHS:
   - First complex explanations attempted
   - Sustained conversation without help requests
   - Self-correction during conversations
   - Initiating cultural discussions
   - Using humor/personality in English

3. CULTURAL BRIDGE ACHIEVEMENTS:
   - Successfully explaining Arab cultural concepts
   - Natural cross-cultural comparisons
   - Cultural pride while using English fluently
   - Helping others understand Arabic perspectives
   - Integrating Islamic/cultural values in English

4. CONSISTENCY REWARDS:
   - Daily streak milestones (7, 14, 30, 60, 100+ days)
   - Weekly completion consistency
   - Monthly engagement maintenance
   - Seasonal learning persistence

5. LEARNING CELEBRATIONS:
   - Level advancement (A1→A2, A2→B1, etc.)
   - Feature unlock readiness achievements  
   - Goal-specific progress (IELTS bands, business readiness)
   - Comparative progress (vs previous months)

CELEBRATION MESSAGING:
For each milestone detected, create:
- Culturally sensitive celebration message
- Specific evidence of achievement
- Connection to user's stated goals
- Preview of next milestone
- Motivational encouragement

Example: "Mashallah! You just demonstrated [achievement]! This shows you're developing [skill area] beautifully. I'm so proud of how you [evidence]. This brings you closer to [goal connection]. Ready for [next challenge]?"

OUTPUT REQUIRED:
1. All milestones achieved with evidence
2. Celebration messages for each
3. Badge/certificate recommendations  
4. Progress story narrative
5. Next milestone preview and guidance
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openAIApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const completion = await response.json();
  console.log('completion', completion);

  // Extract milestone data from the completion
  const milestones = completion.choices[0].message.content;

  return { milestones: [] };
}

// WEEKLY PROGRESS SUMMARY GENERATOR  
async function generateWeeklySummary(data: any) {
  const { week_data, user_goals, previous_weeks } = data;

  if (!openAIApiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const prompt = `
WEEKLY PROGRESS SUMMARY GENERATION:

THIS WEEK'S DATA:
Days Active: ${week_data.activeDays}/7
Study Time: ${week_data.totalMinutes} minutes
Conversations: ${week_data.conversationCount}
Skill Changes: ${JSON.stringify(week_data.skillChanges)}

USER GOALS:
Primary: ${user_goals.primary}
Timeline: ${user_goals.timeline}

PREVIOUS WEEKS COMPARISON:
${previous_weeks.map(week => `Week ${week.number}: ${week.keyMetrics}`).join('\n')}

CREATE PERSONALIZED WEEKLY SUMMARY:

1. CELEBRATION OPENING:
   - Start with specific achievements and praise
   - Reference cultural context appropriately
   - Acknowledge consistency and effort

2. KEY PROGRESS HIGHLIGHTS:
   - Biggest improvement area with evidence
   - Most impressive conversation moment
   - New skill demonstration/breakthrough
   - Cultural bridge success story
   - Confidence growth indicators

3. LEARNING INSIGHTS:
   - Pattern recognition in progress
   - Strength development trajectory  
   - Challenge area improvement strategies
   - Optimal learning approach observations

4. GOAL ADVANCEMENT:
   - Progress toward stated goals with specifics
   - Timeline adjustment if needed
   - Milestone completion celebration
   - Next week's target alignment

5. FORWARD MOTIVATION:
   - Next week's focus preview
   - Upcoming unlock/milestone anticipation
   - Long-term vision connection
   - Continued progress encouragement

6. CULTURAL INTEGRATION:
   - Cultural pride moments from week
   - Arabic-English bridge successes
   - Community/family relevance

TONE: Warm, celebratory, honest about challenges, culturally sensitive, motivational, personal and specific, forward-looking and optimistic.

Generate comprehensive summary that makes users proud of progress and excited about continuing.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openAIApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const completion = await response.json();
  console.log('completion', completion);

  // Extract weekly summary data from the completion
  const weekly_summary = completion.choices[0].message.content;

  return { weekly_summary: {} };
}

// PROGRESS INSIGHTS GENERATOR
async function generateProgressInsights(data: any) {
  const { current_data, historical_data } = data;

  if (!openAIApiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const prompt = `
PROGRESS INSIGHTS GENERATION:

Current Performance: ${JSON.stringify(current_data)}
Historical Data: ${JSON.stringify(historical_data)}

Generate insights like:
- "Your biggest breakthrough this week: [breakthrough]"
- "You're getting stronger at: [improvingAreas]"  
- "This week's challenge: [focusArea]"
- "Cultural pride moment: [culturalSuccess]"
- "Compared to last month: [comparison]"
- "You vs typical learner: [benchmark]"
- "Next week focusing on: [nextPriority]"

Make insights personal, specific, encouraging, and culturally sensitive.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openAIApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const completion = await response.json();
  console.log('completion', completion);

  // Extract insights data from the completion
  const insights = completion.choices[0].message.content;

  return { insights: [] };
}

// PROGRESS SYNC FUNCTION
async function syncProgress(supabase: any, user_id: string, data: any) {
  const { progress_data, lesson_data } = data;

  // Update progress tracking
  const { error: progressError } = await supabase
    .from('progress_tracking')
    .upsert({
      user_id,
      ...progress_data,
      updated_at: new Date().toISOString()
    });

  if (progressError) {
    throw progressError;
  }

  return { success: true, message: 'Progress synced successfully' };
}
