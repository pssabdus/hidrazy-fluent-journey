import { motion } from 'framer-motion';
import { SubscriptionManagement } from '@/components/premium/SubscriptionManagement';

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Subscription Management
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription, view usage statistics, and access premium features.
          </p>
        </motion.div>

        <SubscriptionManagement />
      </div>
    </div>
  );
}