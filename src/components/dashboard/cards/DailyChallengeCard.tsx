import { motion } from 'framer-motion';
import { Timer, Flame, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DailyChallengeCardProps {
  timeRemaining: string;
  streak: number;
  challengeTitle: string;
  onStartChallenge: () => void;
  className?: string;
}

export function DailyChallengeCard({ 
  timeRemaining, 
  streak, 
  challengeTitle,
  onStartChallenge,
  className 
}: DailyChallengeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      className={className}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Timer className="w-5 h-5 text-orange-500" />
              </motion.div>
              <h3 className="font-semibold text-foreground">Daily Challenge</h3>
            </div>
            
            <Badge className="bg-orange-100 text-orange-700 border-orange-300">
              {timeRemaining} left
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">{challengeTitle}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={streak > 0 ? {
                  scale: [1, 1.2, 1],
                } : {}}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Flame className="w-4 h-4 text-orange-500" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700">
                {streak} day streak
              </span>
            </div>
          </div>
          
          <Button 
            onClick={onStartChallenge}
            variant="outline"
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 transition-all duration-300"
          >
            <Play className="w-4 h-4 mr-2" />
            Quick Practice
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}