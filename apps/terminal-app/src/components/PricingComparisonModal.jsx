import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Minus, Crown, Zap, Rocket, Calculator, BookOpen, TrendingUp, Brain, Headphones, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function PricingComparisonModal({ isOpen, onClose, selectedTier, isDark, tiers, currentTier }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTierIcon = (tierName) => {
    switch(tierName) {
      case 'free': return Rocket;
      case 'pro': return Zap;
      case 'elite': return Crown;
      default: return Zap;
    }
  };

  const tier = tiers.find(t => t.tier === selectedTier);
  const TierIcon = tier ? getTierIcon(tier.tier) : Zap;

  const featureCategories = [
    {
      title: "Position & Risk Tools",
      icon: Calculator,
      features: [
        { name: "Position size calculator", free: true, pro: true, elite: true },
        { name: "Multi-TP / Multi-SL support", free: false, pro: true, elite: true },
        { name: "Risk % presets", free: false, pro: true, elite: true },
        { name: "Entry confirmation tools", free: false, pro: true, elite: true }
      ]
    },
    {
      title: "Trading Journal",
      icon: BookOpen,
      features: [
        { name: "Trade log", free: true, pro: true, elite: true },
        { name: "R-multiple tracking", free: false, pro: true, elite: true },
        { name: "Tags & notes", free: false, pro: true, elite: true },
        { name: "Upload screenshots", free: false, pro: true, elite: true },
        { name: "Unlimited trades", free: false, pro: true, elite: true }
      ]
    },
    {
      title: "Smart Money Analysis",
      icon: TrendingUp,
      features: [
        { name: "CVD", free: false, pro: true, elite: true },
        { name: "Open Interest", free: false, pro: true, elite: true },
        { name: "Funding Rate", free: false, pro: true, elite: true },
        { name: "Liquidity behavior", free: false, pro: true, elite: true },
        { name: "Smart Money Terminal", free: false, pro: false, elite: true }
      ]
    },
    {
      title: "Dashboard & Analytics",
      icon: Target,
      features: [
        { name: "Full performance dashboard", free: false, pro: true, elite: true },
        { name: "R-analysis & drawdown curve", free: false, pro: true, elite: true },
        { name: "Daily/weekly performance stats", free: false, pro: true, elite: true }
      ]
    },
    {
      title: "AI Coach",
      icon: Brain,
      features: [
        { name: "AI Trade Coach", free: false, pro: true, elite: true },
        { name: "Advanced Behavioral AI", free: false, pro: false, elite: true }
      ]
    },
    {
      title: "Support",
      icon: Headphones,
      features: [
        { name: "FAQ support", free: true, pro: false, elite: false },
        { name: "Standard support", free: false, pro: true, elite: false },
        { name: "Priority VIP support", free: false, pro: false, elite: true }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full max-w-[700px] my-auto"
            >
              <Card className={`${
                isDark 
                  ? 'bg-slate-900/95 backdrop-blur-xl border border-white/10' 
                  : 'bg-white/95 backdrop-blur-xl border border-black/8'
              } shadow-[0_24px_60px_-12px_rgba(0,0,0,0.4)] rounded-[16px] overflow-hidden`}>
                <CardContent className="p-0">
                  {/* Header */}
                  <div className={`relative px-6 py-5 text-center ${
                    isDark ? 'bg-gradient-to-b from-slate-800/60 to-slate-900/30' : 'bg-gradient-to-b from-gray-50/80 to-white/50'
                  }`}>
                    <button
                      onClick={onClose}
                      className={`absolute top-4 right-4 p-2 rounded-xl transition-all duration-200 ${
                        isDark 
                          ? 'hover:bg-slate-700/50 text-slate-400 hover:text-white' 
                          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col items-center mb-3">
                      <div className={`w-14 h-14 bg-gradient-to-br ${tier?.color} rounded-[14px] flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-3`}>
                        <TierIcon className="w-7 h-7 text-white" />
                      </div>
                      <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {tier?.name}
                      </h2>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        {tier?.subtitle}
                      </p>
                    </div>

                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {tier?.price}
                      </span>
                      <span className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        /{tier?.period}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`h-[1px] ${isDark ? 'bg-slate-700/50' : 'bg-gray-200'}`} />

                  {/* Features Grid */}
                  <div className="px-6 py-5 max-h-[50vh] overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-5">
                      {featureCategories.map((category, idx) => (
                        <div key={idx} className="space-y-2.5">
                          {/* Category Header */}
                          <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-500/15">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isDark ? 'bg-emerald-500/12' : 'bg-emerald-100'
                            }`}>
                              <category.icon className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            </div>
                            <h3 className={`text-sm font-bold ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              {category.title}
                            </h3>
                          </div>

                          {/* Features List */}
                          <div className="space-y-2">
                            {category.features.map((feature, fIdx) => {
                              const hasFeature = feature[selectedTier];
                              return (
                                <div key={fIdx} className="flex items-start gap-2.5">
                                  <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded flex items-center justify-center ${
                                    hasFeature 
                                      ? isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                                      : isDark ? 'bg-slate-800/50' : 'bg-gray-100'
                                  }`}>
                                    {hasFeature ? (
                                      <Check className={`w-2.5 h-2.5 stroke-[3] ${
                                        isDark ? 'text-emerald-400' : 'text-emerald-600'
                                      }`} />
                                    ) : (
                                      <Minus className={`w-2.5 h-2.5 ${
                                        isDark ? 'text-slate-600' : 'text-gray-300'
                                      }`} />
                                    )}
                                  </div>
                                  <span className={`text-xs leading-relaxed ${
                                    hasFeature 
                                      ? isDark ? 'text-slate-200' : 'text-gray-700'
                                      : isDark ? 'text-slate-600' : 'text-gray-400'
                                  }`}>
                                    {feature.name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`h-[1px] ${isDark ? 'bg-slate-700/50' : 'bg-gray-200'}`} />

                  {/* Footer */}
                  <div className={`px-6 py-5 ${
                    isDark ? 'bg-slate-900/50' : 'bg-gray-50/50'
                  }`}>
                    {currentTier === selectedTier ? (
                      <div className={`text-center py-3 rounded-xl ${
                        isDark ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                      }`}>
                        <span className="text-sm font-semibold">✓ This is your current plan</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          if (tier?.stripeLink) {
                            window.open(tier.stripeLink, '_blank');
                            onClose();
                          }
                        }}
                        className={`w-full h-12 text-base font-bold rounded-xl shadow-lg transition-all duration-300 ${
                          tier?.tier === 'free'
                            ? isDark 
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            : `bg-gradient-to-r ${tier?.color} text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`
                        }`}
                        disabled={tier?.tier === 'free'}
                      >
                        {tier?.tier === 'free' ? 'Already Free' : 'Choose Plan'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}