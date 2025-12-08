
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { TESTIMONIALS } from '../../constants';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      
      {/* Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#02040A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#02040A] to-transparent z-10 pointer-events-none" />

      <h2 className="text-center text-sm font-semibold tracking-widest text-slate-500 uppercase mb-12">Trusted by 10,000+ Traders</h2>

      {/* Marquee Container */}
      <div className="flex overflow-hidden">
        <motion.div 
          className="flex gap-6 px-4 items-start" 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {/* Double the array to create seamless loop */}
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div key={`${t.id}-${i}`} className="w-[350px] flex-shrink-0">
              <GlassCard className="p-6" hoverEffect={false}>
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.avatar} alt={t.handle} className="w-10 h-10 rounded-full grayscale opacity-80" />
                  <div>
                    <div className="text-white text-sm font-medium">{t.handle}</div>
                    <div className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, si) => (
                        <Star key={si} className="w-3 h-3 text-cyan-500 fill-cyan-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-sm italic leading-relaxed">"{t.quote}"</p>
              </GlassCard>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
