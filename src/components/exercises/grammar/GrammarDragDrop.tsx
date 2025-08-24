import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';
import { DragDropItem } from '@/types/exercises';

interface GrammarDragDropProps {
  items: DragDropItem[];
  instruction: string;
  onComplete: (correct: boolean) => void;
  showHint?: boolean;
}

export function GrammarDragDrop({ 
  items, 
  instruction, 
  onComplete, 
  showHint = false 
}: GrammarDragDropProps) {
  const [draggedItems, setDraggedItems] = useState<DragDropItem[]>([]);
  const [availableItems, setAvailableItems] = useState<DragDropItem[]>(
    [...items].sort(() => Math.random() - 0.5) // Shuffle initially
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    // Moving from available items to sentence
    if (source.droppableId === 'available' && destination.droppableId === 'sentence') {
      const sourceItems = Array.from(availableItems);
      const destItems = Array.from(draggedItems);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      setAvailableItems(sourceItems);
      setDraggedItems(destItems);
    }
    // Moving from sentence back to available
    else if (source.droppableId === 'sentence' && destination.droppableId === 'available') {
      const sourceItems = Array.from(draggedItems);
      const destItems = Array.from(availableItems);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      setDraggedItems(sourceItems);
      setAvailableItems(destItems);
    }
    // Reordering within sentence
    else if (source.droppableId === 'sentence' && destination.droppableId === 'sentence') {
      const items = Array.from(draggedItems);
      const [movedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, movedItem);
      setDraggedItems(items);
    }
    // Reordering within available items
    else if (source.droppableId === 'available' && destination.droppableId === 'available') {
      const items = Array.from(availableItems);
      const [movedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, movedItem);
      setAvailableItems(items);
    }
  };

  const checkAnswer = () => {
    const correct = draggedItems.every((item, index) => 
      item.correctPosition === index
    ) && draggedItems.length === items.length;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);
    
    setTimeout(() => {
      onComplete(correct);
    }, 2000);
  };

  const resetExercise = () => {
    setDraggedItems([]);
    setAvailableItems([...items].sort(() => Math.random() - 0.5));
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const canCheck = draggedItems.length === items.length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Instruction */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Grammar Builder</h3>
          <p className="text-muted-foreground mb-4">{instruction}</p>
          
          {showHint && attempts > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2"
            >
              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <strong>Hint:</strong> Pay attention to word order. In English, the typical order is Subject + Verb + Object.
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Sentence Building Area */}
        <Card className="border-2 border-dashed border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Build your sentence here:</h4>
              <Badge variant="outline">
                {draggedItems.length} / {items.length} words
              </Badge>
            </div>

            <Droppable droppableId="sentence" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-16 p-4 rounded-lg border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted'
                  } ${draggedItems.length === 0 ? 'bg-muted/20' : ''}`}
                >
                  <div className="flex flex-wrap gap-2 min-h-8">
                    {draggedItems.length === 0 && (
                      <div className="text-muted-foreground text-sm italic self-center">
                        Drag words here to build your sentence...
                      </div>
                    )}
                    
                    {draggedItems.map((item, index) => (
                      <Draggable 
                        key={`sentence-${item.id}-${index}`} 
                        draggableId={`sentence-${item.id}-${index}`} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm cursor-move transition-all ${
                              snapshot.isDragging ? 'rotate-3 scale-105 shadow-lg' : ''
                            }`}
                          >
                            {item.text}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>

        {/* Available Words */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium mb-4">Available words:</h4>
            
            <Droppable droppableId="available" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-16 p-4 rounded-lg border transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted bg-muted/20'
                  }`}
                >
                  <div className="flex flex-wrap gap-2">
                    {availableItems.map((item, index) => (
                      <Draggable 
                        key={`available-${item.id}-${index}`} 
                        draggableId={`available-${item.id}-${index}`} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`px-3 py-2 bg-card border border-border rounded-lg font-medium cursor-move transition-all hover:shadow-md ${
                              snapshot.isDragging ? 'rotate-3 scale-105 shadow-lg opacity-50' : ''
                            }`}
                          >
                            {item.text}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>
      </DragDropContext>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={resetExercise}
            disabled={showFeedback}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          
          {attempts > 0 && (
            <Badge variant="outline">
              Attempt {attempts}
            </Badge>
          )}
        </div>

        <Button
          onClick={checkAnswer}
          disabled={!canCheck || showFeedback}
          className="min-w-24"
        >
          Check Answer
        </Button>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`border-2 ${
              isCorrect 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                  )}
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-2 ${
                      isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isCorrect ? 'Excellent!' : 'Not quite right'}
                    </h4>
                    
                    <p className={`text-sm ${
                      isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCorrect 
                        ? 'Perfect sentence structure! You have mastered this grammar pattern.'
                        : 'The word order isn\'t quite correct. Remember the typical English sentence pattern and try again.'
                      }
                    </p>

                    {!isCorrect && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <p className="text-sm text-muted-foreground">
                          <strong>Correct order:</strong> {' '}
                          {items
                            .sort((a, b) => a.correctPosition - b.correctPosition)
                            .map(item => item.text)
                            .join(' ')
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}