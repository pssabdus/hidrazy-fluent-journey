import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { type SkillProgress } from '@/types/progress';

interface StrengthWeaknessAnalysisProps {
  skillProgress: SkillProgress;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export function StrengthWeaknessAnalysis({ skillProgress, analysis }: StrengthWeaknessAnalysisProps) {
  // Prepare data for radar chart
  const radarData = [
    { skill: 'Speaking', current: skillProgress.speaking, target: 85 },
    { skill: 'Listening', current: skillProgress.listening, target: 85 },
    { skill: 'Reading', current: skillProgress.reading, target: 85 },
    { skill: 'Writing', current: skillProgress.writing, target: 85 },
  ];

  // Calculate overall balance score
  const skills = Object.values(skillProgress);
  const average = skills.reduce((sum, val) => sum + val, 0) / skills.length;
  const variance = skills.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / skills.length;
  const balanceScore = Math.max(0, 100 - variance);

  // Determine strongest and weakest skills
  const skillEntries = Object.entries(skillProgress);
  const strongest = skillEntries.reduce((a, b) => a[1] > b[1] ? a : b);
  const weakest = skillEntries.reduce((a, b) => a[1] < b[1] ? a : b);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Strongest Skill</h3>
                  <p className="text-lg font-bold text-green-900 capitalize">{strongest[0]}</p>
                  <p className="text-sm text-green-600">{strongest[1]}% proficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-full">
                  <TrendingDown className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800">Focus Area</h3>
                  <p className="text-lg font-bold text-orange-900 capitalize">{weakest[0]}</p>
                  <p className="text-sm text-orange-600">{weakest[1]}% proficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Skill Balance</h3>
                  <p className="text-lg font-bold text-blue-900">{Math.round(balanceScore)}%</p>
                  <p className="text-sm text-blue-600">
                    {balanceScore > 80 ? 'Excellent' : balanceScore > 60 ? 'Good' : 'Needs work'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Skill Balance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--muted))" />
                    <PolarAngleAxis 
                      dataKey="skill" 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    />
                    <Radar
                      name="Current Level"
                      dataKey="current"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Target Level"
                      dataKey="target"
                      stroke="hsl(var(--muted-foreground))"
                      fill="transparent"
                      strokeDasharray="5 5"
                      strokeWidth={1}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Current Level</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-muted-foreground opacity-60" />
                  <span className="text-muted-foreground">Target Level</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <div className="space-y-4">
          {/* Strengths */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <motion.div
                    key={strength}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 p-2 bg-white/60 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-800">{strength}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Weaknesses */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.weaknesses.map((weakness, index) => (
                  <motion.div
                    key={weakness}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3 p-2 bg-white/60 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-sm text-orange-800">{weakness}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AI Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              AI-Powered Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.recommendations.map((recommendation, index) => (
                <motion.div
                  key={recommendation}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white/60 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{recommendation}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Practice
                    </Button>
                    <Button size="sm" variant="ghost">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}