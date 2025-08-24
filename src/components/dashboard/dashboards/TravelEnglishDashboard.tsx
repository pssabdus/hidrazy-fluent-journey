import { motion } from 'framer-motion';
import { Plane, Hotel, UtensilsCrossed, Car, AlertTriangle, MapPin } from 'lucide-react';
import { WelcomeCard } from '../cards/WelcomeCard';
import { QuickActionCard } from '../cards/QuickActionCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TravelEnglishDashboardProps {
  userName?: string;
}

export function TravelEnglishDashboard({ userName }: TravelEnglishDashboardProps) {
  const travelSections = [
    { title: 'Airport & Flights', icon: Plane, description: 'Check-in, security, boarding', color: 'blue' as const },
    { title: 'Hotels & Accommodation', icon: Hotel, description: 'Booking, checking in/out', color: 'green' as const },
    { title: 'Restaurants & Food', icon: UtensilsCrossed, description: 'Ordering, dietary needs', color: 'orange' as const },
    { title: 'Transportation', icon: Car, description: 'Taxis, buses, directions', color: 'purple' as const },
  ];

  const countries = [
    { name: 'United States', flag: '🇺🇸', confidence: 85 },
    { name: 'United Kingdom', flag: '🇬🇧', confidence: 92 },
    { name: 'Australia', flag: '🇦🇺', confidence: 78 },
    { name: 'Canada', flag: '🇨🇦', confidence: 88 },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Card */}
      <WelcomeCard
        userName={userName}
        message="Let's prepare you for amazing conversations!"
        avatar="✈️"
      />

      {/* Travel Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Travel Essentials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {travelSections.map((section, index) => (
            <QuickActionCard
              key={section.title}
              title={section.title}
              description={section.description}
              icon={section.icon}
              color={section.color}
              onClick={() => console.log(`${section.title} clicked`)}
            />
          ))}
        </div>
      </motion.div>

      {/* Emergency Phrases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="overflow-hidden bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-foreground">Emergency Phrases</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Quick access to essential phrases for urgent situations
            </p>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              Learn Emergency Phrases
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cultural Context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Cultural Context Lessons</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {countries.slice(0, 4).map((country, index) => (
                <motion.div
                  key={country.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="text-sm font-medium">{country.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {country.confidence}% ready
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Travel Confidence Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Travel Confidence</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Overall Readiness</span>
                <span className="text-sm font-bold text-primary">78%</span>
              </div>
              <Progress value={78} className="h-3" />
              <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                🌟 You're well-prepared for most travel situations!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}