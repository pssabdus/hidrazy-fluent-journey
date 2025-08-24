import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Zap, 
  Users, 
  Globe, 
  MessageSquare, 
  TrendingUp, 
  Check,
  Star,
  Unlock,
  BarChart3,
  Brain,
  Headphones
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePremium } from '@/hooks/usePremium';
import { useToast } from '@/components/ui/use-toast';

interface PremiumFeature {
  icon: React.ElementType;
  title: string;
  description: string;
  available: boolean;
  category: 'ai' | 'analytics' | 'conversation' | 'content';
}

export const PremiumFeaturesShowcase: React.FC = () => {
  const { subscription } = usePremium();
  const isPremium = subscription?.tier === 'premium' || subscription?.tier === 'business';
  
  const handleUpgrade = async () => {
    // Redirect to premium page for now
    window.location.href = '/premium';
  };
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const premiumFeatures: PremiumFeature[] = [
    {
      icon: Brain,
      title: "Advanced AI Personality Modes",
      description: "Access Razia's specialized personalities for business, academic, and IELTS preparation",
      available: isPremium,
      category: 'ai'
    },
    {
      icon: MessageSquare,
      title: "Unlimited Conversations",
      description: "Practice with Razia as much as you want - no daily limits",
      available: isPremium,
      category: 'conversation'
    },
    {
      icon: BarChart3,
      title: "Deep Learning Analytics",
      description: "Advanced progress tracking with AI-powered insights and recommendations",
      available: isPremium,
      category: 'analytics'
    },
    {
      icon: Globe,
      title: "Cultural Intelligence Training",
      description: "Specialized modules for navigating English-speaking cultures",
      available: isPremium,
      category: 'content'
    },
    {
      icon: Headphones,
      title: "Real-time Voice Chat",
      description: "Practice pronunciation with instant AI feedback and coaching",
      available: isPremium,
      category: 'conversation'
    },
    {
      icon: TrendingUp,
      title: "Personalized Learning Path",
      description: "AI-curated curriculum adapted to your specific goals and progress",
      available: isPremium,
      category: 'ai'
    },
    {
      icon: Users,
      title: "Business English Mastery",
      description: "Professional scenarios, presentations, and workplace communication",
      available: isPremium,
      category: 'content'
    },
    {
      icon: Star,
      title: "IELTS Preparation Suite",
      description: "Complete IELTS training with mock tests and band score predictions",
      available: isPremium,
      category: 'content'
    }
  ];


  const categoryColors = {
    ai: 'bg-purple-50 border-purple-200 text-purple-700',
    analytics: 'bg-blue-50 border-blue-200 text-blue-700', 
    conversation: 'bg-green-50 border-green-200 text-green-700',
    content: 'bg-orange-50 border-orange-200 text-orange-700'
  };

  const categoryIcons = {
    ai: Brain,
    analytics: BarChart3,
    conversation: MessageSquare,
    content: Globe
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full"
        >
          <Crown className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Premium Features</span>
        </motion.div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Unlock Your English Potential
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get unlimited access to Razia's advanced AI coaching, deep analytics, and specialized training modules
        </p>
      </div>

      {/* Current Status */}
      {isPremium ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Crown className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Premium Active</h3>
                     <p className="text-sm text-green-700">
                       Subscription: {subscription?.tier || 'Premium'}
                       {subscription?.currentPeriodEnd && (
                         <span className="ml-2">
                           • Renews {subscription.currentPeriodEnd.toLocaleDateString()}
                         </span>
                       )}
                     </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Check className="h-3 w-3 mr-1" />
                  All Features Unlocked
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Unlock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">Free Plan</h3>
                    <p className="text-sm text-purple-700">
                      Limited to 5 conversations per day • Basic features only
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Feature Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(categoryColors).map(([category, colorClass], index) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          const featuresCount = premiumFeatures.filter(f => f.category === category).length;
          const unlockedCount = premiumFeatures.filter(f => f.category === category && f.available).length;
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`text-center ${colorClass}`}>
                <CardContent className="p-4">
                  <Icon className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold capitalize">{category}</h3>
                  <p className="text-xs mt-1">
                    {unlockedCount}/{featuresCount} features
                  </p>
                  <Progress 
                    value={(unlockedCount / featuresCount) * 100} 
                    className="h-1 mt-2" 
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Premium Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiumFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`h-full transition-all duration-300 hover:shadow-lg ${
                feature.available 
                  ? 'bg-green-50 border-green-200' 
                  : 'hover:scale-105 cursor-pointer'
              }`}
              onClick={!feature.available ? handleUpgrade : undefined}
            >
              <CardHeader className="text-center pb-3">
                <div className="relative inline-block mx-auto">
                  <div className={`p-3 rounded-full ${
                    feature.available 
                      ? 'bg-green-100' 
                      : 'bg-gray-100'
                  }`}>
                    <feature.icon className={`h-6 w-6 ${
                      feature.available 
                        ? 'text-green-600' 
                        : 'text-gray-500'
                    }`} />
                  </div>
                  {feature.available && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-2 w-2 text-white" />
                    </div>
                  )}
                  {!feature.available && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Crown className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <Badge 
                  variant="outline" 
                  className={`${categoryColors[feature.category]} text-xs`}
                >
                  {feature.category.toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
                
                {feature.available ? (
                  <div className="mt-4 text-center">
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <Check className="h-3 w-3 mr-1" />
                      Unlocked
                    </Badge>
                  </div>
                ) : (
                  <div className="mt-4 text-center">
                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium Required
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pricing Section */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-purple-900">Ready to Transform Your English?</h2>
                  <p className="text-purple-700 mt-2">
                    Join thousands of Arabic speakers who've accelerated their English learning with Razia Premium
                  </p>
                </div>
                
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-900">$9.99</div>
                    <div className="text-sm text-purple-600">per month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg text-purple-700">or</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-900">$99</div>
                    <div className="text-sm text-purple-600">per year (save 17%)</div>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Crown className="h-5 w-5 mr-2" />
                  )}
                  Start Premium Journey
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-purple-700">
                    <Check className="h-4 w-4" />
                    Cancel anytime
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-purple-700">
                    <Check className="h-4 w-4" />
                    7-day free trial
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-purple-700">
                    <Check className="h-4 w-4" />
                    Instant activation
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};