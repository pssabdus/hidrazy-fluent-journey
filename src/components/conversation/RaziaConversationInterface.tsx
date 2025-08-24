import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MicOff, Send, Volume2, VolumeX, Phone } from 'lucide-react';
import { useConversation } from '@/contexts/ConversationContext';
import VoiceInterface from './VoiceInterface';

interface RaziaConversationInterfaceProps {
  conversationType?: string;
  className?: string;
}

export function RaziaConversationInterface({ 
  conversationType = 'free_chat',
  className = ''
}: RaziaConversationInterfaceProps) {
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
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
  } = useConversation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleTextSend = async () => {
    if (!textInput.trim() || isProcessing) return;
    
    await sendMessage(textInput.trim());
    setTextInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSend();
    }
  };

  const handleStartConversation = () => {
    startConversation(conversationType);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex flex-col h-full max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Practice with Razia
            </h2>
            {isActive && (
              <Badge variant="secondary" className="mt-1">
                {currentTopic}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {isActive ? (
            <Button onClick={endConversation} variant="outline">
              End Practice
            </Button>
          ) : (
            <Button onClick={handleStartConversation}>
              Start Practice
            </Button>
          )}
        </div>
      </div>

      {/* Mode Selector */}
      <div className="p-4 border-b border-border bg-muted/30">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Text Chat
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Voice Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-4">
            {/* Text Chat Interface */}
            <div className="flex-1 flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 min-h-[400px] overflow-hidden">
                <div className="h-full overflow-y-auto space-y-4">
                  {messages.length === 0 && !isActive ? (
                    <div className="text-center text-muted-foreground py-12">
                      <p className="text-lg mb-4">Ready to practice English with Razia?</p>
                      <p className="text-sm">Click "Start Practice" to begin your conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
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
                            
                            {message.analysis && (
                              <div className="text-xs opacity-75 border-t border-border/20 pt-2 mt-2">
                                {message.analysis.grammar_corrections?.length > 0 && (
                                  <div className="mb-1">
                                    <span className="font-medium">Tip: </span>
                                    {message.analysis.grammar_corrections[0].suggestion}
                                  </div>
                                )}
                                {message.analysis.confidence_detected !== undefined && (
                                  <div>
                                    Confidence: {Math.round(message.analysis.confidence_detected * 100)}%
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="text-xs opacity-60">
                              {formatTimestamp(message.timestamp)}
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))
                  )}
                  
                  {isProcessing && (
                    <div className="flex justify-start">
                      <Card className="bg-muted p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="animate-pulse">●</div>
                          <div className="animate-pulse delay-75">●</div>
                          <div className="animate-pulse delay-150">●</div>
                          <span className="ml-2">Razia is thinking...</span>
                        </div>
                      </Card>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Text Input Area */}
              {isActive && (
                <div className="border-t border-border p-4 mt-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        disabled={isProcessing}
                        className="text-base"
                      />
                    </div>
                    
                    <Button
                      onClick={isListening ? stopListening : startListening}
                      variant="outline"
                      size="icon"
                      disabled={isProcessing}
                      className={isListening ? 'bg-red-50 border-red-200' : ''}
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4 text-red-600" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleTextSend}
                      disabled={!textInput.trim() || isProcessing}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>
                      {isListening ? 'Listening...' : 'Press Enter to send, or use voice input'}
                    </span>
                    
                    {isSpeaking && (
                      <div className="flex items-center gap-1">
                        <Volume2 className="h-3 w-3" />
                        <span>Razia speaking...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="mt-4">
            {/* Voice Chat Interface */}
            <div className="min-h-[500px]">
              <VoiceInterface 
                conversationType={conversationType}
                userLevel="beginner"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}