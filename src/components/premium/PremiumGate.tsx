import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Star, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePremium } from '@/hooks/usePremium';
import { PREMIUM_FEATURES, type UpgradeContext } from '@/types/premium';

interface PremiumGateProps {
  featureId: string;
  children: ReactNode;
  fallback?: ReactNode;
  showPreview?: boolean;
  customMessage?: string;
}

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: UpgradeContext;
}

export function PremiumGate({ 
  featureId, 
  children, 
  fallback, 
  showPreview = true,
  customMessage 
}: PremiumGateProps) {
  const { isFeatureAvailable, canUseFeature } = usePremium();

  const feature = PREMIUM_FEATURES.find(f => f.id === featureId);
  
  if (isFeatureAvailable(featureId)) {
    return <>{children}</>;
  }

  if (!canUseFeature(featureId)) {
    return (
      <PremiumContentGate 
        feature={feature!}
        showPreview={showPreview}
        customMessage={customMessage}
      >
        {fallback}
      </PremiumContentGate>
    );
  }

  return <>{children}</>;
}

function PremiumContentGate({ 
  feature, 
  showPreview, 
  customMessage, 
  children 
}: {
  feature: any;
  showPreview: boolean;
  customMessage?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative">
      {/* Preview Content (blurred) */}
      {showPreview && children && (
        <div className="filter blur-sm pointer-events-none select-none">
          {children}
        </div>
      )}
      
      {/* Glass Morphism Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center"
      >
        <Card className="bg-white/90 backdrop-blur-sm border border-primary/20 shadow-lg max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-4"
            >
              <Lock className="h-8 w-8 text-white" />
            </motion.div>

            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">
                {feature.icon} {feature.name}
              </Badge>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {customMessage || 'Unlock Premium Feature'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>

            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-2">What you'll get:</div>
              <div className="space-y-1">
                {feature.benefits.slice(0, 3).map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-primary mr-2" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-primary to-accent text-white font-medium">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>

            <div className="mt-3">
              <div className="text-xs text-muted-foreground">
                Continue where you left off after upgrading
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export function UpgradeModal({ isOpen, onClose, context }: UpgradeModalProps) {
  const feature = PREMIUM_FEATURES.find(f => f.id === context.featureId);
  
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-4"
            >
              <Crown className="h-10 w-10 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Unlock {feature?.name}
            </h2>
            <p className="text-muted-foreground">
              Join thousands of learners accelerating their English journey
            </p>
          </div>

          {/* Feature Benefits */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Zap className="h-5 w-5 text-primary mr-2" />
              Premium Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feature?.benefits.map((benefit: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-3 bg-primary/5 rounded-lg"
                >
                  <Star className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-4">
                <div className="text-center">
                  <Badge className="mb-2 bg-primary text-white">Most Popular</Badge>
                  <h4 className="font-semibold text-lg">Premium</h4>
                  <div className="text-2xl font-bold text-primary">$9.99<span className="text-sm text-muted-foreground">/month</span></div>
                  <p className="text-xs text-muted-foreground mb-4">Everything you need to master English</p>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent text-white">
                    Start Free Trial
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-semibold text-lg">Business</h4>
                  <div className="text-2xl font-bold">$19.99<span className="text-sm text-muted-foreground">/month</span></div>
                  <p className="text-xs text-muted-foreground mb-4">Advanced features for professionals</p>
                  <Button variant="outline" className="w-full">
                    Choose Business
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Proof */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="flex justify-center items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm font-medium">4.9/5 from 12,000+ users</span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Premium features helped me achieve my IELTS target score 3 months faster!"
              </p>
              <p className="text-xs text-muted-foreground mt-1">- Sarah K., Premium User</p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={onClose}>
              Maybe Later
            </Button>
            <div className="text-xs text-muted-foreground">
              ✓ 7-day free trial • ✓ Cancel anytime • ✓ 30-day money-back guarantee
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}