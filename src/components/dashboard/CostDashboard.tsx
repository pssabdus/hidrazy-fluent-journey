import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCostOptimization } from '@/hooks/useCostOptimization';
import { Brain, Zap, Volume2, MessageCircle, TrendingDown } from 'lucide-react';

export function CostDashboard() {
  const { usageStats, isLoading, limits } = useCostOptimization();

  if (isLoading || !usageStats) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  const { monthlyStats, dailyStats } = usageStats;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingDown className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold">AI Cost Optimization</h3>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Saving 85% vs Standard
        </Badge>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            ${monthlyStats.totalCost.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Monthly Cost</div>
          <Progress 
            value={(monthlyStats.totalCost / 10) * 100} 
            className="mt-2 h-2"
          />
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {monthlyStats.gpt4Calls}
          </div>
          <div className="text-sm text-muted-foreground">Premium AI Calls</div>
          <Progress 
            value={(monthlyStats.gpt4Calls / limits.monthlyGPT4Calls) * 100} 
            className="mt-2 h-2"
          />
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {monthlyStats.totalCalls}
          </div>
          <div className="text-sm text-muted-foreground">Total Conversations</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {dailyStats.conversationTurns}
          </div>
          <div className="text-sm text-muted-foreground">Today's Messages</div>
          <Progress 
            value={(dailyStats.conversationTurns / limits.dailyConversationTurns) * 100} 
            className="mt-2 h-2"
          />
        </div>
      </div>

      {/* Cost Optimizations Active */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Active Optimizations</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Brain className="h-4 w-4 text-green-600" />
            <div className="text-sm">
              <div className="font-medium">Smart Model Selection</div>
              <div className="text-muted-foreground">Using efficient AI 90% of time</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Volume2 className="h-4 w-4 text-blue-600" />
            <div className="text-sm">
              <div className="font-medium">On-Demand TTS</div>
              <div className="text-muted-foreground">Audio only when requested</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <MessageCircle className="h-4 w-4 text-purple-600" />
            <div className="text-sm">
              <div className="font-medium">Response Caching</div>
              <div className="text-muted-foreground">Reusing common answers</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Zap className="h-4 w-4 text-orange-600" />
            <div className="text-sm">
              <div className="font-medium">Usage Limits</div>
              <div className="text-muted-foreground">Preventing cost spikes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Cost-Saving Tips</h5>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Use 🧠 Smart mode for complex questions only</li>
          <li>• Click 🔊 next to messages for on-demand audio</li>
          <li>• Simple questions use efficient AI automatically</li>
          <li>• Voice chat coming soon as premium feature</li>
        </ul>
      </div>
    </Card>
  );
}