import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

export type User = SupabaseUser;
export type Session = SupabaseSession;


export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  ageVerification: boolean;
  termsAccepted: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3;
  label: 'weak' | 'medium' | 'strong' | 'very-strong';
  color: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export interface AuthError {
  message: string;
  code?: string;
  details?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  rateLimitExceeded: boolean;
  rateLimitReset: Date | null;
}