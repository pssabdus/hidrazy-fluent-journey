import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Globe, Flame, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import arabicAccent from '@/assets/arabic-accent.png';

interface DashboardHeaderProps {
  streak: number;
  subscriptionTier: 'free' | 'premium';
}

export function DashboardHeader({ streak, subscriptionTier }: DashboardHeaderProps) {
  const { signOut } = useAuth();
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'AR' : 'EN');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">Hidrazy</span>
              <img 
                src={arabicAccent} 
                alt="Arabic accent" 
                className="w-8 h-6 ml-1 opacity-70"
              />
            </div>
          </div>

          {/* Streak Counter - Center */}
          <motion.div 
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-4 py-2 rounded-full border border-orange-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={streak > 0 ? {
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ 
                duration: 1.5, 
                repeat: streak > 0 ? Infinity : 0, 
                repeatDelay: 3 
              }}
            >
              <Flame className="w-5 h-5 text-orange-500" />
            </motion.div>
            <span className="font-bold text-gray-900">{streak}</span>
            <span className="text-sm text-gray-600">day streak</span>
          </motion.div>

          {/* Right Side - Subscription Badge & Language Toggle */}
          <div className="flex items-center space-x-4">
            {/* Subscription Badge */}
            <Badge 
              variant={subscriptionTier === 'premium' ? 'default' : 'secondary'}
              className={`${
                subscriptionTier === 'premium' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              } px-3 py-1 font-medium`}
            >
              {subscriptionTier === 'premium' && <Crown className="w-3 h-3 mr-1" />}
              {subscriptionTier === 'premium' ? 'Premium' : 'Free'}
            </Badge>

            {/* Language Toggle Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-primary/10 transition-all duration-300"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">{language}</span>
                  <div className="w-6 h-4 rounded-sm bg-gradient-to-r from-green-500 to-red-500 opacity-70" />
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={toggleLanguage}>
                  <Globe className="w-4 h-4 mr-2" />
                  Switch to {language === 'EN' ? 'Arabic' : 'English'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}