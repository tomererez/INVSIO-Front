import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookMarked, User, DollarSign, Calculator, BookOpen, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useState, useEffect } from "react";

export default function QuickStartGuide() {
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

  const steps = [
    {
      number: 1,
      title: "Set Up Your Account",
      description: "Create your INVSIO account and customize your profile settings. This takes less than 2 minutes.",
      icon: User,
      color: "from-blue-500 to-indigo-600",
      action: "Go to Account",
      link: "MyAccount",
      details: [
        "Complete your profile information",
        "Set your preferred theme (dark/light)",
        "Configure notification preferences"
      ]
    },
    {
      number: 2,
      title: "Enter Your Portfolio Size",
      description: "Input your trading capital and fee structure. This is crucial for accurate risk calculations.",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
      action: "Open Settings",
      link: "Settings",
      details: [
        "Enter your initial portfolio equity in USD",
        "Set your exchange's maker/taker fees",
        "Your portfolio will update automatically with closed trades"
      ]
    },
    {
      number: 3,
      title: "Use Position Calculator",
      description: "Calculate precise position sizes using the 1R methodology. Never risk more than you're comfortable with.",
      icon: Calculator,
      color: "from-purple-500 to-pink-600",
      action: "Open Calculator",
      link: "RiskCalculator",
      details: [
        "Set your risk percentage (typically 1-2%)",
        "Enter entry price and stop loss",
        "Get exact quantity, leverage, and take-profit levels",
        "Save calculated trades directly to your journal"
      ]
    },
    {
      number: 4,
      title: "Track Trades in Journal",
      description: "Document every trade with all relevant details. Build a complete history of your trading decisions.",
      icon: BookOpen,
      color: "from-orange-500 to-red-600",
      action: "Open Journal",
      link: "TradingJournal",
      details: [
        "Add trades manually or import from calculator",
        "Track open positions with live P&L",
        "Record entry/exit prices, strategy, and notes",
        "Close trades and automatically calculate results"
      ]
    },
    {
      number: 5,
      title: "Review Your Analytics Weekly",
      description: "Analyze your performance metrics and identify patterns. Continuous improvement is the key to success.",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-600",
      action: "View Analytics",
      link: "TradingJournal",
      details: [
        "Check your win rate and profit factor",
        "Review daily and cumulative P&L charts",
        "Identify your best performing strategies",
        "Use AI insights to spot trading patterns",
        "Adjust your approach based on data"
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
                  <BookMarked className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Quick Start Guide
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`text-xl sm:text-2xl max-w-3xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-700'}`}
            >
              5 Simple Steps to Use INVSIO Like a Pro
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 text-center"
        >
          <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
            Follow these steps to get the most out of INVSIO. Each step builds on the previous one, creating a complete professional trading workflow.
          </p>
        </motion.div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'} overflow-hidden hover:shadow-2xl transition-all duration-300`}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Left Side - Number and Icon */}
                    <div className={`w-full md:w-48 bg-gradient-to-br ${step.color} p-8 flex flex-col items-center justify-center text-center`}>
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-6xl font-bold text-white/90">
                        {step.number}
                      </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="flex-1 p-8">
                      <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-lg mb-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        {step.description}
                      </p>

                      <ul className="space-y-3 mb-6">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            <span className={`${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Link to={createPageUrl(step.link)}>
                        <button className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 bg-gradient-to-r ${step.color} text-white shadow-lg`}>
                          {step.action}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className={`${isDark ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'}`}>
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Pro Tips for Success
                </h2>
                <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Follow these principles to maximize your trading performance
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${isDark ? 'bg-slate-900/50' : 'bg-white'} p-6 rounded-xl`}>
                  <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <CheckCircle2 className="w-6 h-6" />
                    Consistency is Key
                  </h3>
                  <p className={`${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Use the position calculator for EVERY trade. Never enter a position without calculating your exact risk. One miscalculated trade can wipe out weeks of profits.
                  </p>
                </div>

                <div className={`${isDark ? 'bg-slate-900/50' : 'bg-white'} p-6 rounded-xl`}>
                  <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <CheckCircle2 className="w-6 h-6" />
                    Document Everything
                  </h3>
                  <p className={`${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Record your strategy and reasoning for each trade in the journal. When reviewing later, you'll identify patterns in your winning and losing trades.
                  </p>
                </div>

                <div className={`${isDark ? 'bg-slate-900/50' : 'bg-white'} p-6 rounded-xl`}>
                  <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <CheckCircle2 className="w-6 h-6" />
                    Review Weekly
                  </h3>
                  <p className={`${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Set aside 30 minutes every Sunday to review your analytics. Look at your profit factor, expectancy, and best strategies. Adjust your approach based on data, not emotions.
                  </p>
                </div>

                <div className={`${isDark ? 'bg-slate-900/50' : 'bg-white'} p-6 rounded-xl`}>
                  <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <CheckCircle2 className="w-6 h-6" />
                    Risk Management First
                  </h3>
                  <p className={`${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Never risk more than 1-2% of your portfolio on a single trade. It's better to miss opportunities than to blow up your account. Professional traders protect capital above all else.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}