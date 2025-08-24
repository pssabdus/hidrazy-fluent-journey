import { useState } from 'react';
import { motion } from 'framer-motion';
import { LessonInterface } from '@/components/lesson/LessonInterface';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Users, BookOpen } from 'lucide-react';

interface LessonDemoProps {
  onClose: () => void;
}

export function LessonDemo({ onClose }: LessonDemoProps) {
  const [showLesson, setShowLesson] = useState(false);

  if (showLesson) {
    return (
      <LessonInterface
        lessonId="demo-conversation-1"
        lessonType="conversation"
        title="Restaurant Conversation Practice"
        difficulty="intermediate"
        estimatedTimeMinutes={15}
        onExit={onClose}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <Card className="overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🎓
                </motion.div>
                <h1 className="text-3xl font-bold">Experience Razia's Interactive Lessons</h1>
                <p className="text-blue-100 text-lg">
                  Immersive English learning with AI-powered conversation practice
                </p>
              </div>
            </div>

            {/* Demo Lesson Card */}
            <div className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Restaurant Conversation Practice
                  </h2>
                  <p className="text-gray-600">
                    Practice ordering food and having conversations in a restaurant setting
                  </p>
                </div>

                {/* Lesson Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Duration</div>
                      <div className="text-sm text-gray-600">15 minutes</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <Users className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Level</div>
                      <div className="text-sm text-gray-600">Intermediate</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Type</div>
                      <div className="text-sm text-gray-600">Conversation</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Experience:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "🎤 Voice interaction with Razia",
                      "💬 Real-time conversation practice",
                      "✨ Instant grammar corrections",
                      "🔊 Natural voice responses",
                      "📊 Progress tracking",
                      "🌍 Cultural context insights"
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center space-x-2"
                      >
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Razia Introduction */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl">
                      😊
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-2">Meet Razia</h4>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        "Ahlan! I'm Razia, your personal English teacher. I understand Arabic culture and will help you practice English naturally through real conversations. I'll gently correct your mistakes and celebrate your progress!"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => setShowLesson(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Demo Lesson
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onClose}
                    className="px-8 py-3"
                  >
                    Back to Dashboard
                  </Button>
                </div>

                {/* Note */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    * This is a demonstration. Sign up to access the full lesson library.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}