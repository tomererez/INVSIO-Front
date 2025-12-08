import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Check, Crown, Zap, Rocket, Star, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import PricingComparisonModal from "../components/PricingComparisonModal";

export default function Pricing() {
  const [theme, setTheme] = useState('dark');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

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

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.auth.me()
  });

  const currentTier = user?.subscription_tier || 'free';

  const STRIPE_PRO_LINK = "https://buy.stripe.com/your-pro-plan-link";
  const STRIPE_ELITE_LINK = "https://buy.stripe.com/your-elite-plan-link";

  const tiers = [
    {
      name: "Free",
      tier: "free",
      price: "$0",
      period: "forever",
      subtitle: "Try the platform essentials",
      icon: Rocket,
      color: "from-blue-500 to-indigo-600",
      features: [
        "Basic position calculator",
        "Basic trading journal (20 trades/mo)",
        "Basic dashboard",
        "Limited smart money analysis",
        "FAQ support"
      ],
      cta: "Start Free"
    },
    {
      name: "Pro",
      tier: "pro",
      price: "$29",
      period: "mo",
      subtitle: "Everything to trade professionally",
      icon: Zap,
      color: "from-emerald-500 to-teal-600",
      popular: true,
      features: [
        "Full position & risk tools",
        "Unlimited trading journal",
        "Smart money analysis (CVD, OI, funding)",
        "Full dashboard & R-analysis",
        "AI Trade Coach",
        "Standard support",
        "Access to all new tools"
      ],
      cta: "Choose Plan",
      stripeLink: STRIPE_PRO_LINK
    },
    {
      name: "Elite",
      tier: "elite",
      price: "$79",
      period: "mo",
      subtitle: "Advanced AI and deep analytics",
      icon: Crown,
      color: "from-amber-500 to-orange-600",
      features: [
        "Everything in Pro",
        "Advanced AI behavioral coach",
        "Smart Money Terminal",
        "Priority VIP support",
        "Early access to releases"
      ],
      cta: "Choose Plan",
      stripeLink: STRIPE_ELITE_LINK
    }
  ];

  const handlePayment = (link) => {
    if (!user) {
      alert("Please log in to upgrade your subscription");
      return;
    }
    window.open(link, '_blank');
  };

  const handleCardClick = (tier) => {
    setSelectedTier(tier);
    setModalOpen(true);
  };

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards through Stripe and PayPal for maximum flexibility."
    },
    {
      question: "Is there a free trial?",
      answer: "Our Free plan gives you access to basic features forever. You can upgrade anytime to unlock advanced features."
    },
    {
      question: "How do I upgrade or downgrade?",
      answer: "You can change your plan at any time from this page. Changes take effect immediately, and we'll prorate any charges."
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden border-b ${isDark ? 'border-slate-800/50' : 'border-gray-200'}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl mb-8 shadow-2xl shadow-emerald-500/50">
              <DollarSign className="w-12 h-12 text-white" />
            </div>

            <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Simple, Transparent Pricing
            </h1>

            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Choose the plan that fits your trading journey
            </p>
          </motion.div>
        </div>
      </div>

      {/* Current Plan Badge */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className={`${isDark
                ? 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30'
                : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'
              }`}>
              <CardContent className="p-6 text-center">
                <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Current Plan: <span className="font-bold text-emerald-400">{currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`relative ${tier.popular ? 'lg:scale-[1.05]' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold px-5 py-2 rounded-full flex items-center gap-2 shadow-xl">
                    <Star className="w-4 h-4 fill-white" />
                    RECOMMENDED
                  </div>
                </div>
              )}

              <Card
                onClick={() => handleCardClick(tier.tier)}
                className={`relative h-full flex flex-col transition-all duration-300 hover:scale-[1.03] cursor-pointer ${isDark
                    ? 'bg-slate-900/50 border-slate-800 shadow-2xl hover:shadow-emerald-500/30'
                    : 'bg-white border-gray-200 shadow-xl hover:shadow-2xl'
                  } ${tier.popular ? 'ring-2 ring-emerald-500 shadow-emerald-500/50' : ''} rounded-2xl`}
              >

                <CardContent className={`p-10 flex flex-col flex-1 ${tier.popular ? 'pt-12' : ''}`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto`}>
                    <tier.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className={`text-2xl font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-sm mb-8 text-center ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {tier.subtitle}
                  </p>

                  {/* Price */}
                  <div className="mb-8 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {tier.price}
                      </span>
                      <span className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        /{tier.period}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`h-px mb-8 ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />

                  {/* Features */}
                  <div className="space-y-4 mb-8 flex-1">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                          }`}>
                          <Check className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        </div>
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentTier !== tier.tier && tier.tier !== 'free') {
                          handlePayment(tier.stripeLink);
                        }
                      }}
                      disabled={currentTier === tier.tier || tier.tier === 'free'}
                      className={`w-full h-12 text-base font-semibold rounded-xl ${currentTier === tier.tier || tier.tier === 'free'
                          ? isDark ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : `bg-gradient-to-r ${tier.color} text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200`
                        }`}
                    >
                      {currentTier === tier.tier ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Current Plan
                        </>
                      ) : (
                        tier.cta
                      )}
                    </Button>
                  </div>

                  {/* View Details */}
                  <p className={`text-xs text-center mt-4 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                    Click to view full details
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className={`h-px ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-24"
        >
          <h2 className={`text-3xl lg:text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800 shadow-2xl' : 'bg-white border-gray-200 shadow-xl'
            } rounded-2xl`}>
            <CardContent className="p-10 lg:p-12">
              <div className="space-y-8 max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`${index !== faqs.length - 1 ? `pb-8 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}` : ''
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'
                        }`}>
                        <HelpCircle className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {faq.question}
                        </h4>
                        <p className={`text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Comparison Modal */}
      <PricingComparisonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedTier={selectedTier}
        isDark={isDark}
        tiers={tiers}
        currentTier={currentTier}
      />
    </div>
  );
}