import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle, 
  BarChart3, 
  Download, 
  Target, 
  Briefcase,
  Crown,
  TrendingUp,
  Users,
  Star,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePremium } from '@/hooks/usePremium';
import { PremiumGate } from './PremiumGate';

export function PremiumShowcase() {
  const { subscription, usageStats, getRemainingUsage } = usePremium();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'unlimited_conversations',
      title: 'Unlimited Conversations',
      description: 'Chat with Razia without daily limits',
      icon: MessageCircle,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      preview: {
        current: `${usageStats.conversationsUsed}/${subscription?.tier === 'free' ? '5' : '∞'}`,
        premium: 'Unlimited daily chats'
      },
      benefits: [
        'No daily conversation limits',
        'Extended conversation history',
        'Advanced Razia personalities',
        'Conversation bookmarking'
      ]
    },
    {
      id: 'advanced_analytics',
      title: 'Advanced Analytics',
      description: 'Deep insights into your learning progress',
      icon: BarChart3,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      preview: {
        current: 'Basic progress tracking',
        premium: 'AI-powered insights & recommendations'
      },
      benefits: [
        'Personalized learning insights',
        'Mistake pattern analysis',
        'Learning velocity tracking',
        'AI-generated study plans'
      ]
    },
    {
      id: 'offline_learning',
      title: 'Offline Learning',
      description: 'Download lessons for study anywhere',
      icon: Download,
      color: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-50',
      preview: {
        current: 'Online only',
        premium: 'Download unlimited lessons'
      },
      benefits: [
        'Download unlimited lessons',
        'Offline conversation mode',
        'Background sync',
        'Smart storage management'
      ]
    },
    {
      id: 'ielts_mastery',
      title: 'IELTS Mastery',
      description: 'Complete IELTS preparation course',
      icon: Target,
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50',
      preview: {
        current: 'Basic practice',
        premium: 'Full IELTS course & assessment'
      },
      benefits: [
        'Full practice tests',
        'Band score prediction',
        'Writing feedback with rubrics',
        'Speaking assessment'
      ]
    },
    {
      id: 'business_english_pro',
      title: 'Business English Pro',
      description: 'Professional communication mastery',
      icon: Briefcase,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      preview: {
        current: 'General English only',
        premium: 'Business-focused curriculum'
      },
      benefits: [
        'Industry-specific vocabulary',
        'Professional scenarios',
        'LinkedIn integration',
        'Business writing templates'
      ],
      businessOnly: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-4"
        >
          <Crown className="h-8 w-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Premium Features</h1>
        <p className="text-muted-foreground">
          Unlock powerful tools to accelerate your English learning journey
        </p>
      </div>

      {/* Current Plan Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={`${
          subscription?.tier !== 'free' 
            ? 'border-primary bg-gradient-to-br from-primary/5 to-accent/5' 
            : 'border-border'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {subscription?.tier !== 'free' && <Crown className="h-6 w-6 text-primary" />}
                <div>
                  <h3 className="font-semibold capitalize">
                    {subscription?.tier || 'Free'} Plan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {subscription?.tier === 'free' 
                      ? 'Limited features • Upgrade to unlock full potential'
                      : 'All premium features unlocked'
                    }
                  </p>
                </div>
              </div>
              
              {subscription?.tier === 'free' && (
                <Button className="bg-gradient-to-r from-primary to-accent text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          const isAvailable = subscription?.tier !== 'free' && 
            (!feature.businessOnly || subscription?.tier === 'business');
          
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedFeature === feature.id ? 'ring-2 ring-primary' : ''
                } ${isAvailable ? 'border-green-200 bg-green-50/50' : ''}`}
                onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${feature.bgColor}`}>
                        <IconComponent className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {isAvailable ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : feature.businessOnly && subscription?.tier === 'premium' ? (
                        <Badge variant="outline">Business Only</Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Feature Preview */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Current</div>
                        <div className="font-medium">{feature.preview.current}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Premium</div>
                        <div className="font-medium text-primary">{feature.preview.premium}</div>
                      </div>
                    </div>

                    {/* Progress for limited features */}
                    {feature.id === 'unlimited_conversations' && subscription?.tier === 'free' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Daily usage</span>
                          <span>{usageStats.conversationsUsed}/5</span>
                        </div>
                        <Progress value={(usageStats.conversationsUsed / 5) * 100} className="h-2" />
                      </div>
                    )}

                    {/* Expanded Benefits */}
                    {selectedFeature === feature.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4 border-t border-border"
                      >
                        <h4 className="font-medium mb-3 flex items-center">
                          <Star className="h-4 w-4 text-primary mr-2" />
                          Key Benefits
                        </h4>
                        <div className="space-y-2">
                          {feature.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                              {benefit}
                            </div>
                          ))}
                        </div>
                        
                        {!isAvailable && (
                          <PremiumGate featureId={feature.id} showPreview={false}>
                            <Button 
                              className="w-full mt-4 bg-gradient-to-r from-primary to-accent text-white"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Crown className="h-4 w-4 mr-2" />
                              Unlock {feature.title}
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </PremiumGate>
                        )}
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Success Stories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Premium User Success Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: "Sarah K.",
                  achievement: "IELTS Band 8",
                  story: "Achieved target score 3 months faster with premium analytics",
                  time: "6 months"
                },
                {
                  name: "Mohammed A.",
                  achievement: "Business Promotion",
                  story: "Landed international role using Business English Pro",
                  time: "4 months"
                },
                {
                  name: "Li W.",
                  achievement: "University Acceptance",
                  story: "Improved speaking confidence with unlimited conversations",
                  time: "8 months"
                }
              ].map((story, index) => (
                <div key={index} className="bg-white/60 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {story.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{story.name}</div>
                      <div className="text-xs text-muted-foreground">{story.time} journey</div>
                    </div>
                  </div>
                  <div className="font-medium text-primary text-sm mb-1">{story.achievement}</div>
                  <div className="text-xs text-muted-foreground">{story.story}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}