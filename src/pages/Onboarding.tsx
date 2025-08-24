import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboardingData } from '@/hooks/useOnboardingData';
import { toast } from '@/hooks/use-toast';

import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { Step1 } from '@/components/onboarding/Step1';
import { Step2 } from '@/components/onboarding/Step2';
import { Step3 } from '@/components/onboarding/Step3';
import { Step4 } from '@/components/onboarding/Step4';
import { Step5 } from '@/components/onboarding/Step5';

const TOTAL_STEPS = 5;

const stepValidation = {
  1: (data: any) => data.ageGroup && data.country,
  2: (data: any) => data.learningGoal,
  3: (data: any) => data.currentLevel,
  4: (data: any) => data.accentPreference && data.explanationLanguage && data.studyTimePreference,
  5: () => true,
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { data, updateData, clearData, isLoaded } = useOnboardingData();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(0);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isStepValid = () => {
    const validator = stepValidation[currentStep as keyof typeof stepValidation];
    return validator(data);
  };

  const handleNext = () => {
    if (!isStepValid()) {
      toast({
        title: "Please complete all required fields",
        description: "Fill in the required information to continue.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      // Store onboarding data in localStorage to pass to registration
      localStorage.setItem('onboarding_data', JSON.stringify(data));
      
      toast({
        title: "Profile ready! 🎉",
        description: "Let's create your account to get started.",
      });

      // Navigate to registration with onboarding data
      navigate('/register');
    } catch (error: any) {
      console.error('Error storing onboarding data:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 data={data} updateData={updateData} />;
      case 2:
        return <Step2 data={data} updateData={updateData} />;
      case 3:
        return <Step3 data={data} updateData={updateData} />;
      case 4:
        return <Step4 data={data} updateData={updateData} />;
      case 5:
        return <Step5 data={data} onComplete={handleComplete} isLoading={isSubmitting} />;
      default:
        return <Step1 data={data} updateData={updateData} />;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            <div className="glass rounded-2xl p-8 md:p-12 shadow-glass border border-white/20">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {currentStep < TOTAL_STEPS && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 glass glass-hover border-white/30"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 bg-gradient-button hover:shadow-glow transform hover:-translate-y-0.5 transition-all duration-300"
              >
                {currentStep === TOTAL_STEPS - 1 ? 'Complete Setup' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}