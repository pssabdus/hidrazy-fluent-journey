import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  Download, 
  Settings,
  TrendingUp,
  Users,
  Star,
  ExternalLink,
  Pause,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePremium } from '@/hooks/usePremium';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function SubscriptionManagement() {
  const { subscription, usageStats, loading } = usePremium();
  const [isManaging, setIsManaging] = useState(false);

  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Unable to open subscription management. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsManaging(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Unable to start upgrade process. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`relative overflow-hidden ${
          subscription?.tier === 'premium' || subscription?.tier === 'business' 
            ? 'border-primary bg-gradient-to-br from-primary/5 to-accent/5' 
            : ''
        }`}>
          {subscription?.tier !== 'free' && (
            <div className="absolute top-4 right-4">
              <Crown className="h-6 w-6 text-primary" />
            </div>
          )}
          
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={subscription?.tier === 'free' ? 'secondary' : 'default'} className="capitalize">
                  {subscription?.tier || 'Free'} Plan
                </Badge>
                {subscription?.status === 'trialing' && (
                  <Badge variant="outline">Free Trial</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {subscription?.tier === 'free' ? (
                <div>
                  <p className="text-muted-foreground mb-4">
                    You're currently on the free plan. Upgrade to unlock powerful features and accelerate your learning.
                  </p>
                  <Button onClick={handleUpgrade} className="bg-gradient-to-r from-primary to-accent text-white">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">
                        {subscription?.tier === 'business' ? 'Business' : 'Premium'} Subscription
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        ${subscription?.tier === 'business' ? '19.99' : '9.99'}/month
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Next billing</div>
                      <div className="font-medium">
                        {subscription?.currentPeriodEnd?.toLocaleDateString() || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleManageSubscription}
                    disabled={isManaging}
                    variant="outline"
                    className="w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {isManaging ? 'Opening...' : 'Manage Subscription'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Usage Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Conversations Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Daily Conversations</span>
                  <span className="text-sm text-muted-foreground">
                    {subscription?.tier === 'free' 
                      ? `${usageStats.conversationsUsed}/${usageStats.conversationsLimit}`
                      : `${usageStats.conversationsUsed} (unlimited)`
                    }
                  </span>
                </div>
                {subscription?.tier === 'free' && (
                  <Progress 
                    value={(usageStats.conversationsUsed / usageStats.conversationsLimit) * 100} 
                    className="h-2"
                  />
                )}
              </div>

              {/* Lessons Accessed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Lessons This Month</span>
                  <span className="text-sm text-muted-foreground">
                    {usageStats.lessonsAccessed}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {subscription?.tier === 'free' 
                    ? 'Upgrade for unlimited access'
                    : 'Unlimited access'
                  }
                </div>
              </div>

              {/* Value Demonstration */}
              {subscription?.tier !== 'free' && (
                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">Your Learning Value</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{usageStats.conversationsUsed * 2}</div>
                      <div className="text-muted-foreground">Hours of practice</div>
                    </div>
                    <div>
                      <div className="font-medium">$0.33</div>
                      <div className="text-muted-foreground">Cost per conversation</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              {subscription?.tier === 'free' ? 'Available with Premium' : 'Your Premium Features'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Unlimited Conversations', available: subscription?.tier !== 'free' },
                { name: 'Advanced Analytics', available: subscription?.tier !== 'free' },
                { name: 'Offline Learning', available: subscription?.tier !== 'free' },
                { name: 'IELTS Mastery', available: subscription?.tier !== 'free' },
                { name: 'Business English Pro', available: subscription?.tier === 'business' },
                { name: 'Priority Support', available: subscription?.tier !== 'free' }
              ].map((feature, index) => (
                <div 
                  key={feature.name}
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    feature.available ? 'bg-green-50 text-green-700' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {feature.available ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  ) : (
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                  )}
                  <span className="text-sm">{feature.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Billing History */}
      {subscription?.tier !== 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Current Period</div>
                    <div className="text-sm text-muted-foreground">
                      ${subscription?.tier === 'business' ? '19.99' : '9.99'} charged monthly
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
                
                <Separator />
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={handleManageSubscription}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Billing History
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      {subscription?.tier !== 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleManageSubscription}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Subscription
                </Button>
                <Button variant="outline" onClick={handleManageSubscription}>
                  <Users className="h-4 w-4 mr-2" />
                  Change Plan
                </Button>
                <Button variant="outline" onClick={handleManageSubscription}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Update Payment Method
                </Button>
                <Button variant="outline" onClick={handleManageSubscription} className="text-red-600 hover:text-red-700">
                  <X className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}