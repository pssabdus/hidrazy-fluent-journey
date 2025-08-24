import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WifiOff, Download, MessageCircle, Clock, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PremiumGate } from '@/components/premium/PremiumGate';
import { useToast } from '@/hooks/use-toast';

interface OfflineConversation {
  id: string;
  title: string;
  scenario: string;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'razia';
    timestamp: Date;
  }>;
  status: 'pending_sync' | 'synced' | 'failed';
  createdAt: Date;
  duration: number; // in minutes
}

export function OfflineConversationMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineConversations, setOfflineConversations] = useState<OfflineConversation[]>([]);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (online && offlineConversations.some(c => c.status === 'pending_sync')) {
        // Auto-sync when coming back online
        handleSyncConversations();
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Mock offline conversations
    setOfflineConversations([
      {
        id: '1',
        title: 'Coffee Shop Order',
        scenario: 'Ordering coffee and pastries',
        messages: [
          { id: '1', content: 'Hello! What can I get for you today?', sender: 'razia', timestamp: new Date('2024-01-20T10:00:00') },
          { id: '2', content: 'Hi! I would like a cappuccino please.', sender: 'user', timestamp: new Date('2024-01-20T10:00:30') },
          { id: '3', content: 'Great choice! Would you like any pastries with that?', sender: 'razia', timestamp: new Date('2024-01-20T10:01:00') },
        ],
        status: 'pending_sync',
        createdAt: new Date('2024-01-20T10:00:00'),
        duration: 5
      },
      {
        id: '2',
        title: 'Job Interview Practice',
        scenario: 'Practicing common interview questions',
        messages: [
          { id: '1', content: 'Tell me about yourself and your experience.', sender: 'razia', timestamp: new Date('2024-01-19T14:00:00') },
          { id: '2', content: 'I have been working in marketing for 3 years...', sender: 'user', timestamp: new Date('2024-01-19T14:00:45') },
        ],
        status: 'synced',
        createdAt: new Date('2024-01-19T14:00:00'),
        duration: 12
      }
    ]);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleSyncConversations = async () => {
    setSyncing(true);
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setOfflineConversations(prev => 
      prev.map(conv => ({
        ...conv,
        status: conv.status === 'pending_sync' ? 'synced' : conv.status
      }))
    );
    
    setSyncing(false);
    
    toast({
      title: "Sync Complete",
      description: "All offline conversations have been synced to the cloud",
    });
  };

  const handleStartOfflineConversation = () => {
    const newConversation: OfflineConversation = {
      id: Date.now().toString(),
      title: 'New Offline Practice',
      scenario: 'General conversation practice',
      messages: [
        {
          id: '1',
          content: 'Hello! I\'m Razia, your offline conversation partner. What would you like to practice today?',
          sender: 'razia',
          timestamp: new Date()
        }
      ],
      status: 'pending_sync',
      createdAt: new Date(),
      duration: 0
    };
    
    setOfflineConversations(prev => [newConversation, ...prev]);
    
    toast({
      title: "Offline Conversation Started",
      description: "You can now practice even without internet connection",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_sync': return 'bg-amber-500/10 text-amber-600';
      case 'synced': return 'bg-green-500/10 text-green-600';
      case 'failed': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_sync': return <Clock className="h-3 w-3" />;
      case 'synced': return <CheckCircle2 className="h-3 w-3" />;
      case 'failed': return <WifiOff className="h-3 w-3" />;
      default: return null;
    }
  };

  const pendingSyncCount = offlineConversations.filter(c => c.status === 'pending_sync').length;

  return (
    <PremiumGate featureId="offline_learning">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Offline Conversations</h1>
            <p className="text-muted-foreground">Practice conversations even without internet connection</p>
          </div>
          
          <div className="flex items-center gap-2">
            {!isOnline && (
              <Badge variant="outline" className="gap-2">
                <WifiOff className="h-4 w-4 text-red-500" />
                Offline Mode
              </Badge>
            )}
          </div>
        </div>

        {/* Offline Status & Sync */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Offline Conversation Status
            </CardTitle>
            <CardDescription>
              Track and sync your offline conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{offlineConversations.length}</div>
                <div className="text-sm text-muted-foreground">Total Conversations</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{pendingSyncCount}</div>
                <div className="text-sm text-muted-foreground">Pending Sync</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {offlineConversations.filter(c => c.status === 'synced').length}
                </div>
                <div className="text-sm text-muted-foreground">Synced</div>
              </div>
            </div>

            {isOnline && pendingSyncCount > 0 && (
              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div>
                  <p className="font-medium text-amber-800">
                    {pendingSyncCount} conversation{pendingSyncCount > 1 ? 's' : ''} waiting to sync
                  </p>
                  <p className="text-sm text-amber-600">
                    Sync now to save your progress to the cloud
                  </p>
                </div>
                <Button 
                  onClick={handleSyncConversations}
                  disabled={syncing}
                  className="gap-2"
                >
                  {syncing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Sync Now
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Start New Offline Conversation */}
        <Card>
          <CardHeader>
            <CardTitle>Start Offline Practice</CardTitle>
            <CardDescription>
              Begin a new conversation that works without internet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <WifiOff className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Offline Conversation Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Practice with Razia using pre-downloaded conversation models
                  </p>
                </div>
              </div>
              <Button onClick={handleStartOfflineConversation} className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Start Practice
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conversation History */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation History</CardTitle>
            <CardDescription>
              Your offline conversation sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {offlineConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{conversation.title}</h3>
                        <Badge variant="secondary" className={getStatusColor(conversation.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(conversation.status)}
                            {conversation.status.replace('_', ' ')}
                          </div>
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-1">
                        {conversation.scenario}
                      </p>
                      
                      <div className="text-xs text-muted-foreground">
                        {conversation.messages.length} messages • {conversation.duration} min • 
                        {conversation.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Continue
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Offline Tips */}
        {!isOnline && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <WifiOff className="h-5 w-5" />
                Offline Mode Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-700 space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Your conversations are saved locally and will sync when you reconnect</li>
                  <li>Razia uses offline AI models for responses</li>
                  <li>Speech recognition works offline with downloaded models</li>
                  <li>Progress tracking continues seamlessly</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PremiumGate>
  );
}