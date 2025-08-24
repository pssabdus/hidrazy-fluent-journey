import { motion } from 'framer-motion';
import { Timer, Mic, PenTool, BookOpen, ExternalLink, TrendingUp } from 'lucide-react';
import { WelcomeCard } from '../cards/WelcomeCard';
import { QuickActionCard } from '../cards/QuickActionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface IELTSDashboardProps {
  userName?: string;
  targetBand: number;
  currentBand: number;
  testDate?: string;
  skillScores: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
}

export function IELTSDashboard({ 
  userName, 
  targetBand, 
  currentBand, 
  testDate,
  skillScores 
}: IELTSDashboardProps) {
  const skills = [
    { name: 'Listening', score: skillScores.listening, color: 'from-blue-500 to-blue-600' },
    { name: 'Reading', score: skillScores.reading, color: 'from-green-500 to-green-600' },
    { name: 'Writing', score: skillScores.writing, color: 'from-purple-500 to-purple-600' },
    { name: 'Speaking', score: skillScores.speaking, color: 'from-orange-500 to-orange-600' },
  ];

  const daysUntilTest = testDate ? Math.ceil((new Date(testDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Card */}
      <WelcomeCard
        userName={userName}
        message="Let's work toward your IELTS goal!"
        avatar="🎯"
      />

      {/* Target Band & Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Band Prediction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Current Band Prediction</h3>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circles for each skill */}
                    {skills.map((skill, index) => {
                      const radius = 40 - index * 6;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDasharray = circumference;
                      const strokeDashoffset = circumference - (skill.score / 9) * circumference;
                      
                      return (
                        <motion.circle
                          key={skill.name}
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="none"
                          stroke={`url(#gradient-${index})`}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={strokeDasharray}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1.5, delay: index * 0.2 }}
                        />
                      );
                    })}
                    
                    {/* Gradient definitions */}
                    <defs>
                      {skills.map((skill, index) => (
                        <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={skill.color.split(' ')[0].replace('from-', '').replace('-500', '')} stopOpacity="0.8" />
                          <stop offset="100%" stopColor={skill.color.split(' ')[2].replace('to-', '').replace('-600', '')} stopOpacity="1" />
                        </linearGradient>
                      ))}
                    </defs>
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{currentBand}</span>
                    <span className="text-xs text-muted-foreground">Target: {targetBand}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {skills.map((skill, index) => (
                    <div key={skill.name} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{skill.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {skill.score}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Countdown Timer */}
        {testDate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          >
            <Card className="overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <Timer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Test Countdown</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {daysUntilTest}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    days until your IELTS test
                  </p>
                  <p className="text-xs text-orange-700 bg-orange-100 rounded-full px-3 py-1 inline-block">
                    🔥 You're making great progress!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          title="Practice Test"
          description="Full mock exam"
          icon={Timer}
          color="blue"
          onClick={() => console.log('Practice Test')}
        />
        <QuickActionCard
          title="Speaking Practice"
          description="With AI examiner"
          icon={Mic}
          color="green"
          onClick={() => console.log('Speaking Practice')}
        />
        <QuickActionCard
          title="Writing Review"
          description="Essay feedback"
          icon={PenTool}
          color="purple"
          onClick={() => console.log('Writing Review')}
        />
        <QuickActionCard
          title="Vocabulary Builder"
          description="Academic words"
          icon={BookOpen}
          color="orange"
          onClick={() => console.log('Vocabulary Builder')}
        />
      </div>

      {/* Progress Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Skill Breakdown</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    <Badge className="bg-primary/10 text-primary">
                      Band {skill.score}
                    </Badge>
                  </div>
                  <Progress 
                    value={(skill.score / 9) * 100} 
                    className="h-2"
                  />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Book IELTS Test */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="overflow-hidden bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Ready to book your test?</h3>
                <p className="text-sm text-muted-foreground">Find official IELTS test centers near you</p>
              </div>
              <Button className="bg-gradient-button hover:shadow-glow">
                <ExternalLink className="w-4 h-4 mr-2" />
                Book IELTS Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}