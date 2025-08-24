import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, BarChart3, Crown, Lock } from 'lucide-react';
import { PremiumGate } from '@/components/premium/PremiumGate';
import { usePremium } from '@/hooks/usePremium';

// Example usage of premium gating in a component
export function ExamplePremiumUsage() {
  const { recordFeatureUsage, getRemainingUsage } = usePremium();

  const handleStartConversation = async () => {
    const canUse = await recordFeatureUsage('unlimited_conversations');
    if (canUse) {
      // Start conversation
      console.log('Starting conversation...');
    } else {
      // Show upgrade modal
      console.log('Show upgrade modal');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Premium Feature Examples</h2>
      
      {/* Example 1: Conversation Feature with Gate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Start Conversation
            <Badge variant="secondary">
              {getRemainingUsage('unlimited_conversations') === -1 
                ? 'Unlimited' 
                : `${getRemainingUsage('unlimited_conversations')} left`}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PremiumGate featureId="unlimited_conversations">
            <Button onClick={handleStartConversation} className="w-full">
              Start New Conversation with Razia
            </Button>
          </PremiumGate>
        </CardContent>
      </Card>

      {/* Example 2: Analytics Feature with Gate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Advanced Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PremiumGate 
            featureId="advanced_analytics"
            customMessage="Unlock detailed learning insights"
          >
            <div className="space-y-4">
              <div className="h-40 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Advanced Analytics Dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">87%</div>
                  <div className="text-sm text-muted-foreground">Fluency Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+12%</div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">5.2</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
              </div>
            </div>
          </PremiumGate>
        </CardContent>
      </Card>

      {/* Example 3: Premium Content with Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Exclusive Premium Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PremiumGate 
            featureId="ielts_mastery" 
            showPreview={true}
            customMessage="Unlock IELTS Mastery Course"
          >
            <div className="space-y-4">
              <h3 className="font-semibold">IELTS Writing Task 2: Academic Essays</h3>
              <p className="text-muted-foreground">
                Master the art of academic essay writing with our comprehensive course. 
                Learn advanced structures, vocabulary, and techniques used by band 8+ students.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Essay Structure</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Introduction techniques</li>
                    <li>• Body paragraph development</li>
                    <li>• Conclusion strategies</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Advanced Vocabulary</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Academic word lists</li>
                    <li>• Collocations</li>
                    <li>• Transition phrases</li>
                  </ul>
                </div>
              </div>
            </div>
          </PremiumGate>
        </CardContent>
      </Card>
    </div>
  );
}