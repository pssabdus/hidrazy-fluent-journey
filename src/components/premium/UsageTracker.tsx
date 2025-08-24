import { usePremium } from '@/hooks/usePremium';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crown, MessageCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function UsageTracker() {
  const { subscription, usageStats, getRemainingUsage, isFeatureAvailable } = usePremium();
  const navigate = useNavigate();

  if (!subscription || subscription.tier !== 'free') {
    return null;
  }

  const remainingConversations = getRemainingUsage('unlimited_conversations');
  const conversationProgress = ((usageStats.conversationsUsed / usageStats.conversationsLimit) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-3"
    >
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Daily Conversations</span>
            </div>
            <Badge variant="outline" className="border-amber-300 text-amber-700">
              {remainingConversations} left
            </Badge>
          </div>
          
          <Progress 
            value={conversationProgress} 
            className="h-2 mb-3"
          />
          
          <div className="flex items-center justify-between text-xs text-amber-700">
            <span>{usageStats.conversationsUsed} / {usageStats.conversationsLimit} used</span>
            {remainingConversations === 0 && (
              <span className="font-medium">Limit reached</span>
            )}
          </div>
        </CardContent>
      </Card>

      {remainingConversations <= 2 && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-4">
              <Crown className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-foreground font-medium mb-2">
                {remainingConversations === 0 
                  ? "You've reached your daily limit!" 
                  : "Almost at your daily limit!"
                }
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Upgrade to Premium for unlimited conversations
              </p>
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-primary to-accent text-white"
                onClick={() => navigate('/premium')}
              >
                <Zap className="h-3 w-3 mr-1" />
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {usageStats.premiumFeaturesAttempted > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-3">
              <p className="text-xs text-purple-700 mb-2">
                You've tried {usageStats.premiumFeaturesAttempted} premium features today
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="text-purple-700 border-purple-300 hover:bg-purple-100"
                onClick={() => navigate('/premium')}
              >
                See What You're Missing
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}