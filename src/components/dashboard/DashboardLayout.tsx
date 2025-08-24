import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { DashboardHeader } from './DashboardHeader';
import { GeneralEnglishDashboard } from './dashboards/GeneralEnglishDashboard';
import { IELTSDashboard } from './dashboards/IELTSDashboard';
import { BusinessEnglishDashboard } from './dashboards/BusinessEnglishDashboard';
import { TravelEnglishDashboard } from './dashboards/TravelEnglishDashboard';
import { RolePlayHub } from '../roleplay/RolePlayHub';
import { RolePlayInterface } from '../roleplay/RolePlayInterface';
import { ExerciseHub } from '../exercises/ExerciseHub';
import { RaziaConversationInterface } from '../conversation/RaziaConversationInterface';
import { Scenario } from '@/types/roleplay';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressDashboard } from '../progress/ProgressDashboard';
import { AdvancedAnalyticsDashboard } from '../analytics/AdvancedAnalyticsDashboard';
import { OfflineLearningHub } from '../offline/OfflineLearningHub';
import { IELTSMasteryHub } from '../ielts/IELTSMasteryHub';
import { type ProgressAnalytics } from '@/types/progress';

interface UserData {
  learning_goal: string;
  target_ielts_band?: number;
  current_level: string;
  country: string;
  subscription_status: string;
}

type TabType = 'home' | 'journey' | 'roleplay' | 'exercises' | 'razia' | 'progress' | 'analytics' | 'offline' | 'ielts' | 'profile';

