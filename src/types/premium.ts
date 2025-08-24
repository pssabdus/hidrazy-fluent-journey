export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  benefits: string[];
  usageLimit?: number;
  category: 'analytics' | 'conversations' | 'offline' | 'ielts' | 'business' | 'core';
}

export interface UserSubscription {
  tier: 'free' | 'premium' | 'business';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

export interface UsageStats {
  conversationsUsed: number;
  conversationsLimit: number;
  lessonsAccessed: number;
  premiumFeaturesAttempted: number;
  lastUpgradePrompt?: Date;
}

export interface UpgradeContext {
  featureId: string;
  source: 'feature_gate' | 'usage_limit' | 'content_gate' | 'settings';
  userJourney: string;
}

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: 'unlimited_conversations',
    name: 'Unlimited Conversations',
    description: 'Chat with Razia without limits',
    icon: '💬',
    benefits: [
      'Unlimited daily conversations',
      'Extended conversation history',
      'Advanced Razia personalities',
      'Conversation bookmarking',
      'Share conversations with teachers'
    ],
    usageLimit: 5, // Free users get 5 conversations per day
    category: 'conversations'
  },
  {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Detailed insights into your learning progress',
    icon: '📊',
    benefits: [
      'Personalized learning insights',
      'Mistake pattern analysis',
      'Learning velocity tracking',
      'AI-generated study plans',
      'Progress comparisons'
    ],
    category: 'analytics'
  },
  {
    id: 'offline_learning',
    name: 'Offline Learning',
    description: 'Download lessons for offline study',
    icon: '📱',
    benefits: [
      'Download unlimited lessons',
      'Offline conversation mode',
      'Background sync',
      'Smart storage management',
      'Offline progress tracking'
    ],
    category: 'offline'
  },
  {
    id: 'ielts_mastery',
    name: 'IELTS Mastery',
    description: 'Complete IELTS preparation course',
    icon: '🎯',
    benefits: [
      'Full practice tests',
      'Band score prediction',
      'Writing feedback with rubrics',
      'Speaking assessment',
      'Test booking integration'
    ],
    category: 'ielts'
  },
  {
    id: 'business_english_pro',
    name: 'Business English Pro',
    description: 'Professional communication mastery',
    icon: '💼',
    benefits: [
      'Industry-specific vocabulary',
      'Professional scenarios',
      'LinkedIn integration',
      'Business writing templates',
      'Presentation skills training'
    ],
    category: 'business'
  }
];

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    period: 'forever',
    features: ['Basic conversations', 'Essential lessons', 'Progress tracking'],
    limits: {
      conversations: 5,
      lessonsPerDay: 3,
      advancedFeatures: false
    }
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    period: 'month',
    features: [
      'Unlimited conversations',
      'Advanced analytics',
      'Offline learning',
      'Priority support',
      'All lesson content'
    ],
    limits: {
      conversations: -1, // unlimited
      lessonsPerDay: -1, // unlimited
      advancedFeatures: true
    }
  },
  business: {
    name: 'Business',
    price: 19.99,
    period: 'month',
    features: [
      'Everything in Premium',
      'Business English Pro',
      'Team management',
      'Advanced reporting',
      'Custom content'
    ],
    limits: {
      conversations: -1,
      lessonsPerDay: -1,
      advancedFeatures: true,
      businessFeatures: true
    }
  }
} as const;