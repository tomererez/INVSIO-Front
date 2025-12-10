import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Target, Users, Lightbulb, TrendingUp, Shield, BarChart3, Calculator, Zap, Eye, Award, Heart, CheckCircle2, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useLanguage } from "../components/LanguageContext";
import { useState, useEffect } from "react";

export default function About() {
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

  const valuePillars = [
    {
      icon: Brain,
      title: "Smart Money Intelligence",
      description: "Institutional-grade analysis tools to decode market behavior and order flow",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Shield,
      title: "Precision Risk Management",
      description: "Professional calculators that ensure you never risk more than you can afford",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Target,
      title: "Systematic Execution",
      description: "Data-driven decision framework that removes emotion from trading",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: BarChart3,
      title: "Behavioral & AI Insights",
      description: "Advanced analytics and AI coaching to improve your trading psychology",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const coreValues = [
    {
      icon: Zap,
      title: "Discipline over emotion",
      description: "Systematic decisions, not impulsive reactions"
    },
    {
      icon: BarChart3,
      title: "Data over opinions",
      description: "Let the market speak through order flow and positioning"
    },
    {
      icon: Shield,
      title: "Risk first, profit second",
      description: "Protect capital before chasing gains"
    },
    {
      icon: Heart,
      title: "Transparency and honesty",
      description: "No hype, no signals, no false promises"
    },
    {
      icon: TrendingUp,
      title: "Continuous improvement",
      description: "Measure, analyze, learn, and evolve"
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Hero Intro Section */}
      <div className={`relative overflow-hidden border-b ${isDark ? 'border-slate-800/50 bg-gradient-to-b from-slate-900/50' : 'border-gray-200 bg-gradient-to-b from-white/50'} to-transparent`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
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
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className={`inline-block px-4 py-1.5 rounded-full border mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  🧠 Professional Trading Intelligence Platform
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl sm:text-7xl font-bold mb-8 bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
            >
              About INVSIO
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`text-xl sm:text-2xl mb-4 max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}
            >
              Empowering retail traders to think and operate like institutional professionals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full`}
            />
          </motion.div>
        </div>
      </div>

      {/* Value Pillars Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {valuePillars.map((pillar, index) => (
            <Card
              key={index}
              className={`group hover:scale-105 transition-all duration-300 ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-200 hover:border-gray-300 shadow-lg'
                }`}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${pillar.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <pillar.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {pillar.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {pillar.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`h-px ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
      </div>

      {/* What is INVSIO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'}`}>
            <CardContent className="p-8 sm:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'} rounded-xl flex items-center justify-center`}>
                  <Brain className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  What is INVSIO?
                </h2>
              </div>
              <div className={`space-y-5 text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                <p>
                  INVSIO is a professional trading intelligence platform designed specifically for cryptocurrency futures traders who want to move beyond emotional, retail-style trading and adopt institutional-grade decision-making processes.
                </p>
                <p>
                  We provide a suite of analytical tools that decode market behavior using the same metrics that smart money institutions use: Cumulative Volume Delta (CVD), Open Interest, Funding Rates, and Price Action analysis.
                </p>
                <p>
                  Combined with precision risk management calculators and a comprehensive trading journal, INVSIO gives you everything you need to trade with confidence, discipline, and a professional edge.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className={`${isDark ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
            }`}>
            <CardContent className="p-8 sm:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-xl flex items-center justify-center`}>
                  <MessageSquare className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Our Story
                </h2>
              </div>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                INVSIO was born from a simple frustration: retail traders were consistently trading blind while institutions relied on superior data, structure, and discipline. We built INVSIO to close that gap — giving every serious trader access to the same tools, insights, and methodologies used by professionals.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className={`${isDark ? 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'}`}>
            <CardContent className="p-8 sm:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'} rounded-xl flex items-center justify-center`}>
                  <Target className="w-8 h-8 text-teal-400" />
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Our Mission
                </h2>
              </div>
              <div className={`space-y-5 text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                <p className="text-xl font-semibold">
                  To level the playing field between retail traders and institutional investors by providing professional-grade tools that were previously only available to the financial elite.
                </p>
                <p>
                  We believe that with the right tools, education, and mindset, any dedicated trader can learn to read markets like institutions do. Our mission is to transform retail traders from reactive gamblers into strategic, data-driven professionals who understand market structure and position themselves on the right side of smart money flow.
                </p>
                <p>
                  We're not here to sell you dreams or guaranteed profits. We're here to give you the tools to make informed, calculated decisions based on real market data—the same data that professional traders use every single day.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Our Vision Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className={`${isDark ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300'
            }`}>
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Our Vision
              </h2>
              <p className={`text-xl leading-relaxed max-w-4xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Our vision is to redefine how retail traders operate — transforming them from emotional, reactive participants into disciplined, data-driven professionals equipped with institutional-grade intelligence.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`h-px ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
      </div>

      {/* Who It's For */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-12"
        >
          <Users className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Who Is This For?
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            INVSIO is built for serious crypto futures traders who are ready to evolve
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'} h-full`}>
              <CardContent className="p-8">
                <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Perfect For:
                </h3>
                <ul className={`space-y-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <span><strong>Active crypto futures traders</strong> who want to move beyond guessing and gambling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <span><strong>Technical analysts</strong> who understand the importance of order flow and market structure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <span><strong>Disciplined traders</strong> who prioritize risk management and systematic decision-making</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <span><strong>Traders ready to learn</strong> institutional-grade concepts like CVD, OI, and smart money positioning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <span><strong>Portfolio sizes from $1K to $100K+</strong>—our tools scale with your account</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'} h-full`}>
              <CardContent className="p-8">
                <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  Not For:
                </h3>
                <ul className={`space-y-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                    <span><strong>Get-rich-quick seekers</strong> looking for signals or guaranteed profits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                    <span><strong>Gamblers</strong> who refuse to use stop losses or practice risk management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                    <span><strong>Passive investors</strong> looking for automated bots or "set and forget" systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                    <span><strong>Traders unwilling to learn</strong> or invest time in understanding professional concepts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                    <span><strong>Spot-only traders</strong>—our tools are optimized for futures and leverage trading</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`h-px ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
      </div>

      {/* Core Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="text-center mb-12">
            <Award className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Our Core Values
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <Card
                key={index}
                className={`group hover:scale-105 transition-all duration-300 ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-amber-500/50' : 'bg-white border-gray-200 hover:border-amber-400 shadow-lg'
                  }`}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'
                    }`}>
                    <value.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {value.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Philosophy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className={`${isDark ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-300'}`}>
            <CardContent className="p-8 sm:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'} rounded-xl flex items-center justify-center`}>
                  <Lightbulb className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Our Philosophy
                </h2>
              </div>

              <div className={`space-y-8 text-lg ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                <div className={`p-6 rounded-xl ${isDark ? 'bg-cyan-500/5 border border-cyan-500/20' : 'bg-cyan-100/50 border border-cyan-200'}`}>
                  <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    Think Like Smart Money, Not Like Retail
                  </h3>
                  <p className="leading-relaxed">
                    The difference between profitable and unprofitable traders isn't luck—it's mindset and methodology. Smart money institutions don't trade on emotions, FOMO, or hope. They analyze order flow, monitor positioning, and execute calculated decisions based on probabilities.
                  </p>
                </div>

                <div className={`p-6 rounded-xl ${isDark ? 'bg-cyan-500/5 border border-cyan-500/20' : 'bg-cyan-100/50 border border-cyan-200'}`}>
                  <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    Data Over Emotions
                  </h3>
                  <p className="leading-relaxed">
                    Every trade should be backed by data. Is volume confirming the move? What does cumulative volume delta tell us about real buying vs. selling pressure? Are smart money positions increasing or decreasing? These are the questions professionals ask—and now you can too.
                  </p>
                </div>

                <div className={`p-6 rounded-xl ${isDark ? 'bg-cyan-500/5 border border-cyan-500/20' : 'bg-cyan-100/50 border border-cyan-200'}`}>
                  <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    Risk First, Profit Second
                  </h3>
                  <p className="leading-relaxed">
                    Professional traders don't ask "how much can I make?" first. They ask "how much can I lose?" Risk management isn't optional—it's the foundation of sustainable trading. Our tools help you calculate exact position sizes, manage multiple take-profit levels, and never risk more than you can afford to lose.
                  </p>
                </div>

                <div className={`p-6 rounded-xl ${isDark ? 'bg-cyan-500/5 border border-cyan-500/20' : 'bg-cyan-100/50 border border-cyan-200'}`}>
                  <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    Measure, Learn, Improve
                  </h3>
                  <p className="leading-relaxed">
                    You can't improve what you don't measure. That's why we built a comprehensive trading journal that tracks not just your P&L, but your patterns, your win rates by strategy, your profit factor, and your psychological performance. The path to consistency is paved with data-driven self-awareness.
                  </p>
                </div>

                <div className={`${isDark ? 'bg-cyan-500/10' : 'bg-cyan-100'} rounded-xl p-8 border-l-4 ${isDark ? 'border-cyan-400' : 'border-cyan-500'}`}>
                  <p className={`text-xl font-bold italic ${isDark ? 'text-cyan-300' : 'text-cyan-800'}`}>
                    "The market doesn't care about your opinions. It only responds to order flow, positioning, and liquidity. Learn to read these signals, and you'll stop being the liquidity—and start taking it."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Founder Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <Card className={`${isDark ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700' : 'bg-gradient-to-br from-gray-100 to-white border-gray-300 shadow-xl'
            }`}>
            <CardContent className="p-8 sm:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <div className={`inline-block px-4 py-2 rounded-full mb-6 ${isDark ? 'bg-slate-700/50' : 'bg-gray-200'
                  }`}>
                  <span className={`text-sm font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    A Message from the Founder
                  </span>
                </div>
                <p className={`text-xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  "INVSIO was built with one goal — to give dedicated traders the tools to truly understand the market instead of guessing. I believe that every trader deserves access to professional-level intelligence, real data, and tools that build discipline and consistency."
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Final CTA - Premium Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Card className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'
            }`}>
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            <CardContent className="relative p-12 sm:p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-8 shadow-2xl shadow-emerald-500/50">
                <Brain className="w-10 h-10 text-white" />
              </div>

              <h3 className={`text-4xl sm:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Ready to Trade Like a Professional?
              </h3>

              <p className={`text-xl mb-10 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Join traders who stopped guessing and started analyzing like Smart Money. Start making calculated, professional decisions today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("CryptoAnalyzer")}>
                  <Button className="group px-8 py-6 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center gap-2">
                    Start Analyzing
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to={createPageUrl("Features")}>
                  <Button
                    variant="outline"
                    className={`px-8 py-6 text-lg font-bold rounded-xl transition-all duration-200 border-2 ${isDark
                        ? 'border-slate-600 bg-slate-800/50 text-white hover:bg-slate-800 hover:border-slate-500'
                        : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                  >
                    Explore All Tools
                  </Button>
                </Link>
              </div>

              <p className={`text-sm mt-8 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                No credit card required • Free tier available • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}