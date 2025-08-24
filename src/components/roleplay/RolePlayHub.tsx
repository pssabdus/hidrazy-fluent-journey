import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScenarioCard } from './ScenarioCard';
import { ScenarioDetail } from './ScenarioDetail';
import { scenarios, getScenariosByCategory } from '@/data/scenarios';
import { Scenario } from '@/types/roleplay';
import { Coffee, Briefcase, Plane, Users as UsersIcon, Star, TrendingUp } from 'lucide-react';

interface RolePlayHubProps {
  onStartScenario: (scenario: Scenario) => void;
  isPremiumUser?: boolean;
}

export function RolePlayHub({ onStartScenario, isPremiumUser = false }: RolePlayHubProps) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Scenarios', icon: Star, count: scenarios.length },
    { id: 'daily_life', label: 'Daily Life', icon: Coffee, count: getScenariosByCategory('daily_life').length },
    { id: 'work', label: 'Work', icon: Briefcase, count: getScenariosByCategory('work').length },
    { id: 'travel', label: 'Travel', icon: Plane, count: getScenariosByCategory('travel').length },
    { id: 'social', label: 'Social', icon: UsersIcon, count: getScenariosByCategory('social').length },
  ];

  const getFilteredScenarios = () => {
    if (activeCategory === 'all') return scenarios;
    return getScenariosByCategory(activeCategory);
  };

  const completedScenarios = scenarios.filter(s => s.isCompleted).length;
  const availableScenarios = scenarios.filter(s => !s.isPremium || isPremiumUser).length;

  if (selectedScenario) {
    return (
      <ScenarioDetail
        scenario={selectedScenario}
        onBack={() => setSelectedScenario(null)}
        onStart={() => onStartScenario(selectedScenario)}
        isPremiumUser={isPremiumUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Role Play Practice
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practice English in realistic scenarios with Razia playing different characters. 
            Build confidence through immersive conversations.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedScenarios}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{availableScenarios}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{scenarios.length}</div>
              <div className="text-sm text-muted-foreground">Total Scenarios</div>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:mx-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Scenarios Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredScenarios().map((scenario, index) => (
                      <motion.div
                        key={scenario.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ScenarioCard
                          scenario={scenario}
                          onSelect={setSelectedScenario}
                          isPremiumUser={isPremiumUser}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Empty State */}
                  {getFilteredScenarios().length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <div className="text-6xl mb-4">🎭</div>
                      <h3 className="text-xl font-semibold mb-2">No scenarios available</h3>
                      <p className="text-muted-foreground">
                        Check back soon for new scenarios in this category!
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Premium Upsell */}
        {!isPremiumUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  Unlock Premium Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access advanced scenarios, detailed feedback, and conversation recordings with Premium.
                </p>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}