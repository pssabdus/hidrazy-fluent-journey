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

    // Get personalized greeting based on user level and conversation type
    const userLevel = state.context.currentLevel || 'intermediate';
    const greeting = getPersonalizedGreeting(userLevel, type);

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

// Helper function to get personalized greetings based on user level and conversation type
function getPersonalizedGreeting(userLevel: string, conversationType: string): string {
  const greetings = {
    beginner: {
      'free-chat': "Ahlan, habibi! 😊 How are you today? I'm so excited to practice English with you! Tell me - did you have a good morning? Maybe you had some qahwa (coffee) or chai?",
      'lesson_practice': "Marhaba, my new friend! 🎉 I'm Razia, and I'm absolutely thrilled to be your English conversation partner! You know what? Learning English as an Arabic speaker is actually a superpower - you'll be trilingual or more! That's amazing, mashallah!",
      'role_play': "Ahlan wa sahlan! Welcome, my friend! 😊 I'm Razia, and I'm here to make learning English fun and natural. Today we're going to practice real-life situations. Don't worry about making mistakes - there are no stupid mistakes here, only learning moments!",
      'business_english': "Marhaba! Welcome to business English practice with Razia! 💼 You know what's amazing? You're building professional skills in multiple languages - that's incredibly valuable, mashallah!",
      'ielts_practice': "Ahlan, future IELTS champion! 🎯 I'm Razia, and I'm here to help you succeed. Remember - you already speak Arabic beautifully, now we're just adding English to your amazing skills!"
    },
    intermediate: {
      'free-chat': "Hey there, my friend! 🌟 I've been looking forward to our chat today! What's been happening in your world? Any interesting stories to share? You know I love hearing about your day!",
      'lesson_practice': "Marhaba! Ready for another exciting English adventure? I love seeing your progress - you're getting stronger every day, mashallah! What would you like to practice today?",
      'role_play': "Ahlan! Ready for some fun role-playing? 🎭 I love how confident you're becoming with English! Today let's practice real situations you might encounter. Which scenario interests you most?",
      'business_english': "Hello, my professional friend! 💼 Your English skills are really developing well, mashallah! Today let's work on more advanced business communication. What workplace situation would you like to practice?",
      'ielts_practice': "Welcome back, IELTS warrior! 🎯 I can see your improvement from our last sessions - your fluency is really growing! Ready to tackle some challenging practice today?"
    },
    advanced: {
      'free-chat': "Welcome back! I was just thinking about our last conversation. How did that situation work out? I'm curious to hear your thoughts, and of course, practice some more English together! 💪",
      'lesson_practice': "Ahlan! Look at you - such sophisticated English now! I'm genuinely impressed by your progress, mashallah! 🌟 Today let's explore some nuanced language concepts. What interests you most?",
      'role_play': "Hello, English expert! 🎭 Your language skills have become so natural and fluent - it's beautiful to see! Today let's challenge ourselves with complex scenarios. What would you like to master?",
      'business_english': "Greetings, business professional! 💼 Your command of business English is becoming quite impressive, mashallah! Let's work on executive-level communication today. What industry topics fascinate you?",
      'ielts_practice': "Welcome, IELTS master in training! 🎯 Your sophisticated vocabulary and natural flow are excellent! Today let's polish those final details for band 8+ performance. Ready for the challenge?"
    }
  };

  return greetings[userLevel]?.[conversationType] || greetings.intermediate['free-chat'];
}