import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Target, Zap, Book, Mic, Headphones, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LessonPlayer } from '@/components/exercises/LessonPlayer';
import { ExerciseRenderer } from '@/components/exercises/ExerciseRenderer';
import { BaseExercise, VocabularyExercise } from '@/types/exercises';

interface Chapter {
  id: string;
  title: string;
  duration: number;
  exercises: BaseExercise[];
  completed: boolean;
}

export function ExerciseHub() {
  const [currentView, setCurrentView] = useState<'hub' | 'lesson'>('hub');
  const [selectedExerciseType, setSelectedExerciseType] = useState<string>('');
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Mock exercise data
  const mockVocabularyExercise: VocabularyExercise = {
    id: 'vocab-1',
    type: 'vocabulary',
    title: 'Daily Conversation Vocabulary',
    instructions: 'Learn essential words for everyday conversations',
    difficulty: 'intermediate',
    estimatedDuration: 15,
    points: 50,
    completed: false,
    progress: 0,
    flashcards: [
      {
        id: '1',
        word: 'greetings',
        definition: 'expressions used when meeting someone',
        example: 'Common greetings include "hello" and "good morning"',
        partOfSpeech: 'noun',
        phonetic: 'ˈɡriːtɪŋz'
      },
      {
        id: '2', 
        word: 'conversation',
        definition: 'an informal talk between two or more people',
        example: 'We had a long conversation about travel',
        partOfSpeech: 'noun',
        phonetic: 'ˌkɒnvəˈseɪʃən'
      },
      {
        id: '3',
        word: 'appreciate',
        definition: 'to recognize the value or significance of something',
        example: 'I really appreciate your help with this project',
        partOfSpeech: 'verb',
        phonetic: 'əˈpriːʃieɪt'
      }
    ],
    spacedRepetition: []
  };

  const mockSpeakingExercise: BaseExercise = {
    id: 'speak-1',
    type: 'speaking',
    title: 'Pronunciation Practice',
    instructions: 'Practice pronouncing common English sounds',
    difficulty: 'beginner',
    estimatedDuration: 10,
    points: 40,
    completed: false,
    progress: 0
  };

  const mockListeningExercise: BaseExercise = {
    id: 'listen-1',
    type: 'listening',
    title: 'Coffee Shop Conversation',
    instructions: 'Listen to a conversation in a coffee shop and answer questions',
    difficulty: 'intermediate',
    estimatedDuration: 12,
    points: 45,
    completed: false,
    progress: 0
  };

  const mockGrammarExercise: BaseExercise = {
    id: 'grammar-1',
    type: 'grammar',
    title: 'Sentence Building',
    instructions: 'Build correct English sentences by arranging words',
    difficulty: 'beginner',
    estimatedDuration: 8,
    points: 35,
    completed: false,
    progress: 0
  };

  const chapters: Chapter[] = [
    {
      id: 'chapter-1',
      title: 'Foundation Skills',
      duration: 1800, // 30 minutes in seconds
      exercises: [mockVocabularyExercise, mockGrammarExercise],
      completed: false
    },
    {
      id: 'chapter-2', 
      title: 'Communication Practice',
      duration: 1320, // 22 minutes in seconds
      exercises: [mockListeningExercise, mockSpeakingExercise],
      completed: false
    }
  ];

  const exerciseTypes = [
    {
      id: 'vocabulary',
      title: 'Vocabulary Building',
      description: 'Learn new words with interactive flashcards',
      icon: Book,
      color: 'bg-blue-500',
      exercises: [mockVocabularyExercise]
    },
    {
      id: 'grammar',
      title: 'Grammar Practice',
      description: 'Master English grammar with interactive exercises',
      icon: Target,
      color: 'bg-green-500',
      exercises: [mockGrammarExercise]
    },
    {
      id: 'listening',
      title: 'Listening Skills',
      description: 'Improve comprehension with audio exercises',
      icon: Headphones,
      color: 'bg-purple-500',
      exercises: [mockListeningExercise]
    },
    {
      id: 'speaking',
      title: 'Speaking Practice',
      description: 'Practice pronunciation and fluency',
      icon: Mic,
      color: 'bg-orange-500',
      exercises: [mockSpeakingExercise]
    }
  ];

  const startExercise = (exerciseType: string) => {
    setSelectedExerciseType(exerciseType);
    setCurrentView('lesson');
  };

  const handleExerciseComplete = (score: number) => {
    console.log('Exercise completed with score:', score);
    // Here you would typically save progress to Supabase
    setCurrentView('hub');
  };

  const handleProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  if (currentView === 'lesson') {
    const selectedType = exerciseTypes.find(type => type.id === selectedExerciseType);
    const exercise = selectedType?.exercises[0];
    
    if (exercise) {
      return (
        <div className="min-h-screen">
          <ExerciseRenderer
            exercise={exercise}
            onComplete={handleExerciseComplete}
            onProgress={handleProgress}
          />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-foreground"
          >
            Interactive Learning Hub
          </motion.h1>
          <p className="text-xl text-muted-foreground">
            Master English with engaging exercises and adaptive learning
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total XP', value: '1,250', icon: Zap, color: 'text-yellow-600' },
            { label: 'Completed', value: '24', icon: Target, color: 'text-green-600' },
            { label: 'Streak', value: '7 days', icon: Clock, color: 'text-blue-600' },
            { label: 'Level', value: '5', icon: MessageCircle, color: 'text-purple-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Exercise Types */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Choose Your Exercise</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exerciseTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="h-full cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${type.color} text-white`}>
                        <type.icon className="h-6 w-6" />
                      </div>
                      <span>{type.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{type.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {type.exercises[0].difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {type.exercises[0].estimatedDuration}min
                        </Badge>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        +{type.exercises[0].points} XP
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => startExercise(type.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Exercise
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Coming Soon Exercises */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Coming Soon</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Reading Comprehension',
                description: 'Interactive articles with comprehension questions',
                icon: Book,
                color: 'bg-red-500'
              },
              {
                title: 'Conversation Simulation',
                description: 'Practice real-world conversations with AI',
                icon: MessageCircle,
                color: 'bg-indigo-500'
              }
            ].map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (exerciseTypes.length + index) * 0.1 }}
              >
                <Card className="h-full opacity-75">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${type.color} text-white opacity-50`}>
                        <type.icon className="h-6 w-6" />
                      </div>
                      <span className="text-muted-foreground">{type.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{type.description}</p>
                    
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}