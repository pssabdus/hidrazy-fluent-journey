import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Calendar, 
  Users, 
  BookOpen,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { usePremium } from '@/hooks/usePremium';
import { PremiumGate } from '@/components/premium/PremiumGate';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LearningInsight {
  id: string;
  type: 'strength' | 'weakness' | 'improvement' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  category: string;
}

interface MistakePattern {
  pattern: string;
  frequency: number;
  category: string;
  examples: string[];
  improvement_tip: string;
  difficulty_level: string;
}

interface LearningVelocity {
  date: string;
  lessons_completed: number;
  time_spent: number;
  words_learned: number;
  conversations: number;
  efficiency_score: number;
}

interface StudyPlan {
  week: number;
  focus_area: string;
  objectives: string[];
  estimated_time: number;
  priority: 'high' | 'medium' | 'low';
  skills: string[];
}

export function AdvancedAnalyticsDashboard() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [mistakePatterns, setMistakePatterns] = useState<MistakePattern[]>([]);
  const [velocityData, setVelocityData] = useState<LearningVelocity[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Load conversation data for analysis
      const { data: conversations } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50);

      // Load lesson progress
      const { data: lessonProgress } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(30);

      // Generate mock analytics data (in real app, this would come from AI analysis)
      generateMockInsights();
      generateMockMistakePatterns();
      generateMockVelocityData();
      generateMockStudyPlan();

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockInsights = () => {
    const mockInsights: LearningInsight[] = [
      {
        id: '1',
        type: 'strength',
        title: 'Excellent Vocabulary Retention',
        description: 'You retain 87% of new vocabulary after 1 week, which is above average.',
        impact: 'high',
        actionable: false,
        category: 'vocabulary'
      },
      {
        id: '2',
        type: 'weakness',
        title: 'Article Usage Challenges',
        description: 'You struggle with definite/indefinite articles in 34% of conversations.',
        impact: 'medium',
        actionable: true,
        category: 'grammar'
      },
      {
        id: '3',
        type: 'improvement',
        title: '15% Speaking Fluency Increase',
        description: 'Your speaking fluency has improved by 15% over the past month.',
        impact: 'high',
        actionable: false,
        category: 'speaking'
      },
      {
        id: '4',
        type: 'recommendation',
        title: 'Focus on Past Tense Practice',
        description: 'Dedicated past tense exercises could improve your accuracy by 25%.',
        impact: 'medium',
        actionable: true,
        category: 'grammar'
      }
    ];
    setInsights(mockInsights);
  };

  const generateMockMistakePatterns = () => {
    const patterns: MistakePattern[] = [
      {
        pattern: 'Missing articles (a/an/the)',
        frequency: 23,
        category: 'Grammar',
        examples: ['"I went to school" → "I went to the school"', '"She is teacher" → "She is a teacher"'],
        improvement_tip: 'Practice article rules with definite/indefinite contexts',
        difficulty_level: 'Intermediate'
      },
      {
        pattern: 'Past tense irregular verbs',
        frequency: 18,
        category: 'Grammar',
        examples: ['"I goed there" → "I went there"', '"She catched the ball" → "She caught the ball"'],
        improvement_tip: 'Memorize common irregular verb forms through repetition',
        difficulty_level: 'Beginner'
      },
      {
        pattern: 'Word order in questions',
        frequency: 15,
        category: 'Syntax',
        examples: ['"Where you are going?" → "Where are you going?"', '"What you like?" → "What do you like?"'],
        improvement_tip: 'Practice question formation patterns regularly',
        difficulty_level: 'Intermediate'
      }
    ];
    setMistakePatterns(patterns);
  };

  const generateMockVelocityData = () => {
    const data: LearningVelocity[] = [
      { date: '2024-01-01', lessons_completed: 3, time_spent: 45, words_learned: 12, conversations: 2, efficiency_score: 8.2 },
      { date: '2024-01-02', lessons_completed: 2, time_spent: 30, words_learned: 8, conversations: 1, efficiency_score: 7.8 },
      { date: '2024-01-03', lessons_completed: 4, time_spent: 60, words_learned: 15, conversations: 3, efficiency_score: 8.7 },
      { date: '2024-01-04', lessons_completed: 1, time_spent: 20, words_learned: 5, conversations: 1, efficiency_score: 7.2 },
      { date: '2024-01-05', lessons_completed: 5, time_spent: 75, words_learned: 18, conversations: 4, efficiency_score: 9.1 },
      { date: '2024-01-06', lessons_completed: 3, time_spent: 50, words_learned: 11, conversations: 2, efficiency_score: 8.0 },
      { date: '2024-01-07', lessons_completed: 2, time_spent: 35, words_learned: 9, conversations: 2, efficiency_score: 8.3 }
    ];
    setVelocityData(data);
  };

  const generateMockStudyPlan = () => {
    const plan: StudyPlan[] = [
      {
        week: 1,
        focus_area: 'Article Usage Mastery',
        objectives: [
          'Complete 5 article-focused exercises',
          'Practice articles in 10 conversations',
          'Review definite/indefinite article rules'
        ],
        estimated_time: 180,
        priority: 'high',
        skills: ['grammar', 'speaking']
      },
      {
        week: 2,
        focus_area: 'Past Tense Consolidation',
        objectives: [
          'Master 20 irregular verbs',
          'Complete past tense story exercises',
          'Practice past tense in role-play scenarios'
        ],
        estimated_time: 150,
        priority: 'medium',
        skills: ['grammar', 'vocabulary']
      },
      {
        week: 3,
        focus_area: 'Question Formation',
        objectives: [
          'Practice WH-question patterns',
          'Role-play interviewer scenarios',
          'Master yes/no question formation'
        ],
        estimated_time: 120,
        priority: 'medium',
        skills: ['speaking', 'grammar']
      }
    ];
    setStudyPlan(plan);
  };

  const radarData = [
    { skill: 'Speaking', current: 7.2, target: 8.5 },
    { skill: 'Listening', current: 8.1, target: 8.8 },
    { skill: 'Reading', current: 6.8, target: 8.0 },
    { skill: 'Writing', current: 6.2, target: 7.5 },
    { skill: 'Grammar', current: 7.5, target: 8.2 },
    { skill: 'Vocabulary', current: 8.3, target: 9.0 }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return CheckCircle2;
      case 'weakness': return AlertTriangle;
      case 'improvement': return TrendingUp;
      case 'recommendation': return Target;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength': return 'text-green-600 bg-green-50 border-green-200';
      case 'weakness': return 'text-red-600 bg-red-50 border-red-200';
      case 'improvement': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'recommendation': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <PremiumGate 
      featureId="advanced_analytics" 
      showPreview={true}
      customMessage="Unlock detailed learning insights and AI-powered recommendations"
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-foreground"
            >
              Advanced Learning Analytics
            </motion.h1>
            <p className="text-xl text-muted-foreground">
              AI-powered insights to accelerate your English mastery
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Learning Efficiency', value: '8.4/10', change: '+12%', icon: TrendingUp, color: 'text-green-600' },
              { label: 'Mistake Reduction', value: '23%', change: 'this week', icon: Brain, color: 'text-blue-600' },
              { label: 'Study Streak', value: '12 days', change: 'Personal best!', icon: Award, color: 'text-purple-600' },
              { label: 'Next Milestone', value: '87%', change: 'to B2 level', icon: Target, color: 'text-orange-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6 text-center">
                    <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-xs text-green-600 mt-1">{stat.change}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Analytics Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="patterns">Mistake Patterns</TabsTrigger>
              <TabsTrigger value="velocity">Learning Velocity</TabsTrigger>
              <TabsTrigger value="plan">Study Plan</TabsTrigger>
            </TabsList>

            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Insights List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      Personalized Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {insights.map((insight, index) => {
                      const Icon = getInsightIcon(insight.type);
                      return (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                        >
                          <div className="flex items-start space-x-3">
                            <Icon className="h-5 w-5 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-medium">{insight.title}</h4>
                              <p className="text-sm opacity-80 mt-1">{insight.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {insight.category}
                                </Badge>
                                {insight.actionable && (
                                  <Button size="sm" variant="ghost" className="text-xs">
                                    Take Action
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Skill Radar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Balance Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis domain={[0, 10]} />
                        <Radar
                          name="Current"
                          dataKey="current"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                        />
                        <Radar
                          name="Target"
                          dataKey="target"
                          stroke="hsl(var(--accent))"
                          fill="hsl(var(--accent))"
                          fillOpacity={0.1}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Mistake Patterns Tab */}
            <TabsContent value="patterns" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Common Mistake Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mistakePatterns.map((pattern, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold">{pattern.pattern}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive">{pattern.frequency} occurrences</Badge>
                          <Badge variant="outline">{pattern.category}</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-2">Common Examples:</h5>
                          <div className="space-y-1">
                            {pattern.examples.map((example, i) => (
                              <div key={i} className="text-sm bg-red-50 p-2 rounded border-l-4 border-red-300">
                                {example}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-300">
                          <h5 className="font-medium text-green-800 mb-2">Improvement Tip:</h5>
                          <p className="text-sm text-green-700">{pattern.improvement_tip}</p>
                        </div>
                        
                        <Button size="sm" className="w-full">
                          Practice This Pattern
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Learning Velocity Tab */}
            <TabsContent value="velocity" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Efficiency Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={velocityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="efficiency_score" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Daily Activity Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={velocityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="lessons_completed" fill="hsl(var(--primary))" />
                        <Bar dataKey="conversations" fill="hsl(var(--accent))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Velocity Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Velocity Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">65 min</div>
                      <div className="text-sm text-blue-600">Average daily study time</div>
                      <div className="text-xs text-blue-500 mt-1">+15% from last week</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-700">3.2</div>
                      <div className="text-sm text-green-600">Lessons per day</div>
                      <div className="text-xs text-green-500 mt-1">Above target pace</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-700">82%</div>
                      <div className="text-sm text-purple-600">Learning efficiency</div>
                      <div className="text-xs text-purple-500 mt-1">Peak performance zone</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Study Plan Tab */}
            <TabsContent value="plan" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    AI-Generated Study Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {studyPlan.map((week, index) => (
                    <motion.div
                      key={week.week}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold">Week {week.week}: {week.focus_area}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={week.priority === 'high' ? 'destructive' : 'outline'}>
                            {week.priority} priority
                          </Badge>
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            {week.estimated_time}min
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-2">Learning Objectives:</h5>
                          <ul className="space-y-1">
                            {week.objectives.map((objective, i) => (
                              <li key={i} className="flex items-center text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Focus Skills:</span>
                          {week.skills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button size="sm" className="w-full">
                          Start Week {week.week}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PremiumGate>
  );
}