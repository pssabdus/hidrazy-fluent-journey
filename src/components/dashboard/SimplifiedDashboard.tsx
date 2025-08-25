import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MessageCircle, 
  BarChart3, 
  Settings, 
  Lock, 
  Check, 
  Clock,
  PlayCircle,
  FileText
} from 'lucide-react';
import { RaziaConversationInterface } from '@/components/conversation/RaziaConversationInterface';
import ComprehensiveProgressDashboard from '@/components/progress/ComprehensiveProgressDashboard';
import { AILessonInterface } from '@/components/lesson/AILessonInterface';
import { StealthAssessmentInterface } from '@/components/assessment/StealthAssessmentInterface';
import { AITeachingService, type LessonContext } from '@/services/AITeachingService';
import { StealthAssessmentService, type AssessmentResult } from '@/services/IntelligentProgressService';

interface UserData {
  learning_goal: string;
  target_ielts_band?: number;
  current_level: string;
  country: string;
  subscription_status: string;
}

type ViewType = 'dashboard' | 'chat' | 'progress' | 'settings' | 'ai-lesson' | 'assessment';

interface DailyActivity {
  id: string;
  type: 'chat' | 'practice' | 'review';
  title: string;
  description: string;
  goal: string;
  duration: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  icon: typeof MessageCircle;
}

