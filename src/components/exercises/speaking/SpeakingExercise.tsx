import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Volume2, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SpeakingExercise as SpeakingExerciseType } from '@/types/exercises';

interface SpeakingExerciseProps {
  exercise: SpeakingExerciseType;
  onComplete: (score: number) => void;
  onProgress: (progress: number) => void;
}

export function SpeakingExercise({ 
  exercise, 
  onComplete, 
  onProgress 
}: SpeakingExerciseProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      // Set up audio context for waveform visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Start waveform animation
      const updateWaveform = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const normalizedData = Array.from(dataArray).map(value => value / 255);
          setWaveformData(normalizedData.slice(0, 50)); // Take first 50 frequencies
          animationFrameRef.current = requestAnimationFrame(updateWaveform);
        }
      };

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks: BlobPart[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        
        // Auto-analyze the recording
        analyzeRecording(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start waveform visualization
      updateWaveform();

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const playRecording = () => {
    if (recordedBlob) {
      const audio = new Audio(URL.createObjectURL(recordedBlob));
      audio.play();
      setIsPlaying(true);
      
      audio.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const playTargetAudio = () => {
    if (exercise.targetAudio) {
      const audio = new Audio(exercise.targetAudio);
      audio.play();
    }
  };

  const analyzeRecording = async (blob: Blob) => {
    // Simulate analysis - in a real app, this would call an AI service
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results
    const mockResults = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      pronunciation: Math.floor(Math.random() * 25) + 75,
      fluency: Math.floor(Math.random() * 20) + 80,
      intonation: Math.floor(Math.random() * 30) + 70,
      pace: Math.floor(Math.random() * 25) + 75,
      suggestions: [
        "Great pronunciation of vowel sounds!",
        "Try to speak a bit more slowly for better clarity",
        "Work on the 'th' sound in 'think'",
        "Good rhythm and natural flow"
      ].slice(0, Math.floor(Math.random() * 2) + 2)
    };

    setAnalysisResults(mockResults);
    setShowResults(true);
    onProgress(100);
    
    setTimeout(() => {
      onComplete(mockResults.overallScore);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const retryRecording = () => {
    setRecordedBlob(null);
    setAnalysisResults(null);
    setShowResults(false);
    setRecordingTime(0);
    setWaveformData([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Exercise Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Mic className="h-6 w-6 text-blue-600" />
            <span>Speaking Practice</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Your Task:</h3>
            <p className="text-blue-800">{exercise.prompt}</p>
          </div>

          {exercise.targetAudio && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Listen to example:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={playTargetAudio}
              >
                <Play className="h-4 w-4 mr-1" />
                Native Speaker
              </Button>
            </div>
          )}

          {exercise.phoneticTarget && (
            <div className="text-center">
              <Badge variant="outline" className="text-lg px-4 py-2">
                [{exercise.phoneticTarget}]
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recording Interface */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Waveform Visualization */}
            <div className="h-32 flex items-end justify-center space-x-1">
              {waveformData.length > 0 ? (
                waveformData.map((value, index) => (
                  <motion.div
                    key={index}
                    className="bg-blue-600 w-2 rounded-t"
                    animate={{ height: `${Math.max(4, value * 120)}px` }}
                    transition={{ duration: 0.1 }}
                  />
                ))
              ) : (
                <div className="text-muted-foreground text-sm">
                  {recordedBlob ? 'Recording completed' : 'Waveform will appear during recording'}
                </div>
              )}
            </div>

            {/* Recording Timer */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-mono text-red-600"
              >
                {formatTime(recordingTime)}
              </motion.div>
            )}

            {/* Main Record Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={showResults}
                className={`w-24 h-24 rounded-full text-white ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
            </motion.div>

            <p className="text-sm text-muted-foreground">
              {isRecording 
                ? 'Recording... Click to stop' 
                : recordedBlob 
                  ? 'Recording complete' 
                  : 'Click to start recording'
              }
            </p>

            {/* Playback Controls */}
            {recordedBlob && !showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center space-x-4"
              >
                <Button variant="outline" onClick={playRecording}>
                  <Play className="h-4 w-4 mr-2" />
                  Play Recording
                </Button>
                <Button variant="outline" onClick={retryRecording}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <AnimatePresence>
        {showResults && analysisResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <span>Speech Analysis Complete</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Score */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {analysisResults.overallScore}%
                  </div>
                  <p className="text-green-700">Overall Speaking Score</p>
                </div>

                {/* Detailed Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysisResults).map(([key, value]) => {
                    if (typeof value === 'number' && key !== 'overallScore') {
                      return (
                        <div key={key} className="text-center">
                          <div className="space-y-2">
                            <div className="text-2xl font-semibold text-green-600">
                              {value}%
                            </div>
                            <div className="text-xs text-green-700 capitalize">
                              {key}
                            </div>
                            <Progress 
                              value={value} 
                              className="h-2 bg-green-100" 
                            />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Suggestions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-green-700 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Feedback & Suggestions
                  </h4>
                  <div className="space-y-2">
                    {analysisResults.suggestions.map((suggestion: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-2 bg-white p-3 rounded border border-green-200"
                      >
                        <AlertCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-green-700">{suggestion}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Retry Button */}
                <div className="text-center">
                  <Button variant="outline" onClick={retryRecording}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Practice Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}