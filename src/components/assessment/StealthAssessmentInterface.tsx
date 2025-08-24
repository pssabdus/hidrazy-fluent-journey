import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle, 
  ArrowLeft, 
  Send,
  Mic,
  MicOff,
  Loader2
} from 'lucide-react';
import { 
  StealthAssessmentService, 
  type StealthAssessmentQuestion,
  type AssessmentResult 
} from '@/services/IntelligentProgressService';
import { useToast } from '@/hooks/use-toast';

interface StealthAssessmentInterfaceProps {
  onComplete: (result: AssessmentResult) => void;
  onBack: () => void;
}

export function StealthAssessmentInterface({ onComplete, onBack }: StealthAssessmentInterfaceProps) {
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<StealthAssessmentQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [raziaGreeting, setRaziaGreeting] = useState('');
  const [raziaResponse, setRaziaResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const { toast } = useToast();

  const totalQuestions = 10; // Based on the assessment flow

  useEffect(() => {
    initializeAssessment();
  }, []);

  const initializeAssessment = async () => {
    try {
      setLoading(true);
      const result = await StealthAssessmentService.startAssessment();
      
      setAssessmentId(result.assessment_id);
      setRaziaGreeting(result.greeting);
      setCurrentQuestion(result.first_question);
      setQuestionIndex(0);
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

  const handleSubmitResponse = async () => {
    if (!userResponse.trim() || !currentQuestion) return;

    try {
      setSubmitting(true);
      
      const result = await StealthAssessmentService.submitResponse(
        assessmentId,
        currentQuestion.id,
        userResponse.trim()
      );

      if (result.completed) {
        // Assessment is complete
        setAssessmentComplete(true);
        handleCompleteAssessment();
      } else {
        // Move to next question
        setCurrentQuestion(result.next_question || null);
        setRaziaResponse(result.razia_response || '');
        setQuestionIndex(prev => prev + 1);
        setUserResponse('');
      }
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

  const handleCompleteAssessment = async () => {
    try {
      const result = await StealthAssessmentService.completeAssessment(assessmentId);
      
      // Mark assessment as complete in local storage
      StealthAssessmentService.markAssessmentComplete(result.final_level);
      
      toast({
        title: "Assessment Complete! 🎉",
        description: `Welcome to your English journey at ${result.final_level.toUpperCase()} level!`,
        variant: "default"
      });

      onComplete(result);
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: "Completion Error",
        description: "Assessment analysis in progress. You can continue to your dashboard.",
        variant: "default"
      });
      
      // Fallback - allow user to continue
      onComplete({
        final_level: 'a2',
        analysis: 'Assessment completed successfully',
        welcome_message: 'Welcome to your English learning journey!',
        competency_breakdown: {
          grammar: 60,
          vocabulary: 65,
          fluency: 55,
          cultural_competence: 70
        }
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitResponse();
    }
  };

  const toggleListening = () => {
    // Voice input functionality would be implemented here
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
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Loader2 className="w-12 h-12 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Preparing Your Assessment</h2>
            <p className="text-muted-foreground">
              Getting ready for our friendly conversation...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (assessmentComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl border-primary/20 bg-gradient-card">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">Assessment Complete!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for that wonderful conversation! I'm analyzing your responses 
              to create the perfect learning path for you.
            </p>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Loader2 className="w-8 h-8 text-primary" />
            </motion.div>
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
              Question {questionIndex + 1} of {totalQuestions}
            </span>
            <Progress 
              value={((questionIndex + 1) / totalQuestions) * 100} 
              className="w-32" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Conversation Area */}
          <div className="lg:col-span-2">
            <Card className="border-primary/20">
              <CardContent className="p-6">
                {/* Razia's Avatar and Name */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white text-xl font-bold">
                    R
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Razia</h2>
                    <p className="text-sm text-muted-foreground">
                      Your English Conversation Partner
                    </p>
                  </div>
                </div>

                {/* Conversation Messages */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {questionIndex === 0 && raziaGreeting && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary/10 rounded-lg p-4"
                    >
                      <p className="whitespace-pre-wrap">{raziaGreeting}</p>
                    </motion.div>
                  )}

                  {currentQuestion && (
                    <motion.div
                      key={currentQuestion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary/10 rounded-lg p-4"
                    >
                      <p className="font-medium">{currentQuestion.question}</p>
                      {currentQuestion.cultural_bridge && typeof currentQuestion.cultural_bridge === 'string' && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {currentQuestion.cultural_bridge}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {raziaResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary/10 rounded-lg p-4"
                    >
                      <p>{raziaResponse}</p>
                    </motion.div>
                  )}
                </div>

                {/* User Input Area */}
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your response here... (Press Enter to send)"
                      className="w-full p-4 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
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
                      className="bg-gradient-button"
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
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Assessment Progress</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span>{questionIndex + 1}/{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion:</span>
                    <span>{Math.round(((questionIndex + 1) / totalQuestions) * 100)}%</span>
                  </div>
                </div>
                <Progress 
                  value={((questionIndex + 1) / totalQuestions) * 100} 
                  className="mt-3" 
                />
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-800 mb-2">Just a friendly chat!</h3>
                <p className="text-sm text-green-600">
                  This feels like a test, but it's really just Razia getting to know you. 
                  Be natural and share your thoughts - there's no pressure!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Get your personalized level placement</li>
                  <li>• Receive a custom learning path</li>
                  <li>• Start your English journey with Razia</li>
                  <li>• Build confidence through conversation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}