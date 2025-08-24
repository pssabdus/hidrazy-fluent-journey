import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Download, Trash2, HardDrive, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineContent {
  id: string;
  title: string;
  type: 'lesson' | 'conversation' | 'exercise' | 'audio';
  size: number; // in MB
  downloadDate: string;
  lastAccessed: string;
  status: 'available' | 'downloading' | 'pending';
  progress?: number;
}

interface OfflineContentManagerProps {
  onContentSelect: (content: OfflineContent) => void;
}

export function OfflineContentManager({ onContentSelect }: OfflineContentManagerProps) {
  const { toast } = useToast();
  const [offlineContent, setOfflineContent] = useState<OfflineContent[]>([]);
  const [totalStorage, setTotalStorage] = useState(0);
  const [availableContent, setAvailableContent] = useState<OfflineContent[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Sample available content for download
  const sampleAvailableContent: OfflineContent[] = [
    {
      id: 'lesson_1',
      title: 'Daily Conversations - Beginner Level',
      type: 'lesson',
      size: 25,
      downloadDate: '',
      lastAccessed: '',
      status: 'pending'
    },
    {
      id: 'lesson_2',
      title: 'Business English Essentials',
      type: 'lesson',
      size: 45,
      downloadDate: '',
      lastAccessed: '',
      status: 'pending'
    },
    {
      id: 'conv_1',
      title: 'Razia Conversation Pack 1',
      type: 'conversation',
      size: 15,
      downloadDate: '',
      lastAccessed: '',
      status: 'pending'
    },
    {
      id: 'audio_1',
      title: 'Pronunciation Practice Audio',
      type: 'audio',
      size: 35,
      downloadDate: '',
      lastAccessed: '',
      status: 'pending'
    },
    {
      id: 'exercise_1',
      title: 'Grammar Exercises - Intermediate',
      type: 'exercise',
      size: 12,
      downloadDate: '',
      lastAccessed: '',
      status: 'pending'
    }
  ];

  useEffect(() => {
    // Load offline content from localStorage
    const stored = localStorage.getItem('hidrazy_offline_content');
    if (stored) {
      const parsed = JSON.parse(stored);
      setOfflineContent(parsed);
      setTotalStorage(parsed.reduce((total: number, item: OfflineContent) => total + item.size, 0));
    }

    // Set available content (excluding already downloaded)
    const storedIds = stored ? JSON.parse(stored).map((item: OfflineContent) => item.id) : [];
    setAvailableContent(sampleAvailableContent.filter(item => !storedIds.includes(item.id)));

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const downloadContent = async (content: OfflineContent) => {
    if (!isOnline) {
      toast({
        title: "No Internet Connection",
        description: "Please connect to the internet to download content",
        variant: "destructive"
      });
      return;
    }

    // Start download
    const downloadingContent = { ...content, status: 'downloading' as const, progress: 0 };
    setAvailableContent(prev => prev.map(item => 
      item.id === content.id ? downloadingContent : item
    ));

    // Simulate download progress
    const downloadInterval = setInterval(() => {
      setAvailableContent(prev => prev.map(item => {
        if (item.id === content.id && item.progress !== undefined) {
          const newProgress = Math.min(100, item.progress + Math.random() * 15);
          return { ...item, progress: newProgress };
        }
        return item;
      }));
    }, 200);

    // Complete download after simulation
    setTimeout(() => {
      clearInterval(downloadInterval);
      
      const completedContent = {
        ...content,
        status: 'available' as const,
        downloadDate: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };

      // Add to offline content
      const updatedOfflineContent = [...offlineContent, completedContent];
      setOfflineContent(updatedOfflineContent);
      setTotalStorage(prev => prev + content.size);
      
      // Remove from available content
      setAvailableContent(prev => prev.filter(item => item.id !== content.id));
      
      // Save to localStorage
      localStorage.setItem('hidrazy_offline_content', JSON.stringify(updatedOfflineContent));
      
      toast({
        title: "Download Complete",
        description: `${content.title} is now available offline`,
      });
    }, 3000);
  };

  const deleteContent = (contentId: string) => {
    const updatedContent = offlineContent.filter(item => item.id !== contentId);
    const deletedItem = offlineContent.find(item => item.id === contentId);
    
    if (deletedItem) {
      setOfflineContent(updatedContent);
      setTotalStorage(prev => prev - deletedItem.size);
      
      // Add back to available content
      const availableItem = { ...deletedItem, status: 'pending' as const, downloadDate: '', lastAccessed: '' };
      setAvailableContent(prev => [...prev, availableItem]);
      
      localStorage.setItem('hidrazy_offline_content', JSON.stringify(updatedContent));
      
      toast({
        title: "Content Deleted",
        description: `${deletedItem.title} removed from offline storage`,
      });
    }
  };

  const accessContent = (content: OfflineContent) => {
    // Update last accessed time
    const updatedContent = offlineContent.map(item =>
      item.id === content.id
        ? { ...item, lastAccessed: new Date().toISOString() }
        : item
    );
    
    setOfflineContent(updatedContent);
    localStorage.setItem('hidrazy_offline_content', JSON.stringify(updatedContent));
    
    onContentSelect(content);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚';
      case 'conversation': return '💬';
      case 'exercise': return '✏️';
      case 'audio': return '🎵';
      default: return '📄';
    }
  };

  const getStorageUsage = () => {
    const maxStorage = 500; // 500MB limit
    return (totalStorage / maxStorage) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Offline Content Manager</h2>
          <p className="text-muted-foreground">Download content for learning without internet</p>
        </div>
        
        <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center gap-2">
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>

      {/* Storage Usage */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Storage Usage</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {totalStorage.toFixed(1)} MB / 500 MB
          </span>
        </div>
        
        <Progress value={getStorageUsage()} className="h-2" />
        
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{offlineContent.length} items downloaded</span>
          <span>{(500 - totalStorage).toFixed(1)} MB available</span>
        </div>
      </Card>

      {/* Downloaded Content */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Downloaded Content</h3>
        
        {offlineContent.length === 0 ? (
          <Card className="p-8 text-center">
            <Download className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No offline content yet</p>
            <p className="text-sm text-muted-foreground">Download lessons and exercises below</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {offlineContent.map((content) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(content.type)}</span>
                      <div>
                        <h4 className="font-medium">{content.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {content.type}
                          </Badge>
                          <span>{content.size} MB</span>
                          <span>•</span>
                          <span>Downloaded {new Date(content.downloadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => accessContent(content)}
                        size="sm"
                      >
                        Open
                      </Button>
                      <Button
                        onClick={() => deleteContent(content.id)}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Available for Download */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available for Download</h3>
        
        {!isOnline && (
          <Card className="p-4 mb-4 bg-orange-50 border-orange-200">
            <div className="flex items-center gap-2 text-orange-800">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm">Internet connection required to download new content</span>
            </div>
          </Card>
        )}
        
        <div className="grid gap-4">
          <AnimatePresence>
            {availableContent.map((content) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(content.type)}</span>
                      <div>
                        <h4 className="font-medium">{content.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {content.type}
                          </Badge>
                          <span>{content.size} MB</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {content.status === 'downloading' && content.progress !== undefined && (
                        <div className="flex items-center gap-2 mr-4">
                          <Progress value={content.progress} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">
                            {Math.round(content.progress)}%
                          </span>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => downloadContent(content)}
                        disabled={!isOnline || content.status === 'downloading'}
                        size="sm"
                        variant={content.status === 'downloading' ? "secondary" : "default"}
                      >
                        {content.status === 'downloading' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}