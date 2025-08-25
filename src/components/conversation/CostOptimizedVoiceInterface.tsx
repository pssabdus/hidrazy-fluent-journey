import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, Star, Crown, Zap } from 'lucide-react';

interface CostOptimizedVoiceInterfaceProps {
  onUpgradeClick?: () => void;
}

// Replacement for expensive real-time voice chat
const CostOptimizedVoiceInterface: React.FC<CostOptimizedVoiceInterfaceProps> = ({ 
  onUpgradeClick 
}) => {
  return (
    <div className="flex flex-col h-full justify-center items-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <Card className="max-w-md mx-auto p-8 text-center shadow-lg border-2 border-purple-200 dark:border-purple-800">
        {/* Premium Feature Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
          <Volume2 className="h-10 w-10 text-white" />
          <Crown className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500" />
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-foreground mb-3">
          🎤 Real-Time Voice Chat
        </h3>
        
        {/* Coming Soon Badge */}
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Star className="h-3 w-3 mr-1" />
          Premium Feature
        </Badge>
        
        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Experience real-time voice conversations with Razia! Coming soon with:
        </p>
        
        {/* Features List */}
        <div className="text-sm text-muted-foreground space-y-2 mb-6">
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            <span>Instant voice feedback</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            <span>Real-time pronunciation help</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            <span>Natural conversation flow</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            <span>Advanced AI voice processing</span>
          </div>
        </div>
        
        {/* Current Alternative */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
            💡 Available Now:
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Use the Text Chat with 🔊 audio buttons for voice practice! 
            You can still hear Razia's responses and practice speaking.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onUpgradeClick}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Crown className="h-4 w-4 mr-2" />
            Get Notified When Available
          </Button>
          
          <p className="text-xs text-muted-foreground">
            We're optimizing this feature to provide the best experience while keeping costs low for all users! 💝
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CostOptimizedVoiceInterface;