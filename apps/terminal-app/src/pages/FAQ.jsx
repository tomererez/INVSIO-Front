
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Minus, Box, DollarSign,
  Zap, Shield, HelpCircle, MessageCircle, Mail, ArrowRight
} from 'lucide-react';
import { GlassCard } from '../components/ui/glass-card';
import { Button } from '../components/ui/marketing-button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

// --- PRESERVED FAQ DATA FROM ORIGINAL TERMINAL APP ---

const FAQ_DATA = [
  // Product
  {
    category: 'product',
    question: "What is SmarTrading?",
    answer: "SmarTrading is a professional trading intelligence platform designed for cryptocurrency futures traders. It provides institutional-grade analytical tools including smart money flow analysis, position calculators, and comprehensive trading journals to help you make data-driven decisions."
  },
  {
    category: 'product',
    question: "Who is SmarTrading for?",
    answer: "SmarTrading is built for serious crypto futures traders who want to move beyond emotional trading. It's perfect for traders who understand technical analysis, prioritize risk management, and are ready to learn institutional-grade concepts like CVD, Open Interest, and funding rate analysis."
  },
  {
    category: 'product',
    question: "Do I need programming or technical knowledge?",
    answer: "No programming knowledge required! While you should understand basic trading concepts (support/resistance, leverage, stop losses), our platform is designed to be intuitive. We guide you through each tool and provide explanations for all metrics."
  },
  {
    category: 'product',
    question: "What exchanges does SmarTrading work with?",
    answer: "SmarTrading is exchange-agnostic. You manually input your trade data from any exchange (Binance, Bybit, OKX, etc.). Our position calculator works with any exchange that offers leverage trading, and our analysis tools interpret universal market data."
  },
  {
    category: 'product',
    question: "Is this a signal service or trading bot?",
    answer: "No. SmarTrading is NOT a signal service or automated bot. We provide professional analytical tools and calculators to help YOU make informed decisions. You maintain complete control over your trading—we just give you institutional-grade intelligence to guide your choices."
  },

  // Pricing
  {
    category: 'pricing',
    question: "How much does SmarTrading cost?",
    answer: "We offer flexible pricing plans to suit different trader needs. Check our Pricing page for current plans and features. We believe in transparent pricing with no hidden fees."
  },
  {
    category: 'pricing',
    question: "Is there a free trial?",
    answer: "Yes! We offer a free trial period so you can test all features and see if SmarTrading fits your trading workflow. No credit card required to start."
  },
  {
    category: 'pricing',
    question: "Can I cancel anytime?",
    answer: "Absolutely. There are no long-term contracts or cancellation fees. You can upgrade, downgrade, or cancel your subscription at any time from your account settings."
  },
  {
    category: 'pricing',
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee if you're not satisfied with the platform. Just contact support within 14 days of purchase for a full refund."
  },
  {
    category: 'pricing',
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and cryptocurrency payments for maximum flexibility and convenience."
  },

  // Tools & Features
  {
    category: 'tools',
    question: "What is CVD and why does it matter?",
    answer: "Cumulative Volume Delta (CVD) measures the net difference between buying and selling volume over time. It reveals real market pressure beyond what price shows. When CVD rises but price falls, it signals accumulation—smart money buying. This helps you avoid fake-outs and position with institutional flow."
  },
  {
    category: 'tools',
    question: "How does the Position Size Calculator work?",
    answer: "Our calculator uses the 1R risk methodology. You input your entry, stop loss, and risk percentage (typically 1-2% of portfolio). The system calculates exact position size so that if you hit your stop, you lose exactly 1R—no more, no less. It also suggests scale-in levels and multiple take-profit targets."
  },
  {
    category: 'tools',
    question: "What's the difference between manual and AI chart analysis?",
    answer: "Manual analysis lets you select specific parameters (Price Action, CVD, OI, Volume) and get scenario-based recommendations from our 27 institutional patterns. AI analysis uses computer vision to automatically read your chart screenshot and provide instant interpretation—faster but slightly less precise."
  },
  {
    category: 'tools',
    question: "Can I import my existing trade history?",
    answer: "Yes! You can bulk import trades via CSV from your exchange. We also support manual entry for full control. The trading journal automatically calculates all metrics (win rate, profit factor, expectancy) and visualizes your performance over time."
  },
  {
    category: 'tools',
    question: "Does the platform provide trade signals or recommendations?",
    answer: "We provide market analysis and scenario interpretations, not direct 'buy/sell' signals. Our AI Analyzer gives you context (bullish/bearish/neutral) and smart money positioning, but YOU make the final decision. This keeps you in control and helps you learn market structure."
  },

  // Security & Data
  {
    category: 'security',
    question: "Is my trading data secure?",
    answer: "Absolutely. All data is encrypted in transit and at rest. We use industry-standard security protocols and never share your personal information or trading data with third parties. Your privacy is our priority."
  },
  {
    category: 'security',
    question: "Do you need access to my exchange accounts?",
    answer: "No! SmarTrading NEVER asks for your exchange API keys or login credentials. You manually input trade data, and we never touch your actual funds or accounts. This eliminates security risks entirely."
  },
  {
    category: 'security',
    question: "Where is my data stored?",
    answer: "Your data is stored on secure, encrypted cloud servers with regular backups. We comply with international data protection regulations and use enterprise-grade infrastructure to ensure reliability and security."
  },
  {
    category: 'security',
    question: "Can I export or delete my data?",
    answer: "Yes. You have full control over your data. You can export all your trading history, settings, and analytics at any time. If you want to delete your account and all associated data, you can do so instantly from account settings."
  },
  {
    category: 'security',
    question: "What happens to my data if I cancel my subscription?",
    answer: "Your data remains accessible for 30 days after cancellation in case you want to reactivate. After 30 days, your data is permanently deleted unless you choose to export it beforehand."
  }
];

