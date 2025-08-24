import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle, 
  Clock, 
  TrendingUp, 
  Mic,
  Target,
  Star,
  Award
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { type ConversationStats } from '@/types/progress';

interface ConversationAnalyticsProps {
  data: ConversationStats;
  compact?: boolean;
}

export function ConversationAnalytics({ data, compact = false }: ConversationAnalyticsProps) {
  const averageMinutes = Math.floor(data.averageLength / 60);
  const averageSeconds = data.averageLength % 60;

  // Mock fluency data for chart
  const fluencyData = data.fluencyImprovement.map((score, index) => ({
    session: `Session ${index + 1}`,
    fluency: score,
    pronunciation: data.pronunciationScores[index] || score - 5
  }));

  // Conversation types pie chart data
  const conversationTypeData = Object.entries(data.favoriteTypes).map(([type, count]) => ({
    name: type,
    value: count,
    color: {
      'Free Chat': '#3b82f6',
      'Lesson Practice': '#10b981',
      'Role Play': '#f59e0b',
      'Assessment': '#ef4444',
      'Cultural Bridge': '#8b5cf6'
    }[type] || '#6b7280'
  }));

  const stats = [
    {
      label: 'Total Conversations',
      value: data.totalConversations.toString(),
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Average Length',
      value: `${averageMinutes}m ${averageSeconds}s`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Topics Covered',
      value: data.topicsDiscussed.length.toString(),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Avg Fluency',
      value: `${Math.round(data.fluencyImprovement[data.fluencyImprovement.length - 1] || 0)}%`,
      icon: Mic,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const latestFluency = data.fluencyImprovement[data.fluencyImprovement.length - 1] || 0;
  const previousFluency = data.fluencyImprovement[data.fluencyImprovement.length - 2] || 0;
  const fluencyImprovement = latestFluency - previousFluency;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Conversation Analytics
          {!compact && (
            <Badge variant="secondary" className="ml-auto">
              Razia Sessions
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className={`grid grid-cols-2 ${compact ? 'gap-3' : 'lg:grid-cols-4 gap-4'}`}>
          {stats.slice(0, compact ? 2 : 4).map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                      <div className="font-semibold text-foreground">{stat.value}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Fluency Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Fluency Progress</h4>
            <div className="flex items-center gap-1">
              <TrendingUp className={`h-4 w-4 ${fluencyImprovement > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm font-medium ${fluencyImprovement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {fluencyImprovement > 0 ? '+' : ''}{fluencyImprovement.toFixed(1)}%
              </span>
            </div>
          </div>
          <Progress value={latestFluency} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Current: {latestFluency.toFixed(1)}%</span>
            <span>Target: 85%</span>
          </div>
        </motion.div>

        {!compact && (
          <>
            {/* Fluency Chart */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Progress Over Time</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fluencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="session" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="fluency" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                      name="Fluency Score"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pronunciation" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 3 }}
                      name="Pronunciation"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Conversation Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Conversation Types</h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conversationTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={50}
                        dataKey="value"
                      >
                        {conversationTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Recent Topics</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {data.topicsDiscussed.slice(0, 6).map((topic, index) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 p-2 rounded bg-muted/50"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm text-foreground truncate">{topic}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievement Highlight */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Conversation Milestone</h4>
                    <p className="text-sm text-muted-foreground">
                      Great progress! You've improved your fluency by 15% this month.
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    <Star className="h-3 w-3 mr-1" />
                    Excellent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Quick Action */}
        <Button className="w-full" variant={compact ? "outline" : "default"}>
          <MessageCircle className="h-4 w-4 mr-2" />
          {compact ? "View Details" : "Start Conversation"}
        </Button>
      </CardContent>
    </Card>
  );
}