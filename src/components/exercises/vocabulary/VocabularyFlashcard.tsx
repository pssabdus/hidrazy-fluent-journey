import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VocabularyFlashcard as FlashcardType } from '@/types/exercises';

interface VocabularyFlashcardProps {
  flashcard: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
  onKnow: () => void;
  onDontKnow: () => void;
  onPlayAudio?: () => void;
  showHint?: boolean;
}

export function VocabularyFlashcard({
  flashcard,
  isFlipped,
  onFlip,
  onKnow,
  onDontKnow,
  onPlayAudio,
  showHint = false
}: VocabularyFlashcardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      <motion.div
        className="relative w-full h-80 preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        onClick={onFlip}
      >
        {/* Front of Card */}
        <Card className="absolute inset-0 w-full h-full backface-hidden shadow-lg">
          <CardContent className="p-6 h-full flex flex-col justify-center items-center space-y-4">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xs">
                {flashcard.partOfSpeech}
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">
                {flashcard.word}
              </h2>
              {flashcard.phonetic && (
                <p className="text-muted-foreground text-sm">
                  [{flashcard.phonetic}]
                </p>
              )}
            </div>

            {flashcard.imageUrl && (
              <motion.div
                className="w-32 h-32 rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: imageLoaded ? 1 : 0, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={flashcard.imageUrl}
                  alt={flashcard.word}
                  className="w-full h-full object-cover"
                  onLoad={() => setImageLoaded(true)}
                />
              </motion.div>
            )}

            <div className="flex items-center space-x-2">
              {flashcard.audioUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayAudio?.();
                  }}
                  className="rounded-full"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExample(!showExample);
                }}
                className="rounded-full"
              >
                {showExample ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {showExample && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-center"
              >
                <p className="text-sm text-muted-foreground italic">
                  "{flashcard.example}"
                </p>
              </motion.div>
            )}

            <div className="text-center text-xs text-muted-foreground">
              Tap to reveal definition
            </div>
          </CardContent>
        </Card>

        {/* Back of Card */}
        <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 shadow-lg">
          <CardContent className="p-6 h-full flex flex-col justify-center items-center space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-muted-foreground">
                {flashcard.word}
              </h3>
              
              <p className="text-xl text-foreground font-medium leading-relaxed">
                {flashcard.definition}
              </p>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground italic">
                  Example: "{flashcard.example}"
                </p>
              </div>
            </div>

            <div className="flex space-x-3 w-full">
              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onDontKnow();
                }}
              >
                Don't Know
              </Button>
              
              <Button
                variant="outline"
                className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onKnow();
                }}
              >
                I Know This
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              className="text-xs text-muted-foreground"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Flip back
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}