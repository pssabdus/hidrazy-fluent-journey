import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Edit,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { type LearningGoal } from '@/types/progress';

interface GoalProgressProps {
  data: LearningGoal;
  compact?: boolean;
}

export function GoalProgress({ data, compact = false }: GoalProgressProps) {
  const overallProgress = (data.currentScore / (data.targetScore || 100)) * 100;
  const daysUntilTarget = Math.ceil((data.estimatedCompletion.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const completedMilestones = data.milestones.filter(m => m.completed);
  const nextMilestone = data.milestones.find(m => !m.completed);
  
  const getGoalTypeInfo = () => {
    switch (data.type) {
      case 'ielts':
        return {
          title: 'IELTS Preparation',
          icon: Award,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          targetText: `Band ${data.targetScore}`,
          currentText: `Band ${data.currentScore}`
        };
      case 'conversation':
        return {
          title: 'Conversation Fluency',
          icon: Target,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          targetText: `${data.targetScore}% Fluency`,
          currentText: `${data.currentScore}% Fluency`
        };
      case 'business':
        return {
          title: 'Business English',
          icon: TrendingUp,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          targetText: `${data.targetScore}% Proficiency`,
          currentText: `${data.currentScore}% Proficiency`
        };
      default:
        return {
          title: 'General English',
          icon: Star,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          targetText: `Level ${data.targetScore}`,
          currentText: `Level ${data.currentScore}`
        };
    }
  };

  const goalInfo = getGoalTypeInfo();
  const IconComponent = goalInfo.icon;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <IconComponent className={`h-5 w-5 ${goalInfo.color}`} />
          {compact ? 'Goal Progress' : goalInfo.title}
          {!compact && (
            <Button variant="ghost" size="sm" className="ml-auto">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className={`p-4 rounded-lg ${goalInfo.bgColor}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-muted-foreground">Current Progress</div>
                <div className="text-2xl font-bold text-foreground">{goalInfo.currentText}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Target</div>
                <div className="text-lg font-semibold text-foreground">{goalInfo.targetText}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Progress value={Math.min(overallProgress, 100)} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(overallProgress)}% Complete</span>
                <span>{daysUntilTarget > 0 ? `${daysUntilTarget} days left` : 'Target reached!'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {!compact && (
          <>
            <Separator />

            {/* Milestones */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Milestones</h4>
                <Badge variant="secondary">
                  {completedMilestones.length} of {data.milestones.length} completed
                </Badge>
              </div>

              <div className="space-y-3">
                {data.milestones.map((milestone, index) => {
                  const progress = (milestone.currentValue / milestone.targetValue) * 100;
                  
                  return (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border transition-all ${
                        milestone.completed 
                          ? 'bg-green-50 border-green-200' 
                          : milestone === nextMilestone
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-muted/30 border-border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${
                          milestone.completed ? 'text-green-600' : 'text-muted-foreground'
                        }`}>
                          {milestone.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <AlertCircle className="h-5 w-5" />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div>
                            <h5 className="font-medium text-foreground">{milestone.title}</h5>
                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          </div>
                          
                          {!milestone.completed && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">
                                  {milestone.currentValue} / {milestone.targetValue}
                                </span>
                              </div>
                              <Progress value={Math.min(progress, 100)} className="h-2" />
                            </div>
                          )}
                        </div>

                        {milestone === nextMilestone && (
                          <Badge variant="secondary">
                            Next
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Estimated Completion</span>
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {data.estimatedCompletion.toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {daysUntilTarget > 0 ? `in ${daysUntilTarget} days` : 'Target reached!'}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Current Pace</span>
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {overallProgress > 50 ? 'On Track' : 'Behind Schedule'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {overallProgress > 50 ? 'Keep up the great work!' : 'Consider increasing study time'}
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Action Button */}
        <Button className="w-full" variant={compact ? "outline" : "default"}>
          <Target className="h-4 w-4 mr-2" />
          {compact ? "View Details" : nextMilestone ? `Work on: ${nextMilestone.title}` : "Celebrate Achievement!"}
        </Button>
      </CardContent>
    </Card>
  );
}