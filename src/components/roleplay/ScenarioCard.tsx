import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, Users, CheckCircle, Lock } from 'lucide-react';
import { Scenario } from '@/types/roleplay';

interface ScenarioCardProps {
  scenario: Scenario;
  onSelect: (scenario: Scenario) => void;
  isPremiumUser?: boolean;
}

export function ScenarioCard({ scenario, onSelect, isPremiumUser = false }: ScenarioCardProps) {
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-500';
    if (difficulty <= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily_life': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'work': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'travel': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'social': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const isLocked = scenario.isPremium && !isPremiumUser;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer"
    >
      <Card className={`h-full border-2 transition-all duration-300 ${
        isLocked 
          ? 'opacity-70 border-gray-200' 
          : 'border-transparent hover:border-primary/20 hover:shadow-lg'
      }`}>
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{scenario.image}</span>
                {scenario.isCompleted && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {isLocked && (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {scenario.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {scenario.description}
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className={getCategoryColor(scenario.category)}
            >
              {scenario.category.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {scenario.vocabularyLevel}
            </Badge>
            {scenario.isPremium && (
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none">
                Premium
              </Badge>
            )}
          </div>

          {/* Metrics */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{scenario.estimatedDuration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className={`w-4 h-4 ${getDifficultyColor(scenario.difficulty)}`} />
              <span className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < scenario.difficulty 
                        ? getDifficultyColor(scenario.difficulty) + ' fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{scenario.character.role}</span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={() => onSelect(scenario)}
            disabled={isLocked}
            className="w-full mt-4"
            variant={scenario.isCompleted ? "secondary" : "default"}
          >
            {isLocked ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </>
            ) : scenario.isCompleted ? (
              'Practice Again'
            ) : (
              'Start Scenario'
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}