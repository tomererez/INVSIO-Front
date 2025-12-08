import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3,
  Activity,
  DollarSign,
  TrendingUp,
  Zap,
  Layers
} from "lucide-react";

export default function TechnicalAnalysis() {
  const [theme, setTheme] = useState('dark');
  const [activeIndicators, setActiveIndicators] = useState({
    cvd: false,
    openInterest: false,
    funding: false,
    delta: false,
    volume: true,
    liquidity: false
  });

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

  const indicators = [
    { key: 'cvd', label: 'CVD', icon: Activity },
    { key: 'openInterest', label: 'Open Interest', icon: DollarSign },
    { key: 'funding', label: 'Funding', icon: TrendingUp },
    { key: 'delta', label: 'Delta', icon: Zap },
    { key: 'volume', label: 'Volume', icon: BarChart3 },
    { key: 'liquidity', label: 'Liquidity Zones', icon: Layers }
  ];

  const toggleIndicator = (key) => {
    setActiveIndicators(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden border-b ${isDark ? 'border-slate-800/50' : 'border-gray-200'}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
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
              className="inline-flex mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-40" />
                <div className="relative w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: appleEasing }}
              className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Technical Analyzer
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.12, ease: appleEasing }}
              className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}
            >
              Real-time charting with Smart Money metrics
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* TradingView Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: appleEasing }}
          className="mb-8"
        >
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'} shadow-2xl overflow-hidden`}>
            <CardContent className="p-0">
              <div className="tradingview-widget-container" style={{ height: "600px", width: "100%" }}>
                <iframe
                  scrolling="no"
                  allowTransparency={true}
                  frameBorder="0"
                  src="https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22BINANCE%3ABTCUSDT%22%2C%22interval%22%3A%22D%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22dark%22%2C%22style%22%3A%221%22%2C%22enable_publishing%22%3Afalse%2C%22hide_top_toolbar%22%3Afalse%2C%22hide_legend%22%3Afalse%2C%22save_image%22%3Afalse%2C%22calendar%22%3Afalse%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22600%22%7D"
                  title="TradingView Chart"
                  style={{ width: "100%", height: "600px", border: "none" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Smart Money Indicators Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: appleEasing }}
        >
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'} shadow-xl`}>
            <CardContent className="p-6">
              <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Layers className="w-5 h-5 text-emerald-400" />
                Smart Money Indicators
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {indicators.map((indicator) => {
                  const Icon = indicator.icon;
                  const isActive = activeIndicators[indicator.key];
                  
                  return (
                    <button
                      key={indicator.key}
                      onClick={() => toggleIndicator(indicator.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                          : isDark
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{indicator.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                <p className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  💡 Toggle indicators to overlay Smart Money metrics on your chart
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}