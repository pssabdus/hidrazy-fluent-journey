import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingLabelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label: string;
  error?: string;
  success?: boolean;
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, success, type, className, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const hasValue = Boolean(props.value);
    const isActive = focused || hasValue;
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="relative">
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "peer w-full h-14 px-4 pt-6 pb-2 text-base bg-background border rounded-xl transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              success && "border-green-500 focus:border-green-500 focus:ring-green-500/20",
              !error && !success && "border-input hover:border-primary/50",
              className
            )}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none",
              isActive
                ? "top-2 text-xs text-muted-foreground"
                : "top-1/2 -translate-y-1/2 text-base text-muted-foreground",
              focused && "text-primary",
              error && "text-destructive",
              success && "text-green-600"
            )}
          >
            {label}
          </label>

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-destructive animate-fade-in-up">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';