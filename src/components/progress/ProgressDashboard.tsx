import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Flame, 
  Trophy, 
  Target, 
  Calendar,
  Download,
  Share2,
  ArrowUp,
  ArrowDown,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillBreakdownSection } from './SkillBreakdownSection';
import { LearningJourneyMap } from './LearningJourneyMap';
import { WeeklyActivityChart } from './WeeklyActivityChart';
import { VocabularyMastery } from './VocabularyMastery';
import { ConversationAnalytics } from './ConversationAnalytics';
import { AchievementGallery } from './AchievementGallery';
import { StrengthWeaknessAnalysis } from './StrengthWeaknessAnalysis';
import { StudyStreakVisualization } from './StudyStreakVisualization';
import { GoalProgress } from './GoalProgress';
import { AdvancedAnalyticsDashboard } from '@/components/analytics/AdvancedAnalyticsDashboard';
import { LearningComparisonChart } from '@/components/analytics/LearningComparisonChart';
import { AIRecommendationEngine } from '@/components/analytics/AIRecommendationEngine';
import { type ProgressAnalytics } from '@/types/progress';

interface ProgressDashboardProps {
  userName: string;
  userAvatar?: string;
  data: ProgressAnalytics;
}

export function ProgressDashboard({ userName, userAvatar, data }: ProgressDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [streakAnimation, setStreakAnimation] = useState(false);

  useEffect(() => {
    // Trigger streak animation on mount
    setStreakAnimation(true);
    const timer = setTimeout(() => setStreakAnimation(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const currentLevel = Math.floor(data.overallCompletion / 10) + 1;
  const progressToNextLevel = (data.overallCompletion % 10) * 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {userName}!</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className="text-primary font-semibold">
                  Level {currentLevel}
                </Badge>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={streakAnimation ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-1"
                  >
                    <Flame className={`h-5 w-5 ${data.studyStreak.currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                    <span className="font-semibold text-foreground">{data.studyStreak.currentStreak} day streak</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Progress Ring */}
          <Card className="p-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 251.2" }}
                  animate={{ 
                    strokeDasharray: `${(data.overallCompletion / 100) * 251.2} 251.2`
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{Math.round(data.overallCompletion)}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Progress
            </Button>
          </div>
        </motion.div>

        {/* Progress Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-13 bg-card text-xs">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="journey">Journey</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
            <TabsTrigger value="comparison">Peer Compare</TabsTrigger>
            <TabsTrigger value="recommendations">AI Coach</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="streak">Streak</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <SkillBreakdownSection skillProgress={data.skillProgress} />
                <WeeklyActivityChart data={data.weeklyActivity} />
              </motion.div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <VocabularyMastery data={data.vocabularyStats} compact />
                <ConversationAnalytics data={data.conversationStats} compact />
                <GoalProgress data={data.learningGoal} compact />
              </div>
            </TabsContent>

            <TabsContent value="skills">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SkillBreakdownSection skillProgress={data.skillProgress} detailed />
              </motion.div>
            </TabsContent>

            <TabsContent value="journey">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LearningJourneyMap />
              </motion.div>
            </TabsContent>

            <TabsContent value="activity">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <WeeklyActivityChart data={data.weeklyActivity} detailed />
              </motion.div>
            </TabsContent>

            <TabsContent value="vocabulary">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <VocabularyMastery data={data.vocabularyStats} />
              </motion.div>
            </TabsContent>

            <TabsContent value="conversations">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ConversationAnalytics data={data.conversationStats} />
              </motion.div>
            </TabsContent>

            <TabsContent value="achievements">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AchievementGallery achievements={data.achievements} />
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AdvancedAnalyticsDashboard />
              </motion.div>
            </TabsContent>

            <TabsContent value="comparison">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LearningComparisonChart />
              </motion.div>
            </TabsContent>

            <TabsContent value="recommendations">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AIRecommendationEngine />
              </motion.div>
            </TabsContent>

            <TabsContent value="analysis">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StrengthWeaknessAnalysis 
                  skillProgress={data.skillProgress}
                  analysis={data.strengthsWeaknesses}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="streak">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StudyStreakVisualization data={data.studyStreak} />
              </motion.div>
            </TabsContent>

            <TabsContent value="goals">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GoalProgress data={data.learningGoal} />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}