import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Star, 
  Calendar, 
  CreditCard, 
  Settings, 
  Download,
  BarChart3,
  ExternalLink,
  CheckCircle,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  stripe_subscription_id: string | null;
}

interface UsageStats {
  lessonsCompleted: number;
  voiceRecordings: number;
  rolePlaySessions: number;
  studyTime: number; // in minutes
}

export function SubscriptionManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [usageStats] = useState<UsageStats>({
    lessonsCompleted: 24,
    voiceRecordings: 156,
    rolePlaySessions: 8,
    studyTime: 1240
  });

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        if (error) throw error;
        
        setSubscriptionData(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        toast({
          title: "Error",
          description: "Unable to load subscription data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user, toast]);

  const handleManageSubscription = async () => {
    setIsUpdating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Unable to open subscription management.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsUpdating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      
      setSubscriptionData(data);
      toast({
        title: "Status Updated",
        description: "Subscription status has been refreshed.",
      });
    } catch (error) {
      console.error('Error refreshing status:', error);
      toast({
        title: "Error",
        description: "Unable to refresh subscription status.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-xl font-semibold">Loading Subscription...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPremium = subscriptionData?.subscribed && subscriptionData?.subscription_tier;
  const isPremiumPlus = subscriptionData?.subscription_tier === 'premium_plus';
  const subscriptionEnd = subscriptionData?.subscription_end ? new Date(subscriptionData.subscription_end) : null;
  const daysRemaining = subscriptionEnd ? Math.ceil((subscriptionEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
          <p className="text-gray-600">Manage your Hidrazy subscription and view usage analytics</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={`relative overflow-hidden ${
                isPremiumPlus 
                  ? 'border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50' 
                  : isPremium 
                  ? 'border-2 border-blue-400 bg-gradient-to-r from-blue-50 to-purple-50'
                  : 'border-gray-200'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full ${
                        isPremiumPlus 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                          : isPremium 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                          : 'bg-gray-100'
                      } text-white`}>
                        {isPremiumPlus ? <Star className="w-6 h-6" /> : 
                         isPremium ? <Crown className="w-6 h-6" /> : 
                         <CheckCircle className="w-6 h-6 text-gray-600" />}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {isPremiumPlus ? 'Premium Plus' : isPremium ? 'Premium' : 'Free Plan'}
                        </CardTitle>
                        <p className="text-gray-600">
                          {isPremiumPlus ? 'Ultimate learning experience with personal tutoring' :
                           isPremium ? 'Full access to all Hidrazy features' :
                           'Basic access to Hidrazy'}
                        </p>
                      </div>
                    </div>
                    
                    {isPremium && (
                      <Badge className={`${
                        isPremiumPlus 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600'
                      } text-white border-none`}>
                        Active
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {isPremium ? (
                    <>
                      {/* Subscription Details */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Next Billing</p>
                            <p className="font-medium">
                              {subscriptionEnd?.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Days Remaining</p>
                            <p className="font-medium text-blue-600">{daysRemaining} days</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={handleManageSubscription}
                          disabled={isUpdating}
                          className="flex-1"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Subscription
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={handleRefreshStatus}
                          disabled={isUpdating}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Refresh Status
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
                      <p className="text-gray-600 mb-4">
                        Unlock unlimited access to all learning features
                      </p>
                      <Button 
                        onClick={() => window.location.href = '/pricing'}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      >
                        View Pricing Plans
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Usage Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Usage Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Lessons Completed</span>
                          <span className="text-sm text-gray-600">{usageStats.lessonsCompleted}/50</span>
                        </div>
                        <Progress value={(usageStats.lessonsCompleted / 50) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Voice Recordings</span>
                          <span className="text-sm text-gray-600">{usageStats.voiceRecordings}</span>
                        </div>
                        <Progress value={Math.min((usageStats.voiceRecordings / 200) * 100, 100)} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Role Play Sessions</span>
                          <span className="text-sm text-gray-600">{usageStats.rolePlaySessions}</span>
                        </div>
                        <Progress value={(usageStats.rolePlaySessions / 20) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Study Time</span>
                          <span className="text-sm text-gray-600">{Math.floor(usageStats.studyTime / 60)}h {usageStats.studyTime % 60}m</span>
                        </div>
                        <Progress value={Math.min((usageStats.studyTime / 1800) * 100, 100)} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Billing Portal
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    View Achievements
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Plan Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isPremiumPlus ? 'Premium Plus Benefits' : isPremium ? 'Premium Benefits' : 'Free Plan Features'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {isPremiumPlus ? [
                      "Personal tutor sessions (2/month)",
                      "Custom learning paths",
                      "Business English certification",
                      "Priority support",
                      "All Premium features"
                    ] : isPremium ? [
                      "All 8 learning worlds",
                      "Unlimited Razia practice",
                      "Unlimited role play",
                      "IELTS preparation",
                      "Offline downloads"
                    ] : [
                      "Foundation World access",
                      "Basic conversations (3/lesson)",
                      "Limited role play (2/week)",
                      "Progress tracking"
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Our support team is here to help with any subscription questions.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}