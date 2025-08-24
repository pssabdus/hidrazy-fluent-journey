import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, AuthError, User, Session } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const RATE_LIMIT_KEY = 'auth_attempts';
const RATE_LIMIT_RESET_KEY = 'auth_reset_time';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    rateLimitExceeded: false,
    rateLimitReset: null,
  });

  // Check rate limiting
  const checkRateLimit = (): boolean => {
    const attempts = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || '0');
    const resetTime = localStorage.getItem(RATE_LIMIT_RESET_KEY);
    
    if (resetTime && new Date() < new Date(resetTime)) {
      setState(prev => ({ 
        ...prev, 
        rateLimitExceeded: true, 
        rateLimitReset: new Date(resetTime)
      }));
      return false;
    }
    
    if (attempts >= MAX_ATTEMPTS) {
      const lockoutEnd = new Date(Date.now() + LOCKOUT_DURATION);
      localStorage.setItem(RATE_LIMIT_RESET_KEY, lockoutEnd.toISOString());
      setState(prev => ({ 
        ...prev, 
        rateLimitExceeded: true, 
        rateLimitReset: lockoutEnd
      }));
      return false;
    }
    
    return true;
  };

  const incrementAttempts = () => {
    const attempts = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || '0');
    localStorage.setItem(RATE_LIMIT_KEY, (attempts + 1).toString());
  };

  const clearAttempts = () => {
    localStorage.removeItem(RATE_LIMIT_KEY);
    localStorage.removeItem(RATE_LIMIT_RESET_KEY);
    setState(prev => ({ ...prev, rateLimitExceeded: false, rateLimitReset: null }));
  };

  const signUp = async (email: string, password: string) => {
    if (!checkRateLimit()) {
      return { error: { message: 'Too many attempts. Please try again later.' } };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        incrementAttempts();
        setState(prev => ({ ...prev, loading: false, error: { message: error.message } }));
        return { error: { message: error.message } };
      }

      clearAttempts();
      setState(prev => ({ ...prev, loading: false }));
      
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });

      return { error: null };
    } catch (error: any) {
      incrementAttempts();
      const errorMessage = error?.message || 'An unexpected error occurred';
      setState(prev => ({ ...prev, loading: false, error: { message: errorMessage } }));
      return { error: { message: errorMessage } };
    }
  };

  const signIn = async (email: string, password: string, rememberMe = false) => {
    if (!checkRateLimit()) {
      return { error: { message: 'Too many attempts. Please try again later.' } };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        incrementAttempts();
        setState(prev => ({ ...prev, loading: false, error: { message: error.message } }));
        return { error: { message: error.message } };
      }

      clearAttempts();
      setState(prev => ({ 
        ...prev, 
        loading: false,
        user: data.user,
        session: data.session
      }));

      if (rememberMe) {
        localStorage.setItem('hidrazy_remember_me', 'true');
      }

      window.location.href = '/';
      return { error: null };
    } catch (error: any) {
      incrementAttempts();
      const errorMessage = error?.message || 'An unexpected error occurred';
      setState(prev => ({ ...prev, loading: false, error: { message: errorMessage } }));
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      localStorage.removeItem('hidrazy_remember_me');
      await supabase.auth.signOut({ scope: 'global' });
      setState(prev => ({ 
        ...prev, 
        user: null, 
        session: null, 
        loading: false 
      }));
      window.location.href = '/login';
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: { message: error.message } }));
        return { error: { message: error.message } };
      }

      setState(prev => ({ ...prev, loading: false }));
      return { error: null };
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred';
      setState(prev => ({ ...prev, loading: false, error: { message: errorMessage } }));
      return { error: { message: errorMessage } };
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false
        }));
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      signUp,
      signIn,
      signOut,
      resetPassword,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}