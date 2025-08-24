import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award, 
  CheckCircle, 
  Clock,
  Star,
  BookOpen,
  MessageSquare,
  Brain,
  Globe,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { motion } from 'framer-motion';

interface ProgressData {
  overall_proficiency: number;
  speaking_level: number;
  listening_level: number;
  reading_level: number;
  writing_level: number;
  grammar_level: number;
  vocabulary_level: number;
  pronunciation_level: number;
  cultural_competency: number;
  learning_velocity: number;
  consistency_score: number;
}

interface ComprehensiveProgressDashboardProps {
  userId: string;
}

const ComprehensiveProgressDashboard: React.FC<ComprehensiveProgressDashboardProps> = ({ userId }) => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Mock comprehensive progress data
  const mockProgressData: ProgressData = {
    overall_proficiency: 87,
    speaking_level: 85,
    listening_level: 92,
    reading_level: 89,
    writing_level: 83,
    grammar_level: 78,
    vocabulary_level: 91,
    pronunciation_level: 86,
    cultural_competency: 84,
    learning_velocity: 15.3,
    consistency_score: 88
  };

  const weeklyTrends = [
    { day: 'Mon', overall: 82, speaking: 80, listening: 88, grammar: 75 },
    { day: 'Tue', overall: 84, speaking: 82, listening: 89, grammar: 76 },
    { day: 'Wed', overall: 85, speaking: 83, listening: 90, grammar: 77 },
    { day: 'Thu', overall: 86, speaking: 84, listening: 91, grammar: 77 },
    { day: 'Fri', overall: 87, speaking: 85, listening: 92, grammar: 78 },
    { day: 'Sat', overall: 87, speaking: 85, listening: 92, grammar: 78 },
    { day: 'Sun', overall: 87, speaking: 85, listening: 92, grammar: 78 }
  ];

  const milestones = [
    { 
      title: 'Intermediate Fluency', 
      description: 'Achieve B2 level across all skills',
      target: 85,
      current: 87,
      completed: true,
      completedDate: '2024-01-20'
    },
    { 
      title: 'Advanced Grammar', 
      description: 'Master complex grammatical structures',
      target: 85,
      current: 78,
      completed: false,
      estimatedDate: '2024-02-15'
    },
    { 
      title: 'Cultural Fluency', 
      description: 'Navigate English cultural contexts confidently',
      target: 90,
      current: 84,
      completed: false,
      estimatedDate: '2024-02-28'
    },
    { 
      title: 'Professional Proficiency', 
      description: 'C1 level for business communication',
      target: 95,
      current: 87,
      completed: false,
      estimatedDate: '2024-03-20'
    }
  ];

  const strengths = [
    { skill: 'Listening Comprehension', score: 92, improvement: '+8%' },
    { skill: 'Vocabulary Range', score: 91, improvement: '+12%' },
    { skill: 'Reading Comprehension', score: 89, improvement: '+6%' },
    { skill: 'Overall Fluency', score: 87, improvement: '+15%' }
  ];

  const improvementAreas = [
    { skill: 'Grammar Accuracy', score: 78, recommendation: 'Focus on verb tenses and articles' },
    { skill: 'Writing Coherence', score: 83, recommendation: 'Practice paragraph structure and linking words' },
    { skill: 'Cultural Context', score: 84, recommendation: 'Engage more with business scenarios' },
    { skill: 'Pronunciation', score: 86, recommendation: 'Work on consonant clusters and word stress' }
  ];

  const skillRadialData = [
    { name: 'Speaking', value: 85, fill: '#8884d8' },
    { name: 'Listening', value: 92, fill: '#82ca9d' },
    { name: 'Reading', value: 89, fill: '#ffc658' },
    { name: 'Writing', value: 83, fill: '#ff7300' },
    { name: 'Grammar', value: 78, fill: '#8dd1e1' },
    { name: 'Vocabulary', value: 91, fill: '#d084d0' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProgressData(mockProgressData);
      setLoading(false);
    }, 1000);
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-muted rounded"></div>
      </div>
    );
  }

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent', variant: 'default' as const };
    if (score >= 80) return { text: 'Good', variant: 'secondary' as const };
    if (score >= 70) return { text: 'Fair', variant: 'outline' as const };
    return { text: 'Needs Work', variant: 'destructive' as const };
  };

  return (
    <div className="space-y-8">
      {/* Header with Overall Score */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Your Learning Progress</h1>
          <p className="text-muted-foreground">Track your English proficiency across all skills</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getProgressColor(progressData!.overall_proficiency)}`}>
                  {progressData!.overall_proficiency}%
                </div>
                <div className="text-sm text-muted-foreground">Overall</div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2">
              <Badge {...getProgressBadge(progressData!.overall_proficiency)}>
                {getProgressBadge(progressData!.overall_proficiency).text}
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Learning Velocity</p>
                  <p className="text-2xl font-bold text-green-900">{progressData!.learning_velocity}%</p>
                  <p className="text-xs text-green-600">Weekly improvement rate</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Consistency Score</p>
                  <p className="text-2xl font-bold text-blue-900">{progressData!.consistency_score}%</p>
                  <p className="text-xs text-blue-600">Daily practice regularity</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Cultural Competency</p>
                  <p className="text-2xl font-bold text-purple-900">{progressData!.cultural_competency}%</p>
                  <p className="text-xs text-purple-600">English culture navigation</p>
                </div>
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Progress Tabs */}
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skills">Skills Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Progress Trends</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Radial Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={skillRadialData}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Individual Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Speaking', value: progressData!.speaking_level, icon: MessageSquare },
                  { name: 'Listening', value: progressData!.listening_level, icon: BookOpen },
                  { name: 'Reading', value: progressData!.reading_level, icon: BookOpen },
                  { name: 'Writing', value: progressData!.writing_level, icon: BookOpen },
                  { name: 'Grammar', value: progressData!.grammar_level, icon: Brain },
                  { name: 'Vocabulary', value: progressData!.vocabulary_level, icon: Star }
                ].map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <skill.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <Badge {...getProgressBadge(skill.value)}>
                        {skill.value}%
                      </Badge>
                    </div>
                    <Progress value={skill.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="overall" stroke="#8884d8" strokeWidth={2} name="Overall" />
                  <Line type="monotone" dataKey="speaking" stroke="#82ca9d" strokeWidth={2} name="Speaking" />
                  <Line type="monotone" dataKey="listening" stroke="#ffc658" strokeWidth={2} name="Listening" />
                  <Line type="monotone" dataKey="grammar" stroke="#ff7300" strokeWidth={2} name="Grammar" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={milestone.completed ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {milestone.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <Target className="h-6 w-6 text-blue-600" />
                        )}
                        <div>
                          <h3 className="font-semibold">{milestone.title}</h3>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        </div>
                      </div>
                      {milestone.completed && (
                        <Badge className="bg-green-100 text-green-800">
                          <Award className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{milestone.current}% / {milestone.target}%</span>
                      </div>
                      <Progress value={(milestone.current / milestone.target) * 100} className="h-2" />
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                        <Calendar className="h-3 w-3" />
                        {milestone.completed ? (
                          <span>Completed on {milestone.completedDate}</span>
                        ) : (
                          <span>Estimated completion: {milestone.estimatedDate}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {strengths.map((strength, index) => (
                  <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-green-900">{strength.skill}</h4>
                      <Badge className="bg-green-100 text-green-800">
                        {strength.score}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <TrendingUp className="h-3 w-3" />
                      <span>{strength.improvement} improvement this month</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Improvement Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Growth Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {improvementAreas.map((area, index) => (
                  <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-blue-900">{area.skill}</h4>
                      <Badge variant="outline">
                        {area.score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-700">
                      {area.recommendation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveProgressDashboard;