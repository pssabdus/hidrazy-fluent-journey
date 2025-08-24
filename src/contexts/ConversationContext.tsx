import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface ConversationMessage {
  id: string;
  type: 'user' | 'razia';
  content: string;
  timestamp: number;
  analysis?: any;
}

interface ConversationContextType {
  messages: ConversationMessage[];
  isActive: boolean;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  currentTopic: string;
  raziaExpression: 'neutral' | 'happy' | 'encouraging' | 'thinking';
  
  // Actions
  startConversation: (type?: string) => Promise<void>;
  endConversation: () => void;
  sendMessage: (content: string, isVoice?: boolean) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
  clearMessages: () => void;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('General Conversation');
  const [raziaExpression, setRaziaExpression] = useState<'neutral' | 'happy' | 'encouraging' | 'thinking'>('neutral');
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const recognition = useRef<SpeechRecognition | null>(null);
  const synthesis = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech synthesis
    synthesis.current = window.speechSynthesis;
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new (window as any).webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';
      
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('[CONVERSATION] Speech recognized:', transcript);
        sendMessage(transcript, true);
      };
      
      recognition.current.onerror = (event) => {
        console.error('[CONVERSATION] Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Please try speaking again",
          variant: "destructive"
        });
      };
      
      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startConversation = useCallback(async (type: string = 'free_chat') => {
    try {
      console.log('[CONVERSATION] Starting conversation, type:', type);
      setIsActive(true);
      setCurrentTopic(type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()));
      setConversationId(crypto.randomUUID());
      setRaziaExpression('happy');
      
      // Add welcome message
      const welcomeMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        type: 'razia',
        content: getWelcomeMessage(type),
        timestamp: Date.now()
      };
      
      setMessages([welcomeMessage]);
      
      toast({
        title: "Conversation Started",
        description: `Let's practice ${type.replace('_', ' ')}!`,
      });
    } catch (error) {
      console.error('[CONVERSATION] Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
    }
  }, [toast]);

  const endConversation = useCallback(() => {
    console.log('[CONVERSATION] Ending conversation');
    setIsActive(false);
    setIsListening(false);
    setIsProcessing(false);
    setIsSpeaking(false);
    setRaziaExpression('neutral');
    setConversationId(null);
    
    if (recognition.current) {
      recognition.current.stop();
    }
    
    if (synthesis.current) {
      synthesis.current.cancel();
    }
    
    toast({
      title: "Conversation Ended",
      description: "Great practice session!",
    });
  }, [toast]);

  const sendMessage = useCallback(async (content: string, isVoice = false) => {
    if (!content.trim() || isProcessing) return;
    
    try {
      setIsProcessing(true);
      setRaziaExpression('thinking');
      
      // Add user message
      const userMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        type: 'user',
        content: content.trim(),
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      console.log('[CONVERSATION] Sending message to Razia AI:', content);
      
      // Call enhanced Razia conversation API
      const { data, error } = await supabase.functions.invoke('razia-conversation', {
        body: {
          message: content,
          conversationType: currentTopic.toLowerCase().replace(' ', '_'),
          conversationId,
          isVoice,
          options: {
            includeCorrections: true,
            includeCulturalContext: true,
            responseStyle: 'conversational'
          }
        }
      });

      if (error) throw error;

      console.log('[CONVERSATION] Received Razia response:', data);
      
      // Add Razia response
      const raziaMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        type: 'razia',
        content: data.response,
        timestamp: Date.now(),
        analysis: data.analysis
      };
      
      setMessages(prev => [...prev, raziaMessage]);
      
      // Update conversation state based on analysis
      if (data.analysis) {
        if (data.analysis.engagement_level > 0.8) {
          setRaziaExpression('happy');
        } else if (data.analysis.confidence_detected < 0.4) {
          setRaziaExpression('encouraging');
        } else {
          setRaziaExpression('neutral');
        }
      }
      
      // Text-to-speech for Razia's response
      if (synthesis.current && isVoice) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        
        synthesis.current.speak(utterance);
      }
      
      // Show recommendations if available
      if (data.recommendations?.length > 0) {
        toast({
          title: "Learning Tip",
          description: data.recommendations[0].message,
        });
      }
      
    } catch (error) {
      console.error('[CONVERSATION] Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setRaziaExpression('neutral');
    }
  }, [isProcessing, currentTopic, conversationId, toast]);

  const startListening = useCallback(() => {
    if (!recognition.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Please use text input instead",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsListening(true);
      recognition.current.start();
      console.log('[CONVERSATION] Started listening');
    } catch (error) {
      console.error('[CONVERSATION] Error starting speech recognition:', error);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Failed to start voice input",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopListening = useCallback(() => {
    if (recognition.current) {
      recognition.current.stop();
    }
    setIsListening(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const value: ConversationContextType = {
    messages,
    isActive,
    isListening,
    isProcessing,
    isSpeaking,
    currentTopic,
    raziaExpression,
    
    startConversation,
    endConversation,
    sendMessage,
    startListening,
    stopListening,
    clearMessages
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider');
  }
  return context;
}

function getWelcomeMessage(type: string): string {
  const welcomeMessages = {
    'free_chat': "Hello! I'm Razia, your English conversation partner. I'm here to help you practice English in a natural, friendly way. What would you like to talk about today?",
    'business_english': "Welcome to business English practice! I'm Razia, and I'll help you develop professional communication skills. Shall we start with a workplace scenario?",
    'ielts_practice': "Hello! I'm Razia, your IELTS speaking coach. I understand the challenges Arabic speakers face with IELTS. Let's practice speaking with confidence!",
    'cultural_bridge': "Ahlan wa sahlan! I'm Razia, and I specialize in helping Arabic speakers navigate English cultural contexts. Let's explore the beautiful bridges between our cultures!",
    'lesson_practice': "Hi there! I'm Razia, your patient and encouraging English teacher. I'm excited to practice with you today. Remember, every mistake is a step toward improvement!",
    'travel_english': "Welcome! I'm Razia, and I'll help you prepare for English conversations while traveling. Let's make sure you feel confident wherever your journey takes you!"
  };
  
  return welcomeMessages[type] || welcomeMessages['free_chat'];
}