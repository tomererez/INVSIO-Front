
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, Activity, TrendingUp, TrendingDown, 
  Target, AlertTriangle, Zap, Layers, 
  BarChart3, XCircle
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';

// --- MOCK DATA ---

const LIVE_FEED_ITEMS = [
  { id: 1, type: 'insight', text: "Price accepted above Daily VAH. Momentum shifting bullish.", time: "Now" },
  { id: 2, type: 'alert', text: "CVD Divergence detected on 15m. Delta not supporting new highs.", time: "2m ago" },
  { id: 3, type: 'structure', text: "Liquidity sweep at $65,100 complete. Reclaiming range.", time: "5m ago" },
  { id: 4, type: 'insight', text: "Open Interest increasing with price. Trend strength: High.", time: "12m ago" },
];

const TIMEFRAME_ANALYSIS = [
  {
    id: 'macro',
    label: 'MACRO',
    sub: '1d-4h Timeframe',
    status: 'Bearish',
    color: 'rose',
    desc: 'Structure remains lower-highs/lower-lows. Rejection at weekly resistance indicates seller dominance.',
    points: ['Negative CVD with price up', 'Decreasing Open Interest']
  },
  {
    id: 'micro',
    label: 'MICRO',
    sub: '1h-4h Timeframe',
    status: 'Neutral',
    color: 'amber',
    desc: 'Consolidating within a tight range. Mixed signals from exchange divergence suggesting a potential impulse soon.',
    points: ['Downward trend with weak momentum', 'RSI Resetting']
  },
  {
    id: 'scalp',
    label: 'SCALPING',
    sub: '5m-30m Timeframe',
    status: 'Neutral',
    color: 'amber',
    desc: 'Chop zone. Not ideal due to mixed volatility and lack of clear invalidation levels.',
    points: ['Volatility: Medium', 'Approach: Wait for breakout']
  }
];

const SETUPS = {
  long: [
    { price: '$87,500 - $88,000', label: 'Potential Demand Zone', invalidation: '$87,000', confidence: 'Medium' },
    { price: '$86,000 - $86,500', label: 'Whale Accumulation Area', invalidation: '$85,500', confidence: 'Low' }
  ],
  short: [
    { price: '$90,500 - $91,000', label: 'Bearish Divergence Zone', invalidation: '$91,500', confidence: 'High' },
    { price: '$89,500 - $90,000', label: 'Retail Exhaustion Level', invalidation: '$90,500', confidence: 'Medium' }
  ]
};

// --- COMPONENTS ---

