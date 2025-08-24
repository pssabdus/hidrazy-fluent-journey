import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Calendar, Clock, MessageCircle, Trophy, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { type WeeklyActivity } from '@/types/progress';

interface WeeklyActivityChartProps {
  data: WeeklyActivity[];
  detailed?: boolean;
}

export function WeeklyActivityChart({ data, detailed = false }: WeeklyActivityChartProps) {
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'year'>('week');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Calculate totals
  const totalStudyMinutes = data.reduce((sum, day) => sum + day.studyMinutes, 0);
  const totalLessons = data.reduce((sum, day) => sum + day.lessonsCompleted, 0);
  const totalConversations = data.reduce((sum, day) => sum + day.conversationCount, 0);
  const totalAchievements = data.reduce((sum, day) => sum + day.achievementUnlocks, 0);

  const stats = [
    {
      label: 'Study Time',
      value: `${Math.floor(totalStudyMinutes / 60)}h ${totalStudyMinutes % 60}m`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Lessons',
      value: totalLessons.toString(),
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Conversations',
      value: totalConversations.toString(),
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Achievements',
      value: totalAchievements.toString(),
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'studyMinutes' && `Study Time: ${entry.value} minutes`}
              {entry.dataKey === 'lessonsCompleted' && `Lessons: ${entry.value}`}
              {entry.dataKey === 'conversationCount' && `Conversations: ${entry.value}`}
              {entry.dataKey === 'achievementUnlocks' && `Achievements: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Activity
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              Bar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                      <div className="text-lg font-semibold text-foreground">{stat.value}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="studyMinutes" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  name="Study Minutes"
                />
                {detailed && (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="lessonsCompleted" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                      name="Lessons Completed"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversationCount" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      name="Conversations"
                    />
                  </>
                )}
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="studyMinutes" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name="Study Minutes"
                />
                {detailed && (
                  <>
                    <Bar 
                      dataKey="lessonsCompleted" 
                      fill="hsl(var(--accent))" 
                      radius={[4, 4, 0, 0]}
                      name="Lessons Completed"
                    />
                    <Bar 
                      dataKey="conversationCount" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]}
                      name="Conversations"
                    />
                  </>
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Goal Line Indicator */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500 opacity-60" />
            <span className="text-muted-foreground">Daily Goal: 30 minutes</span>
          </div>
          <Badge variant="secondary" className="text-primary">
            {Math.round((totalStudyMinutes / (30 * 7)) * 100)}% of weekly goal
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}