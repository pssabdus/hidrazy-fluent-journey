import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Clock, Book, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IELTSQuestion {
  id: string;
  type: 'listening' | 'reading' | 'writing' | 'speaking';
  section: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  timeLimit?: number;
  bandDescriptors: {
    band9: string;
    band7: string;
    band5: string;
  };
}

interface IELTSAssessmentEngineProps {
  targetBand: number;
  onComplete: (results: any) => void;
}

export function IELTSAssessmentEngine({ targetBand, onComplete }: IELTSAssessmentEngineProps) {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentSection, setCurrentSection] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening');

  // Sample IELTS questions - in production, these would come from a database
  const questions: IELTSQuestion[] = [
    {
      id: 'L1',
      type: 'listening',
      section: 'Section 1: Everyday Conversation',
      question: 'What is the main purpose of the phone call?',
      options: [
        'To book a hotel room',
        'To cancel a reservation',
        'To ask about room availability',
        'To complain about service'
      ],
      correctAnswer: 'To book a hotel room',
      timeLimit: 60,
      bandDescriptors: {
        band9: 'Identifies main purpose with full understanding of context and nuance',
        band7: 'Clearly identifies main purpose with good understanding',
        band5: 'Identifies main purpose with some understanding'
      }
    },
    {
      id: 'R1',
      type: 'reading',
      section: 'Academic Reading: Passage 1',
      question: 'According to the passage, what is the primary factor in climate change?',
      options: [
        'Natural weather patterns',
        'Human activities',
        'Solar radiation changes',
        'Ocean current shifts'
      ],
      correctAnswer: 'Human activities',
      timeLimit: 180,
      bandDescriptors: {
        band9: 'Accurately identifies key information with sophisticated understanding',
        band7: 'Identifies key information with good comprehension',
        band5: 'Identifies basic information with adequate understanding'
      }
    },
    {
      id: 'W1',
      type: 'writing',
      section: 'Task 1: Academic Writing',
      question: 'Describe the trends shown in the graph about renewable energy usage from 2010-2020.',
      timeLimit: 1200, // 20 minutes
      bandDescriptors: {
        band9: 'Excellent task achievement with sophisticated language and perfect organization',
        band7: 'Good task achievement with appropriate language and clear organization',
        band5: 'Adequate task achievement with simple language and basic organization'
      }
    },
    {
      id: 'S1',
      type: 'speaking',
      section: 'Part 1: Introduction and Interview',
      question: 'Tell me about your hometown. What do you like most about it?',
      timeLimit: 120,
      bandDescriptors: {
        band9: 'Fluent and natural with sophisticated vocabulary and perfect pronunciation',
        band7: 'Generally fluent with good vocabulary and clear pronunciation',
        band5: 'Some fluency with adequate vocabulary and comprehensible pronunciation'
      }
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isActive && timeRemaining === 0) {
      handleNextQuestion();
    }
  }, [isActive, timeRemaining]);

  const startAssessment = () => {
    setIsActive(true);
    setTimeRemaining(currentQuestion.timeLimit || 60);
    toast({
      title: "IELTS Assessment Started",
      description: "Answer each question to the best of your ability",
    });
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(questions[currentQuestionIndex + 1].timeLimit || 60);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = () => {
    setIsActive(false);
    
    // Calculate results
    const results = calculateResults();
    
    toast({
      title: "Assessment Complete!",
      description: `Your estimated IELTS band: ${results.overallBand}`,
    });
    
    onComplete(results);
  };

  const calculateResults = () => {
    let totalScore = 0;
    let correctAnswers = 0;
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
        totalScore += getBandScore(question.type);
      }
    });
    
    const accuracy = (correctAnswers / questions.length) * 100;
    const overallBand = Math.min(9, Math.max(1, Math.round((accuracy / 100) * 9)));
    
    return {
      overallBand,
      accuracy,
      correctAnswers,
      totalQuestions: questions.length,
      sectionScores: {
        listening: getBandScore('listening'),
        reading: getBandScore('reading'),
        writing: getBandScore('writing'),
        speaking: getBandScore('speaking')
      },
      recommendations: generateRecommendations(overallBand, targetBand)
    };
  };

  const getBandScore = (type: string) => {
    // Simplified band calculation - in production, this would be more sophisticated
    const userAnswer = answers[questions.find(q => q.type === type)?.id || ''];
    const correctAnswer = questions.find(q => q.type === type)?.correctAnswer;
    return userAnswer === correctAnswer ? 7 : 5;
  };

  const generateRecommendations = (currentBand: number, targetBand: number) => {
    const gap = targetBand - currentBand;
    
    if (gap <= 0) {
      return [
        "Excellent work! You're already at or above your target band.",
        "Focus on maintaining your level with regular practice.",
        "Consider taking practice tests under exam conditions."
      ];
    } else if (gap <= 1) {
      return [
        "You're very close to your target! Focus on weak areas.",
        "Practice time management for all sections.",
        "Work on advanced vocabulary and complex grammar structures."
      ];
    } else {
      return [
        "Build foundational skills across all four sections.",
        "Focus on basic grammar and essential vocabulary.",
        "Practice regularly with structured lessons.",
        "Consider intensive preparation courses."
      ];
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">IELTS Assessment Engine</h2>
          <Badge variant="outline" className="text-sm">
            Target Band: {targetBand}
          </Badge>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          {isActive && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(timeRemaining)}
            </span>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isActive && currentQuestionIndex === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 text-center">
              <Book className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-4">Ready for your IELTS Assessment?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                This assessment will test your English skills across all four IELTS sections: 
                Listening, Reading, Writing, and Speaking.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto text-sm">
                <div className="text-left">
                  <p><strong>Duration:</strong> ~30 minutes</p>
                  <p><strong>Questions:</strong> {questions.length}</p>
                </div>
                <div className="text-left">
                  <p><strong>Target Band:</strong> {targetBand}</p>
                  <p><strong>Format:</strong> Adaptive</p>
                </div>
              </div>
              <Button onClick={startAssessment} size="lg" className="bg-primary">
                Start Assessment
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  {currentQuestion.type.toUpperCase()}
                </Badge>
                <h3 className="text-lg font-semibold">{currentQuestion.section}</h3>
              </div>

              <div className="mb-6">
                <p className="text-lg mb-4">{currentQuestion.question}</p>
                
                {currentQuestion.options && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={answers[currentQuestion.id] === option ? "default" : "outline"}
                        className="w-full text-left justify-start h-auto p-4"
                        onClick={() => handleAnswerSelect(option)}
                      >
                        <span className="mr-3 font-medium">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'writing' && (
                  <div className="mt-4">
                    <textarea
                      className="w-full h-40 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Write your response here..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Minimum 150 words recommended
                    </p>
                  </div>
                )}

                {currentQuestion.type === 'speaking' && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      For this speaking question, you would normally record your response. 
                      For this demo, please type your main points:
                    </p>
                    <textarea
                      className="w-full h-20 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Key points of your speaking response..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Target: Band {targetBand}
                </div>
                
                <Button
                  onClick={handleNextQuestion}
                  disabled={!answers[currentQuestion.id]}
                  className="ml-auto"
                >
                  {currentQuestionIndex === questions.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Assessment
                    </>
                  ) : (
                    'Next Question'
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}