import { PasswordStrength } from '@/types/auth';

export function calculatePasswordStrength(password: string): PasswordStrength {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  
  let score: 0 | 1 | 2 | 3;
  let label: 'weak' | 'medium' | 'strong' | 'very-strong';
  let color: string;

  if (metRequirements <= 2) {
    score = 0;
    label = 'weak';
    color = 'hsl(var(--destructive))';
  } else if (metRequirements === 3) {
    score = 1;
    label = 'medium';
    color = 'hsl(39 100% 57%)'; // Orange
  } else if (metRequirements === 4) {
    score = 2;
    label = 'strong';
    color = 'hsl(142 76% 36%)'; // Green
  } else {
    score = 3;
    label = 'very-strong';
    color = 'hsl(142 76% 36%)'; // Green
  }

  return {
    score,
    label,
    color,
    requirements,
  };
}

export function getPasswordStrengthText(strength: PasswordStrength): string {
  switch (strength.label) {
    case 'weak':
      return 'Weak password';
    case 'medium':
      return 'Medium strength';
    case 'strong':
      return 'Strong password';
    case 'very-strong':
      return 'Very strong password';
    default:
      return '';
  }
}