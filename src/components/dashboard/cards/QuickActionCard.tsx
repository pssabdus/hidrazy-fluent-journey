import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuickActionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  onClick: () => void;
  className?: string;
}

const colorClasses = {
  blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
  green: 'from-green-50 to-green-100 border-green-200 text-green-700',
  purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700',
  orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-700',
  red: 'from-red-50 to-red-100 border-red-200 text-red-700',
};

const iconColors = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
  red: 'text-red-500',
};

export function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  onClick,
  className 
}: QuickActionCardProps) {
  return (
    <motion.div
      whileHover={{ 
        y: -4, 
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        scale: 1.02
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
    >
      <Card className={`overflow-hidden bg-gradient-to-br ${colorClasses[color]} transition-all duration-300 hover:shadow-lg`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className={`w-12 h-12 rounded-full bg-white/80 flex items-center justify-center ${iconColors[color]}`}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground truncate mt-1">{description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}