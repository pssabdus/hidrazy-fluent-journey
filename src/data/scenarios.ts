import { Scenario } from '@/types/roleplay';

// ==============================
// DEPRECATED: Static Scenarios Data
// ==============================
// This static scenario data is now replaced by our AI-powered SmartTeachingEngine
// which generates personalized, culturally-sensitive content dynamically.
// Keeping for backward compatibility but should migrate to AI-generated scenarios.
// TODO: Remove after full migration to AI system
// ==============================

export const scenarios: Scenario[] = [
  // Daily Life Scenarios
  {
    id: 'coffee-shop',
    title: 'Coffee Shop Ordering',
    category: 'daily_life',
    description: 'Practice ordering coffee and making small talk with a friendly barista.',
    context: "You're at a trendy coffee shop in London. Practice ordering drinks and making small talk with the barista (Razia). Focus on: polite requests, small talk, payment vocabulary.",
    difficulty: 2,
    estimatedDuration: 10,
    vocabularyLevel: 'A2',
    image: '☕',
    learningObjectives: [
      'Order food and drinks politely',
      'Make small talk with service staff',
      'Handle payment transactions',
      'Ask for recommendations'
    ],
    keyVocabulary: ['latte', 'cappuccino', 'medium', 'takeaway', 'cash', 'card', 'receipt'],
    culturalTips: [
      'British people often say "please" and "thank you" frequently',
      'Small talk about weather is common',
      'Tipping is optional but appreciated'
    ],
    character: {
      role: 'Barista',
      personality: 'Friendly, energetic, helpful',
      speakingStyle: 'casual',
      avatarStyle: 'casual-uniform',
      greeting: "Good morning! Welcome to Bean There! What can I get started for you today?",
      commonPhrases: [
        "What size would you like?",
        "For here or to go?",
        "Would you like anything else?",
        "That'll be £4.50",
        "Lovely weather today, isn't it?"
      ]
    },
    isCompleted: false,
    isPremium: false
  },
  {
    id: 'grocery-shopping',
    title: 'Grocery Store Visit',
    category: 'daily_life',
    description: 'Navigate a grocery store, ask for help finding items, and check out.',
    context: "You're shopping at a local supermarket. Practice asking for help, finding products, and interacting at checkout.",
    difficulty: 2,
    estimatedDuration: 12,
    vocabularyLevel: 'A2',
    image: '🛒',
    learningObjectives: [
      'Ask for help finding products',
      'Understand directions in a store',
      'Handle checkout interactions',
      'Discuss food preferences'
    ],
    keyVocabulary: ['aisle', 'organic', 'fresh', 'checkout', 'receipt', 'bag', 'discount'],
    culturalTips: [
      'Bring your own bags or pay for plastic ones',
      'Queue etiquette is important',
      'Staff are generally helpful if you ask politely'
    ],
    character: {
      role: 'Store Assistant',
      personality: 'Helpful, patient, knowledgeable',
      speakingStyle: 'friendly',
      avatarStyle: 'retail-uniform',
      greeting: "Hello! Are you finding everything alright today?",
      commonPhrases: [
        "It's in aisle 3, near the dairy section",
        "Would you like a bag?",
        "Do you have a loyalty card?",
        "That comes to £23.45"
      ]
    },
    isCompleted: false,
    isPremium: false
  },
  {
    id: 'doctor-visit',
    title: 'Doctor Appointment',
    category: 'daily_life',
    description: 'Practice describing symptoms and understanding medical advice.',
    context: "You're visiting a GP for a routine check-up. Practice describing how you feel and understanding medical instructions.",
    difficulty: 4,
    estimatedDuration: 15,
    vocabularyLevel: 'B2',
    image: '🏥',
    learningObjectives: [
      'Describe symptoms accurately',
      'Understand medical advice',
      'Ask questions about treatment',
      'Schedule follow-up appointments'
    ],
    keyVocabulary: ['symptoms', 'prescription', 'appointment', 'medication', 'allergic', 'treatment'],
    culturalTips: [
      'NHS appointments should be punctual',
      'Be honest about symptoms',
      'Ask questions if you don\'t understand'
    ],
    character: {
      role: 'Doctor',
      personality: 'Professional, caring, thorough',
      speakingStyle: 'professional',
      avatarStyle: 'medical-professional',
      greeting: "Good afternoon! Please have a seat. What brings you in today?",
      commonPhrases: [
        "How long have you been experiencing this?",
        "On a scale of 1 to 10, how would you rate the pain?",
        "I'm going to prescribe you some medication",
        "Let's schedule a follow-up in two weeks"
      ]
    },
    isCompleted: false,
    isPremium: true
  },

  // Work Scenarios
  {
    id: 'job-interview',
    title: 'Job Interview',
    category: 'work',
    description: 'Practice answering common interview questions professionally.',
    context: "You're interviewing for a marketing position at a London company. Practice answering questions about your experience and asking about the role.",
    difficulty: 4,
    estimatedDuration: 20,
    vocabularyLevel: 'B2',
    image: '💼',
    learningObjectives: [
      'Answer interview questions confidently',
      'Ask relevant questions about the role',
      'Discuss experience and qualifications',
      'Handle difficult questions professionally'
    ],
    keyVocabulary: ['experience', 'qualifications', 'responsibilities', 'salary', 'benefits', 'teamwork'],
    culturalTips: [
      'Firm handshake and eye contact are important',
      'Research the company beforehand',
      'Ask thoughtful questions about the role'
    ],
    character: {
      role: 'Hiring Manager',
      personality: 'Professional, evaluative, friendly but formal',
      speakingStyle: 'professional',
      avatarStyle: 'business-formal',
      greeting: "Good morning! Thank you for coming in today. Please, have a seat. Shall we get started?",
      commonPhrases: [
        "Tell me about yourself",
        "What interests you about this position?",
        "Where do you see yourself in five years?",
        "Do you have any questions for me?"
      ]
    },
    isCompleted: false,
    isPremium: true
  },
  {
    id: 'team-meeting',
    title: 'Team Meeting',
    category: 'work',
    description: 'Participate in a team meeting, share ideas, and collaborate.',
    context: "You're attending a weekly team meeting to discuss project progress and plan next steps.",
    difficulty: 3,
    estimatedDuration: 15,
    vocabularyLevel: 'B1',
    image: '👥',
    learningObjectives: [
      'Share updates on your work',
      'Ask for clarification',
      'Suggest ideas and solutions',
      'Take notes during discussions'
    ],
    keyVocabulary: ['agenda', 'deadline', 'milestone', 'budget', 'brainstorm', 'action items'],
    culturalTips: [
      'Contribute ideas but don\'t dominate',
      'Take notes to show engagement',
      'Follow up on action items after the meeting'
    ],
    character: {
      role: 'Team Leader',
      personality: 'Organized, collaborative, encouraging',
      speakingStyle: 'professional',
      avatarStyle: 'business-casual',
      greeting: "Good morning everyone! Thanks for joining today's meeting. Let's start with project updates.",
      commonPhrases: [
        "What's your progress on the Johnson project?",
        "Does anyone have questions about that?",
        "Let's brainstorm some solutions",
        "Who can take ownership of this task?"
      ]
    },
    isCompleted: false,
    isPremium: false
  },

  // Travel Scenarios
  {
    id: 'airport-checkin',
    title: 'Airport Check-in',
    category: 'travel',
    description: 'Practice checking in for a flight and handling airport procedures.',
    context: "You're at Heathrow Airport checking in for your flight to Paris. Practice the check-in process and asking about flight details.",
    difficulty: 3,
    estimatedDuration: 12,
    vocabularyLevel: 'B1',
    image: '✈️',
    learningObjectives: [
      'Check in for flights',
      'Ask about baggage allowance',
      'Understand departure information',
      'Handle travel documents'
    ],
    keyVocabulary: ['boarding pass', 'gate', 'departure', 'baggage', 'passport', 'security', 'terminal'],
    culturalTips: [
      'Arrive early for international flights',
      'Have documents ready',
      'Follow security procedures carefully'
    ],
    character: {
      role: 'Check-in Agent',
      personality: 'Efficient, helpful, professional',
      speakingStyle: 'professional',
      avatarStyle: 'airline-uniform',
      greeting: "Good morning! May I see your passport and booking confirmation please?",
      commonPhrases: [
        "Would you prefer window or aisle?",
        "Did you pack your bags yourself?",
        "Your gate is B12, boarding starts at 2:30 PM",
        "Have a pleasant flight!"
      ]
    },
    isCompleted: false,
    isPremium: false
  },
  {
    id: 'hotel-booking',
    title: 'Hotel Reception',
    category: 'travel',
    description: 'Check into a hotel and request services.',
    context: "You're checking into a hotel in Edinburgh. Practice the check-in process and asking about hotel facilities.",
    difficulty: 2,
    estimatedDuration: 10,
    vocabularyLevel: 'A2',
    image: '🏨',
    learningObjectives: [
      'Check into a hotel',
      'Ask about room amenities',
      'Request hotel services',
      'Handle payment and deposits'
    ],
    keyVocabulary: ['reservation', 'room key', 'WiFi', 'breakfast', 'checkout', 'deposit', 'facilities'],
    culturalTips: [
      'Breakfast times may be different from your country',
      'Tipping is appreciated but not required',
      'Ask about local recommendations'
    ],
    character: {
      role: 'Hotel Receptionist',
      personality: 'Welcoming, professional, accommodating',
      speakingStyle: 'formal',
      avatarStyle: 'hotel-uniform',
      greeting: "Good evening! Welcome to the Royal Edinburgh Hotel. How may I assist you?",
      commonPhrases: [
        "May I have your name and confirmation number?",
        "Your room is on the third floor",
        "Breakfast is served from 7 to 10 AM",
        "Is there anything else I can help you with?"
      ]
    },
    isCompleted: false,
    isPremium: false
  },

  // Social Scenarios
  {
    id: 'making-friends',
    title: 'Making New Friends',
    category: 'social',
    description: 'Practice introducing yourself and starting conversations.',
    context: "You're at a community event and want to meet new people. Practice starting conversations and finding common interests.",
    difficulty: 3,
    estimatedDuration: 15,
    vocabularyLevel: 'B1',
    image: '🤝',
    learningObjectives: [
      'Introduce yourself naturally',
      'Find common interests',
      'Keep conversations flowing',
      'Exchange contact information'
    ],
    keyVocabulary: ['hobbies', 'interests', 'neighborhood', 'background', 'profession', 'originally from'],
    culturalTips: [
      'British people often start with weather or current events',
      'Personal space is important',
      'Follow up with new friends you meet'
    ],
    character: {
      role: 'Friendly Local',
      personality: 'Outgoing, curious, welcoming',
      speakingStyle: 'casual',
      avatarStyle: 'casual-social',
      greeting: "Hi there! I don't think we've met. I'm Razia. Are you new to the area?",
      commonPhrases: [
        "What brings you to Manchester?",
        "Have you been to any of the local pubs?",
        "We should grab coffee sometime!",
        "Here's my number, text me!"
      ]
    },
    isCompleted: false,
    isPremium: true
  }
];

// ==============================
// DEPRECATED: Static Scenario Helpers  
// ==============================
// These functions are replaced by AI-generated content in SmartTeachingEngine
// Use AIContentService.generateRolePlayScenario() instead
// ==============================

export const getScenariosByCategory = (category: string) => {
  // TODO: Replace with AI-generated scenarios based on user profile and cultural context
  return scenarios.filter(scenario => scenario.category === category);
};

export const getScenarioById = (id: string) => {
  // TODO: Replace with AI-generated scenario retrieval
  return scenarios.find(scenario => scenario.id === id);
};