import { motion } from 'framer-motion';
import { PremiumShowcase } from '@/components/premium/PremiumShowcase';

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <PremiumShowcase />
      </motion.div>
    </div>
  );
}