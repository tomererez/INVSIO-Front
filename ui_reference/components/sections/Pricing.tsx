
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { PRICING_TIERS } from '../../constants';

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-24 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] mix-blend-screen" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-white mb-6">Invest in Clarity</h2>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <div 
                className="w-16 h-8 bg-white/10 rounded-full p-1 cursor-pointer relative"
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            >
                <motion.div 
                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    style={{ 
                        x: billingCycle === 'monthly' ? 0 : 32 
                    }}
                />
            </div>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>Yearly <span className="text-emerald-400 text-xs font-bold ml-1">SAVE 30%</span></span>
          </div>
        </div>

        {/* Changed items-center to items-start to prevent height stretching */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {PRICING_TIERS.map((tier) => (
            <div key={tier.id} className="relative group">
               {tier.isPopular && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full shadow-[0_10px_20px_rgba(79,70,229,0.4)]">
                        Most Popular
                      </div>
                  </div>
               )}
               
               {/* Glow for popular card */}
               {tier.isPopular && (
                   <div className="absolute inset-0 bg-indigo-500/20 blur-3xl -z-10 rounded-3xl" />
               )}

               <GlassCard 
                  className={`p-8 flex flex-col ${tier.isPopular ? 'border-indigo-500/30 bg-indigo-900/10' : ''}`}
                  hoverEffect={true}
                  glowColor={tier.isPopular ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.1)"}
               >
                  <div className="mb-6">
                    <h3 className={`text-xl font-medium ${tier.isEnterprise ? 'text-amber-200' : 'text-white'}`}>{tier.name}</h3>
                    <div className="mt-4 flex items-baseline text-white">
                      <span className="text-4xl font-light tracking-tight">
                        ${billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly}
                      </span>
                      <span className="ml-1 text-xl text-slate-500">/mo</span>
                    </div>
                    {billingCycle === 'yearly' && tier.priceMonthly > 0 && (
                        <p className="text-xs text-emerald-400 mt-2">Billed ${tier.priceYearly * 12} yearly</p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <div className={`p-0.5 rounded-full ${tier.isPopular ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                            <Check className="w-3 h-3" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button variant={tier.isPopular ? 'primary' : 'secondary'} className="w-full">
                    {tier.priceMonthly === 0 ? 'Start Free' : 'Get Started'}
                  </Button>
               </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
