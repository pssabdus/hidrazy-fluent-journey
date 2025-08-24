import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeCardProps {
  userName?: string;
  message: string;
  avatar?: string;
  className?: string;
}

export function WelcomeCard({ userName, message, avatar, className }: WelcomeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      className={className}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {avatar && (
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 5 
                }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-2xl">
                  👋
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            )}
            <div className="flex-1">
              <motion.h2 
                className="text-xl font-bold text-foreground mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {message.replace('[Name]', userName || 'there')}
              </motion.h2>
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Razia is ready to help you learn!
              </motion.p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}