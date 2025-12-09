
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Minus, Box, DollarSign,
  Zap, Shield, HelpCircle, MessageCircle, Mail, ArrowRight
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';

// --- MOCK DATA ---

const FAQ_DATA = [
  // Product
  {
    category: 'product',
    question: "What makes MarketFlow different from TradingView?",
    answer: "TradingView is a charting platform. MarketFlow is an intelligence platform. We don't just show you price; we show you the hidden data driving price: aggregated order flow, liquidity heatmaps, and whale wallet tracking, all processed by AI to give you actionable signals, not just lines on a chart."
  },
  {
    category: 'product',
    question: "Do I need to download software?",
    answer: "No. MarketFlow is entirely web-based and optimized for all modern browsers. It works seamlessly on desktop, tablet, and mobile, allowing you to track the markets from anywhere."
  },
  {
    category: 'product',
    question: "Is the data real-time?",
    answer: "Yes. Our Pro and Whale plans feature sub-50ms latency data directly from exchange websockets. The Starter (free) plan has a 15-minute delay."
  },

  // Pricing
  {
    category: 'pricing',
    question: "Can I pay with Crypto?",
    answer: "Yes, we accept USDT, USDC, ETH, and BTC for annual subscriptions. For monthly subscriptions, we currently support credit cards and PayPal."
  },
  {
    category: 'pricing',
    question: "What happens if I upgrade mid-month?",
    answer: "Your billing will be pro-rated. You'll be charged the difference for the remaining days of the month, and your new features will unlock instantly."
  },

  // Tools & Features
  {
    category: 'tools',
    question: "How does the AI Sentiment Engine work?",
    answer: "Our engine scans over 50,000 data points per second, including social media volume (Twitter/Reddit), funding rates, long/short ratios, and liquidation data to generate a composite 'Fear & Greed' score that is far more reactive than standard indices."
  },
  {
    category: 'tools',
    question: "Can I set custom alerts?",
    answer: "Absolutely. You can configure alerts for price levels, RSI divergence, CVD spikes, and specific whale wallet movements. Alerts can be delivered via the app, email, or Telegram bot."
  },

  // Security & Data
  {
    category: 'security',
    question: "Is my personal data safe?",
    answer: "Security is our priority. We use bank-grade AES-256 encryption for all data transmission. We do not sell your personal data or trading history to third parties."
  },
  {
    category: 'security',
    question: "Do you have access to my exchange account?",
    answer: "No. MarketFlow is an analytics layer. We do not execute trades on your behalf and we never ask for your private keys or withdrawal permissions."
  }
];

const CATEGORIES = [
  { id: 'product', label: 'Product', icon: <Box className="w-4 h-4" /> },
  { id: 'pricing', label: 'Pricing', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'tools', label: 'Tools & Features', icon: <Zap className="w-4 h-4" /> },
  { id: 'security', label: 'Security & Data', icon: <Shield className="w-4 h-4" /> },
];

// --- COMPONENTS ---

interface AccordionItemProps {
  item: typeof FAQ_DATA[0];
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onClick, index }) => {
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

export const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('product');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredItems = FAQ_DATA.filter(item => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return searchQuery ? matchesSearch : matchesCategory;
  });

  return (
    <div className="min-h-screen bg-void pt-32 pb-20 px-6 relative overflow-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
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
                <Button variant="secondary">
                  <Mail className="w-4 h-4 mr-2" /> Email Us
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </div>
  );
};
