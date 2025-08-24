import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Send, Eye, BarChart3, CheckCircle, AlertTriangle, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumGate } from '@/components/premium/PremiumGate';

interface WritingCriteria {
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  overall: number;
}

interface WritingFeedback {
  criteria: WritingCriteria;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  bandDescriptor: string;
}

export function IELTSWritingFeedback() {
  const [currentTask, setCurrentTask] = useState<'task1' | 'task2'>('task1');
  const [response, setResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);

  const task1Prompt = `The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`;

  const task2Prompt = `Some people think that children should be taught to be competitive in school. Others, however, say that cooperation and team working skills are more important.

Discuss both these views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`;

  const handleAnalyze = async () => {
    if (!response.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock feedback
    setFeedback({
      criteria: {
        taskAchievement: 6.0,
        coherenceCohesion: 6.5,
        lexicalResource: 5.5,
        grammaticalRange: 6.0,
        overall: 6.0
      },
      strengths: [
        "Clear structure with introduction, body paragraphs, and conclusion",
        "Good use of linking words to connect ideas",
        "Addresses the main requirements of the task",
        "Some variety in sentence structures"
      ],
      improvements: [
        "Limited range of vocabulary - consider using more sophisticated words",
        "Some grammatical errors affecting clarity",
        "Could provide more specific examples to support arguments",
        "Conclusion could be stronger and more decisive"
      ],
      suggestions: [
        "Practice using more advanced vocabulary for common topics",
        "Review complex sentence structures and practice using them",
        "Develop a bank of relevant examples for different essay topics",
        "Work on writing more impactful conclusions"
      ],
      bandDescriptor: "This response demonstrates a generally adequate control of language with some lapses in accuracy and appropriateness."
    });
    
    setIsAnalyzing(false);
  };

  const getCriteriaColor = (score: number) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const wordCount = response.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minWords = currentTask === 'task1' ? 150 : 250;

  return (
    <PremiumGate featureId="ielts_mastery">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">IELTS Writing Feedback</h1>
          <p className="text-muted-foreground">Get AI-powered feedback on your writing with detailed band scoring</p>
        </div>

        {/* Task Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Writing Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTask} onValueChange={(value) => setCurrentTask(value as 'task1' | 'task2')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="task1">Task 1 - Data Description</TabsTrigger>
                <TabsTrigger value="task2">Task 2 - Essay</TabsTrigger>
              </TabsList>
              
              <TabsContent value="task1" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Academic</Badge>
                    <Badge variant="outline">150+ words</Badge>
                    <Badge variant="outline">20 minutes</Badge>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm whitespace-pre-line">{task1Prompt}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="task2" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Academic/General</Badge>
                    <Badge variant="outline">250+ words</Badge>
                    <Badge variant="outline">40 minutes</Badge>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm whitespace-pre-line">{task2Prompt}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Writing Area */}
        <Card>
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
            <CardDescription>
              Write your response below and get instant AI feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Start writing your response here..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-[300px] resize-y"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className={wordCount >= minWords ? 'text-green-600' : 'text-red-600'}>
                    {wordCount} words
                  </span>
                  <span className="text-muted-foreground"> / {minWords} minimum</span>
                </div>
                {wordCount < minWords && (
                  <Badge variant="outline" className="text-red-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Below minimum
                  </Badge>
                )}
                {wordCount >= minWords && (
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Word count met
                  </Badge>
                )}
              </div>
              
              <Button 
                onClick={handleAnalyze}
                disabled={!response.trim() || isAnalyzing}
                className="gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Get Feedback
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Results */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Band Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Band Score Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{feedback.criteria.overall}</div>
                    <div className="text-sm text-muted-foreground">Overall</div>
                  </div>
                  
                  {[
                    { name: 'Task Achievement', score: feedback.criteria.taskAchievement },
                    { name: 'Coherence & Cohesion', score: feedback.criteria.coherenceCohesion },
                    { name: 'Lexical Resource', score: feedback.criteria.lexicalResource },
                    { name: 'Grammar & Accuracy', score: feedback.criteria.grammaticalRange }
                  ].map((criterion) => (
                    <div key={criterion.name} className="text-center">
                      <div className={`text-2xl font-bold ${getCriteriaColor(criterion.score)}`}>
                        {criterion.score}
                      </div>
                      <div className="text-xs text-muted-foreground">{criterion.name}</div>
                      <Progress value={(criterion.score / 9) * 100} className="h-2 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <AlertTriangle className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <BarChart3 className="h-5 w-5" />
                    Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Band Descriptor */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-blue-700">Band Descriptor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">{feedback.bandDescriptor}</p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Save Feedback
              </Button>
              <Button className="gap-2">
                <Edit3 className="h-4 w-4" />
                Try Another Task
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </PremiumGate>
  );
}