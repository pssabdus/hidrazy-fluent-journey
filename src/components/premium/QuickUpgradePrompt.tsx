import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePremium } from '@/hooks/usePremium';
import { useNavigate } from 'react-router-dom';

interface QuickUpgradePromptProps {
  featureId: string;
  onDismiss: () => void;
}

export function QuickUpgradePrompt({ featureId, onDismiss }: QuickUpgradePromptProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { usageStats } = usePremium();
  const navigate = useNavigate();

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleUpgrade = () => {
    navigate('/premium');
  };

  const featureMessages = {
    unlimited_conversations: {
      title: 'Daily Chat Limit Reached',
      description: 'Continue your English journey with unlimited conversations',
      benefits: ['Unlimited daily chats', 'Extended conversation history', 'Advanced personalities']
    },
    advanced_analytics: {
      title: 'Advanced Analytics Locked',
      description: 'Get detailed insights into your learning progress',
      benefits: ['Personalized insights', 'Mistake pattern analysis', 'Learning velocity tracking']
    },
    offline_learning: {
      title: 'Offline Learning Available',
      description: 'Take your lessons anywhere, even without internet',
      benefits: ['Download unlimited lessons', 'Offline conversation mode', 'Background sync']
    }
  };

  const feature = featureMessages[featureId as keyof typeof featureMessages] || featureMessages.unlimited_conversations;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end justify-center p-4"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white shadow-xl border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center"
                  >
                    <Crown className="h-6 w-6 text-white" />
                  </motion.div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {feature.benefits.slice(0, 2).map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {usageStats.conversationsUsed > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs text-blue-800 text-center">
                        💡 You've used {usageStats.conversationsUsed} conversations today. 
                        Premium users get unlimited access!
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleDismiss}
                    >
                      Maybe Later
                    </Button>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-primary to-accent text-white"
                      onClick={handleUpgrade}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Upgrade
                    </Button>
                  </div>

                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      ✓ 7-day free trial • ✓ Cancel anytime
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}