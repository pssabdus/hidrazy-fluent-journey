import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit, Sparkles, Clock, Target } from 'lucide-react';
import { 
  ageGroups, 
  learningGoals, 
  englishLevels, 
  accentPreferences, 
  explanationLanguages,
  studyTimes 
} from '@/utils/onboardingData';

interface Step5Props {
  data: OnboardingData;
  onComplete: () => void;
  isLoading?: boolean;
}

const confettiColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

function ConfettiPiece({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        left: `${Math.random() * 100}%`,
        top: '-10px',
      }}
      initial={{ y: -10, opacity: 1, rotate: 0 }}
      animate={{
        y: window.innerHeight + 10,
        opacity: 0,
        rotate: 360,
      }}
      transition={{
        duration: 3,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

export function Step5({ data, onComplete, isLoading }: Step5Props) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const getDisplayValue = (key: string, value: any) => {
    switch (key) {
      case 'ageGroup':
        return ageGroups.find(g => g.id === value)?.title;
      case 'learningGoal':
        return learningGoals.find(g => g.id === value)?.title;
      case 'currentLevel':
        return englishLevels.find(l => l.id === value)?.label;
      case 'accentPreference':
        return accentPreferences.find(a => a.id === value)?.label;
      case 'explanationLanguage':
        return explanationLanguages.find(e => e.id === value)?.title;
      case 'studyTimePreference':
        return studyTimes.find(s => s.id === value)?.label;
      case 'dailyGoalMinutes':
        return `${value} minutes`;
      case 'ieltsTargetBand':
        return value ? `Band ${value}` : null;
      case 'challenges':
        return Array.isArray(value) ? `${value.length} selected` : null;
      case 'previousExperience':
        return Array.isArray(value) ? `${value.length} experiences` : null;
      default:
        return value;
    }
  };

  const getEstimatedTimeline = () => {
    const level = englishLevels.find(l => l.id === data.currentLevel)?.level || 1;
    const goalMinutes = data.dailyGoalMinutes;
    
    if (data.learningGoal === 'ielts') {
      return data.ieltsTimeline?.replace('-', ' ') || '6 months';
    }
    
    if (goalMinutes >= 60) {
      return `${3 - level + 2} months`;
    } else if (goalMinutes >= 30) {
      return `${6 - level + 2} months`;
    } else {
      return `${12 - level + 3} months`;
    }
  };

  const profileSummary = [
    { label: 'Age Group', value: data.ageGroup, key: 'ageGroup' },
    { label: 'Country', value: data.country, key: 'country' },
    { label: 'Learning Goal', value: data.learningGoal, key: 'learningGoal' },
    { label: 'Current Level', value: data.currentLevel, key: 'currentLevel' },
    { label: 'Accent Preference', value: data.accentPreference, key: 'accentPreference' },
    { label: 'Daily Goal', value: data.dailyGoalMinutes, key: 'dailyGoalMinutes' },
    { label: 'Study Time', value: data.studyTimePreference, key: 'studyTimePreference' },
  ].filter(item => item.value);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="space-y-8 relative"
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }, (_, i) => (
            <ConfettiPiece key={i} delay={i * 0.1} />
          ))}
        </div>
      )}

      {/* Celebration Header */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring", bounce: 0.6 }}
          className="relative"
        >
          <div className="text-8xl mb-4">🎉</div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-primary opacity-50" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-2">
            You're all set!
          </h2>
          <p className="text-xl text-muted-foreground">
            Your personalized learning journey is ready to begin
          </p>
        </motion.div>
      </div>

      {/* Profile Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-primary/20 shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Your Learning Profile
              </h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Complete
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileSummary.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {getDisplayValue(item.key, item.value)}
                    </span>
                    <Edit className="w-3 h-3 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Estimated Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-lg border border-primary/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Estimated Goal Timeline</h4>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Based on your preferences, you could reach your goal in approximately{' '}
                  <span className="font-semibold text-primary">{getEstimatedTimeline()}</span>
                </span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="text-center"
      >
        <Button
          onClick={onComplete}
          disabled={isLoading}
          className="h-14 px-12 text-lg font-semibold bg-gradient-button hover:shadow-glow transform hover:-translate-y-1 transition-all duration-300"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
            </motion.div>
          ) : (
            <Sparkles className="w-5 h-5 mr-2" />
          )}
          {isLoading ? 'Setting up your journey...' : 'Start Learning with Razia'}
        </Button>

        <p className="text-sm text-muted-foreground mt-4">
          Get ready to have natural conversations and achieve fluency faster than ever!
        </p>
      </motion.div>
    </motion.div>
  );
}