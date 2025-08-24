import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Flame, 
  Calendar, 
  Trophy, 
  Target,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { type StudyStreak } from '@/types/progress';

interface StudyStreakVisualizationProps {
  data: StudyStreak;
}

export function StudyStreakVisualization({ data }: StudyStreakVisualizationProps) {
  // Generate last 12 weeks of data for heatmap
  const generateHeatmapData = () => {
    const weeks = [];
    const currentDate = new Date();
    
    for (let weekOffset = 11; weekOffset >= 0; weekOffset--) {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - (weekOffset * 7) - currentDate.getDay());
      
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + day);
        
        // Find matching data or create default
        const existingData = data.streakData.find(d => 
          new Date(d.date).toDateString() === date.toDateString()
        );
        
        weekData.push({
          date: date.toISOString().split('T')[0],
          studyMinutes: existingData?.studyMinutes || 0,
          intensity: existingData?.intensity || 'none'
        });
      }
      weeks.push(weekData);
    }
    
    return weeks;
  };

  const heatmapData = generateHeatmapData();
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'none': return 'bg-gray-100';
      case 'light': return 'bg-green-200';
      case 'medium': return 'bg-green-400';
      case 'high': return 'bg-green-600';
      default: return 'bg-gray-100';
    }
  };

  const getIntensityText = (intensity: string, minutes: number) => {
    if (minutes === 0) return 'No activity';
    return `${minutes} minutes - ${intensity} intensity`;
  };

  // Calculate streak stats
  const totalStudyDays = data.streakData.filter(d => d.studyMinutes > 0).length;
  const averageMinutes = data.streakData.reduce((sum, d) => sum + d.studyMinutes, 0) / data.streakData.length;
  const streakFrequency = (totalStudyDays / data.streakData.length) * 100;

  // Get current streak status
  const isStreakActive = data.currentStreak > 0;
  const streakEmoji = isStreakActive ? '🔥' : '💔';
  const streakColor = isStreakActive ? 'text-orange-500' : 'text-gray-400';

  return (
    <div className="space-y-6">
      {/* Streak Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="text-center bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6">
              <motion.div
                animate={isStreakActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-3"
              >
                <Flame className={`h-8 w-8 mx-auto ${streakColor}`} />
              </motion.div>
              <div className="text-2xl font-bold text-foreground">{data.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
              <Badge variant="secondary" className="mt-2">
                {isStreakActive ? 'Active' : 'Broken'}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="text-center">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 mx-auto text-yellow-500 mb-3" />
              <div className="text-2xl font-bold text-foreground">{data.longestStreak}</div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
              <Badge variant="secondary" className="mt-2">
                Personal Record
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 mx-auto text-blue-500 mb-3" />
              <div className="text-2xl font-bold text-foreground">{Math.round(averageMinutes)}</div>
              <div className="text-sm text-muted-foreground">Avg Minutes/Day</div>
              <Badge variant="secondary" className="mt-2">
                {averageMinutes >= 30 ? 'Exceeding Goal' : 'Below Goal'}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-3" />
              <div className="text-2xl font-bold text-foreground">{Math.round(streakFrequency)}%</div>
              <div className="text-sm text-muted-foreground">Consistency</div>
              <Badge variant="secondary" className="mt-2">
                {streakFrequency >= 80 ? 'Excellent' : streakFrequency >= 60 ? 'Good' : 'Improving'}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Study Activity Heatmap
              <Badge variant="secondary" className="ml-auto">
                Last 12 weeks
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Day Labels */}
              <div className="flex">
                <div className="w-12"></div>
                <div className="flex-1 grid grid-cols-7 gap-1 text-xs text-muted-foreground">
                  {dayLabels.map(day => (
                    <div key={day} className="text-center font-medium">{day}</div>
                  ))}
                </div>
              </div>

              {/* Heatmap Grid */}
              <TooltipProvider>
                <div className="space-y-1">
                  {heatmapData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex items-center">
                      <div className="w-12 text-xs text-muted-foreground">
                        Week {weekIndex + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-7 gap-1">
                        {week.map((day, dayIndex) => (
                          <Tooltip key={dayIndex}>
                            <TooltipTrigger asChild>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                                className={`aspect-square rounded-sm ${getIntensityColor(day.intensity)} 
                                  border border-gray-200 cursor-pointer hover:scale-110 transition-transform`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-center">
                                <div className="font-medium">
                                  {new Date(day.date).toLocaleDateString()}
                                </div>
                                <div className="text-sm">
                                  {getIntensityText(day.intensity, day.studyMinutes)}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TooltipProvider>

              {/* Legend */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" />
                    <div className="w-3 h-3 rounded-sm bg-green-200 border border-gray-200" />
                    <div className="w-3 h-3 rounded-sm bg-green-400 border border-gray-200" />
                    <div className="w-3 h-3 rounded-sm bg-green-600 border border-gray-200" />
                  </div>
                  <span>More</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {totalStudyDays} active days
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Streak Preservation Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {isStreakActive ? 'Maintain Your Streak' : 'Restart Your Journey'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isStreakActive ? (
                <>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">💡 Streak Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Set a daily reminder for study time</li>
                      <li>• Even 5 minutes counts towards your streak</li>
                      <li>• Use weekends to build buffer time</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">🎯 Quick Study Ideas</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Review vocabulary on the go</li>
                      <li>• Practice pronunciation during breaks</li>
                      <li>• Chat with Razia for a few minutes</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">🔄 Recovery Strategy</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Start with just 10 minutes today</li>
                      <li>• Focus on your favorite activity first</li>
                      <li>• Set realistic daily goals</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">💪 Motivation Boost</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Remember your longest streak: {data.longestStreak} days</li>
                      <li>• You can achieve it again!</li>
                      <li>• Every expert was once a beginner</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
            <Button className="w-full mt-4">
              <Target className="h-4 w-4 mr-2" />
              {isStreakActive ? 'Continue Streak' : 'Start New Streak'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}