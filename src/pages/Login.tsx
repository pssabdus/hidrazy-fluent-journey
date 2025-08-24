import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FloatingLabelInput } from '@/components/auth/FloatingLabelInput';
import { PasswordResetModal } from '@/components/auth/PasswordResetModal';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2, Info } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showResetModal, setShowResetModal] = useState(false);

  const { signIn, loading, user, rateLimitExceeded, rateLimitReset } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, calling signIn...');
    const { error } = await signIn(formData.email, formData.password, formData.rememberMe);

    if (error) {
      console.log('Sign in returned error:', error);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      console.log('Sign in successful');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (rateLimitExceeded) {
    return (
      <AuthLayout 
        title="Too Many Attempts" 
        subtitle="Please wait before trying again"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Info className="w-8 h-8 text-destructive" />
          </div>
          
          <p className="text-muted-foreground">
            Too many failed sign-in attempts. You can try again{' '}
            {rateLimitReset && (
              <>at {rateLimitReset.toLocaleTimeString()}</>
            )}
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => setShowResetModal(true)}
              variant="outline" 
              className="w-full"
            >
              Reset Password Instead
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/register">Create New Account</Link>
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue your English journey">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <FloatingLabelInput
          label="Email address"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          autoComplete="email"
          autoFocus
        />

        {/* Password Field */}
        <FloatingLabelInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
            />
            <label 
              htmlFor="rememberMe" 
              className="text-sm text-foreground cursor-pointer"
            >
              Remember me
            </label>
          </div>
          
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-button text-white font-semibold rounded-xl hover:shadow-glow transform hover:-translate-y-0.5 transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Register Link */}
        <p className="text-center text-sm text-muted-foreground">
          New to Hidrazy?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </form>

      {/* Password Reset Modal */}
      <PasswordResetModal 
        open={showResetModal} 
        onClose={() => setShowResetModal(false)} 
      />
    </AuthLayout>
  );
}