export function SimplifiedDashboard() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [streak, setStreak] = useState(7);
  const [currentProgress, setCurrentProgress] = useState(65);
  const [dailyTheme, setDailyTheme] = useState("Past Tense Storytelling");
  const [needsAssessment, setNeedsAssessment] = useState(false);

  // Daily activities with sequential unlock logic
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([
    {
      id: 'chat',
      type: 'chat',
      title: 'Chat with Razia',
      description: 'Practice natural conversations about daily topics',
      goal: 'Build speaking confidence',
      duration: '15-20 minutes',
      isCompleted: false,
      isUnlocked: true,
      icon: MessageCircle
    },
    {
      id: 'practice',
      type: 'practice',
      title: 'Coffee Shop Role-Play',
      description: 'Practice ordering and social interactions',
      goal: 'Master practical vocabulary',
      duration: '10 minutes',
      isCompleted: false,
      isUnlocked: false,
      icon: PlayCircle
    },
    {
      id: 'review',
      type: 'review',
      title: 'Quick Review',
      description: 'Review today\'s new words and phrases',
      goal: 'Reinforce learning',
      duration: '5 minutes',
      isCompleted: false,
      isUnlocked: false,
      icon: FileText
    }
  ]);

  // Check if user needs assessment on component mount
  useEffect(() => {
    if (user) {
      checkAssessmentStatus();
      fetchUserData();
    }
  }, [user]);

  const checkAssessmentStatus = async () => {
    try {
      const { data: assessmentData, error } = await supabase
        .from('assessments')
        .select('status, final_level')
        .eq('user_id', user?.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking assessment status:', error);
        return;
      }

      if (!assessmentData || assessmentData.length === 0) {
        setNeedsAssessment(true);
        setCurrentView('assessment');
      }
    } catch (error) {
      console.error('Error checking assessment status:', error);
    }
  };

  // Generate daily theme
  useEffect(() => {
    const loadDailyTheme = async () => {
      const theme = await AITeachingService.generateDailyTheme();
      setDailyTheme(theme);
    };
    loadDailyTheme();
  }, []);

  // Update unlock status based on completion
  useEffect(() => {
    setDailyActivities(prev => {
      const updated = [...prev];
      const chatCompleted = updated[0].isCompleted;
      const practiceCompleted = updated[1].isCompleted;
      
      if (chatCompleted && !updated[1].isUnlocked) {
        updated[1].isUnlocked = true;
      }
      
      if (practiceCompleted && !updated[2].isUnlocked) {
        updated[2].isUnlocked = true;
      }
      
      return updated;
    });
  }, [dailyActivities]);

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

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getLevelName = (level: string) => {
    const levels = {
      'beginner': 'Foundation Explorer',
      'intermediate': 'Conversation Builder', 
      'advanced': 'Fluency Master'
    };
    return levels[level as keyof typeof levels] || 'English Learner';
  };

  const getNextLevel = (level: string) => {
    const progression = {
      'beginner': 'Intermediate',
      'intermediate': 'Advanced',
      'advanced': 'Native-like'
    };
    return progression[level as keyof typeof progression] || 'next level';
  };

  const handleActivityComplete = (activityId: string) => {
    setDailyActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, isCompleted: true }
          : activity
      )
    );
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setNeedsAssessment(false);
    setCurrentView('dashboard');
    setUserData(prev => prev ? {
      ...prev,
      current_level: result.final_level
    } : null);
  };

  const handleActivityClick = (activity: DailyActivity) => {
    if (!activity.isUnlocked) return;
    
    if (activity.type === 'chat') {
      setCurrentView('chat');
    } else if (activity.type === 'practice') {
      setCurrentView('ai-lesson');
    } else {
      handleActivityComplete(activity.id);
    }
  };

  const getActivityButtonText = (activity: DailyActivity) => {
    if (activity.isCompleted) return '✓ Complete';
    if (!activity.isUnlocked) return '🔒 Complete chat first';
    return 'Start';
  };

  const getActivityButtonClass = (activity: DailyActivity) => {
    if (activity.isCompleted) return 'bg-green-100 text-green-700 border-green-200';
    if (!activity.isUnlocked) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-primary text-primary-foreground hover:bg-primary/90';
  };

  // Show assessment if needed
  if (needsAssessment || currentView === 'assessment') {
    return (
      <StealthAssessmentInterface
        onComplete={handleAssessmentComplete}
        onBack={() => {
          setCurrentView('dashboard');
          setNeedsAssessment(false);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'ai-lesson') {
    const lessonContext: LessonContext = {
      theme: dailyTheme,
      duration: '20 minutes',
      energy_level: 'medium',
      user_request: 'Daily practice session'
    };

    return (
      <AILessonInterface
        category={userData?.learning_goal as 'general' | 'ielts' | 'business' || 'general'}
        onBack={() => {
          setCurrentView('dashboard');
          handleActivityComplete('practice');
        }}
        lessonContext={lessonContext}
      />
    );
  }

  if (currentView === 'chat') {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 border-b bg-card">
          <Button 
            variant="ghost" 
            onClick={() => {
              setCurrentView('dashboard');
              handleActivityComplete('chat');
            }}
            className="mb-2"
          >
            ← Back to Dashboard
          </Button>
        </div>
        <RaziaConversationInterface conversationType="free_chat" />
      </div>
    );
  }

  if (currentView === 'progress') {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 border-b bg-card">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('dashboard')}
            className="mb-2"
          >
            ← Back to Dashboard
          </Button>
        </div>
        <ComprehensiveProgressDashboard userId={user?.id || ''} />
      </div>
    );
  }

  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('dashboard')}
            className="mb-6"
          >
            ← Back to Dashboard
          </Button>
          
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              
              <div className="space-y-6">
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Coming soon: Language preferences, notification settings, learning pace adjustments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="max-w-6xl mx-auto p-6">
        {/* MAIN HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-8">
              {/* Greeting */}
              <div className="text-center lg:text-left mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {getTimeOfDay()}, {user?.email?.split('@')[0]}! 
                  <motion.span
                    animate={{ rotate: [0, 20, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="inline-block ml-2"
                  >
                    👋
                  </motion.span>
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-lg text-muted-foreground">Ready for day</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                    {streak}
                  </span>
                  <motion.span
                    animate={{ 
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="text-2xl"
                  >
                    🔥
                  </motion.span>
                </div>
              </div>

              {/* Current Level Display */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {userData?.current_level?.charAt(0).toUpperCase() + userData?.current_level?.slice(1)} - {getLevelName(userData?.current_level || 'beginner')}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentProgress}% to {getNextLevel(userData?.current_level || 'beginner')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl mb-1">🎯</div>
                  <p className="text-sm font-semibold text-primary">Goal: {userData?.learning_goal || 'General English'}</p>
                </div>
              </div>
              <Progress value={currentProgress} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* TODAY'S FOCUS SECTION - 80% */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-primary/20 bg-primary/5 shadow-card">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Today's Focus</h2>
                    <div className="bg-white rounded-xl p-6 border border-primary/20">
                      <h3 className="text-xl font-semibold text-center text-primary">
                        "{dailyTheme}"
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {dailyActivities.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <Card 
                            className={`transition-all duration-300 ${
                              activity.isUnlocked 
                                ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' 
                                : 'opacity-60 cursor-not-allowed'
                            } ${
                              activity.isCompleted 
                                ? 'bg-green-50 border-green-200' 
                                : activity.isUnlocked 
                                ? 'bg-white border-primary/20 hover:border-primary/40'
                                : 'bg-muted border-border'
                            }`}
                            onClick={() => handleActivityClick(activity)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                    activity.isCompleted 
                                      ? 'bg-green-100 text-green-600'
                                      : activity.isUnlocked
                                      ? 'bg-primary/10 text-primary'
                                      : 'bg-muted text-muted-foreground'
                                  }`}>
                                    {activity.isCompleted ? (
                                      <Check className="w-8 h-8" />
                                    ) : activity.isUnlocked ? (
                                      <Icon className="w-8 h-8" />
                                    ) : (
                                      <Lock className="w-8 h-8" />
                                    )}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-foreground mb-1">
                                      {index + 1}. {activity.title}
                                    </h4>
                                    <p className="text-muted-foreground mb-2">
                                      {activity.description}
                                    </p>
                                    <p className="text-sm font-medium text-primary">
                                      Goal: {activity.goal}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <Clock className="w-4 h-4" />
                                    {activity.duration}
                                  </div>
                                  <Button
                                    size="lg"
                                    className={getActivityButtonClass(activity)}
                                    disabled={!activity.isUnlocked && !activity.isCompleted}
                                  >
                                    {getActivityButtonText(activity)}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* SECONDARY OPTIONS SECTION - 20% */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={() => setCurrentView('progress')}
                className="w-full h-20 bg-gradient-button hover:shadow-glow transition-all duration-300"
                size="lg"
              >
                <div className="text-center">
                  <BarChart3 className="w-6 h-6 mx-auto mb-1" />
                  <span className="font-semibold">📊 My Progress</span>
                </div>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={() => setCurrentView('settings')}
                variant="outline"
                className="w-full h-20 hover:bg-secondary transition-all duration-300"
                size="lg"
              >
                <div className="text-center">
                  <Settings className="w-6 h-6 mx-auto mb-1" />
                  <span className="font-semibold">⚙️ Settings</span>
                </div>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <h4 className="font-semibold text-orange-800 mb-1">Unlocking Soon</h4>
                  <p className="text-xs text-orange-600">
                    Advanced Speaking Practice in 2 days
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}