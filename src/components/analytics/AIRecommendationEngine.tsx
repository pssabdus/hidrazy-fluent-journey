import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Calendar,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Recommendation {
  id: string;
  type: 'immediate' | 'short_term' | 'long_term';
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  reasoning: string;
  expectedImprovement: string;
  timeToComplete: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relatedSkills: string[];
  actionSteps: string[];
  metrics: {
    currentScore: number;
    projectedScore: number;
    confidence: number;
  };
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  skills: string[];
  milestones: string[];
  estimatedOutcome: string;
  suitabilityScore: number;
}

export function AIRecommendationEngine() {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  const recommendations: Recommendation[] = [
    {
      id: '1',
      type: 'immediate',
      priority: 'high',
      category: 'Grammar',
      title: 'Focus on Article Usage',
      description: 'Immediate practice with definite and indefinite articles to reduce common mistakes.',
      reasoning: 'You make article errors in 34% of conversations, particularly with "the" vs "a/an" distinctions.',
      expectedImprovement: '25% reduction in article errors within 1 week',
      timeToComplete: '3-5 days',
      difficulty: 'medium',
      relatedSkills: ['Speaking', 'Writing'],
      actionSteps: [
        'Complete 5 interactive article exercises daily',
        'Practice article usage in conversation contexts',
        'Review article rules with cultural context examples'
      ],
      metrics: {
        currentScore: 66,
        projectedScore: 85,
        confidence: 92
      }
    },
    {
      id: '2',
      type: 'short_term',
      priority: 'high',
      category: 'Vocabulary',
      title: 'Expand Business Vocabulary',
      description: 'Build professional vocabulary for workplace conversations and presentations.',
      reasoning: 'Your career goals indicate business English needs, and you show strong vocabulary retention (87%).',
      expectedImprovement: '40% increase in business vocabulary confidence',
      timeToComplete: '2-3 weeks',
      difficulty: 'medium',
      relatedSkills: ['Speaking', 'Listening', 'Reading'],
      actionSteps: [
        'Learn 10 business terms daily with context',
        'Practice business scenarios with Razia',
        'Complete LinkedIn-style conversation exercises'
      ],
      metrics: {
        currentScore: 45,
        projectedScore: 78,
        confidence: 88
      }
    },
    {
      id: '3',
      type: 'immediate',
      priority: 'medium',
      category: 'Pronunciation',
      title: 'Master TH Sound',
      description: 'Focused practice on the TH sound which appears in 15% of your pronunciation errors.',
      reasoning: 'Arabic speakers commonly struggle with TH sounds, and this is your most frequent pronunciation issue.',
      expectedImprovement: '60% improvement in TH sound accuracy',
      timeToComplete: '1 week',
      difficulty: 'hard',
      relatedSkills: ['Speaking', 'Listening'],
      actionSteps: [
        'Daily TH sound drills with mirror practice',
        'Listen and repeat TH-heavy sentences',
        'Record and compare your pronunciation'
      ],
      metrics: {
        currentScore: 35,
        projectedScore: 75,
        confidence: 85
      }
    },
    {
      id: '4',
      type: 'long_term',
      priority: 'medium',
      category: 'Fluency',
      title: 'Advanced Conversation Skills',
      description: 'Develop natural conversation flow and cultural context understanding.',
      reasoning: 'Your foundation is strong, ready for advanced conversational patterns and cultural nuances.',
      expectedImprovement: 'Move from intermediate to advanced conversational level',
      timeToComplete: '6-8 weeks',
      difficulty: 'hard',
      relatedSkills: ['Speaking', 'Listening', 'Cultural Awareness'],
      actionSteps: [
        'Engage in complex topic discussions',
        'Practice idiomatic expressions in context',
        'Study cultural communication patterns'
      ],
      metrics: {
        currentScore: 72,
        projectedScore: 88,
        confidence: 78
      }
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: 'business',
      name: 'Business English Mastery',
      description: 'Complete pathway for professional English communication',
      duration: '8-12 weeks',
      difficulty: 'Intermediate to Advanced',
      skills: ['Business Vocabulary', 'Presentation Skills', 'Email Writing', 'Meeting Participation'],
      milestones: ['Basic Business Terms', 'Presentation Confidence', 'Professional Writing', 'Leadership Communication'],
      estimatedOutcome: 'Confident professional English communication',
      suitabilityScore: 94
    },
    {
      id: 'ielts',
      name: 'IELTS Preparation Track',
      description: 'Comprehensive IELTS test preparation with band score prediction',
      duration: '10-16 weeks',
      difficulty: 'Intermediate to Advanced',
      skills: ['Academic Writing', 'Reading Comprehension', 'Speaking Fluency', 'Listening Skills'],
      milestones: ['Band 6.0 Equivalency', 'Academic Vocabulary', 'Test Strategies', 'Band 7.0+ Target'],
      estimatedOutcome: 'Target IELTS band score achievement',
      suitabilityScore: 87
    },
    {
      id: 'conversational',
      name: 'Conversational Fluency',
      description: 'Natural conversation skills with cultural context',
      duration: '6-10 weeks',
      difficulty: 'Beginner to Intermediate',
      skills: ['Natural Expression', 'Cultural Context', 'Idiomatic Language', 'Social Interaction'],
      milestones: ['Basic Conversations', 'Cultural Understanding', 'Natural Flow', 'Advanced Topics'],
      estimatedOutcome: 'Confident everyday English conversations',
      suitabilityScore: 91
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'immediate': return Zap;
      case 'short_term': return Clock;
      case 'long_term': return Target;
      default: return Brain;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
        </TabsList>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">🎯 Today's Priority</h3>
                  <p className="text-sm text-blue-700">
                    Based on your recent mistakes, focus on article usage for maximum impact
                  </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Start Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations List */}
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const TypeIcon = getTypeIcon(rec.type);
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-all"
                        onClick={() => setSelectedRecommendation(
                          selectedRecommendation === rec.id ? null : rec.id
                        )}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <TypeIcon className="h-5 w-5 text-primary" />
                          <div>
                            <CardTitle className="text-base">{rec.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{rec.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                          <Badge variant="outline">{rec.timeToComplete}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm">{rec.description}</p>
                      
                      {/* Progress Projection */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Expected Progress</span>
                          <span className="font-medium">{rec.expectedImprovement}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Current: {rec.metrics.currentScore}%</span>
                            <span>Target: {rec.metrics.projectedScore}%</span>
                          </div>
                          <Progress value={rec.metrics.currentScore} className="h-2" />
                          <Progress value={rec.metrics.projectedScore} className="h-1 opacity-50" />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          AI Confidence: {rec.metrics.confidence}%
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedRecommendation === rec.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4 border-t pt-4"
                        >
                          <div>
                            <h4 className="font-medium mb-2 flex items-center">
                              <Lightbulb className="h-4 w-4 mr-2" />
                              Why This Recommendation?
                            </h4>
                            <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Action Steps:</h4>
                            <ul className="space-y-1">
                              {rec.actionSteps.map((step, i) => (
                                <li key={i} className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Related Skills:</span>
                            {rec.relatedSkills.map((skill, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button className="w-full">
                            Start This Recommendation
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Learning Paths Tab */}
        <TabsContent value="paths" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{path.name}</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        {path.suitabilityScore}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Duration:</span>
                        <div className="text-muted-foreground">{path.duration}</div>
                      </div>
                      <div>
                        <span className="font-medium">Difficulty:</span>
                        <div className="text-muted-foreground">{path.difficulty}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Key Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {path.skills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Learning Milestones:</h4>
                      <ul className="space-y-1">
                        {path.milestones.slice(0, 3).map((milestone, i) => (
                          <li key={i} className="flex items-center text-xs">
                            <Target className="h-3 w-3 text-primary mr-2" />
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-900">Expected Outcome:</div>
                      <div className="text-xs text-blue-700">{path.estimatedOutcome}</div>
                    </div>
                    
                    <Button className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Start Learning Path
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}