import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HardDrive, Trash2, Download, AlertTriangle, Settings, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { PremiumGate } from '@/components/premium/PremiumGate';
import { useToast } from '@/hooks/use-toast';

interface StorageItem {
  id: string;
  name: string;
  type: 'lesson' | 'conversation' | 'audio' | 'cache';
  size: number; // in MB
  lastAccessed: Date;
  priority: 'high' | 'medium' | 'low';
  autoManaged: boolean;
}

interface StorageSettings {
  maxStorageSize: number; // in MB
  autoCleanup: boolean;
  keepDuration: number; // in days
  prioritizeRecent: boolean;
}

export function SmartStorageManager() {
  const [storageItems, setStorageItems] = useState<StorageItem[]>([]);
  const [storageSettings, setStorageSettings] = useState<StorageSettings>({
    maxStorageSize: 1000,
    autoCleanup: true,
    keepDuration: 30,
    prioritizeRecent: true
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Mock storage items
    setStorageItems([
      {
        id: '1',
        name: 'Daily Conversations Pack',
        type: 'lesson',
        size: 125,
        lastAccessed: new Date('2024-01-20'),
        priority: 'high',
        autoManaged: false
      },
      {
        id: '2',
        name: 'Conversation with Razia - Coffee Shop',
        type: 'conversation',
        size: 45,
        lastAccessed: new Date('2024-01-18'),
        priority: 'medium',
        autoManaged: true
      },
      {
        id: '3',
        name: 'Audio Files Cache',
        type: 'audio',
        size: 89,
        lastAccessed: new Date('2024-01-15'),
        priority: 'low',
        autoManaged: true
      },
      {
        id: '4',
        name: 'Old Grammar Exercises',
        type: 'lesson',
        size: 67,
        lastAccessed: new Date('2024-01-10'),
        priority: 'low',
        autoManaged: true
      },
      {
        id: '5',
        name: 'Downloaded Audio Pronunciations',
        type: 'audio',
        size: 156,
        lastAccessed: new Date('2024-01-19'),
        priority: 'medium',
        autoManaged: false
      }
    ]);
  }, []);

  const totalUsedStorage = storageItems.reduce((sum, item) => sum + item.size, 0);
  const storagePercentage = (totalUsedStorage / storageSettings.maxStorageSize) * 100;

  const handleDeleteItems = (itemIds: string[]) => {
    const deletedSize = storageItems
      .filter(item => itemIds.includes(item.id))
      .reduce((sum, item) => sum + item.size, 0);
    
    setStorageItems(prev => prev.filter(item => !itemIds.includes(item.id)));
    setSelectedItems([]);
    
    toast({
      title: "Items Deleted",
      description: `Freed up ${deletedSize.toFixed(1)} MB of storage space`,
    });
  };

  const handleSmartCleanup = () => {
    // Simulate smart cleanup logic
    const itemsToRemove = storageItems.filter(item => 
      item.autoManaged && 
      item.priority === 'low' && 
      item.lastAccessed < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    
    if (itemsToRemove.length > 0) {
      handleDeleteItems(itemsToRemove.map(item => item.id));
      toast({
        title: "Smart Cleanup Complete",
        description: `Removed ${itemsToRemove.length} old items to free up space`,
      });
    } else {
      toast({
        title: "No Cleanup Needed",
        description: "Your storage is already optimized",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚';
      case 'conversation': return '💬';
      case 'audio': return '🔊';
      case 'cache': return '🗂️';
      default: return '📄';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600';
      case 'low': return 'bg-green-500/10 text-green-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const formatSize = (size: number) => `${size.toFixed(1)} MB`;
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <PremiumGate featureId="offline_learning">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Smart Storage Manager</h1>
          <p className="text-muted-foreground">Intelligent storage optimization for offline content</p>
        </div>

        {/* Storage Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Overview
            </CardTitle>
            <CardDescription>
              Monitor and manage your offline storage usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{formatSize(totalUsedStorage)}</div>
                <div className="text-sm text-muted-foreground">Used Storage</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{formatSize(storageSettings.maxStorageSize - totalUsedStorage)}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{storageItems.length}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {storageItems.filter(item => item.autoManaged).length}
                </div>
                <div className="text-sm text-muted-foreground">Auto-Managed</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Usage</span>
                <span>{formatSize(totalUsedStorage)} / {formatSize(storageSettings.maxStorageSize)}</span>
              </div>
              <Progress value={storagePercentage} className={storagePercentage > 80 ? "text-red-500" : ""} />
              {storagePercentage > 80 && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Storage almost full - consider running cleanup
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Storage Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Storage Settings
            </CardTitle>
            <CardDescription>
              Configure automatic storage management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Cleanup</p>
                    <p className="text-sm text-muted-foreground">Automatically remove old content</p>
                  </div>
                  <Switch
                    checked={storageSettings.autoCleanup}
                    onCheckedChange={(checked) => 
                      setStorageSettings(prev => ({ ...prev, autoCleanup: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Prioritize Recent</p>
                    <p className="text-sm text-muted-foreground">Keep recently accessed items</p>
                  </div>
                  <Switch
                    checked={storageSettings.prioritizeRecent}
                    onCheckedChange={(checked) => 
                      setStorageSettings(prev => ({ ...prev, prioritizeRecent: checked }))
                    }
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Max Storage Size</p>
                  <Slider
                    value={[storageSettings.maxStorageSize]}
                    onValueChange={([value]) => 
                      setStorageSettings(prev => ({ ...prev, maxStorageSize: value }))
                    }
                    max={2000}
                    min={500}
                    step={100}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatSize(storageSettings.maxStorageSize)}
                  </p>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Keep Duration (days)</p>
                  <Slider
                    value={[storageSettings.keepDuration]}
                    onValueChange={([value]) => 
                      setStorageSettings(prev => ({ ...prev, keepDuration: value }))
                    }
                    max={90}
                    min={7}
                    step={7}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {storageSettings.keepDuration} days
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSmartCleanup} className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Smart Cleanup
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Storage Items */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Items</CardTitle>
            <CardDescription>
              Manage individual items in your offline storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storageItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(prev => [...prev, item.id]);
                        } else {
                          setSelectedItems(prev => prev.filter(id => id !== item.id));
                        }
                      }}
                      className="rounded"
                    />
                    
                    <div className="text-2xl">{getTypeIcon(item.type)}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <Badge variant="secondary" className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        {item.autoManaged && (
                          <Badge variant="outline" className="text-xs">
                            Auto-managed
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {formatSize(item.size)} • Last accessed {formatDate(item.lastAccessed)}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItems([item.id])}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
            
            {selectedItems.length > 0 && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg flex items-center justify-between">
                <p className="text-sm">
                  {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteItems(selectedItems)}
                >
                  Delete Selected
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PremiumGate>
  );
}