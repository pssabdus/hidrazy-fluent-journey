import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  src: string;
  title: string;
  transcript?: string;
  showTranscript?: boolean;
  onTranscriptToggle?: () => void;
  speed?: number;
  onSpeedChange?: (speed: number) => void;
  className?: string;
}

export function AudioPlayer({ 
  src, 
  title, 
  transcript, 
  showTranscript = false,
  onTranscriptToggle,
  speed = 1,
  onSpeedChange,
  className 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipBackward = () => {
    seekTo(Math.max(0, currentTime - 10));
  };

  const skipForward = () => {
    seekTo(Math.min(duration, currentTime + 10));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5];

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title and Speed Control */}
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Speed:</span>
              <div className="flex space-x-1">
                {speedOptions.map((speedOption) => (
                  <Button
                    key={speedOption}
                    variant={speed === speedOption ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSpeedChange?.(speedOption)}
                    className="text-xs px-2 py-1 h-6"
                  >
                    {speedOption}x
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Audio Element */}
          <audio ref={audioRef} src={src} preload="metadata" />

          {/* Waveform Visualization */}
          <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: duration > 0 ? currentTime / duration : 0 }}
              style={{ transformOrigin: 'left' }}
            />
            
            {/* Waveform bars */}
            <div className="absolute inset-0 flex items-center justify-center space-x-0.5 px-2">
              {Array.from({ length: 50 }, (_, i) => (
                <motion.div
                  key={i}
                  className="bg-blue-500 rounded-full"
                  style={{
                    width: '2px',
                    height: `${Math.random() * 80 + 20}%`,
                    opacity: i / 50 <= (duration > 0 ? currentTime / duration : 0) ? 1 : 0.3
                  }}
                  animate={isPlaying ? {
                    scaleY: [1, Math.random() * 1.5 + 0.5, 1]
                  } : {}}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.02 }}
                />
              ))}
            </div>

            {/* Progress indicator */}
            <motion.div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-600 z-10"
              style={{
                left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`
              }}
            />
          </div>

          {/* Progress and Time */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={([value]) => seekTo(value)}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={skipBackward}
                disabled={currentTime === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                size="sm"
                onClick={togglePlayPause}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={skipForward}
                disabled={currentTime === duration}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-gray-600" />
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => setVolume(value / 100)}
                className="w-20"
              />
            </div>

            {/* Transcript Toggle */}
            {transcript && (
              <Button
                variant="outline"
                size="sm"
                onClick={onTranscriptToggle}
              >
                {showTranscript ? 'Hide' : 'Show'} Transcript
              </Button>
            )}
          </div>

          {/* Transcript */}
          {showTranscript && transcript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 p-4 rounded-lg border"
            >
              <h4 className="font-medium text-gray-900 mb-2">Transcript</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}