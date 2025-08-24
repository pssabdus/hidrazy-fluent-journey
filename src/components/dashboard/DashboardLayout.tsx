import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardHeader } from './DashboardHeader';
import { DashboardNavigation } from './DashboardNavigation';
import { GeneralEnglishDashboard } from './dashboards/GeneralEnglishDashboard';
import { IELTSDashboard } from './dashboards/IELTSDashboard';
import { BusinessEnglishDashboard } from './dashboards/BusinessEnglishDashboard';
import { TravelEnglishDashboard } from './dashboards/TravelEnglishDashboard';
import { RolePlayHub } from '../roleplay/RolePlayHub';
import { RolePlayInterface } from '../roleplay/RolePlayInterface';
import { Scenario } from '@/types/roleplay';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface UserData {
  learning_goal: string;
  target_ielts_band?: number;
  current_level: string;
  country: string;
  subscription_status: string;
}

type TabType = 'home' | 'journey' | 'roleplay' | 'ielts' | 'profile';

export function DashboardLayout() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isInRolePlay, setIsInRolePlay] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(7); // Mock data
  const [currentProgress, setCurrentProgress] = useState(65); // Mock data

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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        streak={streak} 
        subscriptionTier={userData?.subscription_status === 'premium' ? 'premium' : 'free'} 
      />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderDashboard()}
          </motion.div>
        </AnimatePresence>
      </main>

      <DashboardNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showIELTS={userData?.learning_goal === 'ielts'}
      />
    </div>
  );
}