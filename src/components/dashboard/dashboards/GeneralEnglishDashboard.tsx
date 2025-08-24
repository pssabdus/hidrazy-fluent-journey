import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Award, TrendingUp, BookOpen, Play, Headphones } from 'lucide-react';
import { WelcomeCard } from '../cards/WelcomeCard';
import { ProgressCard } from '../cards/ProgressCard';
import { DailyChallengeCard } from '../cards/DailyChallengeCard';
import { QuickActionCard } from '../cards/QuickActionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LessonDemo } from '../../lesson/LessonDemo';
import { PremiumFeaturesShowcase } from '../../premium/PremiumFeaturesShowcase';

interface GeneralEnglishDashboardProps {
  userName?: string;
  currentProgress: number;
  worldName: string;
  streak: number;
}

export function GeneralEnglishDashboard({ 
  userName, 
  currentProgress, 
  worldName, 
  streak 
}: GeneralEnglishDashboardProps) {
  const [showLessonDemo, setShowLessonDemo] = useState(false);
  const achievements = [
    { title: 'First Conversation', icon: MessageCircle, unlocked: true },
    { title: 'Grammar Master', icon: BookOpen, unlocked: true },
    { title: 'Pronunciation Pro', icon: Headphones, unlocked: false },
    { title: 'Fluency Champion', icon: Award, unlocked: false },
  ];

  const weeklyData = [40, 65, 30, 80, 45, 70, 85];

  if (showLessonDemo) {
    return <LessonDemo onClose={() => setShowLessonDemo(false)} />;
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Card */}
      <WelcomeCard
        userName={userName}
        message="Ready for today's English adventure, [Name]?"
        avatar="👋"
      />

      {/* Progress and Challenge Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressCard
          title={worldName}
          subtitle="Continue your learning journey"
          percentage={currentProgress}
          buttonText="Continue Learning"
          onContinue={() => setShowLessonDemo(true)}
        />
        
        <DailyChallengeCard
          timeRemaining="8h 32m"
          streak={streak}
          challengeTitle="Practice casual conversations"
          onStartChallenge={() => console.log('Start challenge')}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          title="Vocabulary"
          description="Learn new words"
          icon={BookOpen}
          color="blue"
          onClick={() => console.log('Vocabulary')}
        />
        <QuickActionCard
          title="Listening"
          description="Improve comprehension"
          icon={Headphones}
          color="green"
          onClick={() => console.log('Listening')}
        />
        <QuickActionCard
          title="Speaking"
          description="Practice pronunciation"
          icon={MessageCircle}
          color="purple"
          onClick={() => console.log('Speaking')}
        />
        <QuickActionCard
          title="Grammar"
          description="Master structures"
          icon={Award}
          color="orange"
          onClick={() => console.log('Grammar')}
        />
      </div>

      {/* Achievements Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Achievements</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'border-primary/20 bg-primary/5' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <motion.div
                      animate={achievement.unlocked ? {
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.unlocked ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className="text-xs font-medium text-center">{achievement.title}</span>
                    {achievement.unlocked && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Unlocked
                      </Badge>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Weekly Progress</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-end justify-between h-32 space-x-2">
              {weeklyData.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-primary to-primary-glow rounded-t-md min-h-[4px]"
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium Features Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <PremiumFeaturesShowcase />
      </motion.div>

      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-20 right-6 z-40"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0.7)",
              "0 0 0 10px rgba(59, 130, 246, 0)",
              "0 0 0 0 rgba(59, 130, 246, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-lg hover:shadow-xl"
            onClick={() => setShowLessonDemo(true)}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}