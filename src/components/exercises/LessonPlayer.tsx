import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Settings,
  Bookmark,
  List,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BaseExercise } from '@/types/exercises';

interface Chapter {
  id: string;
  title: string;
  duration: number;
  exercises: BaseExercise[];
  completed: boolean;
}

interface LessonPlayerProps {
  chapters: Chapter[];
  currentChapter: number;
  currentExercise: number;
  progress: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onChapterChange: (chapterIndex: number) => void;
  onExerciseChange: (exerciseIndex: number) => void;
  onProgressSeek: (progress: number) => void;
  children: React.ReactNode;
}

export function LessonPlayer({
  chapters,
  currentChapter,
  currentExercise,
  progress,
  isPlaying,
  playbackSpeed,
  onPlayPause,
  onSpeedChange,
  onChapterChange,
  onExerciseChange,
  onProgressSeek,
  children
}: LessonPlayerProps) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [volume, setVolume] = useState(75);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const totalTime = chapters.reduce((acc, chapter) => acc + chapter.duration, 0);
    setTotalDuration(totalTime);
  }, [chapters]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5];

  const handleProgressClick = (e: React.MouseEvent) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      onProgressSeek(clickPosition * 100);
    }
  };

  const currentChapterData = chapters[currentChapter];
  const currentExerciseData = currentChapterData?.exercises[currentExercise];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-card border-r border-border"
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Lesson Outline</h2>
              <p className="text-sm text-muted-foreground">
                {chapters.length} chapters • {formatTime(totalDuration)}
              </p>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="p-4 space-y-2">
                {chapters.map((chapter, chapterIndex) => (
                  <Card 
                    key={chapter.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      chapterIndex === currentChapter 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : ''
                    }`}
                    onClick={() => onChapterChange(chapterIndex)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">
                            {chapter.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(chapter.duration)}</span>
                            <Badge variant="outline" className="text-xs">
                              {chapter.exercises.length} exercises
                            </Badge>
                          </div>
                        </div>
                        {chapter.completed && (
                          <Badge variant="default" className="bg-green-500">
                            ✓
                          </Badge>
                        )}
                      </div>
                      
                      {chapterIndex === currentChapter && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-border space-y-1"
                        >
                          {chapter.exercises.map((exercise, exerciseIndex) => (
                            <div
                              key={exercise.id}
                              className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                                exerciseIndex === currentExercise
                                  ? 'bg-primary/10 text-primary'
                                  : 'hover:bg-muted text-muted-foreground'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onExerciseChange(exerciseIndex);
                              }}
                            >
                              <ChevronRight className="h-3 w-3" />
                              <span className="text-sm">{exercise.title}</span>
                              {exercise.completed && (
                                <span className="text-green-500 text-xs">✓</span>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <List className="h-4 w-4" />
            </Button>
            
            <div>
              <h1 className="font-semibold text-foreground">
                {currentChapterData?.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentExerciseData?.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {currentExerciseData?.type}
            </Badge>
            <Badge variant="outline">
              {currentExerciseData?.difficulty}
            </Badge>
          </div>
        </div>

        {/* Exercise Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        {/* Control Bar */}
        <div className="h-20 bg-card border-t border-border">
          <div className="px-6 py-2">
            {/* Progress Bar */}
            <div 
              ref={progressRef}
              className="w-full h-2 bg-muted rounded-full cursor-pointer mb-3"
              onClick={handleProgressClick}
            >
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
                layoutId="progress"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onExerciseChange(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0 && currentChapter === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={onPlayPause}
                  className="w-10 h-10 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const totalExercises = currentChapterData?.exercises.length || 0;
                    const isLastExercise = currentExercise === totalExercises - 1;
                    const isLastChapter = currentChapter === chapters.length - 1;
                    
                    if (isLastExercise && !isLastChapter) {
                      onChapterChange(currentChapter + 1);
                      onExerciseChange(0);
                    } else if (!isLastExercise) {
                      onExerciseChange(currentExercise + 1);
                    }
                  }}
                  disabled={
                    currentExercise === (currentChapterData?.exercises.length || 0) - 1 &&
                    currentChapter === chapters.length - 1
                  }
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => setVolume(value[0])}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {formatTime(timeElapsed)} / {formatTime(totalDuration)}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      {playbackSpeed}x
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {speedOptions.map((speed) => (
                      <DropdownMenuItem
                        key={speed}
                        onClick={() => onSpeedChange(speed)}
                        className={speed === playbackSpeed ? 'bg-accent' : ''}
                      >
                        {speed}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}