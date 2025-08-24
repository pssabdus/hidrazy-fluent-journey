import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shuffle, Trophy, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { VocabularyFlashcard } from './VocabularyFlashcard';
import { VocabularyExercise as VocabularyExerciseType } from '@/types/exercises';

interface VocabularyExerciseProps {
  exercise: VocabularyExerciseType;
  onComplete: (score: number) => void;
  onProgress: (progress: number) => void;
}

export function VocabularyExercise({ 
  exercise, 
  onComplete, 
  onProgress 
}: VocabularyExerciseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set());
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  const [sessionStats, setSessionStats] = useState({
    totalSeen: 0,
    correctAnswers: 0,
    timeSpent: 0
  });
  const [startTime] = useState(Date.now());

  const flashcards = exercise.flashcards;
  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;
  const progress = ((knownCards.size + unknownCards.size) / totalCards) * 100;

  useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);

  useEffect(() => {
    // Update time spent every second
    const interval = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleKnow = () => {
    const cardId = currentCard.id;
    setKnownCards(prev => new Set([...prev, cardId]));
    setSessionStats(prev => ({
      ...prev,
      totalSeen: prev.totalSeen + 1,
      correctAnswers: prev.correctAnswers + 1
    }));
    
    // Remove from review queue if present
    setReviewQueue(prev => prev.filter(id => id !== cardId));
    
    moveToNextCard();
  };

  const handleDontKnow = () => {
    const cardId = currentCard.id;
    setUnknownCards(prev => new Set([...prev, cardId]));
    setSessionStats(prev => ({
      ...prev,
      totalSeen: prev.totalSeen + 1
    }));
    
    // Add to review queue for spaced repetition
    setReviewQueue(prev => [...prev, cardId]);
    
    moveToNextCard();
  };

  const moveToNextCard = () => {
    setIsFlipped(false);
    
    // Check if we've seen all cards
    if (knownCards.size + unknownCards.size + 1 >= totalCards) {
      // If there are cards to review, show them
      if (reviewQueue.length > 0) {
        const nextReviewId = reviewQueue[0];
        const nextIndex = flashcards.findIndex(card => card.id === nextReviewId);
        setCurrentIndex(nextIndex);
      } else {
        // Complete the exercise
        const score = (knownCards.size / totalCards) * 100;
        onComplete(score);
      }
    } else {
      // Move to next unseen card
      let nextIndex = currentIndex + 1;
      while (nextIndex < totalCards && 
             (knownCards.has(flashcards[nextIndex].id) || 
              unknownCards.has(flashcards[nextIndex].id))) {
        nextIndex++;
      }
      
      if (nextIndex < totalCards) {
        setCurrentIndex(nextIndex);
      } else {
        // Wrap to beginning and find first unseen card
        nextIndex = 0;
        while (nextIndex < totalCards && 
               (knownCards.has(flashcards[nextIndex].id) || 
                unknownCards.has(flashcards[nextIndex].id))) {
          nextIndex++;
        }
        setCurrentIndex(nextIndex);
      }
    }
  };

  const shuffleCards = () => {
    // Shuffle remaining cards
    const unseenCards = flashcards
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => !knownCards.has(card.id) && !unknownCards.has(card.id));
    
    if (unseenCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * unseenCards.length);
      setCurrentIndex(unseenCards[randomIndex].index);
      setIsFlipped(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const goToNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const accuracy = sessionStats.totalSeen > 0 
    ? (sessionStats.correctAnswers / sessionStats.totalSeen) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="h-6 w-6 text-blue-600" />
                <span>{exercise.title}</span>
              </div>
              <Badge variant="outline" className="text-blue-600">
                Vocabulary Practice
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {knownCards.size}
                  </div>
                  <div className="text-xs text-muted-foreground">Known</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {unknownCards.size}
                  </div>
                  <div className="text-xs text-muted-foreground">Learning</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(accuracy)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor(sessionStats.timeSpent / 60)}m
                  </div>
                  <div className="text-xs text-muted-foreground">Time</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flashcard */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {currentCard && (
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <VocabularyFlashcard
                  flashcard={currentCard}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                  onKnow={handleKnow}
                  onDontKnow={handleDontKnow}
                  onPlayAudio={() => {
                    if (currentCard.audioUrl) {
                      const audio = new Audio(currentCard.audioUrl);
                      audio.play();
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} of {totalCards}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNext}
                  disabled={currentIndex === totalCards - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shuffleCards}
                >
                  <Shuffle className="h-4 w-4 mr-1" />
                  Shuffle
                </Button>

                {reviewQueue.length > 0 && (
                  <Badge variant="secondary">
                    {reviewQueue.length} to review
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Queue Indicator */}
        {reviewQueue.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-orange-700">
                <Trophy className="h-4 w-4" />
                <span className="text-sm">
                  You have {reviewQueue.length} cards to review for better retention!
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}