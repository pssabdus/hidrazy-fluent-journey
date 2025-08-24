import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      {/* Step indicator */}
      <div className="text-center mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          
          return (
            <div key={step} className="flex-1 relative">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isCompleted || isCurrent
                    ? 'bg-gradient-to-r from-primary to-primary-glow'
                    : 'bg-muted'
                }`}
              >
                {(isCompleted || isCurrent) && (
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                )}
              </div>
              
              {/* Step completion indicator */}
              {isCompleted && (
                <motion.div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
              )}
              
              {/* Current step indicator */}
              {isCurrent && (
                <motion.div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-glow" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}