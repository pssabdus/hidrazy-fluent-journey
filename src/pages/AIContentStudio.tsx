import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, BookOpen, Target } from 'lucide-react';
import { AIContentGenerator } from '@/components/ai/AIContentGenerator';
import { LevelProgressionDashboard } from '@/components/progression/LevelProgressionDashboard';
import { aiContentService, GeneratedContent, CEFRLevel } from '@/services/AIContentService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function AIContentStudio() {
  const { user } = useAuth();
  const [userLevel, setUserLevel] = useState<CEFRLevel>('A1');
  const [recentContent, setRecentContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user progression to get current level
      const progression = await aiContentService.getUserProgression();
      if (progression) {
        setUserLevel(progression.current_level);
      } else {
        // Initialize progression if it doesn't exist
        const newProgression = await aiContentService.initializeUserProgression();
        setUserLevel(newProgression.current_level);
      }

      // Load recent generated content
      const content = await aiContentService.getGeneratedContent();
      setRecentContent(content.slice(0, 5)); // Show last 5 items
      
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load your learning data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContentGenerated = (content: GeneratedContent) => {
    setRecentContent(prev => [content, ...prev.slice(0, 4)]);
    toast({
      title: "Content Generated!",
      description: `New ${content.level} level content is ready for you.`
    });
  };

  const handleLevelUnlocked = (newLevel: CEFRLevel) => {
    setUserLevel(newLevel);
    toast({
      title: "Level Unlocked! 🎉",
      description: `Congratulations! You've unlocked ${newLevel} level.`
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Please sign in to access the AI Content Studio.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">AI Content Studio</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold">
          Personalized Learning Content
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Generate custom lessons, conversations, and assessments using AI, specifically designed for Arabic speakers learning English.
        </p>
      </div>

      {/* Current Level Badge */}
      <div className="flex justify-center">
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Current Level: {userLevel}
        </Badge>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Content Generator
          </TabsTrigger>
          <TabsTrigger value="progression" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Level Progression
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Content Library
          </TabsTrigger>
        </TabsList>

        {/* Content Generator Tab */}
        <TabsContent value="generator">
          <AIContentGenerator
            userLevel={userLevel}
            onContentGenerated={handleContentGenerated}
          />
        </TabsContent>

        {/* Level Progression Tab */}
        <TabsContent value="progression">
          <LevelProgressionDashboard
            currentLevel={userLevel}
            onLevelUnlocked={handleLevelUnlocked}
          />
        </TabsContent>

        {/* Content Library Tab */}
        <TabsContent value="library">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Generated Content</CardTitle>
                <CardDescription>
                  Your recently generated learning materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentContent.length > 0 ? (
                  <div className="space-y-4">
                    {recentContent.map((content, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{content.title}</h4>
                            <Badge variant="outline">{content.level}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {content.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Duration: {content.estimated_duration}min</span>
                            <span>•</span>
                            <span>Generated recently</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content generated yet. Start by creating your first lesson!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{recentContent.length}</div>
                  <div className="text-sm text-muted-foreground">Generated Items</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{userLevel}</div>
                  <div className="text-sm text-muted-foreground">Current Level</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {recentContent.reduce((total, content) => total + content.estimated_duration, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Minutes</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Learning Features</CardTitle>
          <CardDescription>
            Discover what makes our AI content generation special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Cultural Awareness</h4>
              <p className="text-sm text-muted-foreground">
                Content specifically designed for Arabic speakers, with cultural context and relevant examples.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Level-Appropriate</h4>
              <p className="text-sm text-muted-foreground">
                Each piece of content is tailored to your exact CEFR level with appropriate vocabulary and grammar.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Progressive Learning</h4>
              <p className="text-sm text-muted-foreground">
                Complete assessments to unlock new levels and access more advanced content.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Multiple Formats</h4>
              <p className="text-sm text-muted-foreground">
                Generate lessons, conversations, role-plays, IELTS practice, and pronunciation guides.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Real-time Assessment</h4>
              <p className="text-sm text-muted-foreground">
                AI-generated assessments test your vocabulary, grammar, speaking, and listening skills.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Personalized Content</h4>
              <p className="text-sm text-muted-foreground">
                Specify topics, objectives, and duration to get content that matches your interests.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}