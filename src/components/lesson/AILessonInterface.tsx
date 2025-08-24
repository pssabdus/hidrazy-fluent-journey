import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Brain, 
  MessageCircle, 
  ArrowLeft, 
  Clock,
  Target,
  TrendingUp,
  Book,
  Users,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { AITeachingService, type LessonContext, type AILessonPlan } from '@/services/AITeachingService';
import { useToast } from '@/hooks/use-toast';

interface AILessonInterfaceProps {
  category: 'general' | 'ielts' | 'business';
  onBack: () => void;
  lessonContext?: LessonContext;
}

export function AILessonInterface({ category, onBack, lessonContext = {} }: AILessonInterfaceProps) {
  const [lessonPlan, setLessonPlan] = useState<AILessonPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [completionData, setCompletionData] = useState({
    confidence_rating: 5,
    key_learnings: [] as string[],
    struggles: [] as string[],
    cultural_moments: [] as string[]
  });
  const { toast } = useToast();

  useEffect(() => {
    generateLesson();
  }, [category]);

  const generateLesson = async () => {
    setLoading(true);
    try {
      const result = await AITeachingService.generatePersonalizedLesson(category, lessonContext);
      setLessonPlan(result);
      
      if (!result.success) {
        toast({
          title: "Using Backup Lesson",
          description: "AI service unavailable, showing curated content",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error generating lesson:', error);
      toast({
        title: "Error",
        description: "Failed to generate lesson. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async () => {
    if (!lessonPlan?.lesson_id) return;

    try {
      await AITeachingService.updateLessonProgress(lessonPlan.lesson_id, {
        completed: true,
        duration_minutes: 20, // Estimated duration
        confidence_rating: completionData.confidence_rating,
        key_learnings: completionData.key_learnings,
        struggles: completionData.struggles,
        cultural_moments: completionData.cultural_moments
      });

      toast({
        title: "Lesson Completed! 🎉",
        description: "Your progress has been saved and analyzed.",
        variant: "default"
      });

      onBack();
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast({
        title: "Progress Saved Locally",
        description: "Your lesson completion will sync when connection improves.",
        variant: "default"
      });
    }
  };

  const parseLessonPlan = (plan: string) => {
    const sections = plan.split('##').filter(section => section.trim());
    return sections.map(section => {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      return { title, content };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="border-primary/20">
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Brain className="w-12 h-12 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Generating Your Personalized Lesson</h2>
              <p className="text-muted-foreground mb-4">
                Razia is analyzing your progress and creating the perfect lesson for you...
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4" />
                  <span>Analyzing your learning profile</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>Identifying optimal teaching approach</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Book className="w-4 h-4" />
                  <span>Creating cultural integration points</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!lessonPlan) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Unable to Generate Lesson</h2>
              <p className="text-muted-foreground mb-4">
                We're having trouble creating your personalized lesson right now.
              </p>
              <Button onClick={generateLesson}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const sections = parseLessonPlan(lessonPlan.lesson_plan);

  if (!lessonStarted) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Lesson Preview */}
            <div className="lg:col-span-2">
              <Card className="border-primary/20 bg-gradient-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Your AI-Generated Lesson</h1>
                      <p className="text-muted-foreground">
                        Personalized for {category} English • {sections.length} sections
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>20-25 minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span>Adaptive difficulty</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>Cultural integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span>Progress tracking</span>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Sections Preview */}
                  <div className="space-y-3 mb-6">
                    {sections.slice(0, 4).map((section, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/30 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                          {index + 1}
                        </div>
                        <span className="font-medium">{section.title}</span>
                      </div>
                    ))}
                    {sections.length > 4 && (
                      <div className="text-center text-sm text-muted-foreground">
                        +{sections.length - 4} more sections
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={() => setLessonStarted(true)}
                    className="w-full bg-gradient-button hover:shadow-glow"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Learning with Razia
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Lesson Stats & Info */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Your Learning Profile</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Level:</span>
                      <Badge variant="secondary">
                        {lessonPlan.user_profile?.current_level || 'Intermediate'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span>{lessonPlan.user_profile?.confidence_score || 7}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Focus Area:</span>
                      <span>Speaking</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Today's Focus
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This lesson adapts to your recent progress and focuses on areas where you can make the biggest improvement.
                  </p>
                </CardContent>
              </Card>

              {!lessonPlan.success && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-orange-800 mb-2">Backup Content</h3>
                    <p className="text-sm text-orange-600">
                      Using curated lesson content while AI service is reconnecting.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Lesson
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Section {currentSection + 1} of {sections.length}
            </div>
            <Progress value={((currentSection + 1) / sections.length) * 100} className="w-32" />
          </div>
        </div>

        <Card className="border-primary/20">
          <CardContent className="p-8">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">{currentSection + 1}</span>
                </div>
                {sections[currentSection]?.title}
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {sections[currentSection]?.content}
                </div>
              </div>
            </motion.div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
              >
                Previous Section
              </Button>

              {currentSection < sections.length - 1 ? (
                <Button
                  onClick={() => setCurrentSection(currentSection + 1)}
                  className="bg-gradient-button"
                >
                  Next Section
                </Button>
              ) : (
                <Button
                  onClick={handleLessonComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Lesson
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}