export function DashboardLayout() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isInRolePlay, setIsInRolePlay] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(7); // Mock data
  const [currentProgress, setCurrentProgress] = useState(65); // Mock data
  
  // Mock progress data
  const mockProgressData: ProgressAnalytics = {
    skillProgress: {
      speaking: 75,
      listening: 82,
      reading: 68,
      writing: 71
    },
    weeklyActivity: [
      { date: '2024-01-15', studyMinutes: 45, lessonsCompleted: 3, conversationCount: 2, achievementUnlocks: 1 },
      { date: '2024-01-16', studyMinutes: 30, lessonsCompleted: 2, conversationCount: 1, achievementUnlocks: 0 },
      { date: '2024-01-17', studyMinutes: 60, lessonsCompleted: 4, conversationCount: 3, achievementUnlocks: 2 },
      { date: '2024-01-18', studyMinutes: 25, lessonsCompleted: 1, conversationCount: 1, achievementUnlocks: 0 },
      { date: '2024-01-19', studyMinutes: 40, lessonsCompleted: 3, conversationCount: 2, achievementUnlocks: 1 },
      { date: '2024-01-20', studyMinutes: 55, lessonsCompleted: 4, conversationCount: 2, achievementUnlocks: 1 },
      { date: '2024-01-21', studyMinutes: 35, lessonsCompleted: 2, conversationCount: 1, achievementUnlocks: 0 }
    ],
    vocabularyStats: {
      totalWords: 1250,
      masteredWords: 856,
      recentlyAdded: [
        { word: 'sophisticated', definition: 'complex or refined', level: 'advanced', masteryLevel: 85, nextReview: new Date() },
        { word: 'ambient', definition: 'surrounding environment', level: 'intermediate', masteryLevel: 70, nextReview: new Date() },
        { word: 'collaborate', definition: 'work together', level: 'intermediate', masteryLevel: 92, nextReview: new Date() }
      ],
      challengingWords: [
        { word: 'paradigm', definition: 'a typical example or pattern', level: 'advanced', masteryLevel: 45, nextReview: new Date() },
        { word: 'ubiquitous', definition: 'present everywhere', level: 'advanced', masteryLevel: 32, nextReview: new Date() }
      ]
    },
    conversationStats: {
      totalConversations: 47,
      averageLength: 480, // seconds
      topicsDiscussed: ['Daily Life', 'Work', 'Travel', 'Technology', 'Culture', 'Food'],
      fluencyImprovement: [65, 68, 72, 75, 78, 82, 85],
      favoriteTypes: {
        'Free Chat': 18,
        'Lesson Practice': 12,
        'Role Play': 10,
        'Assessment': 5,
        'Cultural Bridge': 2
      },
      pronunciationScores: [70, 72, 75, 78, 80, 83, 85]
    },
    achievements: [
      { 
        id: '1', 
        title: 'First Conversation', 
        description: 'Complete your first chat with Razia', 
        icon: '💬', 
        rarity: 'common', 
        unlockedAt: new Date('2024-01-10') 
      },
      { 
        id: '2', 
        title: 'Week Warrior', 
        description: 'Study for 7 consecutive days', 
        icon: '🔥', 
        rarity: 'rare', 
        unlockedAt: new Date('2024-01-17') 
      },
      { 
        id: '3', 
        title: 'Vocabulary Master', 
        description: 'Learn 1000 new words', 
        icon: '📚', 
        rarity: 'epic', 
        unlockedAt: new Date('2024-01-20') 
      },
      { 
        id: '4', 
        title: 'Fluency Champion', 
        description: 'Achieve 90% fluency score', 
        icon: '🏆', 
        rarity: 'legendary', 
        progress: 85, 
        maxProgress: 90 
      }
    ],
    learningGoal: {
      type: 'conversation',
      currentScore: 75,
      targetScore: 90,
      estimatedCompletion: new Date('2024-03-15'),
      milestones: [
        { 
          id: '1', 
          title: 'Basic Conversations', 
          description: 'Handle everyday conversations confidently',
          targetValue: 50,
          currentValue: 50,
          completed: true
        },
        { 
          id: '2', 
          title: 'Complex Topics', 
          description: 'Discuss complex topics with ease',
          targetValue: 75,
          currentValue: 75,
          completed: true
        },
        { 
          id: '3', 
          title: 'Native-like Fluency', 
          description: 'Achieve near-native conversation skills',
          targetValue: 90,
          currentValue: 75,
          completed: false
        }
      ]
    },
    studyStreak: {
      currentStreak: 7,
      longestStreak: 15,
      streakData: [
        { date: '2024-01-15', studyMinutes: 45, intensity: 'medium' },
        { date: '2024-01-16', studyMinutes: 30, intensity: 'light' },
        { date: '2024-01-17', studyMinutes: 60, intensity: 'high' },
        { date: '2024-01-18', studyMinutes: 25, intensity: 'light' },
        { date: '2024-01-19', studyMinutes: 40, intensity: 'medium' },
        { date: '2024-01-20', studyMinutes: 55, intensity: 'high' },
        { date: '2024-01-21', studyMinutes: 35, intensity: 'medium' }
      ]
    },
    overallCompletion: 74,
    strengthsWeaknesses: {
      strengths: [
        'Excellent listening comprehension',
        'Strong vocabulary retention',
        'Confident in daily conversations',
        'Good pronunciation accuracy'
      ],
      weaknesses: [
        'Complex grammar structures',
        'Academic writing skills',
        'Formal presentation skills',
        'Idiomatic expressions'
      ],
      recommendations: [
        'Focus on advanced grammar exercises to improve structure understanding',
        'Practice formal writing with academic topics',
        'Join advanced conversation groups for complex discussions',
        'Study common idioms and phrasal verbs for natural speech'
      ]
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('learning_goal, target_ielts_band, current_level, country, subscription_status')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader 
          streak={0} 
          subscriptionTier="free" 
        />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const renderDashboard = () => {
    if (activeTab !== 'home') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center py-20"
        >
          <Card>
            <CardContent className="p-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon!
              </h2>
              <p className="text-muted-foreground">
                This section is under development. Stay tuned for amazing features!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    const learningGoal = userData?.learning_goal || 'general';

    switch (learningGoal) {
      case 'ielts':
        return (
          <IELTSDashboard
            userName={user?.email?.split('@')[0]}
            targetBand={userData?.target_ielts_band || 7.0}
            currentBand={6.5}
            testDate="2024-12-15"
            skillScores={{
              listening: 6.5,
              reading: 7.0,
              writing: 6.0,
              speaking: 6.5
            }}
          />
        );
      
      case 'business':
        return (
          <BusinessEnglishDashboard
            userName={user?.email?.split('@')[0]}
          />
        );
      
      case 'travel':
        return (
          <TravelEnglishDashboard
            userName={user?.email?.split('@')[0]}
          />
        );
      
      default:
        return (
          <GeneralEnglishDashboard
            userName={user?.email?.split('@')[0]}
            currentProgress={currentProgress}
            worldName="Foundation World"
            streak={streak}
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showIELTS={userData?.learning_goal === 'ielts'}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Trigger */}
          <header className="h-16 flex items-center border-b bg-white px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <DashboardHeader 
                streak={streak} 
                subscriptionTier={userData?.subscription_status === 'premium' ? 'premium' : 'free'} 
              />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'home' && renderDashboard()}
                  {activeTab === 'roleplay' && !isInRolePlay && (
                    <RolePlayHub 
                      onStartScenario={(scenario) => {
                        setSelectedScenario(scenario);
                        setIsInRolePlay(true);
                      }}
                      isPremiumUser={userData?.subscription_status === 'premium'}
                    />
                  )}
                  {activeTab === 'roleplay' && isInRolePlay && selectedScenario && (
                    <RolePlayInterface 
                      scenario={selectedScenario}
                      onExit={() => {
                        setIsInRolePlay(false);
                        setSelectedScenario(null);
                      }}
                    />
                  )}
                  {activeTab === 'exercises' && (
                    <ExerciseHub />
                  )}
                  {activeTab === 'razia' && (
                    <RaziaConversationInterface
                      userId={user?.id || ''}
                      userName={user?.email?.split('@')[0] || 'Student'}
                      initialType="free-chat"
                    />
                  )}
                  {activeTab === 'progress' && (
                    <ProgressDashboard
                      userName={user?.email?.split('@')[0] || 'Student'}
                      data={mockProgressData}
                    />
                  )}
                  {activeTab === 'analytics' && (
                    <AdvancedAnalyticsDashboard />
                  )}
                  {activeTab === 'offline' && (
                    <OfflineLearningHub />
                  )}
                  {activeTab === 'ielts' && (
                    <IELTSMasteryHub />
                  )}
                  {(activeTab === 'journey' || activeTab === 'profile') && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🚧</div>
                      <h2 className="text-2xl font-bold mb-2">Coming Soon!</h2>
                      <p className="text-muted-foreground">This section is under development. Stay tuned for amazing features!</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}