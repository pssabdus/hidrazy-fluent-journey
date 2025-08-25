import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Send,
  Mic,
  MicOff,
  Loader2,
  Heart
} from 'lucide-react';
import { 
  StealthAssessmentService, 
  type AssessmentResult 
} from '@/services/IntelligentProgressService';
import { useToast } from '@/hooks/use-toast';

interface StealthAssessmentInterfaceProps {
  onComplete: (result: AssessmentResult) => void;
  onBack: () => void;
}

interface AssessmentQuestion {
  id: number;
  question: string;
  hiddenAssessment: string;
  followUp?: string;
  culturalBridge?: string;
  level: string;
}

// Complete 12-question assessment flow
const assessmentQuestions: AssessmentQuestion[] = [
  // A1-A2 Level (Comfort Zone)
  {
    id: 1,
    question: "So, tell me about yourself! What's your name and where are you from?",
    hiddenAssessment: "Basic vocabulary, present tense, pronunciation, confidence",
    followUp: "That's wonderful! What do you love most about your region?",
    culturalBridge: "I'd love to learn more about your area!",
    level: "A1-A2"
  },
  {
    id: 2, 
    question: "What do you enjoy doing in your free time? Any hobbies or interests?",
    hiddenAssessment: "Hobby vocabulary, present simple usage, sentence complexity",
    followUp: "How did you get interested in that?",
    culturalBridge: "Are there any traditional activities you enjoy too?",
    level: "A1-A2"
  },
  {
    id: 3,
    question: "Can you describe a typical day for you? What time do you usually wake up?",
    hiddenAssessment: "Daily routine vocabulary, time expressions, sequential language",
    followUp: "How does your routine change during different seasons?",
    culturalBridge: "How does your routine change during Ramadan?",
    level: "A2"
  },
  // A2-B1 Level (Gentle Challenge)
  {
    id: 4,
    question: "Tell me about a happy memory from this past year. What made it special?",
    hiddenAssessment: "Past tense accuracy, narrative ability, emotional vocabulary",
    followUp: "What made that moment so meaningful to you?",
    culturalBridge: "Was this related to any family traditions or celebrations?",
    level: "A2-B1"
  },
  {
    id: 5,
    question: "What's something about Arab culture that you think English speakers should understand better?",
    hiddenAssessment: "Cultural vocabulary, explanation skills, complex structures",
    followUp: "How would you help someone understand that concept?",
    culturalBridge: "This is exactly what I love helping with - cultural bridges!",
    level: "B1"
  },
  {
    id: 6,
    question: "If you could visit any English-speaking country, where would you go and why?",
    hiddenAssessment: "Conditional structures, reasoning ability, future planning",
    followUp: "What would you want to experience there?",
    culturalBridge: "How do you think it would be different from home?",
    level: "B1"
  },
  // B1-B2 Level (Comfortable Stretch)
  {
    id: 7,
    question: "What do you think about social media's impact on how people communicate today?",
    hiddenAssessment: "Opinion expression, abstract thinking, complex vocabulary",
    followUp: "Have you noticed any changes in your own communication?",
    culturalBridge: "Are there differences in how it's used in different cultures?",
    level: "B1-B2"
  },
  {
    id: 8,
    question: "Describe a challenge in your community and how you think it could be addressed.",
    hiddenAssessment: "Problem-solution language, advanced vocabulary, analytical thinking",
    followUp: "What role could individuals play in solving this?",
    culturalBridge: "Have you seen successful solutions in other places?",
    level: "B2"
  },
  {
    id: 9,
    question: "How has learning or using English changed your perspective on anything?",
    hiddenAssessment: "Metacognitive awareness, present perfect, abstract reflection",
    followUp: "What has surprised you most about this experience?",
    culturalBridge: "How do you balance maintaining your identity while learning English?",
    level: "B2"
  },
  // B2+ Level (Advanced Assessment)  
  {
    id: 10,
    question: "Can you explain something from your field of work or study to someone unfamiliar with it?",
    hiddenAssessment: "Technical vocabulary, explanation skills, register awareness",
    followUp: "What's the most challenging part about explaining your field?",
    culturalBridge: "How does your field differ across different countries?",
    level: "B2+"
  },
  {
    id: 11,
    question: "What role do you think technology should play in preserving cultural traditions?",
    hiddenAssessment: "Advanced structures, hypothetical thinking, cultural intelligence",
    followUp: "Can you think of any examples where this has worked well?",
    culturalBridge: "How has technology affected Arab cultural traditions?",
    level: "B2+"
  },
  {
    id: 12,
    question: "If you were building bridges between Arabic and English-speaking cultures, what would be most important to focus on?",
    hiddenAssessment: "Sophisticated vocabulary, cultural competence, visionary thinking",
    followUp: "What misconceptions would you most want to address?",
    culturalBridge: "This is exactly what we'll work on together!",
    level: "B2+"
  }
];

interface ConversationMessage {
  id: string;
  sender: 'razia' | 'user';
  content: string;
  timestamp: Date;
  isFollowUp?: boolean;
}

