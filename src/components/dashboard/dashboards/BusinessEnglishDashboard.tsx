import { motion } from 'framer-motion';
import { Briefcase, Users, Presentation, Mail, ExternalLink, TrendingUp } from 'lucide-react';
import { WelcomeCard } from '../cards/WelcomeCard';
import { QuickActionCard } from '../cards/QuickActionCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BusinessEnglishDashboardProps {
  userName?: string;
}

export function BusinessEnglishDashboard({ userName }: BusinessEnglishDashboardProps) {
  const scenarios = [
    { title: 'Job Interview', icon: Users, description: 'Practice interview skills', color: 'blue' as const },
    { title: 'Business Meeting', icon: Briefcase, description: 'Lead with confidence', color: 'green' as const },
    { title: 'Presentation Skills', icon: Presentation, description: 'Engage your audience', color: 'purple' as const },
    { title: 'Email Writing', icon: Mail, description: 'Professional communication', color: 'orange' as const },
  ];

  const industries = ['Technology', 'Finance', 'Healthcare', 'Marketing', 'Sales'];
  
  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Card */}
      <WelcomeCard
        userName={userName}
        message="Ready to excel in professional English?"
        avatar="💼"
      />

      {/* Professional Scenarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Professional Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((scenario, index) => (
            <QuickActionCard
              key={scenario.title}
              title={scenario.title}
              description={scenario.description}
              icon={scenario.icon}
              color={scenario.color}
              onClick={() => console.log(`${scenario.title} clicked`)}
            />
          ))}
        </div>
      </motion.div>

      {/* Industry Focus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Industry-Specific Content</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {industries.map((industry, index) => (
                <motion.div
                  key={industry}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  >
                    {industry}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Get specialized vocabulary and scenarios for your industry
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Featured Practice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="overflow-hidden bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Meeting Practice with Razia</h3>
                <p className="text-sm text-muted-foreground">
                  Practice leading meetings and presenting ideas confidently
                </p>
              </div>
              <Button className="bg-gradient-button hover:shadow-glow">
                Start Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* LinkedIn Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">LinkedIn Profile Enhancement</h3>
                <p className="text-sm text-muted-foreground">
                  Improve your professional English writing skills
                </p>
              </div>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Connect LinkedIn
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}