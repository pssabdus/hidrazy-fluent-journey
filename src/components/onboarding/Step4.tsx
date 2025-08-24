import { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData } from '@/types/onboarding';
import { accentPreferences, explanationLanguages, studyTimes } from '@/utils/onboardingData';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';

interface Step4Props {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

export function Step4({ data, updateData }: Step4Props) {
  const [playingAccent, setPlayingAccent] = useState<string | null>(null);

  const handlePlayAccent = (accentId: string) => {
    if (playingAccent === accentId) {
      setPlayingAccent(null);
    } else {
      setPlayingAccent(accentId);
      // Simulate audio playing for 3 seconds
      setTimeout(() => setPlayingAccent(null), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="text-6xl mb-4"
        >
          ⚙️
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground">
          Learning Preferences
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Customize how you want to learn with Razia
        </p>
      </div>

      {/* Accent Preference */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Accent Preference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accentPreferences.map((accent, index) => (
            <motion.div
              key={accent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                data.accentPreference === accent.id
                  ? 'border-primary bg-primary/5 shadow-glow'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => updateData({ accentPreference: accent.id as any })}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{accent.flag}</span>
                  <div>
                    <h4 className="font-semibold text-foreground">{accent.label}</h4>
                    <p className="text-sm text-muted-foreground">{accent.description}</p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAccent(accent.id);
                  }}
                  className="relative"
                >
                  {playingAccent === accent.id ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <Volume2 className="w-4 h-4" />
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Listen
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Explanation Language */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Explanation Language</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {explanationLanguages.map((lang, index) => (
            <motion.button
              key={lang.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => updateData({ explanationLanguage: lang.id as any })}
              className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 text-center ${
                data.explanationLanguage === lang.id
                  ? 'border-primary bg-primary/5 shadow-glow'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-3xl mb-3">{lang.icon}</div>
              <h4 className="font-semibold text-foreground mb-2">{lang.title}</h4>
              <p className="text-sm text-muted-foreground">{lang.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Daily Goal */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Daily Learning Goal</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Minutes per day</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">
                {data.dailyGoalMinutes}
              </span>
              <span className="text-lg text-muted-foreground ml-1">min</span>
            </div>
          </div>
          
          <Slider
            value={[data.dailyGoalMinutes]}
            onValueChange={([value]) => updateData({ dailyGoalMinutes: value })}
            min={15}
            max={120}
            step={15}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>15 min</span>
            <span>60 min</span>
            <span>120+ min</span>
          </div>
          
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Estimated weekly progress:{' '}
              <span className="font-semibold text-primary">
                {Math.round((data.dailyGoalMinutes * 7) / 60)} hours
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Study Time Preference */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Preferred Study Time</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {studyTimes.map((time, index) => (
            <motion.button
              key={time.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => updateData({ studyTimePreference: time.id as any })}
              className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 text-center ${
                data.studyTimePreference === time.id
                  ? 'border-primary bg-primary/5 shadow-glow'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-3xl mb-2">{time.icon}</div>
              <h4 className="font-semibold text-foreground">{time.label}</h4>
              <p className="text-xs text-muted-foreground">{time.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}