import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { IntelligentUnlockSystem, UnlockMessage } from '@/services/IntelligentUnlockSystem';
import { UnlockRequirementsCard } from './UnlockRequirementsCard';
import { useAuth } from '@/hooks/useAuth';

interface FeatureUnlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  featureId: string;
  featureName: string;
  onUnlock?: () => void;
}

export function FeatureUnlockDialog({ 
  isOpen, 
  onClose, 
  featureId, 
  featureName, 
  onUnlock 
}: FeatureUnlockDialogProps) {
  const { user } = useAuth();
  const [unlockMessage, setUnlockMessage] = useState<UnlockMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id && featureId) {
      assessFeature();
    }
  }, [isOpen, user?.id, featureId]);

  const assessFeature = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const readinessScore = await IntelligentUnlockSystem.assessFeatureReadiness(user.id, featureId);
      const userProfile = await IntelligentUnlockSystem.buildLearnerContext(user.id);
      
      // Mock feature definition for demo
      const mockFeature = {
        name: featureName,
        category: 'conversation_practice',
        difficulty: 'intermediate',
        requirements: [],
        successFactors: [],
        historicalSuccess: 85,
        avgEngagement: 8,
        completionRate: 78,
        satisfaction: 4.2,
        userExperience: 'interactive role-play scenarios that build confidence through practice'
      };

      const message = IntelligentUnlockSystem.generateUnlockMessage(readinessScore, mockFeature, userProfile);
      setUnlockMessage(message);
    } catch (error) {
      console.error('Error assessing feature:', error);
      // Fallback message
      setUnlockMessage({
        type: 'not_ready',
        title: 'Feature Assessment',
        message: 'We\'re analyzing your readiness for this feature. Please try again in a moment.',
        requirements: {
          completed: [],
          inProgress: [],
          pending: ['Complete assessment']
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = () => {
    onUnlock?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Feature Readiness Assessment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Analyzing your progress...</span>
            </div>
          ) : unlockMessage ? (
            <UnlockRequirementsCard
              featureName={featureName}
              unlockMessage={unlockMessage}
              onUnlock={handleUnlock}
            />
          ) : null}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}