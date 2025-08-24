import { MessageCircle, GitBranch, TrendingUp } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Personalized AI Conversations",
      description: "Meet Razia, your AI conversation partner who adapts to your learning pace and interests. Practice real-world scenarios with intelligent feedback.",
      gradient: "from-primary to-primary-glow"
    },
    {
      icon: GitBranch,
      title: "Cultural Bridge Learning",
      description: "Learn English through cultural context that Arabic speakers understand. Bridge the gap between languages with culturally relevant examples.",
      gradient: "from-accent to-purple-400"
    },
    {
      icon: TrendingUp,
      title: "Real Progress Tracking",
      description: "Visual progress tracking with detailed analytics. See your improvement in vocabulary, pronunciation, and conversation confidence over time.",
      gradient: "from-pink-400 to-rose-400"
    }
  ];

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Hidrazy?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of language learning with AI-powered conversations designed specifically for Arabic speakers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group card-float animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="glass rounded-3xl p-8 h-full relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-lg text-gray-600 mb-6">
            Ready to start your English learning journey?
          </p>
          <button className="btn-hero text-lg px-10 py-4">
            Try Hidrazy Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;