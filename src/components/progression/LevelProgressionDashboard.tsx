import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lock, Trophy, Calendar, Clock, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { aiContentService, LevelProgression, AssessmentResult, CEFRLevel } from '@/services/AIContentService';

const LEVEL_INFO = {
  A1: { name: 'Beginner', color: 'bg-green-500', requirements: ['Basic greetings', 'Simple phrases', 'Numbers', 'Basic questions'] },
  A2: { name: 'Elementary', color: 'bg-blue-500', requirements: ['Daily routines', 'Past tense', 'Comparisons', 'Simple conversations'] },
  B1: { name: 'Intermediate', color: 'bg-purple-500', requirements: ['Express opinions', 'Present perfect', 'Conditionals', 'Describe experiences'] },
  B2: { name: 'Upper Intermediate', color: 'bg-orange-500', requirements: ['Complex arguments', 'Advanced grammar', 'Academic writing', 'Fluent discussion'] },
  C1: { name: 'Advanced', color: 'bg-red-500', requirements: ['Professional communication', 'Nuanced expression', 'Academic discourse', 'Cultural awareness'] },
  C2: { name: 'Proficient', color: 'bg-gold-500', requirements: ['Native-like fluency', 'Sophisticated argumentation', 'Creative expression', 'Complete mastery'] }
};

const ASSESSMENT_TYPES = ['vocabulary', 'grammar', 'speaking', 'listening'];

interface LevelProgressionDashboardProps {
  currentLevel: CEFRLevel;
  onLevelUnlocked?: (newLevel: CEFRLevel) => void;
}

export const LevelProgressionDashboard: React.FC<LevelProgressionDashboardProps> = ({
  currentLevel,
  onLevelUnlocked
}) => {
  const [progression, setProgression] = useState<LevelProgression | null>(null);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAssessment, setGeneratingAssessment] = useState<string | null>(null);

  useEffect(() => {
    loadProgressionData();
  }, []);

  const loadProgressionData = async () => {
    try {
      setLoading(true);
      const [progressionData, assessmentData] = await Promise.all([
        aiContentService.getUserProgression(),
        aiContentService.getLevelAssessments()
      ]);

      if (!progressionData) {
        // Initialize progression if it doesn't exist
        const initialProgression = await aiContentService.initializeUserProgression();
        setProgression(initialProgression);
      } else {
        setProgression(progressionData);
      }

      setAssessments(assessmentData);
    } catch (error) {
      console.error('Error loading progression data:', error);
      toast({
        title: "Error Loading Progress",
        description: "Failed to load your learning progression.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAssessment = async (level: CEFRLevel, assessmentType: string) => {
    try {
      setGeneratingAssessment(`${level}-${assessmentType}`);
      
      const content = await aiContentService.generateContent({
        content_type: 'assessment',
        level,
        topic: `${assessmentType} assessment`,
        cultural_context: 'Arabic-speaking learners',
        learning_objectives: [`Assess ${assessmentType} skills at ${level} level`],
        duration_minutes: 30
      });

      toast({
        title: "Assessment Generated",
        description: `${assessmentType} assessment for ${level} level is ready!`,
      });

      // Here you would typically navigate to the assessment or show it in a modal
      console.log('Generated assessment:', content);
      
    } catch (error) {
      console.error('Error generating assessment:', error);
      toast({
        title: "Assessment Generation Failed",
        description: "Failed to generate the assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingAssessment(null);
    }
  };

  const getLevelProgress = (level: CEFRLevel): number => {
    if (!progression) return 0;
    
    if (progression.levels_completed.includes(level)) return 100;
    if (level !== progression.current_level) return 0;

    const levelAssessments = assessments.filter(a => a.level === level);
    const passedAssessments = levelAssessments.filter(a => a.passed);
    
    return (passedAssessments.length / ASSESSMENT_TYPES.length) * 100;
  };

  const canAccessLevel = (level: CEFRLevel): boolean => {
    if (!progression) return level === 'A1';
    
    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(progression.current_level);
    const targetIndex = levels.indexOf(level);
    
    return targetIndex <= currentIndex;
  };

  const getAssessmentStatus = (level: CEFRLevel, assessmentType: string) => {
    const assessment = assessments.find(a => a.level === level && a.assessment_type === assessmentType);
    if (!assessment) return 'not_taken';
    return assessment.passed ? 'passed' : 'failed';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-2 bg-muted rounded"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-8 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Learning Progression
          </CardTitle>
          <CardDescription>
            Track your progress through CEFR levels and unlock new content by completing assessments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progression && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                  <p className="text-2xl font-bold">{progression.current_level}</p>
                  <p className="text-sm text-muted-foreground">
                    {LEVEL_INFO[progression.current_level].name}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round(getLevelProgress(progression.current_level))}%</span>
                  </div>
                  <Progress value={getLevelProgress(progression.current_level)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Levels Completed: {progression.levels_completed.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Study Time: {Math.floor(progression.total_learning_time / 60)}h {progression.total_learning_time % 60}m</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Streak: {progression.streak_days} days</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">CEFR Levels</h3>
        {(Object.keys(LEVEL_INFO) as CEFRLevel[]).map((level) => {
          const info = LEVEL_INFO[level];
          const progress = getLevelProgress(level);
          const accessible = canAccessLevel(level);
          const isCompleted = progression?.levels_completed.includes(level);
          const isCurrent = progression?.current_level === level;

          return (
            <Card key={level} className={`${accessible ? '' : 'opacity-50'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${info.color}`}></div>
                    <div>
                      <CardTitle className="text-lg">
                        {level} - {info.name}
                        {isCompleted && <CheckCircle className="h-4 w-4 text-green-500 inline ml-2" />}
                        {!accessible && <Lock className="h-4 w-4 text-muted-foreground inline ml-2" />}
                      </CardTitle>
                      {isCurrent && (
                        <Badge variant="secondary" className="mt-1">Current Level</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</p>
                    <Progress value={progress} className="w-24 mt-1" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Requirements:</h5>
                    <div className="flex flex-wrap gap-1">
                      {info.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {accessible && (
                    <div>
                      <h5 className="font-medium mb-2">Assessments:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {ASSESSMENT_TYPES.map((assessmentType) => {
                          const status = getAssessmentStatus(level, assessmentType);
                          const isGenerating = generatingAssessment === `${level}-${assessmentType}`;
                          
                          return (
                            <Button
                              key={assessmentType}
                              variant={status === 'passed' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => generateAssessment(level, assessmentType)}
                              disabled={!accessible || isGenerating}
                              className="w-full"
                            >
                              {isGenerating ? (
                                <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full mr-1" />
                              ) : status === 'passed' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : status === 'failed' ? (
                                <span className="text-red-500 mr-1">×</span>
                              ) : null}
                              {assessmentType}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};