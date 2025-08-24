import { useMemo } from 'react';
import { calculatePasswordStrength, getPasswordStrengthText } from '@/utils/passwordStrength';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrengthMeter({ password, showRequirements = true }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) return null;

  const progressPercentage = ((strength.score + 1) / 4) * 100;

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Password strength
          </span>
          <span 
            className="text-sm font-medium"
            style={{ color: strength.color }}
          >
            {getPasswordStrengthText(strength)}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: strength.color,
            }}
          />
        </div>
      </div>

      {/* Requirements */}
      {showRequirements && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Password requirements:</h4>
          <div className="grid grid-cols-1 gap-1 text-sm">
            <RequirementItem
              met={strength.requirements.length}
              text="At least 8 characters"
            />
            <RequirementItem
              met={strength.requirements.uppercase}
              text="One uppercase letter"
            />
            <RequirementItem
              met={strength.requirements.lowercase}
              text="One lowercase letter"
            />
            <RequirementItem
              met={strength.requirements.number}
              text="One number"
            />
            <RequirementItem
              met={strength.requirements.special}
              text="One special character"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground" />
      )}
      <span className={`text-sm ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
        {text}
      </span>
    </div>
  );
}