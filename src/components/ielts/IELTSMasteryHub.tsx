import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, BookOpen, Mic, Edit3, Calendar, TrendingUp, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PremiumGate } from '@/components/premium/PremiumGate';

interface IELTSProgress {
  reading: number;
  writing: number;
  listening: number;
  speaking: number;
  overall: number;
  targetBand: number;
}

interface PracticeTest {
  id: string;
  type: 'reading' | 'writing' | 'listening' | 'speaking' | 'full';
  title: string;
  duration: number; // in minutes
  difficulty: 'Academic' | 'General Training';
  completed: boolean;
  score?: number;
  completedAt?: Date;
}

export function IELTSMasteryHub() {
  const [ieltsProgress] = useState<IELTSProgress>({
    reading: 6.5,
    writing: 5.5,
    listening: 7.0,
    speaking: 6.0,
    overall: 6.2,
    targetBand: 7.5
  });

  const [practiceTests] = useState<PracticeTest[]>([
    {
      id: '1',
      type: 'reading',
      title: 'Academic Reading Test 1',
      duration: 60,
      difficulty: 'Academic',
      completed: true,
      score: 6.5,
      completedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      type: 'writing',
      title: 'Task 1 & 2 Practice',
      duration: 60,
      difficulty: 'Academic',
      completed: true,
      score: 5.5,
      completedAt: new Date('2024-01-18')
    },
    {
      id: '3',
      type: 'listening',
      title: 'Full Listening Test',
      duration: 40,
      difficulty: 'Academic',
      completed: false,
    },
    {
      id: '4',
      type: 'speaking',
      title: 'Speaking Parts 1-3',
      duration: 15,
      difficulty: 'Academic',
      completed: false,
    },
    {
      id: '5',
      type: 'full',
      title: 'Complete Practice Test',
      duration: 180,
      difficulty: 'Academic',
      completed: false,
    }
  ]);

  const getSkillColor = (score: number, target: number) => {
    if (score >= target) return 'text-green-600';
    if (score >= target - 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reading': return <BookOpen className="h-4 w-4" />;
      case 'writing': return <Edit3 className="h-4 w-4" />;
      case 'listening': return <Clock className="h-4 w-4" />;
      case 'speaking': return <Mic className="h-4 w-4" />;
      case 'full': return <Target className="h-4 w-4" />;
      default: return null;
    }
  };

  const getDaysUntilTest = () => {
    // Mock test date - 45 days from now
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 45);
    return 45;
  };

  const getReadinessPercentage = () => {
    return Math.round((ieltsProgress.overall / ieltsProgress.targetBand) * 100);
  };

  return (
    <PremiumGate featureId="ielts_mastery">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">IELTS Mastery</h1>
            <p className="text-muted-foreground">Complete IELTS preparation with AI-powered feedback</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{getDaysUntilTest()}</div>
              <div className="text-sm text-muted-foreground">Days to Test</div>
            </div>
            <Button className="gap-2">
              <Calendar className="h-4 w-4" />
              Book Test
            </Button>
          </div>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your IELTS Progress
            </CardTitle>
            <CardDescription>
              Track your progress towards your target band score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-foreground">{ieltsProgress.overall}</div>
                <div className="text-sm text-muted-foreground">Current Overall</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">{ieltsProgress.targetBand}</div>
                <div className="text-sm text-muted-foreground">Target Band</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">{getReadinessPercentage()}%</div>
                <div className="text-sm text-muted-foreground">Test Readiness</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { skill: 'Reading', score: ieltsProgress.reading, icon: BookOpen },
                  { skill: 'Writing', score: ieltsProgress.writing, icon: Edit3 },
                  { skill: 'Listening', score: ieltsProgress.listening, icon: Clock },
                  { skill: 'Speaking', score: ieltsProgress.speaking, icon: Mic }
                ].map(({ skill, score, icon: Icon }) => (
                  <div key={skill} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                    <div className={`text-2xl font-bold ${getSkillColor(score, ieltsProgress.targetBand)}`}>
                      {score}
                    </div>
                    <Progress 
                      value={(score / 9) * 100} 
                      className="h-2 mt-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button className="gap-2">
                <TrendingUp className="h-4 w-4" />
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Practice Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Tests</CardTitle>
            <CardDescription>
              Take full-length practice tests with instant feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {practiceTests.map((test) => (
                <motion.div
                  key={test.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getTypeIcon(test.type)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{test.title}</h3>
                        <Badge variant="outline">{test.difficulty}</Badge>
                        {test.completed && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                            <Award className="h-3 w-3 mr-1" />
                            {test.score}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {test.duration} minutes • {test.type.charAt(0).toUpperCase() + test.type.slice(1)} Test
                        {test.completedAt && ` • Completed ${test.completedAt.toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant={test.completed ? "outline" : "default"}>
                    {test.completed ? "Review" : "Start Test"}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Writing Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get AI-powered feedback on your Task 1 and Task 2 responses
              </p>
              <Button className="w-full">Practice Writing</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Speaking Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Practice speaking with AI examiner and get instant scoring
              </p>
              <Button className="w-full">Start Speaking</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Test Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Find and book your official IELTS test date
              </p>
              <Button className="w-full" variant="outline">Book Now</Button>
            </CardContent>
          </Card>
        </div>

        {/* Band Score Predictor */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <TrendingUp className="h-5 w-5" />
              AI Band Score Predictor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700 space-y-2">
              <p className="font-medium">Based on your recent practice tests:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Your strongest skill is Listening (7.0/9.0)</li>
                <li>Focus on improving Writing to reach your target</li>
                <li>With consistent practice, you can achieve 7.5 in 6-8 weeks</li>
                <li>Recommended: 2-3 practice tests per week</li>
              </ul>
              <Button variant="outline" className="mt-3">
                Get Detailed Prediction
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PremiumGate>
  );
}