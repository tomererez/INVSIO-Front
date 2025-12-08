
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, HelpCircle, ArrowRight, Zap, Plus, Minus } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { PRICING_TIERS } from '../../constants';

const FAQ_ITEMS = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes! You can cancel your subscription at any time via your dashboard. You'll continue to have access to pro features until the end of your current billing period."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex) through Stripe, as well as PayPal and Crypto (USDT/USDC) for annual plans."
  },
  {
    question: "Is there a free trial?",
    answer: "Our Starter plan is free forever and gives you access to basic features. For Pro features, we offer a 7-day money-back guarantee instead of a trial, ensuring you have ample time to test the platform risk-free."
  },
  {
    question: "How do I upgrade or downgrade?",
    answer: "You can change your plan at any time from the 'Settings' tab in your dashboard. Upgrades take effect immediately (pro-rated), while downgrades apply at the next billing cycle."
  }
];

// Interactive FAQ Component
const FAQItem = ({ item, isOpen, onToggle }: { item: { question: string, answer: string }, isOpen: boolean, onToggle: () => void }) => {
  return (
    <motion.div 
      initial={false}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen 
          ? 'border-indigo-500/30 bg-indigo-500/[0.03]' 
          : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
      }`}
    >
        {/* Active Glow Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent transition-opacity duration-500 pointer-events-none ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

        <button 
            onClick={onToggle}
            className="w-full flex items-center justify-between p-6 text-left relative z-10 focus:outline-none"
        >
            <span className={`text-base md:text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                {item.question}
            </span>
            <div className={`p-2 rounded-full border transition-all duration-300 flex items-center justify-center ${
                isOpen 
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rotate-45' 
                    : 'border-white/10 text-slate-500 bg-white/5 group-hover:border-white/20 group-hover:text-white group-hover:bg-white/10'
            }`}>
                <Plus className="w-4 h-4" />
            </div>
        </button>

        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                    <div className="px-6 pb-6 pt-0 relative z-10">
                        <div className="border-t border-white/5 pt-4">
                            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-void relative overflow-hidden pt-32 pb-20">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-block mb-6"
          >
            <div className="px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium tracking-widest uppercase backdrop-blur-md">
              Institutional Grade
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight"
          >
            Invest in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-normal">Clarity.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 font-light"
          >
            Stop paying for "signals." Start paying for vision. <br className="hidden md:block" />
            Select the plan that fits your trading size.
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-6 mb-16"
        >
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'} transition-colors`}>Monthly</span>
            <div 
                className="w-16 h-8 bg-white/5 border border-white/10 rounded-full p-1 cursor-pointer relative"
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            >
                <motion.div 
                    className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full shadow-lg shadow-indigo-500/50"
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    style={{ 
                        x: billingCycle === 'monthly' ? 0 : 32 
                    }}
                />
            </div>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'} transition-colors`}>
                Yearly <span className="text-emerald-400 text-[10px] font-bold uppercase ml-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Save 30%</span>
            </span>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-32">
          {PRICING_TIERS.map((tier, index) => (
            <motion.div 
                key={tier.id} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative group h-full"
            >
               {tier.isPopular && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-max">
                      <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-t-lg shadow-[0_-5px_20px_rgba(79,70,229,0.3)]">
                        Recommended
                      </div>
                  </div>
               )}
               
               {/* Ambient Glow for Popular Card */}
               {tier.isPopular && (
                   <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] -z-10 rounded-3xl opacity-50" />
               )}

               <GlassCard 
                  className={`p-8 flex flex-col h-full ${tier.isPopular ? 'border-indigo-500/40 bg-indigo-950/20' : 'bg-white/[0.02]'}`}
                  hoverEffect={true}
                  glowColor={tier.isPopular ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.05)"}
               >
                  <div className="mb-8 pb-8 border-b border-white/5">
                    <h3 className={`text-xl font-medium mb-2 ${tier.isEnterprise ? 'text-amber-200' : 'text-white'}`}>{tier.name}</h3>
                    <div className="flex items-baseline text-white">
                      <span className="text-5xl font-light tracking-tighter">
                        ${billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly}
                      </span>
                      <span className="ml-2 text-lg text-slate-500 font-light">/mo</span>
                    </div>
                    {billingCycle === 'yearly' && tier.priceMonthly > 0 && (
                        <p className="text-xs text-emerald-400 mt-3 font-medium flex items-center gap-1.5">
                            <Zap className="w-3 h-3 fill-current" /> Billed ${tier.priceYearly * 12} yearly
                        </p>
                    )}
                    {billingCycle === 'monthly' && tier.priceMonthly > 0 && (
                        <p className="text-xs text-slate-500 mt-3">Billed monthly, cancel anytime</p>
                    )}
                     {tier.priceMonthly === 0 && (
                        <p className="text-xs text-slate-500 mt-3">No credit card required</p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${tier.isPopular ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                            <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={tier.isPopular ? 'primary' : 'secondary'} 
                    className="w-full group"
                    size="lg"
                  >
                    {tier.priceMonthly === 0 ? 'Start Free' : 'Get Access'}
                    {tier.isPopular && <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />}
                  </Button>
               </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-white mb-4">Frequently Asked Questions</h2>
                <p className="text-slate-400">Everything you need to know about billing and access.</p>
            </div>

            <div className="space-y-4">
                {FAQ_ITEMS.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <FAQItem 
                            item={item} 
                            isOpen={openFaqIndex === i} 
                            onToggle={() => toggleFaq(i)}
                        />
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 text-center">
                 <p className="text-slate-500 text-sm">
                    Have more questions? <a href="#" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors">Contact our support team</a>
                 </p>
            </div>
        </div>

      </div>
    </div>
  );
};
