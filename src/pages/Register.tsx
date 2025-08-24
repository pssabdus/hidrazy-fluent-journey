import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FloatingLabelInput } from '@/components/auth/FloatingLabelInput';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    ageVerification: false,
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { signUp, loading, user, rateLimitExceeded, rateLimitReset } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Age verification
    if (!formData.ageVerification) {
      newErrors.ageVerification = 'You must be 13 years or older to use Hidrazy';
    }

    // Terms acceptance
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { error } = await signUp(formData.email, formData.password);

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSubmitted(true);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (submitted) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle="We've sent you a verification link"
        showBackButton={false}
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-foreground">
              We've sent a verification email to:
            </p>
            <p className="font-semibold text-primary">{formData.email}</p>
            <p className="text-sm text-muted-foreground">
              Click the link in the email to verify your account and start learning.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-gradient-button">
              <Link to="/login">Go to Sign In</Link>
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => setSubmitted(false)}
                className="text-primary hover:underline"
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

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
            You can try again {rateLimitReset && (
              <>at {rateLimitReset.toLocaleTimeString()}</>
            )}
          </p>
          
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Go to Sign In</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Join Hidrazy" subtitle="Start your English journey today">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <FloatingLabelInput
          label="Email address"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          success={formData.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
          autoComplete="email"
        />

        {/* Password Field */}
        <div className="space-y-3">
          <FloatingLabelInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            autoComplete="new-password"
          />
          
          <PasswordStrengthMeter password={formData.password} />
        </div>

        {/* Confirm Password Field */}
        <FloatingLabelInput
          label="Confirm password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          success={formData.confirmPassword && formData.password === formData.confirmPassword}
          autoComplete="new-password"
        />

        {/* Age Verification */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="ageVerification"
              checked={formData.ageVerification}
              onCheckedChange={(checked) => handleInputChange('ageVerification', !!checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <label 
                htmlFor="ageVerification" 
                className="text-sm text-foreground cursor-pointer flex items-center gap-2"
              >
                I am 13 years or older
                <Info className="w-4 h-4 text-muted-foreground" />
              </label>
              {errors.ageVerification && (
                <p className="text-sm text-destructive mt-1">{errors.ageVerification}</p>
              )}
            </div>
          </div>

          {/* Terms Acceptance */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => handleInputChange('termsAccepted', !!checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="termsAccepted" className="text-sm text-foreground cursor-pointer">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-primary hover:underline"
                >
                  Terms of Service and Privacy Policy
                </button>
              </label>
              {errors.termsAccepted && (
                <p className="text-sm text-destructive mt-1">{errors.termsAccepted}</p>
              )}
            </div>
          </div>
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
              Creating Account...
            </>
          ) : (
            'Create My Account'
          )}
        </Button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </form>

      {/* Terms Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms of Service & Privacy Policy</DialogTitle>
            <DialogDescription>
              Please review our terms and privacy policy
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">Terms of Service</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>By using Hidrazy, you agree to these terms and conditions.</p>
                <p>You must be at least 13 years old to use our service.</p>
                <p>You are responsible for maintaining the security of your account.</p>
                <p>We reserve the right to terminate accounts that violate our community guidelines.</p>
              </div>
            </section>
            
            <section>
              <h3 className="font-semibold text-base mb-2">Privacy Policy</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>We collect only the information necessary to provide our service.</p>
                <p>Your personal data is encrypted and stored securely.</p>
                <p>We do not sell or share your personal information with third parties.</p>
                <p>You can request deletion of your data at any time.</p>
              </div>
            </section>
          </div>
          
          <Button onClick={() => setShowTermsModal(false)} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
}