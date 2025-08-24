import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Send, 
  MessageSquare,
  Target,
  Clock,
  TrendingUp,
  Volume2,
  Play,
  Pause
} from 'lucide-react';
import { Scenario, RolePlayMessage, PerformanceMetrics } from '@/types/roleplay';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

interface RolePlayInterfaceProps {
  scenario: Scenario;
  onExit: () => void;
}

export function RolePlayInterface({ scenario, onExit }: RolePlayInterfaceProps) {
  const [messages, setMessages] = useState<RolePlayMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRaziaSpeaking, setIsRaziaSpeaking] = useState(false);
  const [isRaziaThinking, setIsRaziaThinking] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fluency: 0,
    accuracy: 0,
    appropriateness: 0,
    confidence: 0,
    vocabularyUsed: [],
    mistakeCount: 0,
    responseTime: 0
  });
  const [suggestions, setSuggestions] = useState<string[]>([
    "Hello! Nice to meet you.",
    "Could you help me, please?",
    "Thank you very much."
  ]);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const responseStartTime = useRef<number>(0);

  // Initialize with character greeting
  useEffect(() => {
    const initializeConversation = async () => {
      const greeting = scenario.character.greeting;
      
      // Generate audio for greeting
      const { data: audioData } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: greeting,
          voice: 'EXAVITQu4vr4xnSDxMaL',
          emotion: 'encouraging'
        }
      });

      const greetingMessage: RolePlayMessage = {
        id: Date.now().toString(),
        type: 'razia',
        content: greeting,
        timestamp: Date.now(),
        audioUrl: audioData?.audioUrl
      };

      setMessages([greetingMessage]);

      // Auto-play greeting
      if (audioData?.audioUrl) {
        setTimeout(() => {
          playAudio(audioData.audioUrl);
        }, 1000);
      }

      // Update suggestions based on scenario
      const contextualSuggestions = getContextualSuggestions();
      setSuggestions(contextualSuggestions);
    };

    initializeConversation();
  }, [scenario]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 100));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getContextualSuggestions = () => {
    const baseSuggestions = scenario.character.commonPhrases.slice(0, 3);
    return baseSuggestions.map(phrase => phrase.replace(/"/g, ''));
  };

  const playAudio = async (audioUrl: string) => {
    setCurrentAudioUrl(audioUrl);
    setIsRaziaSpeaking(true);

    try {
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsRaziaSpeaking(false);
        setCurrentAudioUrl(null);
      };
      
      audio.onerror = () => {
        setIsRaziaSpeaking(false);
        setCurrentAudioUrl(null);
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsRaziaSpeaking(false);
      setCurrentAudioUrl(null);
    }
  };

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
      responseStartTime.current = Date.now();

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
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // Transcribe audio
        const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio }
        });

        if (transcriptError) throw transcriptError;

        const userText = transcriptData.text;
        if (userText.trim()) {
          await handleUserMessage(userText, true);
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      handleUserMessage(inputText.trim(), false);
      setInputText('');
    }
  };

  const handleUserMessage = async (text: string, isVoice: boolean) => {
    const responseTime = responseStartTime.current ? 
      (Date.now() - responseStartTime.current) / 1000 : 0;

    // Add user message
    const userMessage: RolePlayMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsRaziaThinking(true);

    try {
      // Generate AI response with role-play context
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('razia-conversation', {
        body: {
          userMessage: text,
          lessonType: `role-play: ${scenario.title}`,
          lessonContext: {
            title: scenario.title,
            difficulty: scenario.vocabularyLevel,
            progress: progress,
            character: scenario.character,
            context: scenario.context,
            objectives: scenario.learningObjectives
          },
          conversationHistory: messages.slice(-10) // Last 10 messages for context
        }
      });

      if (aiError) throw aiError;
      setIsRaziaThinking(false);

      // Generate audio for response
      const { data: audioData } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: aiResponse.message,
          voice: 'EXAVITQu4vr4xnSDxMaL',
          emotion: aiResponse.emotion || 'neutral'
        }
      });

      const raziaMessage: RolePlayMessage = {
        id: (Date.now() + 1).toString(),
        type: 'razia',
        content: aiResponse.message,
        timestamp: Date.now() + 1,
        audioUrl: audioData?.audioUrl,
        corrections: aiResponse.corrections
      };

      setMessages(prev => [...prev, raziaMessage]);

      // Auto-play audio
      if (audioData?.audioUrl) {
        playAudio(audioData.audioUrl);
      }

      // Update metrics
      updateMetrics(text, aiResponse.corrections || [], responseTime, isVoice);

      // Update suggestions
      if (aiResponse.corrections && aiResponse.corrections.length > 0) {
        const newSuggestions = aiResponse.corrections.map(c => c.suggestion);
        setSuggestions(prev => [...newSuggestions, ...prev.slice(0, 3 - newSuggestions.length)]);
      }

    } catch (error) {
      console.error('Error generating response:', error);
      setIsRaziaThinking(false);
    }

    responseStartTime.current = Date.now();
  };

  const updateMetrics = (text: string, corrections: any[], responseTime: number, isVoice: boolean) => {
    setMetrics(prev => {
      const words = text.split(' ').length;
      const mistakeCount = corrections.length;
      const accuracy = Math.max(0, 100 - (mistakeCount / words) * 20);
      const fluency = isVoice ? Math.max(0, 100 - responseTime * 10) : 85;
      const vocabularyScore = scenario.keyVocabulary.filter(word => 
        text.toLowerCase().includes(word.toLowerCase())
      ).length;
      
      return {
        ...prev,
        accuracy: Math.round((prev.accuracy + accuracy) / 2),
        fluency: Math.round((prev.fluency + fluency) / 2),
        appropriateness: Math.min(100, prev.appropriateness + 5),
        confidence: Math.min(100, prev.confidence + (isVoice ? 10 : 5)),
        mistakeCount: prev.mistakeCount + mistakeCount,
        responseTime: responseTime,
        vocabularyUsed: [...new Set([...prev.vocabularyUsed, ...scenario.keyVocabulary.filter(word => 
          text.toLowerCase().includes(word.toLowerCase())
        )])]
      };
    });
  };

  const useSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  const renderCharacterAvatar = () => {
    const isThinking = isRaziaThinking;
    const isSpeaking = isRaziaSpeaking;
    
    return (
      <motion.div
        className="relative w-16 h-16 mx-auto"
        animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-purple-200 border-4 border-white shadow-lg flex items-center justify-center relative overflow-hidden">
          <div className="text-2xl relative z-10">
            {scenario.character.role === 'Barista' ? '👩‍🍳' :
             scenario.character.role === 'Doctor' ? '👩‍⚕️' :
             scenario.character.role === 'Hiring Manager' ? '👩‍💼' :
             scenario.character.role === 'Hotel Receptionist' ? '👩‍💼' :
             '👩‍🏫'}
          </div>
        </div>

        {/* Thinking indicator */}
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

        {/* Speaking indicator */}
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
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onExit} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{scenario.title}</h1>
              <p className="text-sm text-muted-foreground">
                Role-playing with {scenario.character.role} Razia
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{Math.round(metrics.accuracy)}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{Math.round(metrics.fluency)}%</div>
              <div className="text-xs text-muted-foreground">Fluency</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">{metrics.vocabularyUsed.length}</div>
              <div className="text-xs text-muted-foreground">New Words</div>
            </div>
          </div>
        </div>
        
        {/* Progress */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span>Progress: {progress}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[70vh] flex flex-col">
              {/* Character Header */}
              <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-4">
                  {renderCharacterAvatar()}
                  <div className="flex-1">
                    <h3 className="font-semibold">{scenario.character.role} Razia</h3>
                    <p className="text-sm text-muted-foreground">{scenario.character.personality}</p>
                    <Badge variant="outline" className="mt-1 capitalize">
                      {scenario.character.speakingStyle}
                    </Badge>
                  </div>
                  {currentAudioUrl && (
                    <Button variant="ghost" size="sm">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div 
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl' 
                        : 'bg-muted rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'
                    } p-3`}>
                      <p className="text-sm">{message.content}</p>
                      
                      {/* Audio controls for Razia messages */}
                      {message.audioUrl && message.type === 'razia' && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => playAudio(message.audioUrl!)}
                            className="p-1 h-6"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                          <div className="text-xs text-muted-foreground">Listen</div>
                        </div>
                      )}

                      {/* Corrections */}
                      {message.corrections && message.corrections.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-yellow-200">
                          <div className="text-xs font-medium mb-1 text-yellow-700">💡 Suggestions:</div>
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
                      
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message or use voice input..."
                    className="flex-1 min-h-[40px] max-h-[120px]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleTextSubmit();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessing}
                      className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    >
                      {isProcessing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : isRecording ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </Button>
                    <Button onClick={handleTextSubmit} disabled={!inputText.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scenario Context */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4" />
                  Context
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{scenario.context}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Objectives:</h4>
                  <ul className="text-xs space-y-1">
                    {scenario.learningObjectives.slice(0, 3).map((obj, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Quick Suggestions */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4" />
                  Quick Phrases
                </h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => useSuggestion(suggestion)}
                      className="w-full text-left justify-start text-xs h-auto py-2 px-3"
                    >
                      "{suggestion}"
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4" />
                  Performance
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Accuracy', value: metrics.accuracy, color: 'bg-blue-500' },
                    { label: 'Fluency', value: metrics.fluency, color: 'bg-green-500' },
                    { label: 'Confidence', value: metrics.confidence, color: 'bg-purple-500' },
                    { label: 'Context', value: metrics.appropriateness, color: 'bg-orange-500' },
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{metric.label}</span>
                        <span>{Math.round(metric.value)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${metric.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}