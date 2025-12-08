
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Minus, Box, DollarSign, 
  Zap, Shield, HelpCircle, ChevronRight 
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

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
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onClick }) => {
  return (
    <motion.div 
      initial={false}
      className={`group border-b border-white/5 last:border-0 ${isOpen ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}
    >
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
      >
        <span className={`text-base font-medium transition-colors ${isOpen ? 'text-indigo-300' : 'text-slate-300 group-hover:text-white'}`}>
          {item.question}
        </span>
        <div className={`p-1 rounded-full border transition-all duration-300 ${
            isOpen ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 rotate-180' : 'border-white/10 text-slate-500'
        }`}>
            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed max-w-3xl">
              {item.answer}
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
         <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] mix-blend-screen" />
         <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-medium uppercase tracking-widest mb-6"
            >
                <HelpCircle className="w-3.5 h-3.5" /> Help Center
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-light text-white mb-6"
            >
                How can we <span className="text-indigo-400">help?</span>
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search for answers..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-black/60 outline-none transition-all backdrop-blur-xl"
                    />
                </div>
            </motion.div>
        </div>

        {/* Category Tabs */}
        {!searchQuery && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-3 mb-10"
            >
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }}
                        className={`
                            flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
                            ${activeCategory === cat.id 
                                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                                : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'}
                        `}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </motion.div>
        )}

        {/* FAQ Content */}
        <motion.div 
            layout
            className="relative"
        >
            <GlassCard className="p-0 overflow-hidden min-h-[300px]">
                {filteredItems.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {filteredItems.map((item, index) => (
                            <AccordionItem 
                                key={index} 
                                item={item} 
                                isOpen={openIndex === index} 
                                onClick={() => setOpenIndex(openIndex === index ? null : index)} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-slate-500">
                        <p>No results found for "{searchQuery}"</p>
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm flex items-center justify-center gap-1"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </GlassCard>
        </motion.div>

        {/* Footer Support CTA */}
        <div className="mt-16 text-center">
            <p className="text-slate-400 mb-4">Still need assistance?</p>
            <div className="flex justify-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all">
                    Contact Support
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium transition-all">
                    Join Community
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};
