import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IELTSMasteryHub } from '@/components/ielts/IELTSMasteryHub';
import { IELTSWritingFeedback } from '@/components/ielts/IELTSWritingFeedback';
import { IELTSSpeakingAssessment } from '@/components/ielts/IELTSSpeakingAssessment';

export default function IELTSMasteryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="practice">Practice Tests</TabsTrigger>
            <TabsTrigger value="writing">Writing Feedback</TabsTrigger>
            <TabsTrigger value="speaking">Speaking Assessment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <IELTSMasteryHub />
          </TabsContent>
          
          <TabsContent value="practice">
            <IELTSMasteryHub />
          </TabsContent>
          
          <TabsContent value="writing">
            <IELTSWritingFeedback />
          </TabsContent>
          
          <TabsContent value="speaking">
            <IELTSSpeakingAssessment />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}