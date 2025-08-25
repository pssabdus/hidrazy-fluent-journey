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

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action } = await req.json();

    if (action === 'get_usage') {
      // Get current month usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: usageLogs } = await supabase
        .from('ai_usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', startOfMonth.toISOString());

      // Calculate usage statistics
      const monthlyStats = {
        totalCost: usageLogs?.reduce((sum, log) => sum + (log.estimated_cost || 0), 0) || 0,
        gpt4Calls: usageLogs?.filter(log => log.model_used?.includes('gpt-4.1')).length || 0,
        totalCalls: usageLogs?.length || 0,
        ttsCharacters: usageLogs?.filter(log => log.model_used === 'tts-1')
          .reduce((sum, log) => sum + (log.input_tokens || 0), 0) || 0
      };

      // Get today's usage
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data: dailyLogs } = await supabase
        .from('ai_usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', startOfDay.toISOString());

      const dailyStats = {
        conversationTurns: dailyLogs?.length || 0,
        dailyCost: dailyLogs?.reduce((sum, log) => sum + (log.estimated_cost || 0), 0) || 0
      };

      // Check limits
      const limits = {
        dailyConversationTurns: 50,
        monthlyGPT4Calls: 20,
        monthlyTTSCharacters: 10000,
        monthlyCostAlert: 10.0 // Alert at $10/month
      };

      const warnings = [];
      if (monthlyStats.totalCost > limits.monthlyCostAlert) {
        warnings.push(`Monthly cost ($${monthlyStats.totalCost.toFixed(2)}) exceeds $${limits.monthlyCostAlert}`);
      }
      if (monthlyStats.gpt4Calls >= limits.monthlyGPT4Calls) {
        warnings.push('Monthly GPT-4.1 limit reached - using efficient models');
      }
      if (dailyStats.conversationTurns >= limits.dailyConversationTurns) {
        warnings.push('Daily conversation limit reached');
      }

      return new Response(JSON.stringify({
        monthlyStats,
        dailyStats,
        limits,
        warnings,
        costOptimizationEnabled: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'check_limits') {
      const { requestType } = await req.json();
      
      // Get current usage quickly
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const [monthlyUsage, dailyUsage] = await Promise.all([
        supabase.from('ai_usage_logs')
          .select('model_used, estimated_cost, input_tokens')
          .eq('user_id', user.id)
          .gte('timestamp', startOfMonth.toISOString()),
        supabase.from('ai_usage_logs')
          .select('id')
          .eq('user_id', user.id)
          .gte('timestamp', startOfDay.toISOString())
      ]);

      const gpt4Calls = monthlyUsage.data?.filter(log => log.model_used?.includes('gpt-4.1')).length || 0;
      const ttsCharacters = monthlyUsage.data?.filter(log => log.model_used === 'tts-1')
        .reduce((sum, log) => sum + (log.input_tokens || 0), 0) || 0;
      const dailyTurns = dailyUsage.data?.length || 0;

      // Check limits
      if (requestType === 'gpt-4.1' && gpt4Calls >= 20) {
        return new Response(JSON.stringify({ 
          allowed: false, 
          fallback: 'gpt-4o-mini',
          message: 'Monthly GPT-4.1 limit reached, using efficient model instead'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (requestType === 'tts' && ttsCharacters >= 10000) {
        return new Response(JSON.stringify({ 
          allowed: false, 
          message: 'Monthly TTS limit reached. Click 🔊 for on-demand audio.' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (dailyTurns >= 50) {
        return new Response(JSON.stringify({
          allowed: false,
          message: 'Daily conversation limit reached. See you tomorrow! 😊'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ allowed: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('[COST-MONITORING] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});