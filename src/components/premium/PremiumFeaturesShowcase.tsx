import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Target, BarChart3, Download, Award, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

export function PremiumFeaturesShowcase() {
  const premiumFeatures = [
    {
      id: 'unlimited_conversations',
      title: 'Unlimited Conversations',
      description: 'Chat with Razia without daily limits',
      icon: MessageCircle,
      color: 'blue',
      route: '/premium'
    },
    {
      id: 'advanced_analytics',
      title: 'Advanced Analytics',
      description: 'AI-powered learning insights and progress tracking',
      icon: BarChart3,
      color: 'purple',
      route: null // Will trigger premium gate
    },
    {
      id: 'offline_learning',
      title: 'Offline Learning',
      description: 'Download lessons and learn anywhere',
      icon: Download,
      color: 'green',
      route: null // Will trigger premium gate
    },
    {
      id: 'ielts_mastery',
      title: 'IELTS Mastery',
      description: 'Complete IELTS preparation with AI feedback',
      icon: Award,
      color: 'orange',
      route: null // Will trigger premium gate
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'purple':
        return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'green':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'orange':
        return 'bg-orange-500/10 text-orange-600 border-orange-200';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Banner */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Unlock Premium Features</h2>
              <p className="text-white/90">Take your English learning to the next level</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">∞</div>
              <div className="text-sm text-white/90">Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-white/90">Offline Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">AI</div>
              <div className="text-sm text-white/90">Analytics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">IELTS</div>
              <div className="text-sm text-white/90">Mastery</div>
            </div>
          </div>
          
          <Link to="/premium">
            <Button variant="secondary" className="w-full">
              Upgrade to Premium
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {premiumFeatures.map((feature, index) => {
          const Icon = feature.icon;
          const colorClasses = getColorClasses(feature.color);
          
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden border-2 ${colorClasses.split(' ')[2]} hover:shadow-lg transition-all duration-300`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {feature.id === 'unlimited_conversations' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Daily Conversations</span>
                          <span className="text-red-600">3/5 used</span>
                        </div>
                        <Progress value={60} className="h-2" />
                        <p className="text-xs text-muted-foreground">Upgrade for unlimited conversations</p>
                      </div>
                    )}
                    
                    {feature.id === 'advanced_analytics' && (
                      <div className="text-sm text-muted-foreground">
                        • Personalized learning insights<br/>
                        • Mistake pattern analysis<br/>
                        • AI-generated study plans
                      </div>
                    )}
                    
                    {feature.id === 'offline_learning' && (
                      <div className="text-sm text-muted-foreground">
                        • Download unlimited lessons<br/>
                        • Offline conversation mode<br/>
                        • Smart storage management
                      </div>
                    )}
                    
                    {feature.id === 'ielts_mastery' && (
                      <div className="text-sm text-muted-foreground">
                        • Full practice tests<br/>
                        • Band score prediction<br/>
                        • Writing & speaking feedback
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    {feature.route ? (
                      <Link to={feature.route}>
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        <Crown className="h-4 w-4 mr-2" />
                        Premium Only
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Access to Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Try Premium Features
          </CardTitle>
          <CardDescription>
            Experience premium features with limited access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/premium">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs">Analytics Preview</span>
              </Button>
            </Link>
            <Link to="/premium">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Download className="h-5 w-5" />
                <span className="text-xs">Offline Preview</span>
              </Button>
            </Link>
            <Link to="/premium">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Award className="h-5 w-5" />
                <span className="text-xs">IELTS Preview</span>
              </Button>
            </Link>
            <Link to="/premium">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Crown className="h-5 w-5" />
                <span className="text-xs">Upgrade Now</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}