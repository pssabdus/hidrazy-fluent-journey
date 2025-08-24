import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Users, 
  Target, 
  BookOpen, 
  Globe, 
  Lock,
  Play
} from 'lucide-react';
import { Scenario } from '@/types/roleplay';

interface ScenarioDetailProps {
  scenario: Scenario;
  onBack: () => void;
  onStart: () => void;
  isPremiumUser?: boolean;
}

export function ScenarioDetail({ scenario, onBack, onStart, isPremiumUser = false }: ScenarioDetailProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{scenario.title}</h1>
            <p className="text-muted-foreground">Detailed scenario information</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scenario Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{scenario.image}</span>
                      <div>
                        <CardTitle className="text-xl">{scenario.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">{scenario.description}</p>
                      </div>
                    </div>
                    {isLocked && <Lock className="w-6 h-6 text-gray-400" />}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getCategoryColor(scenario.category)}>
                      {scenario.category.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">{scenario.vocabularyLevel}</Badge>
                    {scenario.isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none">
                        Premium
                      </Badge>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-y">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{scenario.estimatedDuration} min</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className={`w-4 h-4 ${getDifficultyColor(scenario.difficulty)}`} />
                        <span className="text-sm font-medium">
                          {scenario.difficulty}/5
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Difficulty</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{scenario.character.role}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Character</div>
                    </div>
                  </div>

                  {/* Context */}
                  <div>
                    <h4 className="font-medium mb-2">Scenario Context</h4>
                    <p className="text-muted-foreground">{scenario.context}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Learning Objectives */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Learning Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {scenario.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Key Vocabulary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Key Vocabulary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {scenario.keyVocabulary.map((word, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cultural Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Cultural Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {scenario.culturalTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                        </div>
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Character Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meet Your Character</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👩‍🏫</span>
                    </div>
                    <h4 className="font-medium">{scenario.character.role}</h4>
                    <p className="text-sm text-muted-foreground">{scenario.character.personality}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Speaking Style</h5>
                    <Badge variant="outline" className="capitalize">
                      {scenario.character.speakingStyle}
                    </Badge>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Typical Greeting</h5>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm italic">"{scenario.character.greeting}"</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Common Phrases</h5>
                    <ul className="space-y-1">
                      {scenario.character.commonPhrases.slice(0, 3).map((phrase, index) => (
                        <li key={index} className="text-xs text-muted-foreground">
                          • "{phrase}"
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  {isLocked ? (
                    <div className="space-y-4">
                      <Lock className="w-12 h-12 mx-auto text-gray-400" />
                      <div>
                        <h4 className="font-medium mb-2">Premium Scenario</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upgrade to access this advanced scenario with detailed feedback.
                        </p>
                        <Button className="w-full">
                          Upgrade to Premium
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Play className="w-12 h-12 mx-auto text-primary" />
                      <div>
                        <h4 className="font-medium mb-2">Ready to Practice?</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start your conversation with {scenario.character.role} Razia!
                        </p>
                        <Button onClick={onStart} className="w-full" size="lg">
                          <Play className="w-4 h-4 mr-2" />
                          Start Scenario
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}