import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Headphones, 
  BookOpen, 
  PenTool, 
  ArrowUp, 
  ArrowDown,
  PlayCircle,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { type SkillProgress } from '@/types/progress';

interface SkillBreakdownSectionProps {
  skillProgress: SkillProgress;
  detailed?: boolean;
}

export function SkillBreakdownSection({ skillProgress, detailed = false }: SkillBreakdownSectionProps) {
  const skills = [
    {
      name: 'Speaking',
      icon: Mic,
      progress: skillProgress.speaking,
      improvement: 8.5,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      description: 'Pronunciation, fluency, and conversation confidence'
    },
    {
      name: 'Listening',
      icon: Headphones,
      progress: skillProgress.listening,
      improvement: 12.3,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      description: 'Comprehension, accent recognition, and audio processing'
    },
    {
      name: 'Reading',
      icon: BookOpen,
      progress: skillProgress.reading,
      improvement: -2.1,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      description: 'Text comprehension, vocabulary, and reading speed'
    },
    {
      name: 'Writing',
      icon: PenTool,
      progress: skillProgress.writing,
      improvement: 5.7,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      description: 'Grammar, structure, and creative expression'
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProficiencyLevel = (progress: number) => {
    if (progress >= 85) return { level: 'Advanced', color: 'bg-green-100 text-green-800' };
    if (progress >= 70) return { level: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' };
    if (progress >= 40) return { level: 'Elementary', color: 'bg-blue-100 text-blue-800' };
    return { level: 'Beginner', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Skill Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 ${detailed ? 'lg:grid-cols-2' : 'lg:grid-cols-2'} gap-4`}>
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            const proficiency = getProficiencyLevel(skill.progress);

            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${skill.bgColor}`}>
                          <IconComponent className={`h-6 w-6 ${skill.textColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{skill.name}</h3>
                          <Badge className={proficiency.color} variant="secondary">
                            {proficiency.level}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {skill.improvement > 0 ? (
                            <ArrowUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${
                            skill.improvement > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {Math.abs(skill.improvement)}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">this week</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className={`text-sm font-semibold ${getProgressColor(skill.progress)}`}>
                          {skill.progress}%
                        </span>
                      </div>
                      
                      <div className="relative">
                        <Progress value={skill.progress} className="h-3" />
                        <div 
                          className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>

                      {detailed && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {skill.description}
                        </p>
                      )}

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Practice {skill.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {detailed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  <div>
                    <h4 className="font-medium text-foreground">AI Recommendation</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on reading comprehension this week. Your speaking and listening are progressing well, but reading needs attention to maintain balance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}