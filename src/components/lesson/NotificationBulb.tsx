import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NotificationBulbProps {
  show: boolean;
  message?: string;
}

export function NotificationBulb({ show, message = "Notes added to notebook!" }: NotificationBulbProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10"
    >
      <Badge 
        variant="secondary" 
        className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1 px-3 py-1 shadow-lg"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          <Lightbulb className="h-3 w-3 fill-yellow-600" />
        </motion.div>
        <span className="text-xs font-medium">{message}</span>
      </Badge>
    </motion.div>
  );
}