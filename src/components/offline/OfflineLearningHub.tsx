import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, HardDrive, Wifi, WifiOff, Trash2, Play, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PremiumGate } from '@/components/premium/PremiumGate';
import { useToast } from '@/hooks/use-toast';

interface DownloadedLesson {
  id: string;
  title: string;
  type: 'conversation' | 'exercise' | 'grammar';
  size: number; // in MB
  downloadDate: Date;
  lastAccessed?: Date;
  progress?: number;
}

interface StorageStats {
  used: number; // in MB
  total: number; // in MB
  lessons: number;
}

export function OfflineLearningHub() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadedLessons, setDownloadedLessons] = useState<DownloadedLesson[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats>({ used: 0, total: 500, lessons: 0 });
  const [downloading, setDownloading] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Mock downloaded lessons
    setDownloadedLessons([
      {
        id: '1',
        title: 'Daily Conversation Basics',
        type: 'conversation',
        size: 45,
        downloadDate: new Date('2024-01-15'),
        lastAccessed: new Date('2024-01-20'),
        progress: 75
      },
      {
        id: '2',
        title: 'Grammar Fundamentals',
        type: 'grammar',
        size: 32,
        downloadDate: new Date('2024-01-10'),
        progress: 100
      },
      {
        id: '3',
        title: 'Business Meeting Scenarios',
        type: 'exercise',
        size: 67,
        downloadDate: new Date('2024-01-18'),
        progress: 30
      }
    ]);

    setStorageStats({ used: 144, total: 500, lessons: 3 });

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleDownloadLesson = async (lessonId: string, title: string) => {
    setDownloading(prev => [...prev, lessonId]);
    
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newLesson: DownloadedLesson = {
      id: lessonId,
      title,
      type: 'conversation',
      size: Math.floor(Math.random() * 50) + 20,
      downloadDate: new Date(),
      progress: 0
    };
    
    setDownloadedLessons(prev => [...prev, newLesson]);
    setStorageStats(prev => ({
      ...prev,
      used: prev.used + newLesson.size,
      lessons: prev.lessons + 1
    }));
    
    setDownloading(prev => prev.filter(id => id !== lessonId));
    
    toast({
      title: "Download Complete",
      description: `${title} is now available offline`,
    });
  };

  const handleDeleteLesson = (lessonId: string) => {
    const lesson = downloadedLessons.find(l => l.id === lessonId);
    if (lesson) {
      setDownloadedLessons(prev => prev.filter(l => l.id !== lessonId));
      setStorageStats(prev => ({
        ...prev,
        used: prev.used - lesson.size,
        lessons: prev.lessons - 1
      }));
      
      toast({
        title: "Lesson Deleted",
        description: `${lesson.title} removed from offline storage`,
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conversation': return 'bg-blue-500/10 text-blue-600';
      case 'exercise': return 'bg-green-500/10 text-green-600';
      case 'grammar': return 'bg-purple-500/10 text-purple-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const formatSize = (size: number) => {
    return `${size.toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <PremiumGate featureId="offline_learning">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Offline Learning</h1>
            <p className="text-muted-foreground">Download lessons and learn anywhere, even without internet</p>
          </div>
          
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Badge variant="outline" className="gap-2">
                <Wifi className="h-4 w-4 text-green-500" />
                Online
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-2">
                <WifiOff className="h-4 w-4 text-red-500" />
                Offline
              </Badge>
            )}
          </div>
        </div>

        {/* Storage Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Management
            </CardTitle>
            <CardDescription>
              Manage your offline content and storage usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{storageStats.lessons}</div>
                <div className="text-sm text-muted-foreground">Downloaded Lessons</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{formatSize(storageStats.used)}</div>
                <div className="text-sm text-muted-foreground">Used Storage</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{formatSize(storageStats.total - storageStats.used)}</div>
                <div className="text-sm text-muted-foreground">Available Storage</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Usage</span>
                <span>{formatSize(storageStats.used)} / {formatSize(storageStats.total)}</span>
              </div>
              <Progress value={(storageStats.used / storageStats.total) * 100} />
            </div>
          </CardContent>
        </Card>

        {/* Available Downloads */}
        <Card>
          <CardHeader>
            <CardTitle>Available for Download</CardTitle>
            <CardDescription>
              Download these lessons to access them offline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {['Advanced Pronunciation', 'IELTS Writing Tips', 'Travel Conversations', 'Business Presentations'].map((title, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Download className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 50) + 20} MB • Conversation
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleDownloadLesson(`new-${index}`, title)}
                    disabled={downloading.includes(`new-${index}`) || !isOnline}
                    size="sm"
                  >
                    {downloading.includes(`new-${index}`) ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Downloading...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </div>
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Downloaded Lessons */}
        <Card>
          <CardHeader>
            <CardTitle>Downloaded Lessons</CardTitle>
            <CardDescription>
              Your offline content ready for learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {downloadedLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{lesson.title}</h3>
                        <Badge variant="secondary" className={getTypeColor(lesson.type)}>
                          {lesson.type}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        {formatSize(lesson.size)} • Downloaded {formatDate(lesson.downloadDate)}
                        {lesson.lastAccessed && ` • Last used ${formatDate(lesson.lastAccessed)}`}
                      </div>
                      
                      {lesson.progress !== undefined && (
                        <div className="flex items-center gap-2">
                          <Progress value={lesson.progress} className="h-2 flex-1 max-w-32" />
                          <span className="text-xs text-muted-foreground">{lesson.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Offline Mode Tips */}
        {!isOnline && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <WifiOff className="h-5 w-5" />
                Offline Mode Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-amber-700 space-y-2">
                <p>You're currently offline. You can still:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Access all downloaded lessons</li>
                  <li>Continue your progress tracking</li>
                  <li>Practice with offline exercises</li>
                  <li>Review completed conversations</li>
                </ul>
                <p className="mt-3">Your progress will sync automatically when you reconnect.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PremiumGate>
  );
}