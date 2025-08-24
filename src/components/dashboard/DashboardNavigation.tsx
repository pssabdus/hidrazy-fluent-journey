import { motion } from 'framer-motion';
import { Home, Map, Drama, Award, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardNavigationProps {
  activeTab: 'home' | 'journey' | 'roleplay' | 'ielts' | 'profile';
  onTabChange: (tab: 'home' | 'journey' | 'roleplay' | 'ielts' | 'profile') => void;
  showIELTS: boolean;
}

export function DashboardNavigation({ activeTab, onTabChange, showIELTS }: DashboardNavigationProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'journey' as const, label: 'Journey', icon: Map },
    { id: 'roleplay' as const, label: 'Role Play', icon: Drama },
    ...(showIELTS ? [{ id: 'ielts' as const, label: 'IELTS', icon: Award }] : []),
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/20 shadow-lg">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center space-y-1 px-3 py-2 min-w-0 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.div
                  className="relative z-10 flex flex-col items-center space-y-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium truncate">{tab.label}</span>
                </motion.div>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}