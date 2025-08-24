import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from './ui/button';
import arabicAccent from '@/assets/arabic-accent.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'AR' : 'EN');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">Hidrazy</span>
              <img 
                src={arabicAccent} 
                alt="Arabic accent" 
                className="w-8 h-6 ml-1 opacity-70"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 hover:bg-primary/10 transition-all duration-300"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">{language}</span>
              <div className="w-6 h-4 rounded-sm bg-gradient-to-r from-green-500 to-red-500 opacity-70" />
            </Button>

            {/* Auth Buttons */}
            <Link 
              to="/login" 
              onClick={(e) => {
                console.log('Sign In link clicked');
                console.log('Current pathname:', window.location.pathname);
                console.log('Target:', e.currentTarget.getAttribute('href'));
              }}
            >
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
            
            <Link 
              to="/register" 
              onClick={(e) => {
                console.log('Get Started button clicked');
                console.log('Current pathname:', window.location.pathname);
                console.log('Target:', e.currentTarget.getAttribute('href'));
              }}
            >
              <Button className="btn-hero animate-scale-in">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/20 animate-fade-in-up">
            <div className="px-4 py-6 space-y-4">
              <Button
                variant="ghost"
                onClick={toggleLanguage}
                className="w-full justify-start space-x-2"
              >
                <Globe className="w-4 h-4" />
                <span>{language}</span>
              </Button>
              
              <Link 
                to="/login"
                onClick={(e) => {
                  console.log('Mobile Sign In link clicked');
                  console.log('Current pathname:', window.location.pathname);
                }}
              >
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary"
                >
                  Sign In
                </Button>
              </Link>
              
              <Link 
                to="/register"
                onClick={(e) => {
                  console.log('Mobile Get Started button clicked');
                  console.log('Current pathname:', window.location.pathname);
                }}
              >
                <Button className="w-full btn-hero">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;