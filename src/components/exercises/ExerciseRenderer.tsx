import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VocabularyExercise } from './vocabulary/VocabularyExercise';
import { GrammarDragDrop } from './grammar/GrammarDragDrop';
import { ListeningComprehensionExercise } from './listening/ListeningComprehensionExercise';
import { SpeakingExercise } from './speaking/SpeakingExercise';
import { BaseExercise, ExerciseType } from '@/types/exercises';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Zap } from 'lucide-react';

interface ExerciseRendererProps {
  exercise: BaseExercise;
  onComplete: (score: number) => void;
  onProgress: (progress: number) => void;
}

export function ExerciseRenderer({ 
  exercise, 
  onComplete, 
  onProgress 
}: ExerciseRendererProps) {
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

  const handleComplete = (score: number) => {
    setShowCompletionAnimation(true);
    
    // Show completion animation for 2 seconds
    setTimeout(() => {
      setShowCompletionAnimation(false);
      onComplete(score);
    }, 2000);
  };

  const renderExercise = () => {
    switch (exercise.type) {
      case 'vocabulary':
        return (
          <VocabularyExercise
            exercise={exercise as any}
            onComplete={handleComplete}
            onProgress={onProgress}
          />
        );
      
      case 'grammar':
        // For demo purposes, using drag-drop component with mock data
        const mockDragDropItems = [
          { id: '1', text: 'I', correctPosition: 0 },
          { id: '2', text: 'am', correctPosition: 1 },
          { id: '3', text: 'learning', correctPosition: 2 },
          { id: '4', text: 'English', correctPosition: 3 }
        ];
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
            <div className="w-full max-w-4xl">
              <GrammarDragDrop
                items={mockDragDropItems}
                instruction="Arrange the words to form a correct English sentence."
                onComplete={(correct: boolean) => handleComplete(correct ? 100 : 50)}
                showHint={true}
              />
            </div>
          </div>
        );
      
      case 'listening':
        return (
          <ListeningComprehensionExercise
            exercise={exercise as any}
            onComplete={handleComplete}
            onProgress={onProgress}
          />
        );
      
      case 'speaking':
        return (
          <SpeakingExercise
            exercise={exercise as any}
            onComplete={handleComplete}
            onProgress={onProgress}
          />
        );
      
      case 'reading':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center p-6">
            <Card className="max-w-4xl w-full">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Reading Exercise</h3>
                <p className="text-muted-foreground">
                  Reading comprehension exercises coming soon!
                </p>
                <div className="mt-6">
                  <Badge variant="outline">Under Development</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'conversation':
        return (
          <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-6">
            <Card className="max-w-4xl w-full">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Conversation Exercise</h3>
                <p className="text-muted-foreground">
                  Interactive conversation simulations coming soon!
                </p>
                <div className="mt-6">
                  <Badge variant="outline">Under Development</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-6">
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-4">Unknown Exercise Type</h3>
                <p className="text-muted-foreground">
                  This exercise type is not yet supported.
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {renderExercise()}
      
      {/* Completion Animation Overlay */}
      <AnimatePresence>
        {showCompletionAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md w-full mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", duration: 0.5 }}
                className="mb-6"
              >
                <div className="relative">
                  <Trophy className="h-20 w-20 text-yellow-500 mx-auto" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2"
                  >
                    <Star className="h-8 w-8 text-yellow-400 fill-current" />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Exercise Complete!
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 mb-4"
              >
                Great job! You've earned {exercise.points} XP points.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="flex justify-center space-x-2"
              >
                <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                  <Zap className="h-3 w-3 mr-1" />
                  +{exercise.points} XP
                </Badge>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}