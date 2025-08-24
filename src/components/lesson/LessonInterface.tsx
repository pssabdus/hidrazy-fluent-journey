import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonHeader } from './LessonHeader';
import { RaziaAvatar, ChatBubble, VoiceControls, ChatMessage } from './RaziaChat';
import { AudioPlayer } from './AudioPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface LessonInterfaceProps {
  lessonId: string;
  lessonType: 'conversation' | 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'assessment';
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTimeMinutes: number;
  onExit: () => void;
}

export function LessonInterface({
  lessonId,
  lessonType,
  title,
  difficulty,
  estimatedTimeMinutes,
  onExit
}: LessonInterfaceProps) {
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'razia',
      content: `Hello! I'm Razia, your English teacher. Welcome to today's ${lessonType} lesson. I'm here to help you practice and improve your English skills. Are you ready to begin?`,
      timestamp: Date.now(),
    }
  ]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRaziaSpeaking, setIsRaziaSpeaking] = useState(false);
  const [isRaziaThinking, setIsRaziaThinking] = useState(false);
  const [currentPlayingAudio, setCurrentPlayingAudio] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate lesson progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 30000); // Progress increases every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording Error',
        description: 'Could not access microphone. Please check permissions.',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      // Send to speech-to-text service
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: data.text,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, userMessage]);
      await generateRaziaResponse(data.text);

    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: 'Processing Error',
        description: 'Could not process your speech. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const sendTextMessage = async () => {
    if (!textInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: textInput,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setTextInput('');
    await generateRaziaResponse(textInput);
  };

  const generateRaziaResponse = async (userInput: string) => {
    setIsRaziaThinking(true);

    try {
      // Generate AI response
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('razia-conversation', {
        body: {
          userMessage: userInput,
          lessonType,
          lessonContext: {
            title,
            difficulty,
            progress
          },
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        }
      });

      if (aiError) throw aiError;

      setIsRaziaThinking(false);

      // Generate speech from text
      console.log('Generating audio for Razia response...');
      const { data: audioData, error: audioError } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: aiResponse.message,
          voice: 'EXAVITQu4vr4xnSDxMaL', // Razia's voice ID from ElevenLabs
          emotion: aiResponse.emotion || 'neutral'
        }
      });

      if (audioError) {
        console.error('Audio generation failed:', audioError);
      } else {
        console.log('Audio generated successfully:', !!audioData?.audioUrl);
      }

      const raziaMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'razia',
        content: aiResponse.message,
        timestamp: Date.now(),
        audioUrl: audioData?.audioUrl,
        corrections: aiResponse.corrections
      };

      setMessages(prev => [...prev, raziaMessage]);

      // Auto-play audio if available
      if (audioData?.audioUrl) {
        console.log('Playing Razia audio...');
        playAudio(audioData.audioUrl);
      }

      // Add system message if there are corrections
      if (aiResponse.corrections && aiResponse.corrections.length > 0) {
        setTimeout(() => {
          const systemMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'system',
            content: `I noticed some areas for improvement in your response. Check the suggestions above!`,
            timestamp: Date.now() + 1
          };
          setMessages(prev => [...prev, systemMessage]);
        }, 1000);
      }

    } catch (error) {
      console.error('Error generating response:', error);
      setIsRaziaThinking(false);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'razia',
        content: "I'm sorry, I'm having trouble understanding right now. Could you please try again?",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const playAudio = async (audioUrl: string) => {
    setCurrentPlayingAudio(audioUrl);
    setIsRaziaSpeaking(true);

    try {
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsRaziaSpeaking(false);
        setCurrentPlayingAudio(null);
      };
      
      audio.onerror = () => {
        setIsRaziaSpeaking(false);
        setCurrentPlayingAudio(null);
      };

      await audio.play();
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsRaziaSpeaking(false);
      setCurrentPlayingAudio(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <LessonHeader
        title={title}
        progress={progress}
        estimatedTimeMinutes={estimatedTimeMinutes}
        onExit={onExit}
        lessonType={lessonType}
        difficulty={difficulty}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lesson Content - Left Side (60%) */}
        <div className="w-3/5 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Lesson Content Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {lessonType === 'conversation' && 'Conversation Practice'}
                      {lessonType === 'grammar' && 'Grammar Lesson'}
                      {lessonType === 'vocabulary' && 'Vocabulary Building'}
                      {lessonType === 'listening' && 'Listening Exercise'}
                      {lessonType === 'speaking' && 'Speaking Practice'}
                      {lessonType === 'assessment' && 'Assessment'}
                    </h2>
                    <Badge className={`${
                      difficulty === 'beginner' ? 'bg-green-500' :
                      difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white`}>
                      {difficulty}
                    </Badge>
                  </div>

                  {/* Lesson-specific content */}
                  {lessonType === 'conversation' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2">Scenario: Restaurant Visit</h3>
                        <p className="text-blue-700 text-sm">
                          You're visiting a restaurant for dinner. Practice ordering food, asking questions about the menu, and having casual conversation with the staff.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Your Role</h4>
                          <p className="text-gray-700 text-sm">Customer ordering dinner</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Razia's Role</h4>
                          <p className="text-gray-700 text-sm">Friendly restaurant server</p>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Conversation Starters</h4>
                        <ul className="text-green-700 text-sm space-y-1">
                          <li>• "Could I see the menu, please?"</li>
                          <li>• "What would you recommend?"</li>
                          <li>• "I'd like to order..."</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {lessonType === 'listening' && (
                    <div className="space-y-4">
                      <AudioPlayer
                        src="/api/audio/sample-conversation.mp3"
                        title="Restaurant Conversation"
                        transcript="Waiter: Good evening! Welcome to our restaurant. How many people will be dining tonight?
Customer: Good evening. Just two people, please.
Waiter: Wonderful! Right this way. Here's your table by the window.
Customer: Thank you, this is perfect.
Waiter: Here are your menus. Can I start you off with something to drink?
Customer: I'll have a glass of water, please. And could you recommend a good wine?
Waiter: Certainly! Our house red is very popular. It pairs well with our pasta dishes.
Customer: That sounds great. We'll have a bottle of that.
Waiter: Excellent choice! I'll give you a few minutes to look over the menu."
                        showTranscript={false}
                      />
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Comprehension Questions</h4>
                        <div className="space-y-2">
                          {[
                            "How many people are dining?",
                            "Where is their table located?",
                            "What does the customer order to drink?",
                            "What wine does the waiter recommend?"
                          ].map((question, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">{index + 1}.</span>
                              <span className="text-sm text-gray-900">{question}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Razia Chat Interface - Right Side (40%) */}
        <div className="w-2/5 bg-white border-l border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 text-center">
            <RaziaAvatar
              isThinking={isRaziaThinking}
              isSpeaking={isRaziaSpeaking}
              emotion={isRaziaThinking ? 'thinking' : isRaziaSpeaking ? 'neutral' : 'encouraging'}
            />
            <h3 className="font-medium text-gray-900">Razia</h3>
            <p className="text-sm text-gray-600">Your English Teacher</p>
            {(isRaziaThinking || isRaziaSpeaking) && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-2"
              >
                <Badge variant="outline" className="text-xs">
                  {isRaziaThinking ? 'Thinking...' : 'Speaking...'}
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    onPlayAudio={playAudio}
                    isPlaying={currentPlayingAudio === message.audioUrl}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Text Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-3">
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or use voice..."
                rows={2}
                className="resize-none"
              />
              <div className="flex justify-between items-center">
                <Button
                  onClick={sendTextMessage}
                  disabled={!textInput.trim() || isProcessing}
                  size="sm"
                >
                  Send Message
                </Button>
                <div className="text-xs text-gray-500">
                  Press Enter to send
                </div>
              </div>
            </div>
          </div>

          {/* Voice Controls */}
          <VoiceControls
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}