import { motion } from 'framer-motion';
import { OnboardingData } from '@/types/onboarding';
import { learningGoals, ieltsTargetBands, ieltsTimelines } from '@/utils/onboardingData';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface Step2Props {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

export function Step2({ data, updateData }: Step2Props) {
  const showIeltsOptions = data.learningGoal === 'ielts';

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
          🎯
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground">
          What brings you to Hidrazy?
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Choose your primary learning goal to customize your experience
        </p>
      </div>

      {/* Learning Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningGoals.map((goal, index) => (
          <motion.button
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            onClick={() => updateData({ learningGoal: goal.id as any })}
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 text-left ${
              data.learningGoal === goal.id
                ? 'border-primary bg-primary/5 shadow-glow'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {/* Most Popular Badge */}
            {'badge' in goal && goal.badge && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-primary-glow text-white"
              >
                {goal.badge}
              </Badge>
            )}
            
            <div className="text-4xl mb-4">{goal.icon}</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{goal.title}</h3>
            <p className="text-muted-foreground">{goal.description}</p>
          </motion.button>
        ))}
      </div>

      {/* IELTS Specific Options */}
      {showIeltsOptions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
          className="space-y-6 p-6 bg-primary/5 rounded-xl border border-primary/20"
        >
          {/* Target Band Score */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Target IELTS Band Score</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Band Score</span>
                <span className="text-lg font-bold text-primary">
                  {data.ieltsTargetBand || 6.5}
                </span>
              </div>
              <Slider
                value={[data.ieltsTargetBand || 6.5]}
                onValueChange={([value]) => updateData({ ieltsTargetBand: value })}
                min={5.5}
                max={8.0}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5.5 (Modest)</span>
                <span>6.5 (Competent)</span>
                <span>8.0+ (Expert)</span>
              </div>
            </div>
          </div>

          {/* Timeline Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Study Timeline</h3>
            <div className="grid grid-cols-3 gap-4">
              {ieltsTimelines.map((timeline) => (
                <motion.button
                  key={timeline.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateData({ ieltsTimeline: timeline.id as any })}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    data.ieltsTimeline === timeline.id
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{timeline.icon}</div>
                  <h4 className="font-semibold text-foreground">{timeline.label}</h4>
                  <p className="text-sm text-muted-foreground">{timeline.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}