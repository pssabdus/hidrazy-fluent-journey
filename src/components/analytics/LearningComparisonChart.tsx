import { motion } from 'framer-motion';
import { Users, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ComparisonData {
  metric: string;
  userScore: number;
  averageScore: number;
  topPercentile: number;
  unit: string;
}

interface ProgressComparison {
  week: string;
  user: number;
  average: number;
  topPerformers: number;
}

export function LearningComparisonChart() {
  const comparisonData: ComparisonData[] = [
    {
      metric: 'Daily Study Time',
      userScore: 65,
      averageScore: 45,
      topPercentile: 85,
      unit: 'minutes'
    },
    {
      metric: 'Vocabulary Retention',
      userScore: 87,
      averageScore: 72,
      topPercentile: 94,
      unit: '%'
    },
    {
      metric: 'Speaking Fluency',
      userScore: 7.2,
      averageScore: 6.1,
      topPercentile: 8.4,
      unit: '/10'
    },
    {
      metric: 'Lesson Completion Rate',
      userScore: 92,
      averageScore: 68,
      topPercentile: 98,
      unit: '%'
    },
    {
      metric: 'Conversation Frequency',
      userScore: 12,
      averageScore: 8,
      topPercentile: 18,
      unit: 'per week'
    }
  ];

  const progressData: ProgressComparison[] = [
    { week: 'Week 1', user: 45, average: 38, topPerformers: 72 },
    { week: 'Week 2', user: 52, average: 42, topPerformers: 75 },
    { week: 'Week 3', user: 48, average: 45, topPerformers: 78 },
    { week: 'Week 4', user: 65, average: 47, topPerformers: 82 },
    { week: 'Week 5', user: 68, average: 50, topPerformers: 85 },
    { week: 'Week 6', user: 72, average: 52, topPerformers: 87 },
    { week: 'Week 7', user: 75, average: 54, topPerformers: 90 },
    { week: 'Week 8', user: 78, average: 56, topPerformers: 92 }
  ];

  const getPerformanceLevel = (userScore: number, averageScore: number, topScore: number) => {
    const percentile = ((userScore - 0) / (topScore - 0)) * 100;
    
    if (percentile >= 85) return { label: 'Exceptional', color: 'text-purple-600 bg-purple-100' };
    if (percentile >= 70) return { label: 'Above Average', color: 'text-green-600 bg-green-100' };
    if (percentile >= 50) return { label: 'Average', color: 'text-blue-600 bg-blue-100' };
    return { label: 'Below Average', color: 'text-orange-600 bg-orange-100' };
  };

  const calculateRanking = (userScore: number, averageScore: number) => {
    if (userScore > averageScore * 1.3) return 'Top 10%';
    if (userScore > averageScore * 1.15) return 'Top 25%';
    if (userScore > averageScore) return 'Above Average';
    return 'Below Average';
  };

  return (
    <div className="space-y-6">
      {/* Performance Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisonData.map((item, index) => {
          const performance = getPerformanceLevel(item.userScore, item.averageScore, item.topPercentile);
          const ranking = calculateRanking(item.userScore, item.averageScore);
          
          return (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{item.metric}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Your Score</span>
                      <span className="text-lg font-bold text-primary">
                        {item.userScore}{item.unit}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>vs Average ({item.averageScore}{item.unit})</span>
                        <span className="text-green-600">
                          +{((item.userScore - item.averageScore) / item.averageScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={(item.userScore / item.topPercentile) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${performance.color}`}>
                      {performance.label}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {ranking}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Progress vs Peers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="topPerformers" 
                stackId="1"
                stroke="hsl(var(--muted))" 
                fill="hsl(var(--muted))"
                fillOpacity={0.3}
              />
              <Area 
                type="monotone" 
                dataKey="average" 
                stackId="2"
                stroke="hsl(var(--accent))" 
                fill="hsl(var(--accent))"
                fillOpacity={0.4}
              />
              <Line 
                type="monotone" 
                dataKey="user" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Your Progress</div>
              <div className="text-lg font-bold text-primary">78 points</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Peer Average</div>
              <div className="text-lg font-bold text-accent">56 points</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Top Performers</div>
              <div className="text-lg font-bold text-muted-foreground">92 points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Achievement Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                title: 'Conversation Master', 
                description: '100 conversations completed',
                userProgress: 78,
                peerAverage: 45,
                achieved: false
              },
              { 
                title: 'Vocabulary Expert', 
                description: '500 words mastered',
                userProgress: 387,
                peerAverage: 280,
                achieved: false
              },
              { 
                title: 'Grammar Guru', 
                description: '95% grammar accuracy',
                userProgress: 87,
                peerAverage: 72,
                achieved: false
              },
              { 
                title: 'Fluency Champion', 
                description: '30-day study streak',
                userProgress: 12,
                peerAverage: 8,
                achieved: false
              }
            ].map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 border rounded-lg bg-white"
              >
                <Award className={`h-8 w-8 ${achievement.achieved ? 'text-yellow-500' : 'text-gray-300'}`} />
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Your Progress: {achievement.userProgress}</span>
                        <span>Peer Average: {achievement.peerAverage}</span>
                      </div>
                      <Progress 
                        value={Math.min((achievement.userProgress / 100) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
                <Badge variant={achievement.achieved ? 'default' : 'outline'}>
                  {achievement.achieved ? 'Achieved' : 'In Progress'}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}