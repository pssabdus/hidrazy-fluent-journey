import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Settings,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Heart
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRaziaConversation } from '@/hooks/useRaziaConversation';
import { ConversationMessage } from '@/types/conversation';

interface RaziaConversationInterfaceProps {
  userId: string;
  userName: string;
  initialType?: 'lesson-practice' | 'free-chat' | 'role-play' | 'assessment' | 'cultural-bridge';
  onClose?: () => void;
}

export function RaziaConversationInterface({ 
  userId, 
  userName, 
  initialType = 'free-chat',
  onClose 
}: RaziaConversationInterfaceProps) {
  const [messageInput, setMessageInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const { state, actions } = useRaziaConversation({
    userId,
    userProfile: {
      name: userName,
      country: 'Libya',
      nativeLanguage: 'Arabic',
      interests: [],
      commonMistakes: [],
      progressMilestones: []
    }
  });

  useEffect(() => {
    if (!state.isActive) {
      actions.startConversation(initialType);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    await actions.sendMessage(messageInput);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRaziaAvatar = () => {
    const expressions = {
      neutral: '😊',
      thinking: '🤔',
      speaking: '😊',
      encouraging: '✨',
      correcting: '📝',
      celebrating: '🎉',
      listening: '👂',
      greeting: '👋'
    };
    return expressions[state.raziaExpression as keyof typeof expressions] || '😊';
  };

  const renderMessage = (message: ConversationMessage) => {
    if (message.type === 'razia') {
      return (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start space-x-3 mb-4"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg">
            {getRaziaAvatar()}
          </div>
          <div className="flex-1">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs lg:max-w-md">
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            {message.metadata?.emotionalTone && (
              <div className="flex items-center mt-1 space-x-1">
                <Heart className="h-3 w-3 text-pink-500" />
                <span className="text-xs text-muted-foreground">
                  {message.metadata.emotionalTone}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    if (message.type === 'user') {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start justify-end space-x-3 mb-4"
        >
          <div className="flex-1">
            <div className="bg-white border border-blue-200 rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs lg:max-w-md ml-auto">
              <p className="text-sm leading-relaxed text-gray-900">{message.content}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
            {userName[0]?.toUpperCase()}
          </div>
        </motion.div>
      );
    }

    if (message.type === 'correction') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800">{message.content}</p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (message.type === 'cultural-tip') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-800">{message.content}</p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl">
              {getRaziaAvatar()}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Razia</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">English Teacher & Conversation Partner</span>
                {state.isProcessing && (
                  <Badge variant="secondary" className="text-xs">
                    Thinking...
                  </Badge>
                )}
                {state.isSpeaking && (
                  <Badge variant="secondary" className="text-xs">
                    Speaking...
                  </Badge>
                )}
                {state.isListening && (
                  <Badge variant="secondary" className="text-xs">
                    Listening...
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
        </div>

        {/* Conversation Type */}
        <div className="mt-3 flex items-center space-x-2">
          <Badge variant="outline">
            {state.context.conversationType.replace('-', ' ')}
          </Badge>
          <span className="text-xs text-gray-500">
            {state.context.sessionMetrics.messagesExchanged} messages exchanged
          </span>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 border-b border-gray-200 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Voice</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={state.settings.voice.enabled}
                      onChange={(e) => actions.updateSettings({
                        voice: { ...state.settings.voice, enabled: e.target.checked }
                      })}
                    />
                    <span>Enable voice</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Corrections</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={state.settings.corrections.immediate}
                      onChange={(e) => actions.updateSettings({
                        corrections: { ...state.settings.corrections, immediate: e.target.checked }
                      })}
                    />
                    <span>Immediate corrections</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Cultural</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={state.settings.cultural.tips}
                      onChange={(e) => actions.updateSettings({
                        cultural: { ...state.settings.cultural, tips: e.target.checked }
                      })}
                    />
                    <span>Cultural tips</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence>
            {state.context.conversationHistory.map((message) => (
              <div key={message.id}>
                {renderMessage(message)}
              </div>
            ))}
          </AnimatePresence>

          {/* Error Display */}
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800">{state.error.message}</p>
                    {state.error.retryable && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={actions.clearError}
                        className="p-0 h-auto text-red-600"
                      >
                        Try again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message to Razia..."
                  disabled={state.isProcessing || state.isSpeaking}
                  className="pr-12 min-h-[44px] rounded-full border-gray-300 focus:border-blue-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || state.isProcessing}
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 rounded-full"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={actions.startListening}
                disabled={state.isListening || state.isProcessing || !state.settings.voice.enabled}
                className="rounded-full w-12 h-12"
              >
                {state.isListening ? (
                  <MicOff className="h-5 w-5 text-red-500" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => actions.updateSettings({
                  voice: { ...state.settings.voice, enabled: !state.settings.voice.enabled }
                })}
                className="rounded-full w-12 h-12"
              >
                {state.settings.voice.enabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-3 flex items-center justify-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => actions.sendMessage("Could you help me practice pronunciation?")}
              disabled={state.isProcessing}
            >
              Practice Pronunciation
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => actions.sendMessage("Can you tell me about English culture?")}
              disabled={state.isProcessing}
            >
              Cultural Tips
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => actions.sendMessage("Let's practice a conversation scenario!")}
              disabled={state.isProcessing}
            >
              Role Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}