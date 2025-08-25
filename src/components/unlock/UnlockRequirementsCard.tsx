import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Lock } from 'lucide-react';
import { UnlockMessage } from '@/services/IntelligentUnlockSystem';

interface UnlockRequirementsCardProps {
  featureName: string;
  unlockMessage: UnlockMessage;
  onUnlock?: () => void;
}

export function UnlockRequirementsCard({ featureName, unlockMessage, onUnlock }: UnlockRequirementsCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {unlockMessage.type === 'ready' ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
          {unlockMessage.title}
        </CardTitle>
        <CardDescription className="whitespace-pre-line">
          {unlockMessage.message}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {unlockMessage.requirements && (
          <div className="space-y-4">
            {/* Completed Requirements */}
            {unlockMessage.requirements.completed.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-success">Completed ✅</h4>
                {unlockMessage.requirements.completed.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-muted-foreground line-through">{req}</span>
                  </div>
                ))}
              </div>
            )}

            {/* In Progress Requirements */}
            {unlockMessage.requirements.inProgress.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-primary">In Progress 🔄</h4>
                {unlockMessage.requirements.inProgress.map((req, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{req.text}</span>
                      <Badge variant="secondary">{req.progress}%</Badge>
                    </div>
                    <Progress value={req.progress} className="h-2" />
                  </div>
                ))}
              </div>
            )}

            {/* Pending Requirements */}
            {unlockMessage.requirements.pending.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Coming Up ⏳</h4>
                {unlockMessage.requirements.pending.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{req}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {unlockMessage.type === 'ready' && unlockMessage.actionText && onUnlock && (
          <Button onClick={onUnlock} className="w-full">
            {unlockMessage.actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}