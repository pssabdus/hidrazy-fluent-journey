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
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { action, data: requestData } = await req.json();

    console.log(`[PREMIUM-GATE-ENFORCER] Processing action: ${action} for user: ${user.id}`);

    switch (action) {
      case 'check_feature_access': {
        const { feature_id } = requestData;
        
        // Get user subscription status
        const { data: subscription } = await supabase
          .from('subscribers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Get today's usage
        const today = new Date().toISOString().split('T')[0];
        const { data: usage } = await supabase
          .from('feature_usage')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();

        const accessResult = checkFeatureAccess(feature_id, subscription, usage);
        
        return new Response(JSON.stringify(accessResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'record_feature_usage': {
        const { feature_id, usage_data } = requestData;
        
        // Check if user can use this feature
        const accessCheck = await checkAndRecordUsage(supabase, user.id, feature_id, usage_data);
        
        if (!accessCheck.allowed) {
          return new Response(JSON.stringify({
            success: false,
            reason: accessCheck.reason,
            upgrade_prompt: accessCheck.upgrade_prompt
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({
          success: true,
          usage_recorded: true,
          remaining_usage: accessCheck.remaining_usage
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'check_conversation_limit': {
        const today = new Date().toISOString().split('T')[0];
        
        // Get user's subscription tier
        const { data: subscription } = await supabase
          .from('subscribers')
          .select('subscribed, subscription_tier')
          .eq('user_id', user.id)
          .single();

        // Get today's conversations
        const { data: conversations } = await supabase
          .from('conversations')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lt('created_at', `${today}T23:59:59.999Z`);

        const conversationCount = conversations?.length || 0;
        const limits = getConversationLimits(subscription);
        
        const result = {
          can_start_conversation: conversationCount < limits.daily_limit,
          conversations_used: conversationCount,
          conversations_remaining: Math.max(0, limits.daily_limit - conversationCount),
          daily_limit: limits.daily_limit,
          subscription_tier: subscription?.subscription_tier || 'free',
          is_premium: subscription?.subscribed || false
        };

        // Record conversation attempt if at limit
        if (!result.can_start_conversation) {
          await recordPremiumFeatureAttempt(supabase, user.id, 'unlimited_conversations');
        }

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'increment_conversation_usage': {
        const today = new Date().toISOString().split('T')[0];
        
        // Update or create today's usage record
        const { data: currentUsage } = await supabase
          .from('feature_usage')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();

        const newCount = (currentUsage?.conversations_count || 0) + 1;
        const { data: subscription } = await supabase
          .from('subscribers')
          .select('subscribed, subscription_tier')
          .eq('user_id', user.id)
          .single();

        const limits = getConversationLimits(subscription);
        
        const { error } = await supabase
          .from('feature_usage')
          .upsert({
            user_id: user.id,
            date: today,
            conversations_count: newCount,
            conversations_remaining: Math.max(0, limits.daily_limit - newCount),
            daily_conversation_limit: limits.daily_limit,
            subscription_tier: subscription?.subscription_tier || 'free',
            subscription_active: subscription?.subscribed || false,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          conversations_used: newCount,
          conversations_remaining: Math.max(0, limits.daily_limit - newCount)
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'track_premium_feature_attempt': {
        const { feature_id, context } = requestData;
        
        await recordPremiumFeatureAttempt(supabase, user.id, feature_id, context);
        
        // Generate appropriate upgrade prompt
        const upgradePrompt = generateUpgradePrompt(feature_id, context);
        
        return new Response(JSON.stringify({
          success: true,
          feature_locked: true,
          upgrade_prompt: upgradePrompt
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_usage_analytics': {
        const { time_period = '7_days' } = requestData;
        
        const analytics = await getUserUsageAnalytics(supabase, user.id, time_period);
        
        return new Response(JSON.stringify(analytics), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'validate_subscription': {
        // Comprehensive subscription validation
        const validation = await validateUserSubscription(supabase, user.id);
        
        return new Response(JSON.stringify(validation), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'generate_upgrade_recommendation': {
        const { user_behavior, feature_requests } = requestData;
        
        const recommendation = await generatePersonalizedUpgradeRecommendation(
          supabase, 
          user.id, 
          user_behavior, 
          feature_requests
        );
        
        return new Response(JSON.stringify(recommendation), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('[PREMIUM-GATE-ENFORCER] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Feature access control functions
function checkFeatureAccess(featureId: string, subscription: any, usage: any) {
  const isPremium = subscription?.subscribed || false;
  const tier = subscription?.subscription_tier || 'free';
  
  // Define feature access rules
  const featureRules: { [key: string]: any } = {
    'unlimited_conversations': {
      free: { allowed: false, daily_limit: 5 },
      premium: { allowed: true, daily_limit: -1 },
      business: { allowed: true, daily_limit: -1 }
    },
    'advanced_analytics': {
      free: { allowed: false },
      premium: { allowed: true },
      business: { allowed: true }
    },
    'cultural_intelligence': {
      free: { allowed: false },
      premium: { allowed: true },
      business: { allowed: true }
    },
    'business_mode': {
      free: { allowed: false },
      premium: { allowed: true },
      business: { allowed: true }
    },
    'ielts_practice': {
      free: { allowed: false },
      premium: { allowed: true },
      business: { allowed: true }
    },
    'offline_learning': {
      free: { allowed: false },
      premium: { allowed: true },
      business: { allowed: true }
    },
    'personalized_curriculum': {
      free: { allowed: false },
      premium: { allowed: true },
      business: { allowed: true }
    }
  };

  const rule = featureRules[featureId];
  if (!rule) {
    return { allowed: true, reason: 'Feature not restricted' };
  }

  const tierRule = rule[tier] || rule['free'];
  
  if (!tierRule.allowed) {
    return {
      allowed: false,
      reason: 'premium_required',
      feature_id: featureId,
      user_tier: tier,
      upgrade_benefits: getUpgradeBenefits(featureId)
    };
  }

  // Check usage limits for allowed features
  if (tierRule.daily_limit && tierRule.daily_limit > 0) {
    const currentUsage = getCurrentUsage(usage, featureId);
    if (currentUsage >= tierRule.daily_limit) {
      return {
        allowed: false,
        reason: 'daily_limit_reached',
        feature_id: featureId,
        current_usage: currentUsage,
        daily_limit: tierRule.daily_limit
      };
    }
  }

  return {
    allowed: true,
    remaining_usage: tierRule.daily_limit > 0 ? 
      tierRule.daily_limit - getCurrentUsage(usage, featureId) : -1
  };
}

async function checkAndRecordUsage(supabase: any, userId: string, featureId: string, usageData: any) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get subscription and current usage
  const [subscriptionData, usageData_] = await Promise.all([
    supabase.from('subscribers').select('*').eq('user_id', userId).single(),
    supabase.from('feature_usage').select('*').eq('user_id', userId).eq('date', today).single()
  ]);

  const subscription = subscriptionData.data;
  const currentUsage = usageData_.data;

  // Check access
  const accessCheck = checkFeatureAccess(featureId, subscription, currentUsage);
  if (!accessCheck.allowed) {
    // Record the attempt
    await recordPremiumFeatureAttempt(supabase, userId, featureId);
    return {
      allowed: false,
      reason: accessCheck.reason,
      upgrade_prompt: generateUpgradePrompt(featureId, accessCheck)
    };
  }

  // Record the usage
  await recordFeatureUsage(supabase, userId, featureId, usageData);
  
  return {
    allowed: true,
    remaining_usage: accessCheck.remaining_usage
  };
}

function getConversationLimits(subscription: any) {
  const tier = subscription?.subscription_tier || 'free';
  
  const limits = {
    'free': { daily_limit: 5, monthly_limit: 150 },
    'premium': { daily_limit: -1, monthly_limit: -1 }, // Unlimited
    'business': { daily_limit: -1, monthly_limit: -1 }  // Unlimited
  };
  
  return limits[tier] || limits['free'];
}

function getCurrentUsage(usage: any, featureId: string) {
  if (!usage) return 0;
  
  const usageMap: { [key: string]: string } = {
    'unlimited_conversations': 'conversations_count',
    'advanced_analytics': 'advanced_analytics_views',
    'cultural_intelligence': 'cultural_intelligence_uses',
    'business_mode': 'business_mode_minutes',
    'ielts_practice': 'ielts_practice_sessions',
    'offline_learning': 'offline_content_downloads'
  };
  
  const usageField = usageMap[featureId];
  return usage[usageField] || 0;
}

async function recordFeatureUsage(supabase: any, userId: string, featureId: string, usageData: any) {
  const today = new Date().toISOString().split('T')[0];
  
  const updates: any = {
    user_id: userId,
    date: today,
    updated_at: new Date().toISOString()
  };

  // Map feature to usage field
  switch (featureId) {
    case 'unlimited_conversations':
      updates.conversations_count = (usageData.current_usage || 0) + 1;
      updates.conversation_minutes = (usageData.duration_minutes || 0);
      break;
    case 'advanced_analytics':
      updates.advanced_analytics_views = (usageData.current_usage || 0) + 1;
      break;
    case 'cultural_intelligence':
      updates.cultural_intelligence_uses = (usageData.current_usage || 0) + 1;
      break;
    case 'business_mode':
      updates.business_mode_minutes = (usageData.current_usage || 0) + (usageData.duration_minutes || 0);
      break;
    case 'ielts_practice':
      updates.ielts_practice_sessions = (usageData.current_usage || 0) + 1;
      break;
    case 'offline_learning':
      updates.offline_content_downloads = (usageData.current_usage || 0) + 1;
      break;
  }

  // Track features used today
  const { data: currentUsage } = await supabase
    .from('feature_usage')
    .select('features_used_today')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  const featuresUsed = new Set(currentUsage?.features_used_today || []);
  featuresUsed.add(featureId);
  updates.features_used_today = Array.from(featuresUsed);

  await supabase
    .from('feature_usage')
    .upsert(updates);
}

async function recordPremiumFeatureAttempt(supabase: any, userId: string, featureId: string, context?: any) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get current attempts
  const { data: currentUsage } = await supabase
    .from('feature_usage')
    .select('premium_features_attempted, upgrade_prompts_shown')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  const attempts = currentUsage?.premium_features_attempted || [];
  attempts.push({
    feature_id: featureId,
    attempted_at: new Date().toISOString(),
    context: context
  });

  await supabase
    .from('feature_usage')
    .upsert({
      user_id: userId,
      date: today,
      premium_features_attempted: attempts,
      upgrade_prompts_shown: (currentUsage?.upgrade_prompts_shown || 0) + 1,
      updated_at: new Date().toISOString()
    });
}

function generateUpgradePrompt(featureId: string, context?: any) {
  const prompts: { [key: string]: any } = {
    'unlimited_conversations': {
      title: 'Unlock Unlimited Conversations',
      message: 'Continue your English learning journey without daily limits',
      benefits: ['Unlimited daily conversations', 'Extended practice sessions', 'No interruptions'],
      cta: 'Upgrade to Premium'
    },
    'advanced_analytics': {
      title: 'Discover Your Learning Insights',
      message: 'Get detailed analytics to optimize your English learning',
      benefits: ['Learning pattern analysis', 'Performance predictions', 'Personalized recommendations'],
      cta: 'See Analytics Now'
    },
    'cultural_intelligence': {
      title: 'Master Cultural Communication',
      message: 'Bridge Arabic and English cultures with AI-powered insights',
      benefits: ['Cultural adaptation guidance', 'Context-aware corrections', 'Professional communication'],
      cta: 'Unlock Cultural AI'
    },
    'business_mode': {
      title: 'Excel in Business English',
      message: 'Professional communication skills for career advancement',
      benefits: ['Business vocabulary', 'Professional scenarios', 'Industry-specific training'],
      cta: 'Go Professional'
    },
    'ielts_practice': {
      title: 'Achieve Your IELTS Goals',
      message: 'Comprehensive IELTS preparation with AI feedback',
      benefits: ['Practice tests', 'Band score predictions', 'Personalized study plans'],
      cta: 'Start IELTS Prep'
    },
    'offline_learning': {
      title: 'Learn Anywhere, Anytime',
      message: 'Download lessons for offline study',
      benefits: ['Offline conversations', 'Cached content', 'Study without internet'],
      cta: 'Enable Offline Mode'
    }
  };

  return prompts[featureId] || {
    title: 'Unlock Premium Features',
    message: 'Get full access to advanced learning tools',
    benefits: ['Advanced features', 'Better learning experience', 'Faster progress'],
    cta: 'Upgrade Now'
  };
}

function getUpgradeBenefits(featureId: string) {
  const benefits: { [key: string]: string[] } = {
    'unlimited_conversations': [
      'Unlimited daily conversations with Razia',
      'Extended practice sessions',
      'No waiting periods',
      'Priority AI response times'
    ],
    'advanced_analytics': [
      'Detailed learning pattern analysis',
      'Performance trend predictions',
      'Personalized improvement recommendations',
      'Learning efficiency optimization'
    ],
    'cultural_intelligence': [
      'Arabic-English cultural bridge insights',
      'Context-aware communication guidance',
      'Professional cultural adaptation',
      'Business etiquette training'
    ]
  };

  return benefits[featureId] || ['Access to premium features', 'Enhanced learning experience'];
}

async function getUserUsageAnalytics(supabase: any, userId: string, timePeriod: string) {
  const days = timePeriod === '30_days' ? 30 : 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data: usageData } = await supabase
    .from('feature_usage')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (!usageData?.length) {
    return { message: 'No usage data available' };
  }

  // Aggregate analytics
  const analytics = {
    total_conversations: usageData.reduce((sum: number, day: any) => sum + (day.conversations_count || 0), 0),
    total_study_time: usageData.reduce((sum: number, day: any) => sum + (day.conversation_minutes || 0), 0),
    premium_features_attempted: usageData.reduce((sum: number, day: any) => sum + (day.premium_features_attempted?.length || 0), 0),
    average_daily_usage: 0,
    usage_trend: 'stable',
    most_used_features: [],
    upgrade_prompt_effectiveness: 0
  };

  analytics.average_daily_usage = analytics.total_conversations / days;
  
  // Calculate trend
  const firstHalf = usageData.slice(0, Math.floor(days / 2));
  const secondHalf = usageData.slice(Math.floor(days / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum: number, day: any) => sum + (day.conversations_count || 0), 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum: number, day: any) => sum + (day.conversations_count || 0), 0) / secondHalf.length;
  
  if (secondHalfAvg > firstHalfAvg * 1.2) {
    analytics.usage_trend = 'increasing';
  } else if (secondHalfAvg < firstHalfAvg * 0.8) {
    analytics.usage_trend = 'decreasing';
  }

  return analytics;
}

async function validateUserSubscription(supabase: any, userId: string) {
  const { data: subscription } = await supabase
    .from('subscribers')
    .select('*')
    .eq('user_id', userId)
    .single();

  const now = new Date();
  let isValid = false;
  let status = 'free';
  
  if (subscription) {
    if (subscription.subscribed && subscription.subscription_end) {
      const endDate = new Date(subscription.subscription_end);
      isValid = endDate > now;
      status = isValid ? subscription.subscription_tier : 'expired';
    } else if (subscription.subscribed) {
      isValid = true;
      status = subscription.subscription_tier;
    }
  }

  return {
    is_valid: isValid,
    status: status,
    tier: subscription?.subscription_tier || 'free',
    subscription_end: subscription?.subscription_end,
    stripe_subscription_id: subscription?.stripe_subscription_id,
    needs_renewal: subscription?.subscribed && !isValid
  };
}

async function generatePersonalizedUpgradeRecommendation(supabase: any, userId: string, userBehavior: any, featureRequests: any) {
  // Get user usage patterns
  const { data: recentUsage } = await supabase
    .from('feature_usage')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(7);

  const { data: userData } = await supabase
    .from('users')
    .select('learning_goal, current_level, country')
    .eq('id', userId)
    .single();

  // Analyze usage patterns
  const totalConversations = recentUsage?.reduce((sum: number, day: any) => sum + (day.conversations_count || 0), 0) || 0;
  const premiumAttempts = recentUsage?.reduce((sum: number, day: any) => sum + (day.premium_features_attempted?.length || 0), 0) || 0;
  
  let recommendation = {
    priority: 'medium',
    primary_benefit: 'unlimited_conversations',
    personalized_message: '',
    recommended_tier: 'premium',
    discount_eligible: false,
    urgency_factor: 0.5
  };

  // Heavy user - needs unlimited conversations
  if (totalConversations > 25) {
    recommendation.priority = 'high';
    recommendation.personalized_message = 'You\'re an active learner! Unlock unlimited conversations to accelerate your progress.';
    recommendation.urgency_factor = 0.9;
  }

  // Business learner - recommend business features
  if (userData?.learning_goal === 'business') {
    recommendation.primary_benefit = 'business_mode';
    recommendation.personalized_message = 'Take your business English to the next level with professional communication training.';
    recommendation.recommended_tier = 'business';
  }

  // IELTS learner - recommend IELTS features
  if (userData?.learning_goal === 'ielts') {
    recommendation.primary_benefit = 'ielts_practice';
    recommendation.personalized_message = 'Achieve your target IELTS band score with AI-powered practice tests and feedback.';
  }

  // High premium feature attempts - discount eligible
  if (premiumAttempts > 5) {
    recommendation.discount_eligible = true;
    recommendation.urgency_factor = 0.8;
    recommendation.personalized_message += ' Special offer: Get 20% off your first month!';
  }

  return recommendation;
}