import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { type UserSubscription, type UsageStats, SUBSCRIPTION_PLANS } from '@/types/premium';

interface PremiumContextType {
  subscription: UserSubscription | null;
  usageStats: UsageStats;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  isFeatureAvailable: (featureId: string) => boolean;
  canUseFeature: (featureId: string) => boolean;
  recordFeatureUsage: (featureId: string) => Promise<boolean>;
  getRemainingUsage: (featureId: string) => number;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    conversationsUsed: 0,
    conversationsLimit: 5,
    lessonsAccessed: 0,
    premiumFeaturesAttempted: 0
  });
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      // Check subscription status from Supabase
      const { data: subData } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subData?.subscribed) {
        setSubscription({
          tier: subData.subscription_tier === 'business' ? 'business' : 'premium',
          status: 'active',
          currentPeriodEnd: subData.subscription_end ? new Date(subData.subscription_end) : undefined
        });
      } else {
        setSubscription({
          tier: 'free',
          status: 'active'
        });
      }

      // Get usage stats
      await fetchUsageStats();
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription({
        tier: 'free',
        status: 'active'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageStats = async () => {
    if (!user) return;

    try {
      // Get today's usage from conversations table
      const today = new Date().toISOString().split('T')[0];
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00.000Z`);

      setUsageStats(prev => ({
        ...prev,
        conversationsUsed: conversations?.length || 0,
        conversationsLimit: subscription?.tier === 'free' ? 5 : -1
      }));
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    }
  };

  const isFeatureAvailable = (featureId: string): boolean => {
    if (!subscription) return false;
    
    const plan = SUBSCRIPTION_PLANS[subscription.tier];
    
    switch (featureId) {
      case 'unlimited_conversations':
        return plan.limits.conversations === -1;
      case 'advanced_analytics':
      case 'offline_learning':
        return plan.limits.advancedFeatures;
      case 'ielts_mastery':
        return subscription.tier !== 'free';
      case 'business_english_pro':
        return subscription.tier === 'business';
      default:
        return subscription.tier !== 'free';
    }
  };

  const canUseFeature = (featureId: string): boolean => {
    if (!subscription) return false;

    if (isFeatureAvailable(featureId)) return true;

    // Check usage limits for free users
    if (featureId === 'unlimited_conversations') {
      return usageStats.conversationsUsed < usageStats.conversationsLimit;
    }

    return false;
  };

  const recordFeatureUsage = async (featureId: string): Promise<boolean> => {
    if (!user) return false;

    if (isFeatureAvailable(featureId)) return true;

    // Check and update usage for limited features
    if (featureId === 'unlimited_conversations') {
      if (usageStats.conversationsUsed >= usageStats.conversationsLimit) {
        setUsageStats(prev => ({
          ...prev,
          premiumFeaturesAttempted: prev.premiumFeaturesAttempted + 1,
          lastUpgradePrompt: new Date()
        }));
        return false;
      }

      setUsageStats(prev => ({
        ...prev,
        conversationsUsed: prev.conversationsUsed + 1
      }));
      return true;
    }

    setUsageStats(prev => ({
      ...prev,
      premiumFeaturesAttempted: prev.premiumFeaturesAttempted + 1,
      lastUpgradePrompt: new Date()
    }));
    return false;
  };

  const getRemainingUsage = (featureId: string): number => {
    if (isFeatureAvailable(featureId)) return -1; // unlimited

    if (featureId === 'unlimited_conversations') {
      return Math.max(0, usageStats.conversationsLimit - usageStats.conversationsUsed);
    }

    return 0;
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Refresh usage stats every minute
    const interval = setInterval(() => {
      if (user && subscription?.tier === 'free') {
        fetchUsageStats();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user, subscription]);

  return (
    <PremiumContext.Provider
      value={{
        subscription,
        usageStats,
        loading,
        checkSubscription,
        isFeatureAvailable,
        canUseFeature,
        recordFeatureUsage,
        getRemainingUsage
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}