import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OfflineLearningHub } from '@/components/offline/OfflineLearningHub';
import { OfflineConversationMode } from '@/components/offline/OfflineConversationMode';
import { SmartStorageManager } from '@/components/offline/SmartStorageManager';

export default function OfflineLearningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <Tabs defaultValue="downloads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="downloads">Lesson Downloads</TabsTrigger>
            <TabsTrigger value="conversations">Offline Conversations</TabsTrigger>
            <TabsTrigger value="storage">Storage Manager</TabsTrigger>
          </TabsList>
          
          <TabsContent value="downloads">
            <OfflineLearningHub />
          </TabsContent>
          
          <TabsContent value="conversations">
            <OfflineConversationMode />
          </TabsContent>
          
          <TabsContent value="storage">
            <SmartStorageManager />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}