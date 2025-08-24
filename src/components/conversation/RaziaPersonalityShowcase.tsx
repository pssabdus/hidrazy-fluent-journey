import React from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageCircle, Sparkles, Heart, Brain, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function RaziaPersonalityShowcase() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="relative inline-block">
          <Bot className="h-16 w-16 text-primary mx-auto" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 h-4 w-4 bg-pink-400 rounded-full"
          />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Meet Razia</h2>
          <p className="text-lg text-muted-foreground">
            Your AI English teacher with cultural intelligence and a warm heart
          </p>
        </div>
      </motion.div>

      {/* Personality Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: Heart,
            title: "Warm & Encouraging",
            description: "Like a caring older sister who celebrates every small victory and builds your confidence",
            color: "text-pink-500",
            bgColor: "bg-pink-50",
            features: ["Positive reinforcement", "Gentle corrections", "Celebrates progress", "Patient teaching"]
          },
          {
            icon: Globe,
            title: "Cultural Intelligence",
            description: "Deep understanding of Arabic culture and expert at bridging cultural differences",
            color: "text-purple-500",
            bgColor: "bg-purple-50",
            features: ["Arabic cultural awareness", "Islamic values respect", "Cultural bridges", "Communication styles"]
          },
          {
            icon: Brain,
            title: "Adaptive AI",
            description: "Instantly adjusts teaching style based on your level, confidence, and emotional state",
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            features: ["Level adaptation", "Confidence building", "Emotional intelligence", "Personalized responses"]
          },
          {
            icon: MessageCircle,
            title: "Conversation Expert",
            description: "Natural dialogue flow while maintaining clear learning objectives and cultural context",
            color: "text-green-500",
            bgColor: "bg-green-50",
            features: ["Natural conversation", "Learning integration", "Context awareness", "Engaging topics"]
          },
          {
            icon: Sparkles,
            title: "Error Correction Master",
            description: "Positive framing approach that builds confidence while providing clear, helpful corrections",
            color: "text-yellow-500",
            bgColor: "bg-yellow-50",
            features: ["Positive framing", "Clear explanations", "Arabic transfer errors", "Improvement tracking"]
          },
          {
            icon: Bot,
            title: "Scenario Specialist",
            description: "Expert modes for Business, IELTS, Travel, and Cultural Bridge conversations",
            color: "text-indigo-500",
            bgColor: "bg-indigo-50",
            features: ["Business English", "IELTS preparation", "Travel scenarios", "Cultural navigation"]
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className={`inline-flex p-3 rounded-full ${feature.bgColor} mb-2`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  {feature.description}
                </p>
                
                <div className="flex flex-wrap gap-1 justify-center">
                  {feature.features.map((item) => (
                    <Badge key={item} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Level Adaptation Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <span>Adaptive Teaching Examples</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  level: "Beginner (A1-A2)",
                  approach: "Simple vocabulary, very patient pace, lots of encouragement, Arabic support when needed",
                  example: "Excellent try! In English, we say 'I am going to school' - 'ana adhab ila al-madrasa'. You're doing great!",
                  color: "bg-green-50 border-green-200"
                },
                {
                  level: "Intermediate (B1-B2)",
                  approach: "Moderate vocabulary, cultural nuances, fluency focus, balanced corrections",
                  example: "Good expression! You could also say 'I'm planning to visit' which sounds more natural in this context. What do you think?",
                  color: "bg-blue-50 border-blue-200"
                },
                {
                  level: "Advanced (C1-C2)",
                  approach: "Sophisticated language, cultural subtleties, challenging discussions, nuanced corrections",
                  example: "Excellent analysis! Consider using 'furthermore' instead of 'also' for more academic register. How might cultural context influence this?",
                  color: "bg-purple-50 border-purple-200"
                }
              ].map((example) => (
                <Card key={example.level} className={example.color}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-2">{example.level}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{example.approach}</p>
                    <div className="bg-white p-3 rounded border-l-4 border-primary">
                      <p className="text-xs italic">"{example.example}"</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cultural Intelligence Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-500" />
              <span>Cultural Intelligence in Action</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Common Arabic-English Challenges</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-mono">×</span>
                    <div>
                      <span className="font-medium">Article confusion:</span>
                      <div className="text-muted-foreground">"I go to school" → "I go to <strong>the</strong> school"</div>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-mono">×</span>
                    <div>
                      <span className="font-medium">P/B pronunciation:</span>
                      <div className="text-muted-foreground">"pen" → "ben" (Arabic lacks /p/ sound)</div>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-mono">×</span>
                    <div>
                      <span className="font-medium">Word order transfer:</span>
                      <div className="text-muted-foreground">VSO patterns from Arabic → SVO in English</div>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Cultural Bridges Razia Creates</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 font-mono">✓</span>
                    <div>
                      <span className="font-medium">Family values:</span>
                      <div className="text-muted-foreground">Explains English individualism vs. Arabic collectivism</div>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 font-mono">✓</span>
                    <div>
                      <span className="font-medium">Communication styles:</span>
                      <div className="text-muted-foreground">Bridges indirect Arabic → direct English patterns</div>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 font-mono">✓</span>
                    <div>
                      <span className="font-medium">Religious awareness:</span>
                      <div className="text-muted-foreground">Respects Islamic values in all interactions</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}