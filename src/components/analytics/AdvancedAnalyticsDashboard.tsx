import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  TrendingUp, 
  Clock, 
  Target, 
  Brain, 
  Globe,
  Award,
  BookOpen,
  Mic,
  MessageSquare,
  Star,
  Calendar,
  BarChart3,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface AnalyticsDashboardProps {
  userId: string;
}

export const AdvancedAnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data for demonstration
  const mockAnalytics = {
    weeklyProgress: [
      { day: 'Mon', speaking: 85, listening: 92, grammar: 78, vocabulary: 88 },
      { day: 'Tue', speaking: 88, listening: 89, grammar: 82, vocabulary: 90 },
      { day: 'Wed', speaking: 92, listening: 94, grammar: 85, vocabulary: 93 },
      { day: 'Thu', speaking: 89, listening: 91, grammar: 88, vocabulary: 89 },
      { day: 'Fri', speaking: 94, listening: 96, grammar: 91, vocabulary: 95 },
      { day: 'Sat', speaking: 96, listening: 98, grammar: 93, vocabulary: 97 },
      { day: 'Sun', speaking: 91, listening: 94, grammar: 89, vocabulary: 92 }
    ],
    skillBreakdown: [
      { skill: 'Speaking', current: 91, target: 95, progress: 87 },
      { skill: 'Listening', current: 94, target: 98, progress: 92 },
      { skill: 'Grammar', current: 87, target: 92, progress: 78 },
      { skill: 'Vocabulary', current: 93, target: 96, progress: 89 },
      { skill: 'Pronunciation', current: 89, target: 94, progress: 83 },
      { skill: 'Cultural Fluency', current: 85, target: 90, progress: 76 }
    ],
    conversationMetrics: {
      totalMinutes: 247,
      conversationsCount: 23,
      averageConfidence: 87,
      improvementRate: 15.3,
      culturalAdaptation: 82,
      engagementScore: 94
    },
    mistakePatterns: [
      { type: 'Articles', count: 12, trend: -25, improvement: 'Good' },
      { type: 'Pronunciation', count: 8, trend: -40, improvement: 'Excellent' },
      { type: 'Verb Tenses', count: 15, trend: -15, improvement: 'Moderate' },
      { type: 'Prepositions', count: 9, trend: -35, improvement: 'Good' },
      { type: 'Word Order', count: 6, trend: -50, improvement: 'Excellent' }
    ],
    achievements: [
      { 
        title: 'Conversation Master', 
        description: '20 conversations completed', 
        icon: MessageSquare, 
        unlocked: true, 
        date: '2024-01-15' 
      },
      { 
        title: 'Cultural Bridge Builder', 
        description: 'Successfully navigated cultural contexts', 
        icon: Globe, 
        unlocked: true, 
        date: '2024-01-18' 
      },
      { 
        title: 'Pronunciation Pro', 
        description: 'Achieved 90%+ pronunciation accuracy', 
        icon: Mic, 
        unlocked: true, 
        date: '2024-01-20' 
      },
      { 
        title: 'Grammar Guardian', 
        description: 'Master complex grammar structures', 
        icon: BookOpen, 
        unlocked: false, 
        progress: 78 
      }
    ],
    learningVelocity: {
      current: 15.3,
      target: 20,
      trend: '+3.2% from last week'
    },
    nextMilestones: [
      { skill: 'Speaking Fluency', progress: 87, target: 95, daysLeft: 12 },
      { skill: 'Grammar Mastery', progress: 78, target: 90, daysLeft: 18 },
      { skill: 'Cultural Confidence', progress: 82, target: 90, daysLeft: 15 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-muted rounded"></div>
      </div>
    );
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Analytics</h1>
          <p className="text-muted-foreground">Track your English learning progress with AI-powered insights</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'quarter'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Practice Time</p>
                  <p className="text-2xl font-bold text-blue-900">{analytics.conversationMetrics.totalMinutes}min</p>
                  <p className="text-xs text-blue-600">This week</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Conversations</p>
                  <p className="text-2xl font-bold text-green-900">{analytics.conversationMetrics.conversationsCount}</p>
                  <p className="text-xs text-green-600">+5 from last week</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Confidence</p>
                  <p className="text-2xl font-bold text-purple-900">{analytics.conversationMetrics.averageConfidence}%</p>
                  <p className="text-xs text-purple-600">+12% improvement</p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Learning Velocity</p>
                  <p className="text-2xl font-bold text-orange-900">{analytics.learningVelocity.current}%</p>
                  <p className="text-xs text-orange-600">{analytics.learningVelocity.trend}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Weekly Progress Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="speaking" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="listening" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="grammar" stroke="#ffc658" strokeWidth={2} />
              <Line type="monotone" dataKey="vocabulary" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skills and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Next Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.nextMilestones.map((milestone, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{milestone.skill}</span>
                  <Badge variant="outline">{milestone.daysLeft} days left</Badge>
                </div>
                <Progress value={(milestone.progress / milestone.target) * 100} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{milestone.progress}%</span>
                  <span>Target: {milestone.target}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-yellow-200' : 'bg-gray-200'}`}>
                  <achievement.icon className={`h-4 w-4 ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked && achievement.date && (
                    <Badge className="mt-1 text-xs">
                      <Trophy className="h-3 w-3 mr-1" />
                      {new Date(achievement.date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};