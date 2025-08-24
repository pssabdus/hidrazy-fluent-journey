import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ProgressCardProps {
  title: string;
  subtitle: string;
  percentage: number;
  buttonText: string;
  onContinue: () => void;
  className?: string;
}

export function ProgressCard({ 
  title, 
  subtitle, 
  percentage, 
  buttonText, 
  onContinue,
  className 
}: ProgressCardProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      className={className}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Progress</span>
                  <span className="text-sm font-bold text-primary">{percentage}%</span>
                </div>
                
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
              </div>
              
              <Button 
                onClick={onContinue}
                className="w-full mt-4 bg-gradient-button hover:shadow-glow transform hover:-translate-y-0.5 transition-all duration-300"
              >
                {buttonText}
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.div>
              </Button>
            </div>
            
            {/* Circular Progress Ring */}
            <div className="relative w-24 h-24 ml-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{percentage}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}