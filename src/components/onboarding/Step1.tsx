import { motion } from 'framer-motion';
import { OnboardingData } from '@/types/onboarding';
import { ageGroups, genderOptions, countries } from '@/utils/onboardingData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Step1Props {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

export function Step1({ data, updateData }: Step1Props) {
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
          👋
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground">
          Let's get to know you!
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Tell us a bit about yourself so we can personalize your learning experience
        </p>
      </div>

      {/* Age Group Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">What's your age group?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ageGroups.map((group, index) => (
            <motion.button
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => updateData({ ageGroup: group.id as any })}
              className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                data.ageGroup === group.id
                  ? 'border-primary bg-primary/5 shadow-glow'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-3xl mb-3">{group.icon}</div>
              <h4 className="font-semibold text-foreground mb-2">{group.title}</h4>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Gender Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Gender (optional)</h3>
        <div className="flex gap-4 max-w-md">
          {genderOptions.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateData({ gender: option.id as any })}
              className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-300 ${
                data.gender === option.id
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Country Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Where are you from?</h3>
        <div className="max-w-md">
          <Select value={data.country} onValueChange={(value) => updateData({ country: value })}>
            <SelectTrigger className="h-12 text-left">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}