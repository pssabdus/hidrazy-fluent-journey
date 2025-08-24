import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Globe, BookOpen } from 'lucide-react';

interface RaziaWelcomeMessageProps {
  conversationType: string;
  userLevel?: string;
  userName?: string;
}

export function RaziaWelcomeMessage({ 
  conversationType, 
  userLevel = 'intermediate', 
  userName = 'habibi' 
}: RaziaWelcomeMessageProps) {
  
  const getWelcomeContent = () => {
    const messages = {
      'free_chat': {
        title: "Ahlan wa sahlan! 🤗",
        message: `Marhaba, ${userName}! I'm Razia, your warm English conversation partner. I understand the beautiful journey of Arabic speakers learning English, and I'm here to make it enjoyable and culturally respectful. Ready to chat and improve together?`,
        features: [
          { icon: Heart, text: "Warm & encouraging approach", color: "text-red-500" },
          { icon: Globe, text: "Cultural bridge between Arabic & English", color: "text-blue-500" },
          { icon: Star, text: "Celebrates your progress, mashallah!", color: "text-yellow-500" }
        ]
      },
      'lesson_practice': {
        title: "Welcome to Learning with Razia! 📚",
        message: `Ahlan, my dedicated student! You know what's amazing? Learning English as an Arabic speaker is like building a bridge between two beautiful worlds. I'm here to guide you step by step, celebrating every small victory along the way!`,
        features: [
          { icon: BookOpen, text: "Structured lessons with cultural intelligence", color: "text-green-500" },
          { icon: Heart, text: "Patient guidance with Arabic insights", color: "text-red-500" },
          { icon: Star, text: "Gentle corrections with encouragement", color: "text-yellow-500" }
        ]
      },
      'role_play': {
        title: "Ready for Real-Life Practice? 🎭",
        message: `Marhaba! I'm excited to practice real-world scenarios with you! From ordering coffee to job interviews, we'll make English feel natural and confident. Remember - in Arab culture, we value respect and warmth, and that translates beautifully into English too!`,
        features: [
          { icon: Globe, text: "Real-world scenarios", color: "text-blue-500" },
          { icon: Heart, text: "Cultural adaptation tips", color: "text-red-500" },
          { icon: Star, text: "Confidence building in safe environment", color: "text-yellow-500" }
        ]
      },
      'business_english': {
        title: "Business English Mastery! 💼",
        message: `Ahlan, future business leader! Your multilingual abilities are already impressive, mashallah! Today we'll polish your professional English while respecting your cultural values. Let's make you shine in the global business world!`,
        features: [
          { icon: BookOpen, text: "Professional communication skills", color: "text-green-500" },
          { icon: Globe, text: "International business etiquette", color: "text-blue-500" },
          { icon: Star, text: "Confidence in meetings & presentations", color: "text-yellow-500" }
        ]
      },
      'ielts_practice': {
        title: "IELTS Success Journey! 🎯",
        message: `Ahlan, IELTS champion! I'm genuinely excited to help you achieve your target band score. Your dedication to learning English is inspiring, and together we'll turn your IELTS dreams into reality, inshallah!`,
        features: [
          { icon: Star, text: "IELTS-specific strategies", color: "text-yellow-500" },
          { icon: BookOpen, text: "Band score improvement focus", color: "text-green-500" },
          { icon: Heart, text: "Confidence building for test day", color: "text-red-500" }
        ]
      }
    };

    return messages[conversationType] || messages['free_chat'];
  };

  const getLevelBadge = () => {
    const levels = {
      'beginner': { text: 'Building Foundation', color: 'bg-green-100 text-green-800' },
      'intermediate': { text: 'Growing Strong', color: 'bg-blue-100 text-blue-800' },
      'advanced': { text: 'Mastering Excellence', color: 'bg-purple-100 text-purple-800' }
    };
    return levels[userLevel] || levels['intermediate'];
  };

  const content = getWelcomeContent();
  const levelBadge = getLevelBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Razia Avatar */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <span className="text-2xl">👩‍🏫</span>
            </motion.div>
            
            {/* Welcome Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-foreground">
                  {content.title}
                </h3>
                <Badge className={levelBadge.color}>
                  {levelBadge.text}
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {content.message}
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {content.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-2 p-2 bg-white/60 rounded-lg"
                  >
                    <feature.icon className={`h-4 w-4 ${feature.color}`} />
                    <span className="text-sm text-muted-foreground">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Cultural Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 p-3 bg-white/60 rounded-lg border-l-4 border-blue-400"
          >
            <p className="text-sm text-muted-foreground italic">
              "أهلاً وسهلاً - Welcome! Remember, learning English doesn't mean losing your beautiful Arabic culture. 
              We're building bridges between languages and hearts! 💙"
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}