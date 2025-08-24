import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

export function AuthLayout({ children, title, subtitle, showBackButton = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {showBackButton && (
        <Link 
          to="/" 
          className="fixed top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to home</span>
        </Link>
      )}
      
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-glass border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <h1 className="text-2xl font-bold text-primary">Hidrazy</h1>
            </Link>
            <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {children}

          {/* Social Proof */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Join 50,000+ learners
            </p>
            <div className="flex justify-center items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-xs text-muted-foreground">Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-xs text-muted-foreground">Encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-xs text-muted-foreground">GDPR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}