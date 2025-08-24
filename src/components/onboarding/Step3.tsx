import { motion } from 'framer-motion';
import { OnboardingData } from '@/types/onboarding';
import { englishLevels, challenges, previousExperiences } from '@/utils/onboardingData';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface Step3Props {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

export function Step3({ data, updateData }: Step3Props) {
  const currentLevel = englishLevels.find(level => level.id === data.currentLevel);
  const levelIndex = currentLevel ? currentLevel.level - 1 : 0;

  const handleLevelChange = ([value]: number[]) => {
    const level = englishLevels[value];
    updateData({ currentLevel: level.id as any });
  };

  const handleChallengeToggle = (challengeId: string) => {
    const currentChallenges = data.challenges || [];
    const isSelected = currentChallenges.includes(challengeId as any);
    
    if (isSelected) {
      updateData({
        challenges: currentChallenges.filter(c => c !== challengeId)
      });
    } else {
      updateData({
        challenges: [...currentChallenges, challengeId as any]
      });
    }
  };

  const handleExperienceToggle = (experienceId: string) => {
    const currentExperiences = data.previousExperience || [];
    const isSelected = currentExperiences.includes(experienceId as any);
    
    if (isSelected) {
      updateData({
        previousExperience: currentExperiences.filter(e => e !== experienceId)
      });
    } else {
      updateData({
        previousExperience: [...currentExperiences, experienceId as any]
      });
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
          📊
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground">
          Your English Background
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Help us understand your current level and experience
        </p>
      </div>

      {/* Current Level Assessment */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Current English Level</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Level</span>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">
                {currentLevel?.label || 'Select Level'}
              </span>
              {currentLevel && (
                <p className="text-sm text-muted-foreground">
                  {currentLevel.description}
                </p>
              )}
            </div>
          </div>
          
          <Slider
            value={[levelIndex]}
            onValueChange={handleLevelChange}
            min={0}
            max={englishLevels.length - 1}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            {englishLevels.map((level) => (
              <span key={level.id} className="text-center">
                {level.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Biggest Challenges */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">
          What are your biggest challenges? (Select all that apply)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                data.challenges?.includes(challenge.id as any)
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleChallengeToggle(challenge.id)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{challenge.icon}</div>
                <span className="font-medium text-foreground">{challenge.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Previous Experience */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">
          Previous English Learning Experience
        </h3>
        <div className="space-y-3">
          {previousExperiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <Checkbox
                id={experience.id}
                checked={data.previousExperience?.includes(experience.id as any) || false}
                onCheckedChange={() => handleExperienceToggle(experience.id)}
              />
              <label
                htmlFor={experience.id}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <span className="text-2xl">{experience.icon}</span>
                <span className="font-medium text-foreground">{experience.label}</span>
              </label>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}