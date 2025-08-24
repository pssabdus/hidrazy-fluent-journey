import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Check, 
  Crown, 
  Star, 
  Zap,
  Globe,
  Mic,
  Users,
  BookOpen,
  Award,
  BarChart3,
  Download,
  HeadphonesIcon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  features: string[];
  cta: string;
  popular?: boolean;
  gradient?: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free Forever',
    description: 'Perfect for trying Hidrazy',
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: <BookOpen className="w-6 h-6" />,
    features: [
      'Foundation World access',
      'Basic Razia conversations (3 recordings/lesson)',
      'Limited role play (2/week)',
      'Progress tracking',
      'Community access'
    ],
    cta: 'Get Started Free'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Unlimited learning experience',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    badge: 'Most Popular',
    badgeColor: 'bg-blue-500',
    icon: <Crown className="w-6 h-6" />,
    popular: true,
    gradient: 'from-blue-500 to-purple-600',
    features: [
      'All 8 learning worlds',
      'Unlimited Razia practice',
      'Unlimited role play scenarios',
      'IELTS preparation course',
      'Offline lesson downloads',
      'Advanced progress analytics',
      'Voice feedback analysis',
      'Cultural context lessons'
    ],
    cta: 'Start Premium Trial'
  },
  {
    id: 'premium_plus',
    name: 'Premium Plus',
    description: 'Premium features + personal tutoring',
    monthlyPrice: 39.99,
    yearlyPrice: 399.99,
    icon: <Star className="w-6 h-6" />,
    gradient: 'from-yellow-500 to-orange-500',
    features: [
      'Everything in Premium',
      'Personal tutor sessions (2/month)',
      'Custom learning path',
      'Business English certification',
      'Priority support',
      'Advanced AI feedback',
      'Conversation recordings review',
      '1-on-1 speaking practice'
    ],
    cta: 'Go Premium Plus'
  }
];

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = async (tierId: string) => {
    if (tierId === 'free') {
      // Redirect to sign up or main app
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(tierId);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          tier: tierId,
          billing: isYearly ? 'yearly' : 'monthly'
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    const monthlyCost = monthlyPrice * 12;
    const savings = ((monthlyCost - yearlyPrice) / monthlyCost) * 100;
    return Math.round(savings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Choose Your Learning Journey
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Master English with AI-powered conversations, personalized feedback, 
              and immersive role-play scenarios designed for Arabic speakers.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mb-12"
        >
          <div className="flex items-center space-x-4 p-2 bg-white rounded-lg shadow-md">
            <span className={`text-sm font-medium ${!isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
              Yearly
            </span>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              Save up to 17%
            </Badge>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`relative ${tier.popular ? 'md:-mt-4' : ''}`}
            >
              <Card className={`h-full relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                tier.popular 
                  ? 'border-2 border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                {/* Popular Badge */}
                {tier.badge && (
                  <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${tier.badgeColor} text-white px-4 py-1 rounded-full text-sm font-medium`}>
                    {tier.badge}
                  </div>
                )}

                {/* Gradient Border for Premium */}
                {tier.gradient && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tier.gradient} opacity-5 rounded-lg`} />
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    tier.gradient 
                      ? `bg-gradient-to-r ${tier.gradient} text-white` 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tier.icon}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <p className="text-gray-600">{tier.description}</p>
                  
                  <div className="mt-4">
                    {tier.monthlyPrice === 0 ? (
                      <div className="text-4xl font-bold">Free</div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl font-bold">
                          ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                          <span className="text-lg font-normal text-gray-500">
                            /{isYearly ? 'year' : 'month'}
                          </span>
                        </div>
                        {isYearly && tier.monthlyPrice > 0 && (
                          <div className="text-sm text-green-600 font-medium">
                            Save {calculateSavings(tier.monthlyPrice, tier.yearlyPrice)}% annually
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={isLoading === tier.id}
                    className={`w-full py-3 font-semibold transition-all duration-300 ${
                      tier.id === 'free'
                        ? 'variant-outline border-blue-500 text-blue-600 hover:bg-blue-50'
                        : tier.gradient
                        ? `bg-gradient-to-r ${tier.gradient} hover:opacity-90 text-white shadow-lg hover:shadow-xl`
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isLoading === tier.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        {tier.cta}
                        {tier.gradient && <Sparkles className="w-4 h-4 ml-2" />}
                      </>
                    )}
                  </Button>

                  {tier.id === 'premium' && (
                    <p className="text-xs text-center text-gray-500">
                      7-day free trial • Cancel anytime
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Hidrazy Premium?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Globe className="w-8 h-8 text-blue-500" />,
                title: "8 Learning Worlds",
                description: "From beginner basics to advanced business English"
              },
              {
                icon: <Mic className="w-8 h-8 text-green-500" />,
                title: "AI Voice Analysis",
                description: "Real-time pronunciation feedback and accent training"
              },
              {
                icon: <Users className="w-8 h-8 text-purple-500" />,
                title: "Role Play Scenarios",
                description: "Practice real-world conversations with AI characters"
              },
              {
                icon: <Award className="w-8 h-8 text-orange-500" />,
                title: "IELTS Preparation",
                description: "Comprehensive test prep with practice exams"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes! You can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period."
              },
              {
                q: "Is there a free trial?",
                a: "Premium subscribers get a 7-day free trial. You can explore all features without any commitment."
              },
              {
                q: "Do you offer student discounts?",
                a: "Yes! Contact our support team with your student ID for special pricing options."
              }
            ].map((faq, index) => (
              <Card key={index} className="text-left p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}