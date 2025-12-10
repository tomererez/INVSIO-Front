import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, BadgeCheck } from "lucide-react";
import { useState, useEffect } from "react";

export default function Testimonials() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';

  const testimonials = [
    {
      name: "Michael Chen",
      role: "Day Trader",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      content: "Finally, a platform that thinks like a professional trader. The position calculator alone has saved me from countless bad trades. My risk management is on point now.",
      rating: 5,
      profit: "+47% in 3 months"
    },
    {
      name: "Sarah Martinez",
      role: "Swing Trader",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      content: "The Smart Money analysis is a game changer. I used to trade blindly following patterns. Now I understand WHY the market moves. My win rate went from 42% to 68%.",
      rating: 5,
      profit: "+$12,400 last month"
    },
    {
      name: "James Wilson",
      role: "Crypto Trader",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      content: "Best trading tool I've used. The trading journal keeps me accountable, and seeing my stats in real-time helps me stick to my strategy. Worth every penny.",
      rating: 5,
      profit: "3R average per trade"
    },
    {
      name: "Emily Rodriguez",
      role: "Full-Time Trader",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      content: "I was skeptical at first, but INVSIO transformed how I approach the markets. The AI insights helped me identify patterns I was completely missing.",
      rating: 5,
      profit: "From -$3k to +$8k"
    },
    {
      name: "David Park",
      role: "Options Trader",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "The risk calculator is incredibly precise. I can scale in and out with confidence knowing exactly what I'm risking. No more guessing or over-leveraging.",
      rating: 5,
      profit: "Reduced drawdown by 60%"
    },
    {
      name: "Lisa Thompson",
      role: "Futures Trader",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      content: "Professional-grade tools without the complexity. The platform is intuitive, powerful, and actually helps me make better trading decisions every single day.",
      rating: 5,
      profit: "Consistent 5% monthly"
    }
  ];

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Trusted by Traders Worldwide
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Join thousands of traders who've upgraded their edge
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`h-full ${isDark
                  ? 'bg-slate-900/50 border-slate-800 shadow-xl'
                  : 'bg-white border-gray-200 shadow-lg'
                } hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                <CardContent className="p-8 h-full flex flex-col">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className={`w-10 h-10 ${isDark ? 'text-emerald-500/40' : 'text-emerald-600/40'}`} />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className={`text-base leading-relaxed mb-6 flex-grow ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    "{testimonial.content}"
                  </p>

                  {/* Author Info */}
                  <div className="mt-auto space-y-4">
                    <div className={`flex items-center gap-4 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/20"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {testimonial.name}
                          </p>
                          <BadgeCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    {/* Performance Badge */}
                    <div className={`rounded-lg p-3 ${isDark
                        ? 'bg-emerald-500/10 border border-emerald-500/30'
                        : 'bg-emerald-50 border border-emerald-200'
                      }`}>
                      <p className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        📈 {testimonial.profit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-full border ${isDark
              ? 'bg-slate-900/50 border-slate-800'
              : 'bg-white border-gray-200 shadow-md'
            }`}>
            <p className={`text-base font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              Join <span className="text-emerald-400 font-bold">2,400+</span> active traders
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}