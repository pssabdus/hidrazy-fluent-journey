import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Button } from './ui/button';
import conversationBubbles from '@/assets/conversation-bubbles.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Gradient Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-inter font-bold text-white mb-6 leading-tight">
            Learn English Through{' '}
            <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
              Natural Conversations
            </span>{' '}
            with Razia
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
            AI-powered conversations that make you fluent faster - designed specifically for Arabic speakers
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              asChild
              size="lg"
              className="btn-hero text-lg px-12 py-6 animate-scale-in"
              onClick={() => console.log('Start Learning Free button clicked')}
            >
              <Link to="/register">Start Learning Free</Link>
            </Button>
            
            <Button 
              asChild
              size="lg"
              variant="ghost"
              className="btn-glass text-lg px-12 py-6 animate-scale-in"
              style={{ animationDelay: '0.2s' }}
            >
              <Link to="#demo">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Floating Conversation Bubbles */}
        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <img 
            src={conversationBubbles}
            alt="English-Arabic conversation examples"
            className="mx-auto max-w-2xl w-full animate-float opacity-90"
          />
          
          {/* Additional floating elements */}
          <div className="absolute -top-4 -left-4 glass rounded-2xl p-4 animate-float">
            <p className="text-white text-sm">
              <span className="text-primary-glow">EN:</span> "How do you say 'مرحبا' in English?"
            </p>
          </div>
          
          <div className="absolute -bottom-4 -right-4 glass rounded-2xl p-4 animate-float" style={{ animationDelay: '1.5s' }}>
            <p className="text-white text-sm">
              <span className="text-accent">AR:</span> "Hello! It means 'welcome' or 'hello'"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;