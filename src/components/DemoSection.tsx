import { Play, Star } from 'lucide-react';
import videoDemo from '@/assets/video-demo.png';

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
    <section className="py-24 bg-white">
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
                  src={videoDemo}
                  alt="Hidrazy demo video"
                  className="w-full h-auto"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="group w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 shadow-glow">
                    <Play className="w-10 h-10 text-white ml-1 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </div>
            
            {/* Caption */}
            <p className="text-center text-gray-600 mt-6 text-lg">
              See Razia in action - 2 minute demo
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