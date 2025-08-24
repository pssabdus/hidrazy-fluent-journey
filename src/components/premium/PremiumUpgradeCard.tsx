import { motion } from 'framer-motion';
import { Crown, Zap, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePremium } from '@/hooks/usePremium';
import { useNavigate } from 'react-router-dom';

export function PremiumUpgradeCard() {
  const { subscription, usageStats } = usePremium();
  const navigate = useNavigate();

  // Only show for free users
  if (!subscription || subscription.tier !== 'free') {
    return null;
  }

  const handleUpgrade = () => {
    navigate('/premium');
  };

  const usagePercentage = (usageStats.conversationsUsed / usageStats.conversationsLimit) * 100;
  const isNearLimit = usagePercentage >= 60;
  const hasTriedPremium = usageStats.premiumFeaturesAttempted > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="mb-6"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-purple-100 border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg"
            >
              <Crown className="h-6 w-6 text-white" />
            </motion.div>
            <Badge className="bg-gradient-to-r from-primary to-accent text-white">
              Limited Time
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {isNearLimit ? 'Almost at your daily limit!' : 'Unlock Your Full Potential'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {hasTriedPremium 
                  ? `You've explored ${usageStats.premiumFeaturesAttempted} premium features. Upgrade to unlock them all!`
                  : 'Get unlimited conversations, advanced analytics, and exclusive features.'
                }
              </p>
            </div>

            {/* Progress indicator for free users */}
            {isNearLimit && (
              <div className="bg-white/50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-foreground font-medium">Daily Usage</span>
                  <span className="text-muted-foreground">
                    {usageStats.conversationsUsed}/{usageStats.conversationsLimit}
                  </span>
                </div>
                <div className="w-full bg-white/80 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercentage}%` }}
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                'Unlimited conversations',
                'Advanced analytics',
                'Offline learning',
                'Premium features'
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center text-xs text-muted-foreground"
                >
                  <Star className="h-3 w-3 text-primary mr-1 flex-shrink-0" />
                  {feature}
                </motion.div>
              ))}
            </div>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-primary to-accent text-white font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Zap className="h-4 w-4 mr-2" />
              Upgrade to Premium
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <div className="text-center">
              <div className="text-xs text-muted-foreground">
                ✓ 7-day free trial • ✓ Cancel anytime • ✓ 30-day money-back guarantee
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}