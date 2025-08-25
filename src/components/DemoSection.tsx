import { Play, Star } from 'lucide-react';
import raziaChatDemo from '@/assets/razia-chat-demo.jpg';

const DemoSection = () => {
  const testimonials = [
    {
      name: "Ahmed Al-Rashid",
      role: "Business Professional",
      text: "Hidrazy helped me gain confidence in English conversations. Razia understands my Arabic context perfectly!",
      avatar: "👨‍💼",
      rating: 5
    },
    {
      name: "Fatima Hassan",
      role: "University Student", 
      text: "The cultural bridge approach made learning English so much easier. I finally understand idioms!",
      avatar: "👩‍🎓",
      rating: 5
    },
    {
      name: "Omar Khalil",
      role: "Software Engineer",
      text: "Perfect for technical English. Razia helped me prepare for international meetings.",
      avatar: "👨‍💻", 
      rating: 5
    }
  ];

  return (
    <section id="demo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Razia
            </span>{' '}
            in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how our AI conversation partner helps Arabic speakers master English through natural, engaging conversations.
          </p>
        </div>

        {/* Video Demo */}
        <div className="relative max-w-5xl mx-auto mb-20">
          <div className="relative group animate-scale-in">
            <div className="glass rounded-3xl overflow-hidden shadow-card">
              <div className="relative">
                <img 
                  src={raziaChatDemo}
                  alt="Razia AI conversation interface demo showing cultural intelligence and smart English teaching"
                  className="w-full h-auto rounded-2xl"
                />
                
                {/* Feature Highlights Overlay */}
                <div className="absolute top-4 left-4">
                  <div className="glass rounded-lg p-3">
                    <p className="text-white text-sm font-medium">🧠 Cultural Intelligence</p>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4">
                  <div className="glass rounded-lg p-3">
                    <p className="text-white text-sm font-medium">🎯 Smart Cost Optimization</p>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4">
                  <div className="glass rounded-lg p-3">
                    <p className="text-white text-sm font-medium">🗣️ Voice + Text Learning</p>
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4">
                  <div className="glass rounded-lg p-3">
                    <p className="text-white text-sm font-medium">📊 Progress Tracking</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Caption */}
            <p className="text-center text-gray-600 mt-6 text-lg">
              Experience Razia's Cultural Intelligence - Smart Arabic-English Bridge
            </p>
          </div>
        </div>

        {/* Floating Testimonials */}
        <div className="relative">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-fade-in-up">
            What Our Learners Say
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="animate-float card-float"
                style={{ 
                  animationDelay: `${index * 0.5}s`,
                  animationDuration: `${3 + index * 0.5}s`
                }}
              >
                <div className="glass rounded-2xl p-6 relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                  
                  {/* Rating Stars */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;