// 1. BIAS GAUGE (Fixed Gradient)
const BiasGauge: React.FC<{ score: number }> = ({ score }) => {
  // Score: 0 (Bearish/Red) -> 100 (Bullish/Green)
  // Rotation: -90deg (Left) -> +90deg (Right)
  const rotation = (score / 100) * 180 - 90;
  
  let status = "Neutral";
  let colorClass = "text-slate-200";
  if (score > 60) { status = "Bullish"; colorClass = "text-emerald-400"; }
  else if (score < 40) { status = "Bearish"; colorClass = "text-rose-400"; }

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      {/* Semi Circle Track */}
      <div className="relative w-64 h-32 overflow-hidden mb-6">
        {/* Background Grey Track */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[12px] border-white/5 border-b-0 box-border" />
        
        {/* Gradient Track (Red -> Yellow -> Green) */}
        <div 
            className="absolute top-0 left-0 w-64 h-64 rounded-full" 
            style={{
                // USING EXPLICIT DEGREES to ensure full coverage
                // 270deg (Left/Start) -> Red
                // 360deg/0deg (Top/Center) -> Yellow (at 90deg of rotation)
                // 90deg (Right/End) -> Green (at 180deg of rotation)
                background: 'conic-gradient(from 270deg, #ef4444 0deg, #fbbf24 90deg, #10b981 180deg, transparent 180deg)',
                
                // Mask to create a ring
                WebkitMaskImage: 'radial-gradient(farthest-side, transparent calc(100% - 12px), black calc(100% - 12px))',
                maskImage: 'radial-gradient(farthest-side, transparent calc(100% - 12px), black calc(100% - 12px))'
            }}
        />
        
        {/* Needle */}
        <motion.div 
            className="absolute bottom-0 left-1/2 w-1.5 h-28 bg-white origin-bottom rounded-full z-10"
            initial={{ rotate: -90 }}
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            style={{ 
                boxShadow: '0 0 15px rgba(255,255,255,0.8)',
                transformOrigin: 'bottom center'
            }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-white rounded-full z-20 shadow-[0_0_20px_rgba(255,255,255,1)] border-4 border-slate-900" />
      </div>

      <div className="text-center">
        <motion.div 
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl font-bold tracking-tight uppercase mb-1 ${colorClass}`}
            style={{ textShadow: '0 0 30px currentColor' }}
        >
            {status}
        </motion.div>
        
        {/* Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
            score > 60 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            score < 40 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
            'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${score > 60 ? 'bg-emerald-400' : score < 40 ? 'bg-rose-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${score > 60 ? 'bg-emerald-500' : score < 40 ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-xs font-bold tracking-wider uppercase">Confidence: {Math.round(Math.abs(score - 50) * 2)}%</span>
        </div>
      </div>
    </div>
  );
};

// 2. LIVE FEED ITEM
const FeedItem: React.FC<{ item: any }> = ({ item }) => {
    const icon = item.type === 'alert' ? <AlertTriangle className="w-4 h-4 text-rose-400" /> 
               : item.type === 'structure' ? <Layers className="w-4 h-4 text-indigo-400" />
               : <Zap className="w-4 h-4 text-emerald-400" />;
    
    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 items-start p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
        >
            <div className="mt-0.5">{icon}</div>
            <div>
                <p className="text-sm text-slate-200 leading-snug font-light">{item.text}</p>
                <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
            </div>
        </motion.div>
    );
};

// 3. TIMEFRAME CARD
const TimeframeCard: React.FC<{ data: any }> = ({ data }) => {
    const colors = {
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    };
    
    // @ts-ignore
    const theme = colors[data.color] || colors.amber;

    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">{data.label}</h4>
                        <span className="text-[10px] text-slate-500 uppercase">{data.sub}</span>
                    </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${theme}`}>
                    {data.status}
                </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
                {data.desc}
            </p>

            <div className="space-y-1.5 pt-4 border-t border-white/5">
                {data.points.map((pt: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-slate-300">
                        <div className={`w-1 h-1 rounded-full ${data.color === 'rose' ? 'bg-rose-500' : data.color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {pt}
                    </div>
                ))}
            </div>
        </div>
    );
};

// 4. SETUP CARD
const SetupRow: React.FC<{ setup: any, type: 'long' | 'short' }> = ({ setup, type }) => (
    <div className={`p-4 rounded-xl border mb-3 last:mb-0 relative overflow-hidden group ${
        type === 'long' 
        ? 'bg-emerald-900/5 border-emerald-500/10 hover:border-emerald-500/30' 
        : 'bg-rose-900/5 border-rose-500/10 hover:border-rose-500/30'
    }`}>
        {/* Hover Highlight */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-r ${
            type === 'long' ? 'from-emerald-500/5 to-transparent' : 'from-rose-500/5 to-transparent'
        }`} />

        <div className="flex justify-between items-start mb-2 relative z-10">
            <div className={`font-mono font-bold text-sm ${type === 'long' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {setup.price}
            </div>
            <div className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                setup.confidence === 'High' ? 'bg-white/10 text-white' : 
                setup.confidence === 'Medium' ? 'bg-white/5 text-slate-300' : 
                'bg-white/5 text-slate-500'
            }`}>
                {setup.confidence} Conf
            </div>
        </div>
        
        <p className="text-xs text-slate-400 mb-3 relative z-10">{setup.label}</p>
        
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono relative z-10">
            <XCircle className="w-3 h-3" /> Invalidation: <span className="text-slate-300">{setup.invalidation}</span>
        </div>
    </div>
);

// 5. SCENARIO BAR (Refactored to be inset)
const ScenarioBar: React.FC<{ label: string, prob: number, colorClass: string }> = ({ label, prob, colorClass }) => (
    <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-center mb-4 z-10 relative">
            <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${colorClass.replace('text-', 'bg-')}`} />
                <span className={`text-sm font-medium ${colorClass}`}>{label}</span>
            </div>
            <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded">{prob}%</span>
        </div>
        
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${prob}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`}
            />
        </div>
        
        <div className="mt-auto pt-4 border-t border-white/5 text-[10px] text-slate-400 flex justify-between">
            <span>Target: <span className="text-white font-mono">$93,000</span></span>
            <span>Trigger: <span className="text-white">Break $91k</span></span>
        </div>
    </div>
);


export const MarketAnalyzer: React.FC = () => {
  const [activeScore, setActiveScore] = useState(35); // Bearish Default
  
  useEffect(() => {
    const interval = setInterval(() => {
        // Subtle fluctuation to simulate live data
        setActiveScore(prev => Math.min(100, Math.max(0, prev + (Math.random() * 4 - 2))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    // REDUCED pb-40 to pb-12 to fix bottom extension issue
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
               <div className="px-2 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10 text-[10px] text-indigo-300 font-mono animate-pulse flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                   LIVE_STREAM_ACTIVE
               </div>
           </div>
           <h1 className="text-3xl font-light text-white mb-2">AI Market Analyzer <span className="text-indigo-500 text-lg font-normal">v2.1</span></h1>
           <p className="text-slate-400 text-sm">Powered by OpenAI GPT 5, Cloude Sonnet 4.5, Gemini 3.0 • Premium Intelligence Engine</p>
        </div>
        <div className="flex gap-2">
            <Button variant="primary" size="sm" className="shadow-[0_0_20px_rgba(245,158,11,0.2)] border-amber-500/20 text-amber-100">
                <Zap className="w-3.5 h-3.5 mr-2 text-amber-400 fill-amber-400" /> Run Premium AI Scan
            </Button>
        </div>
      </div>

      {/* TICKER STRIP */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: 'BTC Price', val: '$89,277', sub: '+0.19%', color: 'text-emerald-400' },
            { label: 'Market Regime', val: 'Unclear', sub: 'Confidence: 4/10', color: 'text-white' },
            { label: 'AI Bias', val: 'WAIT', sub: 'Score: 3.5/10', color: 'text-amber-400' },
            { label: 'Whale Activity', val: 'Balanced', sub: 'Ratio: 0.86', color: 'text-white' }
        ].map((stat, i) => (
            <GlassCard key={i} className="p-4 flex flex-col items-start justify-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    {i === 0 && <Activity className="w-3 h-3 text-indigo-400" />}
                    {stat.label}
                </div>
                <div className={`text-xl font-bold ${stat.color}`}>{stat.val}</div>
                <div className="text-[10px] text-slate-400">{stat.sub}</div>
            </GlassCard>
        ))}
      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: GAUGE & ALERTS */}
        <div className="space-y-6 lg:sticky lg:top-24">
            
            {/* The Gauge */}
            <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                <BiasGauge score={activeScore} />
                
                <div className="w-full flex justify-between items-center mt-8 border-t border-white/5 pt-4">
                    <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase">Current Price</div>
                        <div className="text-white font-mono text-lg">$89,277</div>
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] text-slate-500 uppercase">24h Change</div>
                        <div className="text-emerald-400 font-mono text-lg">+0.19%</div>
                    </div>
                </div>
            </GlassCard>

            {/* Smart Alerts Feed */}
            <GlassCard className="p-0 overflow-hidden max-h-[400px]">
                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400 fill-current" /> Live Feed
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Updating
                    </div>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto">
                    {LIVE_FEED_ITEMS.map(item => (
                        <FeedItem key={item.id} item={item} />
                    ))}
                </div>
            </GlassCard>
        </div>

        {/* RIGHT COLUMN: DEEP ANALYSIS */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Timeframe Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIMEFRAME_ANALYSIS.map((tf) => (
                    <TimeframeCard key={tf.id} data={tf} />
                ))}
            </div>

            {/* 2. Setups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Longs */}
                <GlassCard className="p-0 overflow-hidden h-full flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-emerald-500/[0.02] flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-sm font-bold text-emerald-100">Long Setups</h3>
                    </div>
                    <div className="p-4 flex-1">
                        {SETUPS.long.map((setup, i) => (
                            <SetupRow key={i} setup={setup} type="long" />
                        ))}
                    </div>
                </GlassCard>

                {/* Shorts */}
                <GlassCard className="p-0 overflow-hidden h-full flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-rose-500/[0.02] flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-rose-400" />
                        <h3 className="text-sm font-bold text-rose-100">Short Setups</h3>
                    </div>
                    <div className="p-4 flex-1">
                        {SETUPS.short.map((setup, i) => (
                            <SetupRow key={i} setup={setup} type="short" />
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* 3. Action Plan & Scenarios (Combined Section) */}
            <GlassCard className="p-6 border-l-4 border-l-amber-500/50">
                <div className="flex items-center gap-2 mb-6">
                    <Target className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">Action Plan</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Primary Strategy</div>
                        <p className="text-white font-medium text-lg mb-4">Look for short setups due to bearish signs</p>
                        
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Key Levels to Watch</div>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-xs font-mono">$88,500</span>
                            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-xs font-mono">$90,000</span>
                        </div>
                    </div>
                    
                    <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Risk Level</div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-xs font-bold uppercase">Medium</span>
                            <span className="text-sm text-slate-400">Size: Conservative</span>
                        </div>

                        <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <div className="text-xs font-bold text-rose-400 uppercase">Avoid</div>
                                <div className="text-xs text-rose-200/70">Entering large positions without confirmation of trend</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scenarios - Nested Inside Action Plan */}
                <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-bold text-white">Market Scenarios</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ScenarioBar label="Bullish Scenario" prob={30} colorClass="text-emerald-400" />
                        <ScenarioBar label="Bearish Scenario" prob={70} colorClass="text-rose-400" />
                    </div>
                </div>
            </GlassCard>

        </div>

      </div>
    </div>
  );
};
