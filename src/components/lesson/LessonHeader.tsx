import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Clock, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface LessonHeaderProps {
  title: string;
  progress: number;
  estimatedTimeMinutes: number;
  onExit: () => void;
  lessonType: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function LessonHeader({ 
  title, 
  progress, 
  estimatedTimeMinutes, 
  onExit, 
  lessonType,
  difficulty 
}: LessonHeaderProps) {
  const [showExitModal, setShowExitModal] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000 / 60));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressSegments = () => {
    const segments = 10;
    const completedSegments = Math.floor((progress / 100) * segments);
    
    return Array.from({ length: segments }, (_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: i * 0.1 }}
        className={`h-2 rounded-full flex-1 mx-0.5 ${
          i < completedSegments 
            ? 'bg-green-500' 
            : i === completedSegments && progress % 10 > 0
            ? 'bg-green-300'
            : 'bg-gray-200'
        }`}
      />
    ));
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExitModal(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Exit
            </Button>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {lessonType}
                </Badge>
                <Badge className={`text-xs text-white ${getDifficultyColor()}`}>
                  {difficulty}
                </Badge>
              </div>
            </div>
          </div>

          {/* Center Section - Progress */}
          <div className="flex-1 max-w-md mx-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
              </div>
              <div className="flex space-x-1">
                {getProgressSegments()}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{timeSpent}m / {estimatedTimeMinutes}m</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Exit Lesson?</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              You're {Math.round(progress)}% through this lesson. Your progress will be saved.
            </p>
            
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time spent:</span>
                    <span className="font-medium">{timeSpent} minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Progress:</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>XP earned:</span>
                    <span className="font-medium text-green-600">+{Math.floor(progress * 0.5)} XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExitModal(false)}
              className="w-full sm:w-auto"
            >
              Continue Lesson
            </Button>
            <Button
              onClick={() => {
                setShowExitModal(false);
                onExit();
              }}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              Exit & Save Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}