const CATEGORIES = [
  { id: 'product', label: 'Product', icon: <Box className="w-4 h-4" /> },
  { id: 'pricing', label: 'Pricing', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'tools', label: 'Tools & Features', icon: <Zap className="w-4 h-4" /> },
  { id: 'security', label: 'Security & Data', icon: <Shield className="w-4 h-4" /> },
];

// --- COMPONENTS ---

const GlowingOrb = ({ color, className }) => (
  <div className={`absolute rounded-full blur-[100px] mix-blend-screen pointer-events-none opacity-10 ${className}`} style={{ background: color }} />
);

const AccordionItem = ({ item, isOpen, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 mb-4 ${isOpen
        ? 'border-indigo-500/30 bg-indigo-500/[0.05]'
        : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
        }`}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 transition-opacity duration-500 pointer-events-none ${isOpen ? 'opacity-100' : ''}`} />

      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left relative z-10 focus:outline-none"
      >
        <span className={`text-base md:text-lg font-medium transition-colors duration-300 pr-8 ${isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
          {item.question}
        </span>
        <div className={`shrink-0 p-2 rounded-full border transition-all duration-300 flex items-center justify-center ${isOpen
          ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rotate-90'
          : 'border-white/10 text-slate-500 bg-white/5 group-hover:border-white/20 group-hover:text-white group-hover:bg-white/10'
          }`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
              <div className="h-px w-full bg-white/5 mb-4" />
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('product');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filteredItems = FAQ_DATA.filter(item => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return searchQuery ? matchesSearch : matchesCategory;
  });

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6 relative overflow-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <GlowingOrb color="#6366f1" className="top-[5%] left-[10%] w-[500px] h-[500px] opacity-15" />
        <GlowingOrb color="#06b6d4" className="bottom-[20%] right-[10%] w-[600px] h-[600px] opacity-15" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Knowledge Base
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight"
          >
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-normal">help?</span>
          </motion.h1>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:bg-black/60 outline-none transition-all backdrop-blur-xl shadow-lg"
              />
            </div>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`flex flex-wrap justify-center gap-3 mb-10 transition-all duration-500 ${searchQuery ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }}
              className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-md
                        ${activeCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-white/20 shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10'}
                    `}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* FAQ List */}
        <motion.div
          layout
          className="relative min-h-[300px]"
        >
          <AnimatePresence mode="wait">
            {filteredItems.length > 0 ? (
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {filteredItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    item={item}
                    isOpen={openIndex === index}
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]"
              >
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-light mb-2">No results found for "{searchQuery}"</p>
                <p className="text-sm mb-6">Try adjusting your search terms</p>
                <Button
                  variant="secondary"
                  onClick={() => setSearchQuery('')}
                  size="sm"
                >
                  Clear Search
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <GlassCard className="p-8 md:p-10 border-indigo-500/20 bg-indigo-900/5 relative overflow-hidden text-center">
            {/* Internal Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-2xl font-light text-white mb-3">Still have questions?</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you get back to trading.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="primary" className="shadow-lg shadow-indigo-500/20">
                  <MessageCircle className="w-4 h-4 mr-2" /> Chat with Support
                </Button>
                <Link to={createPageUrl("Contact")}>
                  <Button variant="secondary">
                    <Mail className="w-4 h-4 mr-2" /> Email Us
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </div>
  );
}