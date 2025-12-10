import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Sparkles, Zap, Target, TrendingUp, Shield, Users, CheckCircle2, XCircle, ArrowRight, BarChart3, Calculator, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createPageUrl } from "../utils";
import { useLanguage } from "../components/LanguageContext";
import { useEffect, useState } from "react";
import Testimonials from "../components/Testimonials";

export default function Home() {
  const { t } = useLanguage();
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

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Money Analysis",
      description: "Read market structure like institutions do"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Intelligence",
      description: "Instant insights when markets move"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Precision Risk Control",
      description: "Calculate exact position sizes every time"
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className={`text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Professional Trading Intelligence
                </span>
              </div>

              <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight`}>
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Trade Like
                </span>
                <br />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  Smart Money
                </span>
              </h1>

              <p className={`text-lg sm:text-xl mb-8 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Stop trading on emotions and retail mentality. Use institutional-grade tools to analyze markets, manage risk, and make data-driven decisions like professional traders.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
                      }`}
                  >
                    <div className="text-emerald-400">{feature.icon}</div>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl("CryptoAnalyzer")} className="w-full sm:w-auto">
                  <button className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 flex items-center justify-center gap-2">
                    Start Analyzing
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link to={createPageUrl("Features")} className="w-full sm:w-auto">
                  <button className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold transition-all duration-200 border hover:scale-105 ${isDark ? 'bg-slate-800/50 text-white border-slate-700 hover:bg-slate-800' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                    }`}>
                    View All Features
                  </button>
                </Link>
              </div>

              <p className={`text-sm mt-6 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                No credit card required • Free tier available • Cancel anytime
              </p>
            </motion.div>

            {/* Right: Platform Preview Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className={`relative rounded-2xl border-2 overflow-hidden shadow-2xl ${isDark ? 'border-slate-700 bg-slate-900' : 'border-gray-300 bg-white'
                }`}>
                <div className={`h-12 flex items-center px-4 border-b ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className={`p-8 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                      <BarChart3 className="w-6 h-6 text-emerald-500 mb-2" />
                      <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Analysis</div>
                    </div>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-teal-500/10' : 'bg-teal-50'}`}>
                      <Calculator className="w-6 h-6 text-teal-500 mb-2" />
                      <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Calculator</div>
                    </div>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
                      <BookOpen className="w-6 h-6 text-cyan-500 mb-2" />
                      <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Journal</div>
                    </div>
                  </div>
                  <div className={`h-48 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'} flex items-center justify-center`}>
                    <Brain className={`w-16 h-16 ${isDark ? 'text-slate-700' : 'text-gray-300'}`} />
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-lg font-semibold text-sm">
                AI-Powered
              </div>
              <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-teal-500 text-white rounded-lg shadow-lg font-semibold text-sm">
                Real-Time Data
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Built for Serious Traders Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 mb-6">
            <Users className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Built for Serious Traders
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Institutional-quality decisions for crypto traders
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className={`h-full ${isDark
                ? 'bg-gradient-to-br from-emerald-900/20 to-teal-900/10 border-emerald-500/30 shadow-xl'
                : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg'
              }`}>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Perfect For</h3>
                </div>
                <ul className={`space-y-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Crypto futures traders seeking professional edge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Understanding smart money flow & positioning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Systematic execution over emotional trading</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Accounts from $1K to $100K+</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className={`h-full ${isDark
                ? 'bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30 shadow-xl'
                : 'bg-gradient-to-br from-red-50 to-red-50 border-red-200 shadow-lg'
              }`}>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Not For</h3>
                </div>
                <ul className={`space-y-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Get-rich-quick schemes or "guaranteed" signals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Trading without risk management or stops</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Automated bots or "set and forget" systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Unwilling to learn professional concepts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Smart Money vs Retail Comparison */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-24 border-t ${isDark ? 'border-slate-800/50' : 'border-gray-200'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 mb-6">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Why Traders Fail — and How INVSIO Fixes It
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            The difference isn't luck—it's mindset, methodology, and the right tools
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className={`h-full ${isDark
                ? 'bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30 shadow-xl'
                : 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 shadow-lg'
              }`}>
              <CardContent className="p-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Retail Trader</h3>
                </div>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-400" />
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Trades on emotions</p>
                      <p className={`text-base ${isDark ? 'text-slate-400' : 'text-gray-600'} leading-relaxed`}>FOMO entries, panic exits, no systematic approach</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-400" />
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No risk management</p>
                      <p className={`text-base ${isDark ? 'text-slate-400' : 'text-gray-600'} leading-relaxed`}>Overleveraged positions, missing stop losses</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-400" />
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Chases pumps</p>
                      <p className={`text-base ${isDark ? 'text-slate-400' : 'text-gray-600'} leading-relaxed`}>Buys tops and sells bottoms repeatedly</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-400" />
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No tracking</p>
                      <p className={`text-base ${isDark ? 'text-slate-400' : 'text-gray-600'} leading-relaxed`}>Repeats the same mistakes without learning</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className={`h-full ${isDark
                ? 'bg-gradient-to-br from-emerald-900/20 to-teal-900/10 border-emerald-500/30 shadow-xl'
                : 'bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-300 shadow-lg'
              }`}>
              <CardContent className="p-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Smart Money</h3>
                </div>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Data-driven decisions</p>
                      <p className={`text-base ${isDark ? 'text-slate-400' : 'text-gray-600'} leading-relaxed`}>CVD, OI, and funding rate analysis before entry</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Precise risk control</p>
                      <p className={`text-base ${isDark ? 'text-slate-400' : 'text-gray-600'} leading-relaxed`}>Never risks more than 1-2% per trade</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Patient entries</p>
                      <p className={`text-base ${isDark ? 'text-slate-400' : 'text-gray-600'} leading-relaxed`}>Waits for optimal setups with confirmation</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Constant improvement</p>
                      <p className={`text-base ${isDark ? 'text-slate-400' : 'text-gray-600'} leading-relaxed`}>Reviews and analyzes every single trade</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className={`max-w-4xl mx-auto ${isDark
              ? 'bg-slate-900/50 border-emerald-500/30 shadow-xl'
              : 'bg-white border-emerald-300 shadow-lg'
            }`}>
            <CardContent className="p-10 text-center">
              <Shield className="w-14 h-14 text-emerald-400 mx-auto mb-6" />
              <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>INVSIO</span> gives you the tools to operate like smart money—analyze systematically, execute with discipline, and manage risk professionally.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className={`${isDark
              ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30 shadow-2xl'
              : 'bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-300 shadow-xl'
            } overflow-hidden`}>
            <CardContent className="p-12 md:p-16 text-center relative">
              <div className="absolute inset-0 bg-grid-pattern opacity-5" />
              <div className="relative">
                <Sparkles className="w-16 h-16 text-emerald-400 mx-auto mb-8" />
                <h3 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Ready to Trade with Professional Intelligence?
                </h3>
                <p className={`text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Join traders who've moved beyond guessing and gambling. Start making calculated, professional decisions today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <Link to={createPageUrl("Features")} className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105">
                      Explore All Tools
                    </button>
                  </Link>
                  <Link to={createPageUrl("RiskCalculator")} className="w-full sm:w-auto">
                    <button className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold transition-all duration-200 border hover:scale-105 ${isDark ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                      }`}>
                      Calculate Position Size
                    </button>
                  </Link>
                </div>
                <p className={`text-base ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                  No commitments • Cancel anytime • Free tier available
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}