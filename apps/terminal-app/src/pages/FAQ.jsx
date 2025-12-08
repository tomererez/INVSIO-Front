import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Package, DollarSign, Wrench, Shield, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useState, useEffect } from "react";

export default function FAQ() {
  const [theme, setTheme] = useState('dark');
  const [openQuestion, setOpenQuestion] = useState(null);

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

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  const faqSections = [
    {
      title: "Product",
      icon: Package,
      color: "from-emerald-500 to-teal-600",
      questions: [
        {
          id: "product-1",
          question: "What is SmarTrading?",
          answer: "SmarTrading is a professional trading intelligence platform designed for cryptocurrency futures traders. It provides institutional-grade analytical tools including smart money flow analysis, position calculators, and comprehensive trading journals to help you make data-driven decisions."
        },
        {
          id: "product-2",
          question: "Who is SmarTrading for?",
          answer: "SmarTrading is built for serious crypto futures traders who want to move beyond emotional trading. It's perfect for traders who understand technical analysis, prioritize risk management, and are ready to learn institutional-grade concepts like CVD, Open Interest, and funding rate analysis."
        },
        {
          id: "product-3",
          question: "Do I need programming or technical knowledge?",
          answer: "No programming knowledge required! While you should understand basic trading concepts (support/resistance, leverage, stop losses), our platform is designed to be intuitive. We guide you through each tool and provide explanations for all metrics."
        },
        {
          id: "product-4",
          question: "What exchanges does SmarTrading work with?",
          answer: "SmarTrading is exchange-agnostic. You manually input your trade data from any exchange (Binance, Bybit, OKX, etc.). Our position calculator works with any exchange that offers leverage trading, and our analysis tools interpret universal market data."
        },
        {
          id: "product-5",
          question: "Is this a signal service or trading bot?",
          answer: "No. SmarTrading is NOT a signal service or automated bot. We provide professional analytical tools and calculators to help YOU make informed decisions. You maintain complete control over your trading—we just give you institutional-grade intelligence to guide your choices."
        }
      ]
    },
    {
      title: "Pricing",
      icon: DollarSign,
      color: "from-blue-500 to-indigo-600",
      questions: [
        {
          id: "pricing-1",
          question: "How much does SmarTrading cost?",
          answer: "We offer flexible pricing plans to suit different trader needs. Check our Pricing page for current plans and features. We believe in transparent pricing with no hidden fees."
        },
        {
          id: "pricing-2",
          question: "Is there a free trial?",
          answer: "Yes! We offer a free trial period so you can test all features and see if SmarTrading fits your trading workflow. No credit card required to start."
        },
        {
          id: "pricing-3",
          question: "Can I cancel anytime?",
          answer: "Absolutely. There are no long-term contracts or cancellation fees. You can upgrade, downgrade, or cancel your subscription at any time from your account settings."
        },
        {
          id: "pricing-4",
          question: "Do you offer refunds?",
          answer: "We offer a 14-day money-back guarantee if you're not satisfied with the platform. Just contact support within 14 days of purchase for a full refund."
        },
        {
          id: "pricing-5",
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, debit cards, and cryptocurrency payments for maximum flexibility and convenience."
        }
      ]
    },
    {
      title: "Tools & Features",
      icon: Wrench,
      color: "from-purple-500 to-pink-600",
      questions: [
        {
          id: "tools-1",
          question: "What is CVD and why does it matter?",
          answer: "Cumulative Volume Delta (CVD) measures the net difference between buying and selling volume over time. It reveals real market pressure beyond what price shows. When CVD rises but price falls, it signals accumulation—smart money buying. This helps you avoid fake-outs and position with institutional flow."
        },
        {
          id: "tools-2",
          question: "How does the Position Size Calculator work?",
          answer: "Our calculator uses the 1R risk methodology. You input your entry, stop loss, and risk percentage (typically 1-2% of portfolio). The system calculates exact position size so that if you hit your stop, you lose exactly 1R—no more, no less. It also suggests scale-in levels and multiple take-profit targets."
        },
        {
          id: "tools-3",
          question: "What's the difference between manual and AI chart analysis?",
          answer: "Manual analysis lets you select specific parameters (Price Action, CVD, OI, Volume) and get scenario-based recommendations from our 27 institutional patterns. AI analysis uses computer vision to automatically read your chart screenshot and provide instant interpretation—faster but slightly less precise."
        },
        {
          id: "tools-4",
          question: "Can I import my existing trade history?",
          answer: "Yes! You can bulk import trades via CSV from your exchange. We also support manual entry for full control. The trading journal automatically calculates all metrics (win rate, profit factor, expectancy) and visualizes your performance over time."
        },
        {
          id: "tools-5",
          question: "Does the platform provide trade signals or recommendations?",
          answer: "We provide market analysis and scenario interpretations, not direct 'buy/sell' signals. Our AI Analyzer gives you context (bullish/bearish/neutral) and smart money positioning, but YOU make the final decision. This keeps you in control and helps you learn market structure."
        }
      ]
    },
    {
      title: "Security & Data",
      icon: Shield,
      color: "from-orange-500 to-red-600",
      questions: [
        {
          id: "security-1",
          question: "Is my trading data secure?",
          answer: "Absolutely. All data is encrypted in transit and at rest. We use industry-standard security protocols and never share your personal information or trading data with third parties. Your privacy is our priority."
        },
        {
          id: "security-2",
          question: "Do you need access to my exchange accounts?",
          answer: "No! SmarTrading NEVER asks for your exchange API keys or login credentials. You manually input trade data, and we never touch your actual funds or accounts. This eliminates security risks entirely."
        },
        {
          id: "security-3",
          question: "Where is my data stored?",
          answer: "Your data is stored on secure, encrypted cloud servers with regular backups. We comply with international data protection regulations and use enterprise-grade infrastructure to ensure reliability and security."
        },
        {
          id: "security-4",
          question: "Can I export or delete my data?",
          answer: "Yes. You have full control over your data. You can export all your trading history, settings, and analytics at any time. If you want to delete your account and all associated data, you can do so instantly from account settings."
        },
        {
          id: "security-5",
          question: "What happens to my data if I cancel my subscription?",
          answer: "Your data remains accessible for 30 days after cancellation in case you want to reactivate. After 30 days, your data is permanently deleted unless you choose to export it beforehand."
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden border-b ${isDark ? 'border-slate-800/50 bg-gradient-to-b from-slate-900/50' : 'border-gray-200 bg-gradient-to-b from-white/50'} to-transparent`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                  <HelpCircle className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Frequently Asked Questions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`text-xl sm:text-2xl max-w-3xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-700'}`}
            >
              Everything you need to know about SmarTrading
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {faqSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {section.title}
              </h2>
            </div>

            <div className="space-y-3">
              {section.questions.map((item, index) => (
                <Card 
                  key={item.id}
                  className={`${
                    isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-md'
                  } transition-all duration-200 ${openQuestion === item.id ? 'shadow-lg' : ''}`}
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleQuestion(item.id)}
                      className="w-full flex items-center justify-between p-6 text-left transition-all duration-200 hover:opacity-80"
                    >
                      <span className={`text-lg font-semibold pr-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {item.question}
                      </span>
                      <ChevronDown 
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                          openQuestion === item.id ? 'rotate-180' : ''
                        } ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                      />
                    </button>
                    
                    {openQuestion === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-6 pb-6 ${isDark ? 'text-slate-300' : 'text-gray-700'} leading-relaxed`}>
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className={`${isDark ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'}`}>
            <CardContent className="p-12 text-center">
              <HelpCircle className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
              <h3 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Still Have Questions?
              </h3>
              <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Can't find what you're looking for? Our support team is here to help you get the most out of SmarTrading.
              </p>
              <Link to={createPageUrl("Contact")}>
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:scale-105">
                  Contact Support
                </button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}