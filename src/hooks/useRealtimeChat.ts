import { useState, useCallback, useRef } from 'react';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { useToast } from '@/components/ui/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'razia';
  content: string;
  timestamp: number;
  isVoice: boolean;
}

interface UseRealtimeChatOptions {
  conversationType?: string;
  userLevel?: string;
  onConnectionChange?: (connected: boolean) => void;
}

export function useRealtimeChat(options: UseRealtimeChatOptions = {}) {
  const { conversationType = 'free_chat', userLevel = 'beginner', onConnectionChange } = options;
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = useCallback((event: any) => {
    if (event.type === 'transcript_complete') {
      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: event.speaker === 'user' ? 'user' : 'razia',
        content: event.content,
        timestamp: Date.now(),
        isVoice: true
      };
      setMessages(prev => [...prev, newMessage]);
    }
  }, []);

  const handleConnectionStateChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    setIsConnecting(false);
    onConnectionChange?.(connected);
    
    if (connected) {
      toast({
        title: "Voice Chat Connected",
        description: "Ready for conversation with Razia!",
      });
    }
  }, [toast, onConnectionChange]);

  const handleSpeakingStateChange = useCallback((speaking: boolean) => {
    setIsSpeaking(speaking);
  }, []);

  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;
    
    try {
      setIsConnecting(true);
      chatRef.current = new RealtimeChat(
        handleMessage,
        handleConnectionStateChange,
        handleSpeakingStateChange
      );
      
      await chatRef.current.init(conversationType, userLevel);
    } catch (error) {
      console.error('[useRealtimeChat] Connection error:', error);
      setIsConnecting(false);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to connect to voice chat',
        variant: "destructive",
      });
    }
  }, [conversationType, userLevel, handleMessage, handleConnectionStateChange, handleSpeakingStateChange, isConnected, isConnecting, toast]);

  const disconnect = useCallback(() => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
    setIsConnecting(false);
    setMessages([]);
  }, []);

  const sendTextMessage = useCallback(async (text: string) => {
    if (!chatRef.current || !text.trim()) return;
    
    try {
      // Add user message to UI
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'user',
        content: text.trim(),
        timestamp: Date.now(),
        isVoice: false
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Send to Razia
      await chatRef.current.sendText(text.trim());
    } catch (error) {
      console.error('[useRealtimeChat] Send message error:', error);
      toast({
        title: "Message Failed",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isConnected,
    isSpeaking,
    isConnecting,
    connect,
    disconnect,
    sendTextMessage,
    clearMessages
  };
}