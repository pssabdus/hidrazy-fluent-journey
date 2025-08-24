import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Map, 
  MapPin, 
  Lock, 
  Star, 
  Clock,
  CheckCircle,
  PlayCircle,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';

interface World {
  id: string;
  name: string;
  level: string;
  completion: number;
  isUnlocked: boolean;
  isCurrent: boolean;
  islands: Island[];
  estimatedTime: string;
  color: string;
}

interface Island {
  id: string;
  name: string;
  completion: number;
  isUnlocked: boolean;
  lessons: number;
  completedLessons: number;
}

export function LearningJourneyMap() {
  // Mock data for worlds
  const worlds: World[] = [
    {
      id: '1',
      name: 'Foundation World',
      level: 'A1-A2',
      completion: 85,
      isUnlocked: true,
      isCurrent: false,
      estimatedTime: '2 weeks',
      color: 'from-green-400 to-emerald-500',
      islands: [
        { id: '1', name: 'Basic Greetings', completion: 100, isUnlocked: true, lessons: 8, completedLessons: 8 },
        { id: '2', name: 'Daily Routines', completion: 100, isUnlocked: true, lessons: 12, completedLessons: 12 },
        { id: '3', name: 'Family & Friends', completion: 75, isUnlocked: true, lessons: 10, completedLessons: 7 },
        { id: '4', name: 'Shopping & Food', completion: 60, isUnlocked: true, lessons: 15, completedLessons: 9 }
      ]
    },
    {
      id: '2',
      name: 'Exploration World',
      level: 'B1',
      completion: 45,
      isUnlocked: true,
      isCurrent: true,
      estimatedTime: '3 weeks',
      color: 'from-blue-400 to-cyan-500',
      islands: [
        { id: '5', name: 'Travel & Directions', completion: 80, isUnlocked: true, lessons: 14, completedLessons: 11 },
        { id: '6', name: 'Hobbies & Interests', completion: 40, isUnlocked: true, lessons: 12, completedLessons: 5 },
        { id: '7', name: 'Work & Study', completion: 20, isUnlocked: true, lessons: 16, completedLessons: 3 },
        { id: '8', name: 'Health & Wellness', completion: 0, isUnlocked: false, lessons: 13, completedLessons: 0 }
      ]
    },
    {
      id: '3',
      name: 'Advanced World',
      level: 'B2',
      completion: 0,
      isUnlocked: false,
      isCurrent: false,
      estimatedTime: '4 weeks',
      color: 'from-purple-400 to-violet-500',
      islands: [
        { id: '9', name: 'Complex Discussions', completion: 0, isUnlocked: false, lessons: 18, completedLessons: 0 },
        { id: '10', name: 'Professional Skills', completion: 0, isUnlocked: false, lessons: 20, completedLessons: 0 },
        { id: '11', name: 'Cultural Topics', completion: 0, isUnlocked: false, lessons: 15, completedLessons: 0 },
        { id: '12', name: 'Critical Thinking', completion: 0, isUnlocked: false, lessons: 22, completedLessons: 0 }
      ]
    },
    {
      id: '4',
      name: 'Mastery World',
      level: 'C1-C2',
      completion: 0,
      isUnlocked: false,
      isCurrent: false,
      estimatedTime: '6 weeks',
      color: 'from-yellow-400 to-orange-500',
      islands: [
        { id: '13', name: 'Academic English', completion: 0, isUnlocked: false, lessons: 25, completedLessons: 0 },
        { id: '14', name: 'Business Mastery', completion: 0, isUnlocked: false, lessons: 28, completedLessons: 0 },
        { id: '15', name: 'Creative Expression', completion: 0, isUnlocked: false, lessons: 20, completedLessons: 0 },
        { id: '16', name: 'Leadership & Influence', completion: 0, isUnlocked: false, lessons: 30, completedLessons: 0 }
      ]
    }
  ];

  const currentWorld = worlds.find(w => w.isCurrent);
  const currentUserName = "You"; // This would come from props

  return (
    <div className="space-y-6">
      {/* Journey Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Learning Journey Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{worlds.filter(w => w.completion > 80).length}</div>
              <div className="text-sm text-muted-foreground">Worlds Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{worlds.filter(w => w.isUnlocked && w.completion < 80).length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{worlds.filter(w => !w.isUnlocked).length}</div>
              <div className="text-sm text-muted-foreground">Locked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentWorld?.level || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* World Map */}
      <div className="space-y-8">
        {worlds.map((world, worldIndex) => (
          <motion.div
            key={world.id}
            initial={{ opacity: 0, x: worldIndex % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: worldIndex * 0.2 }}
          >
            <Card className={`relative overflow-hidden ${
              world.isCurrent ? 'ring-2 ring-primary shadow-lg' : ''
            } ${!world.isUnlocked ? 'opacity-60' : ''}`}>
              
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${world.color} opacity-10`} />
              
              {/* Current World Indicator */}
              {world.isCurrent && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <Avatar className="h-8 w-8 ring-2 ring-primary">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {currentUserName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="default">Current</Badge>
                </div>
              )}

              {/* Lock Overlay */}
              {!world.isUnlocked && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <div className="text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <div className="text-sm font-medium text-muted-foreground">
                      Complete previous world to unlock
                    </div>
                  </div>
                </div>
              )}

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* World Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{world.name}</h3>
                      <Badge variant="secondary" className="mb-2">{world.level}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Est. {world.estimatedTime}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-medium">{world.completion}%</span>
                      </div>
                      <Progress value={world.completion} className="h-3" />
                    </div>

                    {world.isUnlocked && (
                      <Button 
                        variant={world.isCurrent ? "default" : "outline"} 
                        size="sm"
                        className="w-full"
                      >
                        {world.completion > 80 ? (
                          <>
                            <Trophy className="h-4 w-4 mr-2" />
                            Review World
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            {world.isCurrent ? 'Continue Learning' : 'Start World'}
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Islands Grid */}
                  <div className="lg:col-span-2">
                    <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Learning Islands
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {world.islands.map((island, islandIndex) => (
                        <motion.div
                          key={island.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: worldIndex * 0.2 + islandIndex * 0.1 }}
                          className="group"
                        >
                          <Card className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                            island.completion === 100 
                              ? 'bg-green-50 border-green-200' 
                              : island.isUnlocked 
                              ? 'hover:bg-muted/50' 
                              : 'opacity-50'
                          }`}>
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm text-foreground">{island.name}</h5>
                                  <div className="text-xs text-muted-foreground">
                                    {island.completedLessons}/{island.lessons} lessons
                                  </div>
                                </div>
                                {island.completion === 100 && (
                                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                )}
                                {!island.isUnlocked && (
                                  <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                )}
                              </div>

                              <div className="space-y-1">
                                <Progress value={island.completion} className="h-2" />
                                <div className="text-xs text-muted-foreground text-right">
                                  {island.completion}%
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Next Unlock Preview */}
      {worlds.some(w => !w.isUnlocked) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  🎯 Next Adventure Awaits!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Complete {Math.round(100 - (currentWorld?.completion || 0))}% more in {currentWorld?.name} to unlock the next world.
                </p>
                <Button>
                  <Star className="h-4 w-4 mr-2" />
                  Continue Your Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}