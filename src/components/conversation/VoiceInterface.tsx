import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { RaziaPersonalityShowcase } from './RaziaPersonalityShowcase';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Phone, 
  PhoneOff,
  MessageCircle 
} from 'lucide-react';

interface VoiceMessage {
  id: string;
  type: 'user' | 'razia';
  content: string;
  timestamp: number;
  isComplete: boolean;
}

interface VoiceInterfaceProps {
  conversationType?: string;
  userLevel?: string;
  onClose?: () => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  conversationType = 'free_chat',
  userLevel = 'beginner',
  onClose 
}) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  
  const chatRef = useRef<RealtimeChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleMessage = useCallback((event: any) => {
    console.log('[VoiceInterface] Received message:', event);
    
    if (event.type === 'transcript_delta') {
      // Update current transcript
      setCurrentTranscript(prev => prev + event.content);
    } else if (event.type === 'transcript_complete') {
      // Complete message
      const messageId = crypto.randomUUID();
      const newMessage: VoiceMessage = {
        id: messageId,
        type: event.speaker === 'user' ? 'user' : 'razia',
        content: event.content,
        timestamp: Date.now(),
        isComplete: true
      };
      
      setMessages(prev => [...prev, newMessage]);
      setCurrentTranscript('');
    }
  }, []);

  const handleConnectionStateChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    setIsConnecting(false);
    
    if (connected) {
      toast({
        title: "Connected",
        description: "Voice conversation with Razia is ready!",
      });
      
      // Add welcome message
      const welcomeMessage: VoiceMessage = {
        id: crypto.randomUUID(),
        type: 'razia',
        content: "Hello! I'm Razia, your English conversation partner. I can hear you now - feel free to start speaking!",
        timestamp: Date.now(),
        isComplete: true
      };
      setMessages([welcomeMessage]);
    } else {
      toast({
        title: "Disconnected",
        description: "Voice conversation ended",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleSpeakingStateChange = useCallback((speaking: boolean) => {
    setIsSpeaking(speaking);
  }, []);

  const startConversation = async () => {
    try {
      setIsConnecting(true);
      chatRef.current = new RealtimeChat(
        handleMessage,
        handleConnectionStateChange,
        handleSpeakingStateChange
      );
      
      await chatRef.current.init(conversationType, userLevel);
    } catch (error) {
      console.error('[VoiceInterface] Error starting conversation:', error);
      setIsConnecting(false);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : 'Failed to start voice conversation',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
    setMessages([]);
    setCurrentTranscript('');
    onClose?.();
  };

  const sendTextMessage = async () => {
    if (!textInput.trim() || !chatRef.current) return;
    
    try {
      await chatRef.current.sendText(textInput.trim());
      setTextInput('');
    } catch (error) {
      console.error('[VoiceInterface] Error sending text:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Voice Chat with Razia
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {isConnected && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              )}
              {conversationType && (
                <Badge variant="outline">
                  {conversationType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTextInput(!showTextInput)}
            className="text-muted-foreground"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          
          {!isConnected ? (
            <Button 
              onClick={startConversation} 
              disabled={isConnecting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  Start Voice Chat
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={endConversation}
              variant="destructive"
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              End Call
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6 space-y-4">
          {!isConnected && messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <Volume2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg mb-4">Ready for voice practice with Razia?</p>
              <p className="text-sm mb-6">
                Experience real-time voice conversations with natural pronunciation feedback
              </p>
              <div className="max-w-md mx-auto text-xs text-muted-foreground space-y-2">
                <p>✓ Real-time voice interaction</p>
                <p>✓ Natural conversation flow</p>
                <p>✓ Cultural context understanding</p>
                <p>✓ Pronunciation guidance</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <Card className={`max-w-[80%] p-4 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed">
                    {message.content}
                  </p>
                  <div className="text-xs opacity-60">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </Card>
            </div>
          ))}

          {/* Current transcript */}
          {currentTranscript && (
            <div className="flex justify-start">
              <Card className="bg-muted p-4 max-w-[80%]">
                <div className="flex items-center gap-2 text-sm">
                  <div className="animate-pulse">●</div>
                  <span className="opacity-70">{currentTranscript}</span>
                </div>
              </Card>
            </div>
          )}

          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="flex justify-start">
              <Card className="bg-blue-50 border-blue-200 p-4">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Volume2 className="h-4 w-4 animate-pulse" />
                  <span>Razia is speaking...</span>
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Text Input (Optional) */}
      {showTextInput && isConnected && (
        <div className="border-t border-border p-4 bg-card">
          <div className="flex gap-2">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message (optional)..."
              className="text-base"
            />
            <Button
              onClick={sendTextMessage}
              disabled={!textInput.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            You can also type messages, but voice interaction is recommended for best practice
          </p>
        </div>
      )}

      {/* Connection Status */}
      {isConnected && (
        <div className="border-t border-border p-4 bg-card">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Voice chat active</span>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="h-3 w-3" />
              <span>Listening...</span>
            </div>
            {isSpeaking && (
              <div className="flex items-center gap-2">
                <Volume2 className="h-3 w-3" />
                <span>Razia speaking</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInterface;