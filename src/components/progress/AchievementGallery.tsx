import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Medal, 
  Award, 
  Lock,
  Share2,
  Filter,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Achievement } from '@/types/progress';

interface AchievementGalleryProps {
  achievements: Achievement[];
}

export function AchievementGallery({ achievements }: AchievementGalleryProps) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all');

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  const filteredAchievements = achievements.filter(achievement => {
    const statusMatch = filter === 'all' || 
                       (filter === 'unlocked' && achievement.unlockedAt) ||
                       (filter === 'locked' && !achievement.unlockedAt);
    
    const rarityMatch = rarityFilter === 'all' || achievement.rarity === rarityFilter;
    
    return statusMatch && rarityMatch;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'shadow-blue-200';
      case 'epic': return 'shadow-purple-200';
      case 'legendary': return 'shadow-yellow-200';
      default: return '';
    }
  };

  const getAchievementIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return Trophy;
      case 'epic': return Award;
      case 'rare': return Medal;
      default: return Star;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Achievement Gallery
            </CardTitle>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{unlockedAchievements.length}</div>
                <div className="text-muted-foreground">Unlocked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{lockedAchievements.length}</div>
                <div className="text-muted-foreground">Locked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{achievements.length}</div>
                <div className="text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress 
            value={(unlockedAchievements.length / achievements.length) * 100} 
            className="h-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{Math.round((unlockedAchievements.length / achievements.length) * 100)}% Complete</span>
            <span>{unlockedAchievements.length} / {achievements.length} achievements</span>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'unlocked' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unlocked')}
              >
                Unlocked
              </Button>
              <Button
                variant={filter === 'locked' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('locked')}
              >
                Locked
              </Button>
            </div>
            
            <div className="h-4 w-px bg-border" />
            
            <div className="flex gap-2">
              {['all', 'common', 'rare', 'epic', 'legendary'].map(rarity => (
                <Button
                  key={rarity}
                  variant={rarityFilter === rarity ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRarityFilter(rarity as any)}
                  className="capitalize"
                >
                  {rarity}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredAchievements.map((achievement, index) => {
            const IconComponent = getAchievementIcon(achievement.rarity);
            const isUnlocked = !!achievement.unlockedAt;
            const progressPercentage = achievement.progress && achievement.maxProgress 
              ? (achievement.progress / achievement.maxProgress) * 100 
              : 0;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className={`h-full relative overflow-hidden ${
                  isUnlocked 
                    ? `${getRarityGlow(achievement.rarity)} shadow-lg` 
                    : 'opacity-70'
                } transition-all duration-300 group-hover:shadow-xl`}>
                  
                  {/* Rarity Indicator */}
                  <div className="absolute top-2 right-2">
                    <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                      {achievement.rarity}
                    </Badge>
                  </div>

                  {/* Lock Overlay for Locked Achievements */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                      <Lock className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-full ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-primary to-accent' 
                        : 'bg-muted'
                    } flex items-center justify-center mb-4 mx-auto`}>
                      <IconComponent className={`h-8 w-8 ${
                        isUnlocked ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`} />
                    </div>

                    {/* Title and Description */}
                    <div className="text-center mb-4 flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>

                    {/* Progress Bar (for in-progress achievements) */}
                    {!isUnlocked && achievement.progress && achievement.maxProgress && (
                      <div className="space-y-2 mb-4">
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="text-xs text-center text-muted-foreground">
                          {achievement.progress} / {achievement.maxProgress}
                        </div>
                      </div>
                    )}

                    {/* Unlock Date */}
                    {isUnlocked && achievement.unlockedAt && (
                      <div className="text-xs text-center text-muted-foreground">
                        Unlocked {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    )}

                    {/* Share Button for Unlocked Achievements */}
                    {isUnlocked && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    )}
                  </CardContent>

                  {/* Sparkle Animation for Legendary */}
                  {isUnlocked && achievement.rarity === 'legendary' && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-400 rounded-full" />
                      <div className="absolute top-6 right-4 w-1 h-1 bg-yellow-400 rounded-full" />
                      <div className="absolute bottom-4 left-6 w-1 h-1 bg-yellow-400 rounded-full" />
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredAchievements.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No achievements found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more achievements.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}