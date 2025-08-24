import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Star, 
  Clock, 
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { type VocabularyStats } from '@/types/progress';

interface VocabularyMasteryProps {
  data: VocabularyStats;
  compact?: boolean;
}

export function VocabularyMastery({ data, compact = false }: VocabularyMasteryProps) {
  const masteryPercentage = Math.round((data.masteredWords / data.totalWords) * 100);
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelStats = () => {
    const levels = { beginner: 0, intermediate: 0, advanced: 0 };
    [...data.recentlyAdded, ...data.challengingWords].forEach(word => {
      levels[word.level]++;
    });
    return levels;
  };

  const levelStats = getLevelStats();

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Vocabulary Mastery
          {!compact && (
            <Badge variant="secondary" className="ml-auto">
              {data.totalWords} words
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Overall Mastery</span>
            <span className="text-2xl font-bold text-primary">{masteryPercentage}%</span>
          </div>
          <Progress value={masteryPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{data.masteredWords} mastered</span>
            <span>{data.totalWords - data.masteredWords} learning</span>
          </div>
        </motion.div>

        {!compact && (
          <>
            <Separator />

            {/* Level Distribution */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Level Distribution</h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(levelStats).map(([level, count]) => (
                  <Card key={level} className="p-3 text-center">
                    <Badge className={getLevelColor(level)} variant="secondary">
                      {level}
                    </Badge>
                    <div className="text-lg font-semibold text-foreground mt-1">{count}</div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Recently Added */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Plus className="h-4 w-4 text-green-500" />
              Recently Added
            </h4>
            {compact && (
              <Button variant="ghost" size="sm">
                View All
              </Button>
            )}
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {data.recentlyAdded.slice(0, compact ? 3 : 10).map((word, index) => (
              <motion.div
                key={word.word}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <div className="font-medium text-foreground">{word.word}</div>
                  <div className="text-xs text-muted-foreground truncate">{word.definition}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getLevelColor(word.level)} variant="secondary" size="sm">
                    {word.level}
                  </Badge>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {!compact && (
          <>
            <Separator />

            {/* Challenging Words */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                Needs Practice
              </h4>
              <div className="space-y-2">
                {data.challengingWords.slice(0, 5).map((word, index) => (
                  <motion.div
                    key={word.word}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-orange-50 border border-orange-200"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{word.word}</div>
                      <div className="text-xs text-muted-foreground">{word.definition}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={word.masteryLevel} className="w-16 h-2" />
                      <span className="text-xs text-orange-600 font-medium">
                        {word.masteryLevel}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Spaced Repetition */}
            <Separator />
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Next Review Session</h4>
                    <p className="text-sm text-muted-foreground">
                      15 words ready for review • Estimated 8 minutes
                    </p>
                  </div>
                  <Button size="sm" className="ml-auto">
                    Start Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Quick Action */}
        <Button className="w-full" variant={compact ? "outline" : "default"}>
          <TrendingUp className="h-4 w-4 mr-2" />
          {compact ? "View Details" : "Practice Vocabulary"}
        </Button>
      </CardContent>
    </Card>
  );
}