import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { selectOptimalModel, shouldUseTTS, defaultUsageLimits } from '@/utils/costOptimization';

interface UsageStats {
  monthlyStats: {
    totalCost: number;
    gpt4Calls: number;
    totalCalls: number;
    ttsCharacters: number;
  };
  dailyStats: {
    conversationTurns: number;
    dailyCost: number;
  };
  warnings: string[];
}

export function useCostOptimization() {
  const { toast } = useToast();
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current usage statistics
  const fetchUsageStats = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('cost-monitoring', {
        body: { action: 'get_usage' }
      });

      if (error) throw error;
      setUsageStats(data);

      // Show warnings if any
      if (data.warnings && data.warnings.length > 0) {
        data.warnings.forEach((warning: string) => {
          toast({
            title: "Cost Alert",
            description: warning,
            variant: "destructive",
          });
        });
      }
    } catch (error) {
      console.error('[COST-OPTIMIZATION] Failed to fetch usage stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a request is allowed based on current usage
  const checkUsageLimits = async (requestType: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('cost-monitoring', {
        body: { action: 'check_limits', requestType }
      });

      if (error) throw error;
      
      if (!data.allowed) {
        toast({
          title: "Usage Limit Reached",
          description: data.message,
          variant: "destructive",
        });
        
        return { allowed: false, fallback: data.fallback, message: data.message };
      }

      return { allowed: true };
    } catch (error) {
      console.error('[COST-OPTIMIZATION] Failed to check usage limits:', error);
      // Allow request if check fails to avoid blocking users
      return { allowed: true };
    }
  };

  // Smart model selection wrapper
  const getOptimalModel = (context: any) => {
    return selectOptimalModel(context);
  };

  // Smart TTS decision wrapper
  const shouldUseTTSForMessage = (messageType: string, content: string, userPreferences: any) => {
    return shouldUseTTS(messageType, content, userPreferences);
  };

  // Log AI usage (called from frontend for transparency)
  const logUsage = async (model: string, estimatedTokens: number, requestType: string) => {
    try {
      // This is mainly for client-side tracking/display
      // Actual logging happens in the edge functions
      console.log(`[COST-OPTIMIZATION] Used ${model} for ${requestType}, ~${estimatedTokens} tokens`);
    } catch (error) {
      console.error('[COST-OPTIMIZATION] Failed to log usage:', error);
    }
  };

  useEffect(() => {
    fetchUsageStats();
  }, []);

  return {
    usageStats,
    isLoading,
    fetchUsageStats,
    checkUsageLimits,
    getOptimalModel,
    shouldUseTTSForMessage,
    logUsage,
    limits: defaultUsageLimits
  };
}