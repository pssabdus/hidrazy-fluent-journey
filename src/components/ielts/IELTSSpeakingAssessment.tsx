import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Play, Square, BarChart3, Clock, Target, Volume2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumGate } from '@/components/premium/PremiumGate';

interface SpeakingCriteria {
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
  overall: number;
}

interface SpeakingFeedback {
  criteria: SpeakingCriteria;
  transcript: string;
  highlights: Array<{
    text: string;
    type: 'good' | 'improvement';
    explanation: string;
  }>;
  suggestions: string[];
}

export function IELTSSpeakingAssessment() {
  const [currentPart, setCurrentPart] = useState<'part1' | 'part2' | 'part3'>('part1');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const speakingParts = {
    part1: {
      title: "Introduction & Interview",
      duration: "4-5 minutes",
      description: "General questions about yourself, family, work, studies, and interests",
      questions: [
        "Can you tell me your full name?",
        "Where are you from?",
        "Do you work or are you a student?",
        "What do you like about your hometown?",
        "Do you enjoy reading? Why/why not?"
      ]
    },
    part2: {
      title: "Long Turn",
      duration: "3-4 minutes (1 min prep + 2 min talk)",
      description: "Speak about a topic for 1-2 minutes after 1 minute preparation",
      topic: {
        title: "Describe a book you enjoyed reading",
        points: [
          "What the book was about",
          "When you read it",
          "Why you decided to read it",
          "And explain why you enjoyed reading it"
        ]
      }
    },
    part3: {
      title: "Discussion",
      duration: "4-5 minutes",
      description: "Abstract discussion related to Part 2 topic",
      questions: [
        "What kinds of books are popular in your country?",
        "Do you think people read less now than in the past?",
        "What are the advantages of reading books vs watching films?",
        "How important is it for children to read regularly?"
      ]
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setFeedback({
      criteria: {
        fluencyCoherence: 6.5,
        lexicalResource: 6.0,
        grammaticalRange: 6.5,
        pronunciation: 7.0,
        overall: 6.5
      },
      transcript: "Well, I'd like to tell you about a book that I really enjoyed reading recently. It was called 'The Seven Husbands of Evelyn Hugo' by Taylor Jenkins Reid. Um, it's basically about this, uh, famous actress from Hollywood's golden age who decides to finally tell her life story to a young journalist. The book explores her relationships, her career, and the secrets she's kept for decades...",
      highlights: [
        {
          text: "I'd like to tell you about",
          type: 'good',
          explanation: 'Good use of introductory phrase'
        },
        {
          text: "um... uh...",
          type: 'improvement',
          explanation: 'Try to reduce hesitation markers'
        },
        {
          text: "explores her relationships",
          type: 'good',
          explanation: 'Good vocabulary choice'
        }
      ],
      suggestions: [
        "Work on reducing hesitation markers (um, uh) through practice",
        "Excellent pronunciation - continue this strength",
        "Try to use more complex sentence structures",
        "Good fluency overall, just practice speaking without pauses"
      ]
    });
    
    setIsAnalyzing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCriteriaColor = (score: number) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <PremiumGate featureId="ielts_mastery">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">IELTS Speaking Assessment</h1>
          <p className="text-muted-foreground">Practice with AI examiner and get instant band scoring</p>
        </div>

        {/* Speaking Part Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Speaking Test Parts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={currentPart} onValueChange={(value) => setCurrentPart(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="part1">Part 1</TabsTrigger>
                <TabsTrigger value="part2">Part 2</TabsTrigger>
                <TabsTrigger value="part3">Part 3</TabsTrigger>
              </TabsList>
              
              {Object.entries(speakingParts).map(([key, part]) => (
                <TabsContent key={key} value={key} className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{part.duration}</Badge>
                      <Badge variant="outline">Speaking</Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">{part.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{part.description}</p>
                    </div>

                    {key === 'part2' && 'topic' in part ? (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-medium mb-2">{'topic' in part ? part.topic.title : ''}</h4>
                        <p className="text-sm text-muted-foreground mb-2">You should say:</p>
                        <ul className="text-sm space-y-1">
                          {'topic' in part && part.topic.points.map((point, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span>•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Sample questions:</p>
                        <ul className="text-sm space-y-2">
                          {(part as any).questions.map((question: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <Volume2 className="h-3 w-3 text-muted-foreground" />
                              {question}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Recording Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Record Your Response</CardTitle>
            <CardDescription>
              Speak clearly into your microphone and get AI-powered feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative">
                <motion.div
                  className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    isRecording ? 'bg-red-500' : 'bg-primary'
                  }`}
                  animate={{
                    scale: isRecording ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: isRecording ? Infinity : 0,
                  }}
                >
                  {isRecording ? (
                    <Square className="h-8 w-8 text-white" />
                  ) : (
                    <Mic className="h-8 w-8 text-white" />
                  )}
                </motion.div>
                
                {isRecording && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">{formatTime(recordingTime)}</div>
                      <div className="text-xs text-muted-foreground">Recording...</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className="gap-2"
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </>
                )}
              </Button>

              {hasRecording && !isRecording && (
                <>
                  <Button variant="outline" className="gap-2">
                    <Play className="h-4 w-4" />
                    Play Back
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4" />
                        Analyze Speech
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>

            {hasRecording && (
              <div className="text-center text-sm text-muted-foreground">
                Recording completed • {formatTime(recordingTime)} • Ready for analysis
              </div>
            )}
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
                  Speaking Band Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{feedback.criteria.overall}</div>
                    <div className="text-sm text-muted-foreground">Overall</div>
                  </div>
                  
                  {[
                    { name: 'Fluency & Coherence', score: feedback.criteria.fluencyCoherence },
                    { name: 'Lexical Resource', score: feedback.criteria.lexicalResource },
                    { name: 'Grammar & Accuracy', score: feedback.criteria.grammaticalRange },
                    { name: 'Pronunciation', score: feedback.criteria.pronunciation }
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

            {/* Transcript with Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Speech Transcript & Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {feedback.transcript.split(' ').map((word, index) => {
                      const highlight = feedback.highlights.find(h => h.text.includes(word));
                      if (highlight) {
                        return (
                          <span
                            key={index}
                            className={`${
                              highlight.type === 'good' 
                                ? 'bg-green-100 text-green-800 border-b-2 border-green-500' 
                                : 'bg-yellow-100 text-yellow-800 border-b-2 border-yellow-500'
                            } px-1 rounded cursor-help`}
                            title={highlight.explanation}
                          >
                            {word}
                          </span>
                        );
                      }
                      return <span key={index}>{word} </span>;
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </PremiumGate>
  );
}