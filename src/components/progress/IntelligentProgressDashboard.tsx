import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Zap,
  Trophy,
  Flame,
  Sparkles
} from 'lucide-react';
import { IntelligentProgressTracker, type ProgressMetrics, type Milestone, type WeeklySummary } from '@/services/IntelligentProgressTracker';

interface IntelligentProgressDashboardProps {
  userId: string;
}

const IntelligentProgressDashboard: React.FC<IntelligentProgressDashboardProps> = ({ userId }) => {
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadProgressData();
  }, [userId]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const [metrics, summary, detectedMilestones] = await Promise.all([
        IntelligentProgressTracker.calculateProgressMetrics(userId),
        IntelligentProgressTracker.generateWeeklyProgress(userId),
        IntelligentProgressTracker.detectMilestones(userId)
      ]);
      
      setProgressMetrics(metrics);
      setWeeklySummary(summary);
      setMilestones(detectedMilestones);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const skillAreas = [
    {
      name: "Grammar Accuracy",
      emoji: "📗", 
      currentScore: progressMetrics?.skillLevels.grammar || 0,
      weeklyGain: "+5% this week",
      nextMilestone: "Master Past Perfect",
      color: "hsl(var(--primary))"
    },
    {
      name: "Speaking Confidence", 
      emoji: "🗣️",
      currentScore: progressMetrics?.skillLevels.speaking || 0,
      weeklyGain: "+8% this week",
      nextMilestone: "Natural Conversations",
      color: "hsl(var(--secondary))"
    },
    {
      name: "Listening Comprehension",
      emoji: "👂",
      currentScore: progressMetrics?.skillLevels.listening || 0,
      weeklyGain: "+3% this week",
      nextMilestone: "Native Speed Audio",
      color: "hsl(var(--accent))"
    },
    {
      name: "Writing Ability",
      emoji: "✍️",
      currentScore: progressMetrics?.skillLevels.writing || 0,
      weeklyGain: "+6% this week",
      nextMilestone: "Essay Structure",
      color: "hsl(var(--destructive))"
    },
    {
      name: "Vocabulary Range",
      emoji: "📚",
      currentScore: progressMetrics?.skillLevels.vocabulary || 0,
      weeklyGain: "+12% this week",
      nextMilestone: "2000 Active Words",
      color: "hsl(var(--warning))"
    },
    {
      name: "Pronunciation Clarity", 
      emoji: "🎭",
      currentScore: progressMetrics?.skillLevels.pronunciation || 0,
      weeklyGain: "+4% this week",
      nextMilestone: "Stress Patterns",
      color: "hsl(var(--info))"
    },
    {
      name: "Cultural Bridge Skills",
      emoji: "🌍", 
      currentScore: progressMetrics?.skillLevels.culturalBridge || 0,
      weeklyGain: "+7% this week",
      nextMilestone: "Business Etiquette",
      color: "hsl(var(--success))"
    }
  ];

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-8 p-6">
      {/* Main Progress Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            {progressMetrics?.currentLevel}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-warning" />
              <span className="text-lg font-semibold text-warning">
                {progressMetrics?.streakDays} day streak!
              </span>
            </div>
            <div className="text-muted-foreground">
              Next milestone: 30 days
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to next level</span>
            <span>{progressMetrics?.progressToNext}%</span>
          </div>
          <Progress 
            value={progressMetrics?.progressToNext || 0} 
            className="h-4 bg-gradient-to-r from-primary/20 to-secondary/20"
          />
        </div>

        {/* Goal Display */}
        <div className="flex items-center justify-center gap-2 text-primary font-semibold">
          <Target className="h-5 w-5" />
          <span>Goal: {weeklySummary?.goalProgress.primaryGoal}</span>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Skills Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Skills Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillAreas.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{skill.emoji}</div>
                      <Badge 
                        variant="secondary"
                        className={getProgressColor(skill.currentScore)}
                      >
                        {skill.currentScore}%
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{skill.name}</h3>
                    
                    {/* Circular Progress Ring */}
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-muted"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={skill.color}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - skill.currentScore / 100)}`}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold">{skill.currentScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-success">
                        <TrendingUp className="h-3 w-3" />
                        <span>{skill.weeklyGain}</span>
                      </div>
                      <div className="text-muted-foreground">
                        Next: {skill.nextMilestone}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {milestones.filter(m => m.achieved).slice(0, 5).map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-success/10 border border-success/20 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-success" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-success">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-success mt-1">
                        {achievement.achievedDate?.toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Streak Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-warning" />
                  Streak Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg">
                  <Flame className="h-12 w-12 text-warning mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-warning">
                    {progressMetrics?.streakDays} Day Streak Master
                  </h3>
                  <p className="text-muted-foreground">You're on fire! 🔥</p>
                  <div className="mt-4">
                    <div className="text-sm">Next milestone: 30 days</div>
                    <Progress 
                      value={(progressMetrics?.streakDays || 0) / 30 * 100} 
                      className="mt-2 h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Weekly Summary Tab */}
        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>This Week's Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Week Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {weeklySummary?.activeDays || 0}/7
                  </div>
                  <div className="text-sm text-muted-foreground">Days Active</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {weeklySummary?.totalMinutes || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Minutes Studied</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {weeklySummary?.conversationCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Conversations</div>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    +{weeklySummary?.goalProgress.weeklyProgress || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Goal Progress</div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Weekly Celebration</h3>
                <p className="text-muted-foreground">
                  {weeklySummary?.motivationalMessage}
                </p>
              </div>

              {/* Cultural Moments */}
              {weeklySummary?.culturalMoments && weeklySummary.culturalMoments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Cultural Bridge Moments
                  </h3>
                  {weeklySummary.culturalMoments.map((moment, index) => (
                    <div key={index} className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm">{moment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Progress Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progressMetrics?.weeklyInsights?.slice(0, 4).map((insight, index) => (
                  <div key={index} className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm capitalize mb-1">
                          {insight.type.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {insight.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-center py-8">
                    Keep learning to unlock AI insights!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Next Week Focus */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  Next Week's Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-secondary/10 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-secondary mb-2">
                    {weeklySummary?.nextWeekFocus || 'Continue building confidence'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Based on your progress patterns, this focus area will maximize your growth.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentProgressDashboard;