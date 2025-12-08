import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Layers,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { useLanguage } from "../components/LanguageContext";

export default function CryptoGuide() {
  const { t, language } = useLanguage();
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
  const appleEasing = [0.25, 0.1, 0.25, 1];

  const parameters = [
    {
      icon: TrendingUp,
      title: "Price Action",
      description: "Understanding market trends and momentum",
      bullets: [
        "Uptrend: Higher highs and higher lows indicate bullish momentum",
        "Downtrend: Lower highs and lower lows signal bearish pressure",
        "Range: Price consolidates between support and resistance",
        "Breakout: Price breaks through key levels with strong volume"
      ]
    },
    {
      icon: Activity,
      title: "Cumulative Volume Delta (CVD)",
      description: "Measure real-time buying vs selling pressure",
      bullets: [
        "Positive CVD: Aggressive buyers stepping in at market price",
        "Negative CVD: Aggressive sellers dumping at market price",
        "CVD Divergence: Price moves up but CVD falls (bearish signal)",
        "CVD Confirmation: Price and CVD move together (trend strength)"
      ]
    },
    {
      icon: DollarSign,
      title: "Open Interest",
      description: "Track institutional positioning and commitment",
      bullets: [
        "Rising OI + Price Up: New longs entering, strong bullish momentum",
        "Rising OI + Price Down: New shorts entering, strong bearish pressure",
        "Falling OI + Price Up: Shorts covering, potential exhaustion",
        "Falling OI + Price Down: Longs closing, potential bottom forming"
      ]
    },
    {
      icon: TrendingDown,
      title: "Funding Rate",
      description: "Understand perpetual futures market sentiment",
      bullets: [
        "Positive Funding: Longs pay shorts, indicating bullish sentiment",
        "Negative Funding: Shorts pay longs, indicating bearish sentiment",
        "Extreme Rates: Often signal potential reversals or liquidations",
        "Neutral Funding: Balanced market with no clear directional bias"
      ]
    },
    {
      icon: BarChart3,
      title: "Volume Analysis",
      description: "Identify institutional activity and liquidity",
      bullets: [
        "High Volume + Price Move: Strong conviction in direction",
        "Low Volume + Price Move: Weak move, likely to reverse",
        "Volume Spikes: Often indicate institutional activity or news",
        "Volume Divergence: Price rises on low volume (bearish signal)"
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden border-b ${isDark ? 'border-slate-800/50' : 'border-gray-200'}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: appleEasing }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: appleEasing }}
              className="inline-flex mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-40" />
                <div className="relative w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: appleEasing }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Market Parameters Guide
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.12, ease: appleEasing }}
              className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}
            >
              Master the institutional metrics that drive market decisions
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Alternating Parameter Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="space-y-32">
          {parameters.map((param, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={index}
                className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              >
                {/* Text Column */}
                <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'} order-2`}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.42, ease: appleEasing }}
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl mb-6 shadow-lg`}
                  >
                    <param.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.46, delay: 0.06, ease: appleEasing }}
                    className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    {param.title}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.44, delay: 0.1, ease: appleEasing }}
                    className={`text-lg mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}
                  >
                    {param.description}
                  </motion.p>

                  <div className="space-y-3">
                    {param.bullets.map((bullet, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.4, delay: 0.14 + (idx * 0.08), ease: appleEasing }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                          {bullet}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Visual Column - Placeholder */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.12, ease: appleEasing }}
                  className={`${isEven ? 'lg:order-2' : 'lg:order-1'} order-1`}
                >
                  <div className={`aspect-video rounded-2xl ${
                    isDark 
                      ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300'
                  } shadow-2xl flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                    <div className={`relative ${isDark ? 'text-slate-700' : 'text-gray-300'}`}>
                      <param.icon className="w-24 h-24" />
                    </div>
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      isDark 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    }`}>
                      Visual Guide
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}