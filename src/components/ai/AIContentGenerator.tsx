import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, BookOpen, MessageSquare, Users, FileText, Mic, ClipboardCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { aiContentService, ContentRequest, GeneratedContent, CEFRLevel, ContentType } from '@/services/AIContentService';

const CONTENT_TYPE_ICONS = {
  lesson: BookOpen,
  conversation: MessageSquare,
  roleplay: Users,
  ielts: FileText,
  pronunciation: Mic,
  assessment: ClipboardCheck
};

const CONTENT_TYPE_LABELS = {
  lesson: 'Lesson',
  conversation: 'Conversation',
  roleplay: 'Role-play',
  ielts: 'IELTS Practice',
  pronunciation: 'Pronunciation',
  assessment: 'Assessment'
};

interface AIContentGeneratorProps {
  userLevel: CEFRLevel;
  onContentGenerated?: (content: GeneratedContent) => void;
}

export const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  userLevel,
  onContentGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [formData, setFormData] = useState<ContentRequest>({
    content_type: 'lesson',
    level: userLevel,
    topic: '',
    cultural_context: 'Arabic-speaking learners',
    learning_objectives: [],
    duration_minutes: 15
  });

  const [objectivesInput, setObjectivesInput] = useState('');

  useEffect(() => {
    setFormData(prev => ({ ...prev, level: userLevel }));
  }, [userLevel]);

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for the content generation.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const objectives = objectivesInput
        .split('\n')
        .map(obj => obj.trim())
        .filter(obj => obj.length > 0);

      const request = {
        ...formData,
        learning_objectives: objectives.length > 0 ? objectives : undefined
      };

      const content = await aiContentService.generateContent(request);
      setGeneratedContent(content);
      onContentGenerated?.(content);

      toast({
        title: "Content Generated Successfully!",
        description: `Generated ${CONTENT_TYPE_LABELS[formData.content_type]} for ${formData.level} level.`
      });
    } catch (error) {
      console.error('Content generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate content.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof ContentRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const IconComponent = CONTENT_TYPE_ICONS[formData.content_type];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate personalized learning content using AI, specifically designed for Arabic speakers learning English.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content Type</label>
              <Select
                value={formData.content_type}
                onValueChange={(value: ContentType) => handleInputChange('content_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONTENT_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Level</label>
              <Select
                value={formData.level}
                onValueChange={(value: CEFRLevel) => handleInputChange('level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Topic</label>
            <Input
              placeholder="Enter the topic or theme for your content..."
              value={formData.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Learning Objectives (optional)
            </label>
            <Textarea
              placeholder="Enter learning objectives, one per line..."
              value={objectivesInput}
              onChange={(e) => setObjectivesInput(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
              <Input
                type="number"
                min="5"
                max="120"
                value={formData.duration_minutes}
                onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 15)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Cultural Context</label>
              <Input
                placeholder="Arabic-speaking learners"
                value={formData.cultural_context}
                onChange={(e) => handleInputChange('cultural_context', e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.topic.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                Generate {CONTENT_TYPE_LABELS[formData.content_type]}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {generatedContent.title}
              <Badge variant="secondary">{generatedContent.level}</Badge>
            </CardTitle>
            <CardDescription>{generatedContent.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Duration: {generatedContent.estimated_duration} minutes</span>
                <span>•</span>
                <span>Type: {CONTENT_TYPE_LABELS[formData.content_type]}</span>
              </div>

              {generatedContent.metadata && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Vocabulary Focus</h4>
                    <div className="flex flex-wrap gap-1">
                      {generatedContent.metadata.vocabulary_focus?.map((word, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Grammar Focus</h4>
                    <div className="flex flex-wrap gap-1">
                      {generatedContent.metadata.grammar_focus?.map((grammar, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {grammar}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Generated Content</h4>
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(generatedContent.content, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};