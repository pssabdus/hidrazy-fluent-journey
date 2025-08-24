import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ListeningComprehension } from '@/types/exercises';

interface ListeningComprehensionExerciseProps {
  exercise: ListeningComprehension;
  onComplete: (score: number) => void;
  onProgress: (progress: number) => void;
}

export function ListeningComprehensionExercise({
  exercise,
  onComplete,
  onProgress
}: ListeningComprehensionExerciseProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [showTranscript, setShowTranscript] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());

  const questions = exercise.questions;
  const currentQ = questions[currentQuestion];
  const progress = (currentQuestion / questions.length) * 100;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);

  // Highlight words as audio plays
  useEffect(() => {
    if (showTranscript && currentTime > 0) {
      const words = exercise.transcript.split(' ');
      const wordsPerSecond = words.length / duration;
      const currentWordIndex = Math.floor(currentTime * wordsPerSecond);
      setHighlightedWord(currentWordIndex);
    }
  }, [currentTime, duration, showTranscript, exercise.transcript]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const rewind = () => {
    seekTo(Math.max(0, currentTime - 10));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate score and complete
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    
    const score = (correct / questions.length) * 100;
    setShowResults(true);
    
    setTimeout(() => {
      onComplete(score);
    }, 3000);
  };

  const renderTranscript = () => {
    const words = exercise.transcript.split(' ');
    return words.map((word, index) => (
      <span
        key={index}
        className={`cursor-pointer hover:bg-blue-100 px-1 rounded transition-colors ${
          index === highlightedWord ? 'bg-blue-200 font-medium' : ''
        }`}
        onClick={() => {
          const timePerWord = duration / words.length;
          seekTo(index * timePerWord);
        }}
      >
        {word}{' '}
      </span>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Audio Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-6 w-6 text-blue-600" />
              <span>Listening Exercise</span>
            </div>
            <Badge variant="outline">
              {exercise.speaker.accent} • {exercise.speaker.gender}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <audio ref={audioRef} src={exercise.audioUrl} preload="metadata" />
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div 
              className="w-full h-2 bg-muted rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPosition = (e.clientX - rect.left) / rect.width;
                seekTo(clickPosition * duration);
              }}
            >
              <div 
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={rewind}
                disabled={currentTime === 0}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button
                variant="default"
                size="lg"
                onClick={togglePlayPause}
                className="w-12 h-12 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <div className="flex items-center space-x-2">
                <VolumeX className="h-4 w-4" />
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  step={1}
                  className="w-20"
                />
                <Volume2 className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPlaybackSpeed(0.75)}
                className={playbackSpeed === 0.75 ? 'bg-accent' : ''}
              >
                0.75x
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPlaybackSpeed(1)}
                className={playbackSpeed === 1 ? 'bg-accent' : ''}
              >
                1x
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPlaybackSpeed(1.25)}
                className={playbackSpeed === 1.25 ? 'bg-accent' : ''}
              >
                1.25x
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                {showTranscript ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                Transcript
              </Button>
            </div>
          </div>

          {/* Transcript */}
          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-muted/50 p-4 rounded-lg border"
              >
                <h4 className="font-medium mb-2">Transcript</h4>
                <p className="text-sm leading-relaxed">
                  {renderTranscript()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Question Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Question Progress</span>
            <span>{currentQuestion + 1} of {questions.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Question {currentQuestion + 1}</span>
                {currentQ.timestamp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => seekTo(currentQ.timestamp!)}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Go to audio
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">{currentQ.question}</p>

              {currentQ.type === 'multiple-choice' && currentQ.options && (
                <RadioGroup
                  value={answers[currentQ.id] || ''}
                  onValueChange={handleAnswerChange}
                >
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQ.type === 'short-answer' && (
                <Textarea
                  placeholder="Type your answer here..."
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="min-h-20"
                />
              )}

              {currentQ.type === 'true-false' && (
                <RadioGroup
                  value={answers[currentQ.id] || ''}
                  onValueChange={handleAnswerChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true" className="cursor-pointer">True</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false" className="cursor-pointer">False</Label>
                  </div>
                </RadioGroup>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                <Button
                  onClick={nextQuestion}
                  disabled={!answers[currentQ.id]}
                  className="min-w-24"
                >
                  {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
          >
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                </motion.div>
                
                <h3 className="text-2xl font-bold">Listening Complete!</h3>
                
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    You answered {Object.keys(answers).filter(id => 
                      answers[id] === questions.find(q => q.id === id)?.correctAnswer
                    ).length} out of {questions.length} questions correctly.
                  </p>
                  
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round((Object.keys(answers).filter(id => 
                      answers[id] === questions.find(q => q.id === id)?.correctAnswer
                    ).length / questions.length) * 100)}%
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