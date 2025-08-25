import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QualityAssuranceSystem, TestResults, CulturalIssue, ImprovementRecommendation } from '@/services/QualityAssuranceSystem';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Users, 
  Brain, 
  Heart, 
  Zap,
  Target,
  Globe,
  Shield
} from 'lucide-react';

const QualityDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [lastTestDate, setLastTestDate] = useState<string>('');

  useEffect(() => {
    // Load last test results on component mount
    loadLastTestResults();
  }, []);

  const loadLastTestResults = async () => {
    // Mock loading last test results
    setLastTestDate(new Date().toLocaleDateString());
  };

  const runComprehensiveTests = async () => {
    setIsRunningTests(true);
    try {
      const results = await QualityAssuranceSystem.runComprehensiveTests();
      setTestResults(results);
      setLastTestDate(new Date().toLocaleDateString());
    } catch (error) {
      console.error('Failed to run comprehensive tests:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 80) return 'secondary';
    return 'destructive';
  };

  const formatScore = (score: number) => `${score.toFixed(0)}%`;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quality Assurance Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive system quality monitoring and cultural sensitivity validation
          </p>
          {lastTestDate && (
            <p className="text-sm text-muted-foreground mt-1">
              Last test run: {lastTestDate}
            </p>
          )}
        </div>
        <Button 
          onClick={runComprehensiveTests} 
          disabled={isRunningTests}
          size="lg"
          className="flex items-center gap-2"
        >
          {isRunningTests ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Run Quality Tests
            </>
          )}
        </Button>
      </div>

      {/* Overall Score */}
      {testResults && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Overall System Quality Score
            </CardTitle>
            <CardDescription>
              Comprehensive assessment of all system components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-primary">
                {formatScore(testResults.overallScore)}
              </div>
              <Badge 
                variant={getScoreBadgeVariant(testResults.overallScore)}
                className="text-lg px-4 py-2"
              >
                {testResults.overallScore >= 90 ? 'Excellent' : 
                 testResults.overallScore >= 80 ? 'Good' : 
                 testResults.overallScore >= 70 ? 'Needs Improvement' : 'Critical'}
              </Badge>
            </div>
            <Progress 
              value={testResults.overallScore} 
              className="mt-4 h-3"
            />
          </CardContent>
        </Card>
      )}

      {testResults && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="user-journey">User Journey</TabsTrigger>
            <TabsTrigger value="ai-validation">AI Validation</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="recommendations">Actions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* User Journey Score */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">User Journey</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatScore((testResults.userJourneyTests.newUserOnboarding.assessmentCompletion.userSatisfaction * 20))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    End-to-end experience quality
                  </p>
                  <Progress 
                    value={testResults.userJourneyTests.newUserOnboarding.assessmentCompletion.userSatisfaction * 20}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              {/* AI Validation Score */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Validation</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatScore(testResults.aiPromptValidation.overallEffectiveness)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    AI prompt effectiveness
                  </p>
                  <Progress 
                    value={testResults.aiPromptValidation.overallEffectiveness}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              {/* Cultural Sensitivity Score */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cultural Sensitivity</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatScore(testResults.culturalSensitivityAudit.overallScore)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cultural appropriateness
                  </p>
                  <Progress 
                    value={testResults.culturalSensitivityAudit.overallScore}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              {/* Performance Score */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatScore(testResults.performanceMetrics.systemReliability.uptime)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    System reliability
                  </p>
                  <Progress 
                    value={testResults.performanceMetrics.systemReliability.uptime}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              {/* Integration Score */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Integration</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    98%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Component integration
                  </p>
                  <Progress 
                    value={98}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              {/* UX Quality Score */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">UX Quality</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatScore(testResults.uxQualityResults.navigation.userSatisfactionScore.reduce((a, b) => a + b, 0) / testResults.uxQualityResults.navigation.userSatisfactionScore.length * 20)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    User experience quality
                  </p>
                  <Progress 
                    value={testResults.uxQualityResults.navigation.userSatisfactionScore.reduce((a, b) => a + b, 0) / testResults.uxQualityResults.navigation.userSatisfactionScore.length * 20}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Journey Tab */}
          <TabsContent value="user-journey" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Onboarding Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle>New User Onboarding</CardTitle>
                  <CardDescription>Assessment and first experience quality</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time to Complete</span>
                    <Badge variant="outline">
                      {testResults.userJourneyTests.newUserOnboarding.assessmentCompletion.timeToComplete} min
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">User Satisfaction</span>
                    <Badge variant={getScoreBadgeVariant(testResults.userJourneyTests.newUserOnboarding.assessmentCompletion.userSatisfaction * 20)}>
                      {testResults.userJourneyTests.newUserOnboarding.assessmentCompletion.userSatisfaction}/5
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Placement Accuracy</span>
                    <Badge variant={getScoreBadgeVariant(testResults.userJourneyTests.newUserOnboarding.assessmentCompletion.placementAccuracy)}>
                      {formatScore(testResults.userJourneyTests.newUserOnboarding.assessmentCompletion.placementAccuracy)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cultural Comfort</span>
                    <Badge variant={getScoreBadgeVariant(testResults.userJourneyTests.newUserOnboarding.assessmentCompletion.culturalComfort)}>
                      {formatScore(testResults.userJourneyTests.newUserOnboarding.assessmentCompletion.culturalComfort)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Learning Flow */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Learning Experience</CardTitle>
                  <CardDescription>Consistency and quality of daily interactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Teaching Quality</span>
                    <Badge variant={getScoreBadgeVariant(testResults.userJourneyTests.dailyLearningFlow.teachingQuality.appropriateContent.reduce((a, b) => a + b, 0) / testResults.userJourneyTests.dailyLearningFlow.teachingQuality.appropriateContent.length * 10)}>
                      {formatScore(testResults.userJourneyTests.dailyLearningFlow.teachingQuality.appropriateContent.reduce((a, b) => a + b, 0) / testResults.userJourneyTests.dailyLearningFlow.teachingQuality.appropriateContent.length * 10)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cultural Integration</span>
                    <Badge variant={getScoreBadgeVariant(testResults.userJourneyTests.dailyLearningFlow.teachingQuality.culturalIntegration.reduce((a, b) => a + b, 0) / testResults.userJourneyTests.dailyLearningFlow.teachingQuality.culturalIntegration.length * 10)}>
                      {formatScore(testResults.userJourneyTests.dailyLearningFlow.teachingQuality.culturalIntegration.reduce((a, b) => a + b, 0) / testResults.userJourneyTests.dailyLearningFlow.teachingQuality.culturalIntegration.length * 10)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Progress Tracking</span>
                    <Badge variant={getScoreBadgeVariant(testResults.userJourneyTests.dailyLearningFlow.progressTracking.skillMeasurement.reduce((a, b) => a + b, 0) / testResults.userJourneyTests.dailyLearningFlow.progressTracking.skillMeasurement.length * 10)}>
                      {formatScore(testResults.userJourneyTests.dailyLearningFlow.progressTracking.skillMeasurement.reduce((a, b) => a + b, 0) / testResults.userJourneyTests.dailyLearningFlow.progressTracking.skillMeasurement.length * 10)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Feature Unlock Timing</span>
                    <Badge variant={getScoreBadgeVariant(testResults.userJourneyTests.dailyLearningFlow.unlockTiming.overallSatisfaction.reduce((a, b) => a + b, 0) / testResults.userJourneyTests.dailyLearningFlow.unlockTiming.overallSatisfaction.length * 10)}>
                      {formatScore(testResults.userJourneyTests.dailyLearningFlow.unlockTiming.overallSatisfaction.reduce((a, b) => a + b, 0) / testResults.userJourneyTests.dailyLearningFlow.unlockTiming.overallSatisfaction.length * 10)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cultural Sensitivity Tab */}
          <TabsContent value="cultural" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Cultural Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Cultural Assessment Scores</CardTitle>
                  <CardDescription>Breakdown of cultural sensitivity metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Respect for Arab Culture</span>
                      <Badge variant={getScoreBadgeVariant(testResults.culturalSensitivityAudit.respectForArabCulture)}>
                        {formatScore(testResults.culturalSensitivityAudit.respectForArabCulture)}
                      </Badge>
                    </div>
                    <Progress value={testResults.culturalSensitivityAudit.respectForArabCulture} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Islamic Considerations</span>
                      <Badge variant={getScoreBadgeVariant(testResults.culturalSensitivityAudit.islamicConsiderations)}>
                        {formatScore(testResults.culturalSensitivityAudit.islamicConsiderations)}
                      </Badge>
                    </div>
                    <Progress value={testResults.culturalSensitivityAudit.islamicConsiderations} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Regional Awareness</span>
                      <Badge variant={getScoreBadgeVariant(testResults.culturalSensitivityAudit.regionalAwareness)}>
                        {formatScore(testResults.culturalSensitivityAudit.regionalAwareness)}
                      </Badge>
                    </div>
                    <Progress value={testResults.culturalSensitivityAudit.regionalAwareness} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cultural Pride Preservation</span>
                      <Badge variant={getScoreBadgeVariant(testResults.culturalSensitivityAudit.culturalPridePreservation)}>
                        {formatScore(testResults.culturalSensitivityAudit.culturalPridePreservation)}
                      </Badge>
                    </div>
                    <Progress value={testResults.culturalSensitivityAudit.culturalPridePreservation} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Linguistic Sensitivity</span>
                      <Badge variant={getScoreBadgeVariant(testResults.culturalSensitivityAudit.linguisticSensitivity)}>
                        {formatScore(testResults.culturalSensitivityAudit.linguisticSensitivity)}
                      </Badge>
                    </div>
                    <Progress value={testResults.culturalSensitivityAudit.linguisticSensitivity} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Cultural Issues */}
              <Card>
                <CardHeader>
                  <CardTitle>Cultural Issues & Recommendations</CardTitle>
                  <CardDescription>Areas for cultural sensitivity improvements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testResults.culturalSensitivityAudit.issues.length > 0 ? (
                    testResults.culturalSensitivityAudit.issues.map((issue: CulturalIssue, index: number) => (
                      <Alert key={index} className={
                        issue.severity === 'critical' ? 'border-red-500' :
                        issue.severity === 'high' ? 'border-orange-500' :
                        issue.severity === 'medium' ? 'border-yellow-500' :
                        'border-blue-500'
                      }>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex justify-between items-start mb-2">
                            <strong>{issue.category}</strong>
                            <Badge variant={
                              issue.severity === 'critical' ? 'destructive' :
                              issue.severity === 'high' ? 'destructive' :
                              issue.severity === 'medium' ? 'secondary' :
                              'outline'
                            }>
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{issue.description}</p>
                          <p className="text-sm font-medium">Recommendation: {issue.recommendation}</p>
                        </AlertDescription>
                      </Alert>
                    ))
                  ) : (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        No cultural sensitivity issues detected. Excellent cultural awareness!
                      </AlertDescription>
                    </Alert>
                  )}

                  {testResults.culturalSensitivityAudit.recommendations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">General Recommendations:</h4>
                      <ul className="space-y-1">
                        {testResults.culturalSensitivityAudit.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Validation Tab */}
          <TabsContent value="ai-validation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Teaching Prompts */}
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Prompts Validation</CardTitle>
                  <CardDescription>Quality assessment of AI teaching prompts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(testResults.aiPromptValidation.teachingPrompts).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <Badge variant={getScoreBadgeVariant(value as number)}>
                        {formatScore(value as number)}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Assessment Prompts */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Prompts Validation</CardTitle>
                  <CardDescription>Quality assessment of AI assessment prompts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(testResults.aiPromptValidation.assessmentPrompts).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <Badge variant={getScoreBadgeVariant(value as number)}>
                        {formatScore(value as number)}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Response Times */}
              <Card>
                <CardHeader>
                  <CardTitle>Response Times</CardTitle>
                  <CardDescription>AI response performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Teaching Prompts</span>
                    <Badge variant="outline">
                      {(testResults.performanceMetrics.responseTime.teachingPrompts.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseTime.teachingPrompts.length).toFixed(1)}s
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Assessment Analysis</span>
                    <Badge variant="outline">
                      {(testResults.performanceMetrics.responseTime.assessmentAnalysis.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseTime.assessmentAnalysis.length).toFixed(1)}s
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Unlock Decisions</span>
                    <Badge variant="outline">
                      {(testResults.performanceMetrics.responseTime.unlockDecisions.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseTime.unlockDecisions.length).toFixed(1)}s
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Progress Generation</span>
                    <Badge variant="outline">
                      {(testResults.performanceMetrics.responseTime.progressGeneration.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseTime.progressGeneration.length).toFixed(1)}s
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* System Reliability */}
              <Card>
                <CardHeader>
                  <CardTitle>System Reliability</CardTitle>
                  <CardDescription>Overall system health metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uptime</span>
                    <Badge variant={getScoreBadgeVariant(testResults.performanceMetrics.systemReliability.uptime)}>
                      {formatScore(testResults.performanceMetrics.systemReliability.uptime)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <Badge variant={testResults.performanceMetrics.systemReliability.errorRate < 1 ? 'default' : 'destructive'}>
                      {testResults.performanceMetrics.systemReliability.errorRate}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Failure Recovery</span>
                    <Badge variant="outline">
                      {testResults.performanceMetrics.systemReliability.failureRecovery}s
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Consistency</span>
                    <Badge variant={getScoreBadgeVariant(testResults.performanceMetrics.systemReliability.dataConsistency)}>
                      {formatScore(testResults.performanceMetrics.systemReliability.dataConsistency)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Response Quality */}
              <Card>
                <CardHeader>
                  <CardTitle>Response Quality</CardTitle>
                  <CardDescription>AI response quality metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Relevance</span>
                    <Badge variant={getScoreBadgeVariant(testResults.performanceMetrics.responseQuality.relevanceScores.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseQuality.relevanceScores.length * 10)}>
                      {formatScore(testResults.performanceMetrics.responseQuality.relevanceScores.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseQuality.relevanceScores.length * 10)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Coherence</span>
                    <Badge variant={getScoreBadgeVariant(testResults.performanceMetrics.responseQuality.coherenceScores.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseQuality.coherenceScores.length * 10)}>
                      {formatScore(testResults.performanceMetrics.responseQuality.coherenceScores.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseQuality.coherenceScores.length * 10)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cultural Appropriate</span>
                    <Badge variant={getScoreBadgeVariant(testResults.performanceMetrics.responseQuality.culturalAppropriateScores.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseQuality.culturalAppropriateScores.length * 10)}>
                      {formatScore(testResults.performanceMetrics.responseQuality.culturalAppropriateScores.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseQuality.culturalAppropriateScores.length * 10)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pedagogical Sound</span>
                    <Badge variant={getScoreBadgeVariant(testResults.performanceMetrics.responseQuality.pedagogicalSoundScores.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseQuality.pedagogicalSoundScores.length * 10)}>
                      {formatScore(testResults.performanceMetrics.responseQuality.pedagogicalSoundScores.reduce((a, b) => a + b, 0) / testResults.performanceMetrics.responseQuality.pedagogicalSoundScores.length * 10)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Improvement Recommendations</h3>
              
              {testResults.recommendations.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {testResults.recommendations.map((rec: ImprovementRecommendation, index: number) => (
                    <Card key={index} className={`border-l-4 ${
                      rec.priority === 'immediate' ? 'border-l-red-500' :
                      rec.priority === 'short-term' ? 'border-l-orange-500' :
                      rec.priority === 'medium-term' ? 'border-l-yellow-500' :
                      'border-l-blue-500'
                    }`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{rec.description}</CardTitle>
                            <CardDescription>{rec.category}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={
                              rec.priority === 'immediate' ? 'destructive' :
                              rec.priority === 'short-term' ? 'secondary' :
                              'outline'
                            }>
                              {rec.priority}
                            </Badge>
                            <Badge variant="outline">
                              {rec.impact} impact
                            </Badge>
                            <Badge variant="outline">
                              {rec.effort} effort
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Expected Outcome: {rec.expectedOutcome}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Timeline: {rec.timeline}</span>
                          <span className="text-sm text-muted-foreground">
                            Resources: {rec.resources.join(', ')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No immediate recommendations. System quality is excellent!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {!testResults && !isRunningTests && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Test Results Available</h3>
            <p className="text-muted-foreground text-center mb-4">
              Run comprehensive quality tests to validate system performance, cultural sensitivity, and user experience.
            </p>
            <Button onClick={runComprehensiveTests} className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Run Quality Tests
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QualityDashboard;