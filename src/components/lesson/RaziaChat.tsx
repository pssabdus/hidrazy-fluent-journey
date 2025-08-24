import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RaziaAvatarProps {
  isThinking?: boolean;
  isSpeaking?: boolean;
  emotion?: 'neutral' | 'encouraging' | 'thinking' | 'excited' | 'corrective';
}

export function RaziaAvatar({ isThinking, isSpeaking, emotion = 'neutral' }: RaziaAvatarProps) {
  const [currentExpression, setCurrentExpression] = useState('😊');

  useEffect(() => {
    const expressions = {
      neutral: '😊',
      encouraging: '🌟',
      thinking: '🤔',
      excited: '🎉',
      corrective: '💡'
    };
    setCurrentExpression(expressions[emotion]);
  }, [emotion]);

  return (
    <motion.div
      className="relative w-20 h-20 mx-auto mb-4"
      animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
    >
      {/* Avatar Background */}
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-white shadow-lg flex items-center justify-center relative overflow-hidden">
        {/* Avatar Character */}
        <div className="text-3xl relative z-10">{currentExpression}</div>
        
        {/* Hijab representation */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300/30 to-transparent rounded-full" />
      </div>

      {/* Thinking Animation */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-2 -right-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs"
            >
              💭
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speaking Animation */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [1, 2, 1] }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                  className="w-1 h-2 bg-blue-500 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Status */}
      <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
    </motion.div>
  );
}

export interface ChatMessage {
  id: string;
  type: 'razia' | 'user' | 'system';
  content: string;
  timestamp: number;
  audioUrl?: string;
  corrections?: Array<{ original: string; suggestion: string; explanation?: string }>;
}

interface ChatBubbleProps {
  message: ChatMessage;
  onPlayAudio?: (audioUrl: string) => void;
  isPlaying?: boolean;
}

export function ChatBubble({ message, onPlayAudio, isPlaying }: ChatBubbleProps) {
  const getBubbleStyles = () => {
    switch (message.type) {
      case 'razia':
        return 'bg-blue-500 text-white rounded-tl-none ml-0 mr-auto';
      case 'user':
        return 'bg-gray-200 text-gray-900 rounded-tr-none ml-auto mr-0';
      case 'system':
        return 'bg-yellow-100 text-yellow-900 border border-yellow-300 mx-auto';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`max-w-[80%] ${message.type === 'user' ? 'ml-auto' : 'mr-auto'} mb-4`}
    >
      <Card className={`${getBubbleStyles()} shadow-sm`}>
        <CardContent className="p-3">
          <div className="space-y-2">
            {/* Message Content */}
            <p className="text-sm leading-relaxed">{message.content}</p>
            
            {/* Audio Controls */}
            {message.audioUrl && message.type === 'razia' && (
              <div className="flex items-center space-x-2 pt-2 border-t border-white/20">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onPlayAudio?.(message.audioUrl!)}
                  className="text-white hover:bg-white/20 p-1 h-6 w-6"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    animate={isPlaying ? { x: ['0%', '100%'] } : {}}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                </div>
              </div>
            )}

            {/* Grammar Corrections */}
            {message.corrections && message.corrections.length > 0 && (
              <div className="pt-2 border-t border-yellow-200">
                <p className="text-xs font-medium mb-1">💡 Suggestions:</p>
                {message.corrections.map((correction, index) => (
                  <div key={index} className="text-xs bg-yellow-50 p-2 rounded mb-1">
                    <span className="line-through text-red-600">{correction.original}</span>
                    {' → '}
                    <span className="text-green-600 font-medium">{correction.suggestion}</span>
                    {correction.explanation && (
                      <p className="text-gray-600 mt-1">{correction.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Timestamp */}
            <div className={`text-xs opacity-70 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface VoiceControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isProcessing?: boolean;
  hasAudio?: boolean;
}

export function VoiceControls({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  isProcessing,
  hasAudio 
}: VoiceControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4 p-4 border-t border-gray-200">
      {/* Voice Input Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={isProcessing}
          className={`relative h-14 w-14 rounded-full ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white shadow-lg`}
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            </motion.div>
          ) : (
            <>
              {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              
              {/* Recording Animation */}
              {isRecording && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-4 border-red-400 opacity-30"
                />
              )}
            </>
          )}
        </Button>
      </motion.div>

      {/* Recording Status */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center space-x-2"
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [1, 2, 1] }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    delay: i * 0.1 
                  }}
                  className="w-1 h-4 bg-red-500 rounded-full"
                />
              ))}
            </div>
            <span className="text-sm text-red-600 font-medium">Recording...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Status */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center space-x-2"
          >
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-600 font-medium">Processing...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}