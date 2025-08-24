import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, Crown, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        navigate('/pricing');
        return;
      }

      try {
        // Check subscription status
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) throw error;

        setSubscriptionData(data);
        
        toast({
          title: "Payment Successful! 🎉",
          description: `Welcome to ${data.subscription_tier === 'premium_plus' ? 'Premium Plus' : 'Premium'}!`,
        });

      } catch (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: "Verification Error",
          description: "We're processing your payment. Please check back in a few minutes.",
          variant: "destructive"
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate, toast]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Sparkles className="w-16 h-16 text-blue-500" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your subscription.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPremiumPlus = subscriptionData?.subscription_tier === 'premium_plus';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center overflow-hidden">
            <CardContent className="p-12">
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-8"
              >
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                  isPremiumPlus 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                } text-white mb-6`}>
                  <CheckCircle className="w-12 h-12" />
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h1 className="text-4xl font-bold mb-4">
                  Welcome to Hidrazy {isPremiumPlus ? 'Premium Plus' : 'Premium'}! 🎉
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Your subscription is now active. Get ready to master English like never before!
                </p>
              </motion.div>

              {/* Features Unlocked */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center gap-2">
                  {isPremiumPlus ? <Star className="w-6 h-6 text-yellow-500" /> : <Crown className="w-6 h-6 text-blue-500" />}
                  Features Unlocked
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {isPremiumPlus ? [
                    "Personal tutor sessions (2/month)",
                    "Custom learning path creation",
                    "Business English certification",
                    "Priority 24/7 support",
                    "Advanced AI feedback analysis",
                    "Conversation recordings review",
                    "1-on-1 speaking practice sessions",
                    "Plus all Premium features"
                  ] : [
                    "All 8 learning worlds",
                    "Unlimited Razia conversations",
                    "Unlimited role play scenarios",
                    "IELTS preparation course",
                    "Offline lesson downloads",
                    "Advanced progress analytics",
                    "Voice feedback analysis",
                    "Cultural context lessons"
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center space-x-3 text-left"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold mb-4">Ready to start learning?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/')}
                    className={`${
                      isPremiumPlus 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                    } text-white px-8 py-3`}
                  >
                    Start Learning Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/subscription')}
                    className="px-8 py-3"
                  >
                    Manage Subscription
                  </Button>
                </div>
              </motion.div>

              {/* Celebration Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    initial={{ 
                      opacity: 1,
                      y: "100vh",
                      x: Math.random() * window.innerWidth
                    }}
                    animate={{ 
                      opacity: 0,
                      y: "-100vh",
                      rotate: Math.random() * 360
                    }}
                    transition={{ 
                      duration: 3,
                      delay: Math.random() * 2,
                      repeat: Infinity,
                      repeatDelay: 5
                    }}
                  >
                    {['🎉', '✨', '🎊', '💎', '🌟'][Math.floor(Math.random() * 5)]}
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}