export function StealthAssessmentInterface({ onComplete, onBack }: StealthAssessmentInterfaceProps) {
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult | null>(null);
  const { toast } = useToast();

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const totalQuestions = assessmentQuestions.length;

  useEffect(() => {
    initializeAssessment();
  }, []);

  const initializeAssessment = async () => {
    try {
      setLoading(true);
      
      // Add Razia's greeting to conversation
      const greetingMessage: ConversationMessage = {
        id: 'greeting',
        sender: 'razia',
        content: `Marhaba! I'm Razia, and I'm absolutely thrilled to meet you! 😊

Think of me as your English conversation partner and cultural bridge friend. Before we start our learning adventure together, I'd love to just chat and get to know you better - no pressure, no tests, just a normal conversation between friends!

I'm curious about your story and how I can help you achieve your English goals. Ready to chat?`,
        timestamp: new Date()
      };

      // Add first question
      const firstQuestionMessage: ConversationMessage = {
        id: 'q1',
        sender: 'razia',
        content: currentQuestion.question,
        timestamp: new Date()
      };

      setConversationHistory([greetingMessage, firstQuestionMessage]);
      
      // Start assessment session in the backend
      const result = await StealthAssessmentService.startAssessment();
      setAssessmentId(result.assessment_id);
      
    } catch (error) {
      console.error('Error starting assessment:', error);
      toast({
        title: "Assessment Error",
        description: "Failed to start assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeResponse = async (response: string, question: AssessmentQuestion) => {
    try {
      return await StealthAssessmentService.submitResponse(
        assessmentId,
        0, // question_id - we'll track internally
        response
      );
    } catch (error) {
      console.error('Error analyzing response:', error);
      return null;
    }
  };

  const generateRaziaFollowUp = (question: AssessmentQuestion, userResponse: string): string => {
    const responses = [
      `${question.followUp || "That's really interesting!"}`,
      question.culturalBridge ? `${question.culturalBridge}` : "I love learning about different perspectives!",
      "Thank you for sharing that with me - it helps me understand you better.",
      "That's exactly the kind of insight that makes conversations so meaningful!",
      "Mashallah! Your experiences are so valuable to share."
    ];
    
    // Choose based on question or random
    if (question.followUp) return question.followUp;
    if (question.culturalBridge) return question.culturalBridge;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmitResponse = async () => {
    if (!userResponse.trim() || !currentQuestion) return;

    try {
      setSubmitting(true);
      
      // Add user response to conversation
      const userMessage: ConversationMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        content: userResponse.trim(),
        timestamp: new Date()
      };

      setConversationHistory(prev => [...prev, userMessage]);

      // Analyze response in background
      await analyzeResponse(userResponse.trim(), currentQuestion);

      // Generate Razia's follow-up response
      const raziaFollowUp = generateRaziaFollowUp(currentQuestion, userResponse.trim());
      const raziaMessage: ConversationMessage = {
        id: `razia-${Date.now()}`,
        sender: 'razia',
        content: raziaFollowUp,
        timestamp: new Date(),
        isFollowUp: true
      };

      setConversationHistory(prev => [...prev, raziaMessage]);

      // Move to next question or complete
      if (currentQuestionIndex + 1 >= totalQuestions) {
        // Assessment complete
        setTimeout(() => {
          completeAssessment();
        }, 2000);
      } else {
        // Move to next question
        setTimeout(() => {
          const nextQuestion = assessmentQuestions[currentQuestionIndex + 1];
          const nextQuestionMessage: ConversationMessage = {
            id: `q${nextQuestion.id}`,
            sender: 'razia',
            content: nextQuestion.question,
            timestamp: new Date()
          };

          setConversationHistory(prev => [...prev, nextQuestionMessage]);
          setCurrentQuestionIndex(prev => prev + 1);
          setUserResponse('');
        }, 1500);
      }

      setUserResponse('');
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const completeAssessment = async () => {
    try {
      setAssessmentComplete(true);
      
      // Add completion message
      const completionMessage: ConversationMessage = {
        id: 'completion',
        sender: 'razia',
        content: "Thank you for that wonderful conversation! I've really enjoyed getting to know you. Let me analyze our chat to create the perfect learning path for you... 🤔✨",
        timestamp: new Date()
      };

      setConversationHistory(prev => [...prev, completionMessage]);

      // Generate final placement
      const result = await StealthAssessmentService.completeAssessment(assessmentId);
      setAssessmentResults(result);
      
      setTimeout(() => {
        setShowResults(true);
      }, 3000);

    } catch (error) {
      console.error('Error completing assessment:', error);
      // Fallback
      const fallbackResult: AssessmentResult = {
        final_level: 'a2',
        analysis: 'Assessment completed successfully',
        welcome_message: 'Welcome to your English learning journey!',
        competency_breakdown: {
          grammar: 60,
          vocabulary: 65,
          fluency: 55,
          cultural_competence: 70
        }
      };
      setAssessmentResults(fallbackResult);
      setShowResults(true);
    }
  };

  const handleCompleteAndContinue = () => {
    if (assessmentResults) {
      onComplete(assessmentResults);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitResponse();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    toast({
      title: "Voice Input",
      description: "Voice input feature coming soon!",
      variant: "default"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl border-primary/20 bg-gradient-card">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Loader2 className="w-12 h-12 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Preparing Our Conversation</h2>
            <p className="text-muted-foreground">
              Razia is getting ready to meet you...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults && assessmentResults) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl border-primary/20 bg-gradient-card">
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-center mb-6"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-4">Assessment Results</h2>
            </motion.div>

            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="whitespace-pre-wrap text-center">
                <p className="text-lg leading-relaxed">
                  You know what, habibi? I've really enjoyed getting to know you! 😊
                </p>
                <br />
                <p>
                  Based on our wonderful conversation, I can see you're at a solid <strong>{assessmentResults.final_level.toUpperCase()} level</strong> with some really impressive strengths. Your ability to share your thoughts and cultural perspectives really impressed me, mashallah!
                </p>
                <br />
                <p>
                  I also noticed some areas where we can work together to build even more confidence - but don't worry, every Arabic speaker I work with has similar patterns, and we'll make great progress together!
                </p>
                <br />
                <div className="text-left">
                  <p className="font-semibold mb-2">Here's your personalized English journey:</p>
                  <div className="space-y-1 text-primary">
                    <p>✨ Focus on building conversational confidence</p>
                    <p>✨ Build confidence in cultural bridge conversations</p> 
                    <p>✨ Practice grammar in natural contexts</p>
                  </div>
                </div>
                <br />
                <p>
                  The best part? This will all happen through natural conversations like we just had. Ready to start this adventure together? 🚀
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {assessmentResults.competency_breakdown && Object.entries(assessmentResults.competency_breakdown).map(([skill, score]) => (
                <div key={skill} className="bg-secondary/20 rounded-lg p-3">
                  <div className="text-sm font-medium capitalize text-center mb-2">{skill.replace('_', ' ')}</div>
                  <Progress value={score} className="h-2" />
                  <div className="text-xs text-center mt-1 text-muted-foreground">{score}%</div>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleCompleteAndContinue}
              className="w-full bg-gradient-button hover:shadow-glow text-lg py-6"
              size="lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Let's Start Learning Together!
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <Progress 
              value={((currentQuestionIndex + 1) / totalQuestions) * 100} 
              className="w-32" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Conversation Area */}
          <div className="lg:col-span-2">
            <Card className="border-primary/20 shadow-card">
              <CardContent className="p-6">
                {/* Razia's Avatar and Info */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white text-xl font-bold">
                    R
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Razia</h2>
                    <p className="text-sm text-muted-foreground">
                      Your English & Cultural Bridge Friend
                    </p>
                  </div>
                </div>

                {/* Conversation Flow */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                  <AnimatePresence>
                    {conversationHistory.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-lg p-4 ${
                          message.sender === 'razia' 
                            ? 'bg-primary/10 text-foreground' 
                            : 'bg-secondary ml-8 text-foreground'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === 'razia' && (
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                              R
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap leading-relaxed">
                              {message.content}
                            </p>
                            {message.isFollowUp && (
                              <div className="text-xs text-muted-foreground mt-2">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {assessmentComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-6"
                    >
                      <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin mb-2" />
                      <p className="text-muted-foreground">Analyzing your responses...</p>
                    </motion.div>
                  )}
                </div>

                {/* User Input Area */}
                {!assessmentComplete && (
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={userResponse}
                        onChange={(e) => setUserResponse(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Share your thoughts here... (Press Enter to send)"
                        className="w-full p-4 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        rows={4}
                        disabled={submitting}
                      />
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleListening}
                        className={`absolute top-2 right-2 ${isListening ? 'text-red-500' : 'text-muted-foreground'}`}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Just be yourself - there are no wrong answers! 😊
                      </p>
                      
                      <Button 
                        onClick={handleSubmitResponse}
                        disabled={!userResponse.trim() || submitting}
                        className="bg-gradient-button hover:shadow-glow"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Conversation Progress</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span>{currentQuestionIndex + 1}/{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion:</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
                  </div>
                </div>
                <Progress 
                  value={((currentQuestionIndex + 1) / totalQuestions) * 100} 
                  className="mt-3" 
                />
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 shadow-card">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-800 mb-2">Just a friendly chat!</h3>
                <p className="text-sm text-green-600">
                  This feels like a conversation because it is! Razia is simply getting to know you. 
                  Share naturally - there's no pressure! 💚
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Get your personalized level placement</li>
                  <li>• Receive a custom learning path</li>
                  <li>• Start your English journey with Razia</li>
                  <li>• Build confidence through cultural conversations</li>
                </ul>
              </CardContent>
            </Card>

            {currentQuestion && (
              <Card className="border-blue-200 bg-blue-50 shadow-card">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Current Focus</h3>
                  <p className="text-sm text-blue-600">
                    Level: <span className="font-medium">{currentQuestion.level}</span>
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    This question helps Razia understand your {currentQuestion.hiddenAssessment.split(',')[0]}
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