import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ConversationState, 
  ConversationMessage, 
  ConversationContext,
  ConversationSettings,
  AIResponseOptions 
} from '@/types/conversation';

export function useRaziaConversation(initialContext: Partial<ConversationContext>) {
  const [state, setState] = useState<ConversationState>({
    isActive: false,
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    currentTopic: '',
    raziaExpression: 'neutral',
    context: {
      userId: '',
      currentLevel: 'intermediate',
      learningGoals: [],
      conversationType: 'free-chat',
      userProfile: {
        name: '',
        country: 'Libya',
        nativeLanguage: 'Arabic',
        interests: [],
        commonMistakes: [],
        progressMilestones: []
      },
      conversationHistory: [],
      sessionMetrics: {
        startTime: Date.now(),
        messagesExchanged: 0,
        mistakesCorrected: 0,
        newVocabulary: [],
        fluencyScore: 0
      },
      ...initialContext
    } as ConversationContext,
    settings: {
      voice: {
        enabled: true,
        language: 'en-US',
        accent: 'american',
        speed: 1.0,
        pitch: 1.0,
        emotionalTone: 'encouraging'
      },
      corrections: {
        immediate: true,
        gentle: true,
        explanations: true
      },
      encouragement: {
        frequency: 'medium',
        arabicPhrases: true
      },
      cultural: {
        tips: true,
        comparisons: true
      }
    }
  });

  const conversationHistoryRef = useRef<ConversationMessage[]>([]);

  // Initialize conversation
  const startConversation = useCallback(async (type: ConversationContext['conversationType']) => {
    setState(prev => ({
      ...prev,
      isActive: true,
      raziaExpression: 'greeting',
      context: {
        ...prev.context,
        conversationType: type,
        sessionMetrics: {
          ...prev.context.sessionMetrics,
          startTime: Date.now()
        }
      }
    }));

    // Generate initial greeting
    const greeting = await generateRaziaResponse('Hello! I\'m excited to practice English with you today!', {
      includeCorrections: false,
      includeEncouragement: true,
      includeCulturalContext: false,
      adaptLanguageLevel: true,
      responseStyle: 'conversational',
      maxResponseLength: 150
    });

    addMessage({
      id: `razia-${Date.now()}`,
      type: 'razia',
      content: greeting,
      timestamp: Date.now(),
      metadata: {
        emotionalTone: 'encouraging'
      }
    });
  }, []);

  // End conversation
  const endConversation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      isListening: false,
      isProcessing: false,
      isSpeaking: false,
      raziaExpression: 'neutral'
    }));
  }, []);

  // Add message to conversation
  const addMessage = useCallback((message: ConversationMessage) => {
    setState(prev => ({
      ...prev,
      context: {
        ...prev.context,
        conversationHistory: [...prev.context.conversationHistory, message],
        sessionMetrics: {
          ...prev.context.sessionMetrics,
          messagesExchanged: prev.context.sessionMetrics.messagesExchanged + 1
        }
      }
    }));
    conversationHistoryRef.current = [...conversationHistoryRef.current, message];
  }, []);

  // Generate AI response using OpenAI
  const generateRaziaResponse = useCallback(async (
    userMessage: string, 
    options: AIResponseOptions
  ): Promise<string> => {
    try {
      setState(prev => ({ 
        ...prev, 
        isProcessing: true, 
        raziaExpression: 'thinking' 
      }));

      const { data, error } = await supabase.functions.invoke('razia-conversation', {
        body: {
          userMessage,
          conversationType: state.context.conversationType,
          userLevel: state.context.currentLevel,
          conversationHistory: state.context.conversationHistory.slice(-10), // Last 10 messages
          userProfile: state.context.userProfile,
          options
        }
      });

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        raziaExpression: 'speaking' 
      }));

      return data.response || 'I apologize, I had trouble understanding. Could you please try again?';
    } catch (error) {
      console.error('Error generating Razia response:', error);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        raziaExpression: 'neutral',
        error: {
          type: 'ai_response',
          message: 'I\'m having trouble thinking right now. Please try again.',
          retryable: true
        }
      }));
      return 'I apologize, I\'m having some technical difficulties. Let\'s try again!';
    }
  }, [state.context]);

  // Send user message
  const sendMessage = useCallback(async (content: string, isVoice = false) => {
    // Add user message
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: Date.now()
    };
    addMessage(userMessage);

    // Generate Razia's response
    const response = await generateRaziaResponse(content, {
      includeCorrections: state.settings.corrections.immediate,
      includeEncouragement: true,
      includeCulturalContext: state.settings.cultural.tips,
      adaptLanguageLevel: true,
      responseStyle: 'conversational',
      maxResponseLength: 200
    });

    // Add Razia's response
    const raziaMessage: ConversationMessage = {
      id: `razia-${Date.now()}`,
      type: 'razia',
      content: response,
      timestamp: Date.now(),
      metadata: {
        emotionalTone: 'encouraging'
      }
    };
    addMessage(raziaMessage);

    // Generate speech if voice is enabled
    if (state.settings.voice.enabled) {
      generateSpeech(response);
    }
  }, [state.settings, addMessage, generateRaziaResponse]);

  // Generate speech from text
  const generateSpeech = useCallback(async (text: string) => {
    try {
      setState(prev => ({ ...prev, isSpeaking: true }));

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voice: 'alloy', // Razia's voice
          emotion: state.settings.voice.emotionalTone
        }
      });

      if (error) {
        console.error('Speech generation error:', error);
        setState(prev => ({ ...prev, isSpeaking: false }));
        return;
      }

      // Play the audio
      if (data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.onended = () => setState(prev => ({ ...prev, isSpeaking: false }));
        await audio.play();
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, [state.settings.voice.emotionalTone]);

  // Speech recognition
  const startListening = useCallback(() => {
    // Check for Speech Recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      setState(prev => ({
        ...prev,
        error: {
          type: 'speech_recognition',
          message: 'Speech recognition is not supported in your browser.',
          retryable: false
        }
      }));
      return;
    }

    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setState(prev => ({ 
        ...prev, 
        isListening: true, 
        raziaExpression: 'listening' 
      }));
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript, true);
    };

    recognition.onend = () => {
      setState(prev => ({ 
        ...prev, 
        isListening: false, 
        raziaExpression: 'neutral' 
      }));
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setState(prev => ({ 
        ...prev, 
        isListening: false, 
        raziaExpression: 'neutral',
        error: {
          type: 'speech_recognition',
          message: 'I couldn\'t hear you clearly. Please try again.',
          retryable: true
        }
      }));
    };

    recognition.start();
  }, [sendMessage]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<ConversationSettings>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: undefined
    }));
  }, []);

  // Save conversation to database
  const saveConversation = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('conversations')
        .insert({
          user_id: state.context.userId,
          type: state.context.conversationType,
          messages_json: state.context.conversationHistory as any,
          performance_data_json: state.context.sessionMetrics as any
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }, [state.context]);

  // Auto-save conversation periodically
  useEffect(() => {
    if (state.isActive && state.context.conversationHistory.length > 0) {
      const interval = setInterval(() => {
        saveConversation();
      }, 30000); // Save every 30 seconds

      return () => clearInterval(interval);
    }
  }, [state.isActive, state.context.conversationHistory.length, saveConversation]);

  return {
    state,
    actions: {
      startConversation,
      endConversation,
      sendMessage,
      startListening,
      updateSettings,
      clearError,
      saveConversation
    }
  };
}