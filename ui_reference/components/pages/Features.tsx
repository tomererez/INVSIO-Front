
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, Calculator, Brain, BookOpen, LayoutDashboard, 
  Target, Zap, Activity, Shield, TrendingUp, AlertTriangle, ArrowRight,
  Crosshair, Layers, FileText, Check, BarChart2, Upload, TrendingDown,
  DollarSign
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';

// --- VISUAL COMPONENTS ---

const RadarVisual = () => (
  <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center">
    {/* Concentric Circles */}
    <div className="absolute inset-0 rounded-full border border-cyan-500/10" />
    <div className="absolute inset-[15%] rounded-full border border-cyan-500/10" />
    <div className="absolute inset-[30%] rounded-full border border-cyan-500/10" />
    <div className="absolute inset-[45%] rounded-full border border-cyan-500/20" />
    
    {/* Rotating Scan - Slower (8s cycle) to allow for readable data hits */}
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 rounded-full bg-[conic-gradient(transparent_270deg,rgba(6,182,212,0.15)_360deg)]"
    />
    
    {/* Center Core */}
    <div className="relative z-10 w-20 h-20 rounded-full bg-cyan-950/50 border border-cyan-500/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
      <Radar className="w-8 h-8 text-cyan-400" />
    </div>

    {/* 
        DATA BLIPS: 
        Synchronized with the 8s rotation.
        Cycle = Duration (2s) + RepeatDelay (6s) = 8s Total.
    */}

    {/* 1. LIQ_HUNT (Rose) - Top Right (~45deg -> ~1s mark) */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.1] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.8, repeatDelay: 6 }}
      className="absolute top-[20%] right-[20%] flex items-center gap-2"
    >
      <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
      <span className="text-[10px] text-rose-400 font-mono bg-black/50 px-1 rounded border border-rose-500/20">LIQ_HUNT</span>
    </motion.div>

    {/* 2. OI_EXPANSION (Emerald) - Bottom Left (~225deg -> ~5s mark) */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.1] }}
      transition={{ duration: 2, repeat: Infinity, delay: 4.8, repeatDelay: 6 }}
      className="absolute bottom-[25%] left-[25%] flex items-center gap-2"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
      <span className="text-[10px] text-emerald-400 font-mono bg-black/50 px-1 rounded border border-emerald-500/20">OI_EXPANSION</span>
    </motion.div>

    {/* 3. CVD_ABSORPTION (Purple) - Top Left (~315deg -> ~7s mark) */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.1] }}
      transition={{ duration: 2, repeat: Infinity, delay: 6.8, repeatDelay: 6 }}
      className="absolute top-[25%] left-[20%] flex items-center gap-2"
    >
      <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
      <span className="text-[10px] text-purple-400 font-mono bg-black/50 px-1 rounded border border-purple-500/20">CVD_ABSORPTION</span>
    </motion.div>
  </div>
);

const CalculatorVisual = () => (
  <div className="relative w-full max-w-[400px] mx-auto group">
    {/* Background Glow */}
    <div className="absolute -inset-0.5 bg-gradient-to-b from-emerald-500/20 to-transparent blur-2xl opacity-20 group-hover:opacity-40 transition-duration-500" />
    
    <GlassCard className="p-0 border-emerald-500/30 bg-black/60 overflow-hidden relative backdrop-blur-xl">
      
      {/* SCAN LINE ANIMATION */}
      <motion.div 
        animate={{ top: ['-20%', '120%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent z-0 pointer-events-none"
      />

      {/* HEADER */}
      <div className="relative z-10 p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Risk Engine Active</span>
         </div>
         <div className="font-mono text-[10px] text-emerald-500/50">SYS_V2.1</div>
      </div>
      
      {/* METRICS BODY */}
      <div className="relative z-10 p-6 space-y-6">
         
         {/* Metric 1 */}
         <div className="space-y-2">
            <div className="flex justify-between text-xs">
               <span className="text-slate-400">Stop Loss Distance</span>
               <span className="text-emerald-400 font-mono font-medium">1.2% (OPTIMAL)</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '40%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
               />
            </div>
         </div>

         {/* Metric 2 */}
         <div className="space-y-2">
            <div className="flex justify-between text-xs">
               <span className="text-slate-400">Volatility Index</span>
               <span className="text-amber-400 font-mono font-medium">HIGH (ADJUSTING SIZE)</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '85%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
               />
            </div>
         </div>

         {/* Metric 3 */}
         <div className="space-y-2">
            <div className="flex justify-between text-xs">
               <span className="text-slate-400">Liquidity Depth</span>
               <span className="text-indigo-400 font-mono font-medium">SUFFICIENT</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '70%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
               />
            </div>
         </div>
         
         {/* Grid of smaller checks */}
         <div className="grid grid-cols-2 gap-2 pt-2">
             {['Structure', 'Trend', 'Spread', 'Fee'].map((label, i) => (
                 <motion.div 
                    key={label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    className="flex items-center justify-between px-3 py-2 rounded bg-white/5 border border-white/5"
                 >
                     <span className="text-[10px] text-slate-500 uppercase">{label}</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 </motion.div>
             ))}
         </div>

      </div>

      {/* FOOTER RESULT */}
      <div className="relative z-10 p-6 bg-emerald-950/20 border-t border-emerald-500/20">
         <div className="flex justify-between items-end">
             <div>
                 <div className="text-[10px] text-emerald-400/70 uppercase tracking-wider mb-1 font-semibold">Calculated Size</div>
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-4xl font-mono font-bold text-white tracking-tighter leading-none"
                 >
                    1.424 <span className="text-lg text-emerald-500 ml-1">BTC</span>
                 </motion.div>
             </div>
             <Shield className="w-8 h-8 text-emerald-500/20" />
         </div>
      </div>
      
    </GlassCard>
  </div>
);

const Typewriter = ({ text, delay }: { text: string, delay: number }) => {
  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { transition: { staggerChildren: 0.02, delayChildren: delay } },
        hidden: {}
      }}
      className="mb-3 font-medium leading-relaxed"
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

const CoachVisual = () => (
  <div className="relative w-full max-w-[400px] mx-auto flex flex-col gap-4 font-sans">
     {/* User Msg */}
     <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="self-end max-w-[85%]"
     >
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tr-sm text-sm text-slate-300 shadow-lg backdrop-blur-sm">
           Why am I losing so many BTC shorts lately?
        </div>
        <div className="text-[10px] text-slate-500 text-right mt-1 pr-1 font-mono">USER</div>
     </motion.div>

     {/* AI Msg */}
     <div className="self-start max-w-[95%]">
        <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl rounded-tl-sm text-sm text-indigo-100 relative overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.15)] backdrop-blur-sm"
        >
           <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
           
           <Typewriter text="Because your entries conflict with the Market Analyzer bias." delay={1.5} />
           
           <motion.div 
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ opacity: 1, height: 'auto' }}
              viewport={{ once: true }}
              transition={{ delay: 3.0, duration: 0.5 }}
              className="space-y-2 mb-4 overflow-hidden"
           >
              <div className="bg-black/40 p-2.5 rounded border border-white/5 text-xs text-rose-300 flex gap-2 items-center">
                 <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                 <span>71% opened while HTF bias was <span className="font-bold text-emerald-400">LONG</span></span>
              </div>
              <div className="bg-black/40 p-2.5 rounded border border-white/5 text-xs text-rose-300 flex gap-2 items-center">
                 <Activity className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                 <span>CVD showed strong absorption</span>
              </div>
           </motion.div>

           <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 3.8, duration: 0.5 }}
              className="text-xs text-slate-400 italic"
           >
              Waiting for alignment would have saved 17 losses.
           </motion.p>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-[10px] text-indigo-400 mt-1 pl-1 flex items-center gap-1 font-mono"
        >
            <Brain className="w-3 h-3" /> AI COACH
        </motion.div>
     </div>
  </div>
);

const JournalVisual = () => (
  <div className="relative w-full max-w-[400px] mx-auto">
    <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-30" />
    <GlassCard className="p-0 overflow-hidden relative border-white/10 bg-black/50">
       
       {/* Fake Header */}
       <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
           <div className="flex items-center gap-2">
               <FileText className="w-4 h-4 text-slate-400" />
               <span className="text-xs font-bold text-slate-300 uppercase">Trade Log</span>
           </div>
           <div className="flex gap-1.5">
               <div className="w-2 h-2 rounded-full bg-rose-500/20 border border-rose-500/50" />
               <div className="w-2 h-2 rounded-full bg-amber-500/20 border border-amber-500/50" />
               <div className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
           </div>
       </div>

       {/* List Items */}
       <div className="p-4 space-y-3">
           {/* Item 1 - Processing */}
           <motion.div 
               initial={{ x: -20, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between"
           >
               <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                       <Upload className="w-4 h-4" />
                   </div>
                   <div>
                       <div className="text-xs text-white font-medium">Importing Binance.csv</div>
                       <div className="text-[10px] text-slate-500">Processing 142 trades...</div>
                   </div>
               </div>
               <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
           </motion.div>

           {/* Item 2 - Tagged Trade */}
           <motion.div 
               initial={{ x: -20, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.6 }}
               className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between relative overflow-hidden"
           >
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
               <div className="flex items-center gap-3">
                   <div className="flex flex-col pl-2">
                       <span className="text-xs font-bold text-white">BTC/USD</span>
                       <span className="text-[10px] text-emerald-400">LONG</span>
                   </div>
               </div>
               <div className="flex flex-col items-end">
                   <span className="text-xs font-bold text-emerald-400">+$2,402</span>
                   <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 mt-1">A+ Setup</span>
               </div>
           </motion.div>

           {/* Item 3 - Mistake */}
           <motion.div 
               initial={{ x: -20, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.8 }}
               className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between relative overflow-hidden"
           >
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
               <div className="flex items-center gap-3">
                   <div className="flex flex-col pl-2">
                       <span className="text-xs font-bold text-white">ETH/USDT</span>
                       <span className="text-[10px] text-rose-400">SHORT</span>
                   </div>
               </div>
               <div className="flex flex-col items-end">
                   <span className="text-xs font-bold text-rose-400">-$890</span>
                   <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20 mt-1 flex items-center gap-1">
                       <AlertTriangle className="w-3 h-3" /> FOMO
                   </span>
               </div>
           </motion.div>
       </div>

       {/* AI Insight Overlay */}
       <motion.div 
           initial={{ y: 20, opacity: 0 }}
           whileInView={{ y: 0, opacity: 1 }}
           transition={{ delay: 1.2 }}
           className="m-4 mt-2 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex gap-3"
       >
           <Brain className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
           <div className="text-[10px] text-indigo-200">
               <span className="font-bold text-indigo-400">Insight:</span> You lose 82% of trades entered between 2AM-4AM EST.
           </div>
       </motion.div>

    </GlassCard>
  </div>
);

const DashboardVisual = () => (
  <div className="relative w-full max-w-[400px] mx-auto">
     <div className="absolute -inset-1 bg-gradient-to-t from-cyan-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-30" />
     <GlassCard className="p-5 border-white/10 bg-black/60 relative overflow-hidden">
        
        <div className="flex justify-between items-end mb-6">
            <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Total Equity</div>
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-3xl font-light text-white font-mono"
                >
                    $142,890
                </motion.div>
            </div>
            <div className="text-right">
                 <div className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">+12.4% this month</div>
            </div>
        </div>

        {/* Chart Area */}
        <div className="h-32 w-full relative mb-6">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
                <div className="w-full h-px bg-white/5" />
                <div className="w-full h-px bg-white/5" />
                <div className="w-full h-px bg-white/5" />
            </div>

            {/* Line Chart Path */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <motion.path 
                    d="M0 128 L 40 110 L 80 115 L 120 90 L 160 95 L 200 60 L 240 70 L 280 40 L 320 45 L 360 10"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path 
                    d="M0 128 L 40 110 L 80 115 L 120 90 L 160 95 L 200 60 L 240 70 L 280 40 L 320 45 L 360 10 V 128 H 0 Z"
                    fill="url(#gradientArea)"
                    stroke="none"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                />
            </svg>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="p-2 rounded bg-white/5 border border-white/5 text-center"
            >
                <div className="text-[9px] text-slate-500 uppercase">Win Rate</div>
                <div className="text-sm font-bold text-white">68%</div>
            </motion.div>
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="p-2 rounded bg-white/5 border border-white/5 text-center"
            >
                <div className="text-[9px] text-slate-500 uppercase">P. Factor</div>
                <div className="text-sm font-bold text-emerald-400">2.42</div>
            </motion.div>
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.6 }}
               className="p-2 rounded bg-white/5 border border-white/5 text-center"
            >
                <div className="text-[9px] text-slate-500 uppercase">Avg R:R</div>
                <div className="text-sm font-bold text-white">3.1R</div>
            </motion.div>
        </div>

     </GlassCard>
  </div>
);

const FEATURE_BOXES = [
    { title: "AI Market Analyzer", desc: "Deep-scan structural anomalies, liquidity sweeps, and sentiment shifts in real-time.", icon: <Radar /> },
    { title: "Position Engine", desc: "Dynamic risk calculator outputs optimal position size based on volatility.", icon: <Calculator /> },
    { title: "Smart Journal", desc: "Automated trade logging with AI tagging. Upload CSVs in seconds.", icon: <BookOpen /> },
    { title: "AI Trading Coach", desc: "Personalized neural network analyzing psychological leaks.", icon: <Brain /> },
    { title: "Performance Dashboard", desc: "Institutional-grade analytics tracking equity curve and expectancy.", icon: <LayoutDashboard /> },
];

const FeatureBox = ({ item, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + (index * 0.1) }}
    className="h-full"
  >
    <GlassCard 
        className="p-6 h-full flex flex-col items-start text-left group border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
        glowColor="rgba(255, 255, 255, 0.15)"
    >
        <div className="mb-4 w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 transition-all duration-300">
            {React.cloneElement(item.icon, { className: "w-5 h-5" })}
        </div>
        <h3 className="text-base font-medium text-white mb-2">{item.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed font-light">{item.desc}</p>
    </GlassCard>
  </motion.div>
);

export const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        
        {/* 1. HEADER (THE COMPLETE ARSENAL) */}
        <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium uppercase tracking-widest mb-6"
            >
                <Crosshair className="w-3.5 h-3.5 text-indigo-400" /> System Modules
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight"
            >
                The Complete <span className="text-indigo-400 font-normal">Arsenal.</span>
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto"
            >
                Institutional-grade weaponry for the retail trader. <br/>
                Five modules. One objective: <span className="text-white font-medium">Dominance.</span>
            </motion.p>
        </div>

        {/* 2. FEATURE BOXES */}
        <div className="flex flex-col gap-6 max-w-5xl mx-auto mb-40 px-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FEATURE_BOXES.slice(0, 3).map((item, i) => (
                    <FeatureBox key={i} item={item} index={i} />
                ))}
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-2/3 mx-auto">
                {FEATURE_BOXES.slice(3, 5).map((item, i) => (
                    <FeatureBox key={i + 3} item={item} index={i + 3} />
                ))}
            </div>
        </div>

        {/* 3. DEEP DIVE 1: ANALYZER */}
        <section className="mb-40">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                            <Radar className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-light text-white">See the <span className="text-cyan-400 font-normal">Invisible</span></h2>
                    </div>
                    
                    <p className="text-lg text-slate-300 font-medium mb-4 leading-relaxed border-l-2 border-cyan-500/30 pl-4">
                        If you’re watching candles, you’re already behind. <br/>
                        INVSIO exposes the mechanics market makers don’t want you to see.
                    </p>
                    
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                        Our Market Analyzer breaks down open interest manipulation, CVD absorption, liquidity engineering, and liquidation pressure — turning chaos into a clear directional bias.
                    </p>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4">Actionable Intelligence</h4>
                        {[
                            'Liquidity Targets (Next hunt zones)',
                            'OI Expansion/Compression Alerts',
                            'Aggressive Buy/Sell Divergences',
                            'Sweep → Reversal Detection',
                            'Confidence-Weighted Signals'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_5px_currentColor]" />
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <RadarVisual />
                </motion.div>
            </div>
        </section>

        {/* 4. DEEP DIVE 2: CALCULATOR */}
        <section className="mb-40">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="order-2 lg:order-1"
                >
                    <CalculatorVisual />
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="order-1 lg:order-2"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <Calculator className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-light text-white">Calculated <span className="text-emerald-400 font-normal">Immunity</span></h2>
                    </div>
                    
                    <p className="text-lg text-slate-300 font-medium mb-4 leading-relaxed border-l-2 border-emerald-500/30 pl-4">
                        Amateurs guess. Professionals measure. <br/>
                        INVSIO enforces.
                    </p>
                    
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                        Most traders blow up because they size like degenerates. 
                        INVSIO’s Position Engine computes your exact lot size based on volatility, equity, and stop distance, making over-risking mathematically impossible.
                    </p>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Protection Protocols</h4>
                        <div className="space-y-3">
                             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                 <span className="text-slate-300">Dynamic Sizing</span>
                                 <span className="text-slate-500">Volatility-weighted calibration</span>
                             </div>
                             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                 <span className="text-slate-300">Risk Guard</span>
                                 <span className="text-slate-500">Hard equity-loss limits</span>
                             </div>
                             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                 <span className="text-slate-300">Reward Matrix</span>
                                 <span className="text-slate-500">Auto R:R validation</span>
                             </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* 5. DEEP DIVE 3: COACH */}
        <section className="mb-40">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                            <Brain className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-light text-white">Your Personal <span className="text-indigo-400 font-normal">Quant</span></h2>
                    </div>
                    
                    <p className="text-lg text-slate-300 font-medium mb-4 leading-relaxed border-l-2 border-indigo-500/30 pl-4">
                        You can lie to yourself. <br/>
                        You can’t lie to your data.
                    </p>
                    
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                        INVSIO’s Behavioral Engine dissects every trade you make — the timing, the risk, the emotional fingerprints — and exposes the patterns silently draining your edge.
                    </p>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">Advanced Diagnostics</h4>
                        {[
                            'Psychological Patterns (FOMO, Tilt, Hesitation)',
                            'Execution Leaks (Late entries, early exits)',
                            'Risk Violations (Inconsistent stops)',
                            'Strategy Analysis (What actually works)'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_5px_currentColor]" />
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <CoachVisual />
                </motion.div>
            </div>
        </section>

        {/* 6. DEEP DIVE 4: JOURNAL */}
        <section className="mb-40">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="order-2 lg:order-1"
                >
                    <JournalVisual />
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="order-1 lg:order-2"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-light text-white">The <span className="text-indigo-400 font-normal">Black Box</span></h2>
                    </div>
                    
                    <p className="text-lg text-slate-300 font-medium mb-4 leading-relaxed border-l-2 border-indigo-500/30 pl-4">
                        Memory is flawed. Data is eternal. <br/>
                        Treat your trading business like a business.
                    </p>
                    
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                        Your brain deletes painful memories to protect your ego. The Smart Journal forces you to face them. It auto-tags setups, timestamps execution, and links every decision to PnL.
                    </p>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">Automated Recall</h4>
                        {[
                            'Instant CSV Import (Binance, Bybit, MetaTrader)',
                            'Setup Tagging (Track A+ vs. C- trades)',
                            'Mistake Tracking (Revenge, Over-leverage)',
                            'Session Analytics (Find your golden hours)'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                <Check className="w-4 h-4 text-indigo-400" />
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>

        {/* 7. DEEP DIVE 5: DASHBOARD */}
        <section className="mb-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                            <LayoutDashboard className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-light text-white">Full Spectrum <span className="text-cyan-400 font-normal">Vision</span></h2>
                    </div>
                    
                    <p className="text-lg text-slate-300 font-medium mb-4 leading-relaxed border-l-2 border-cyan-500/30 pl-4">
                        Data over dogma. <br/>
                        Know your stats. Own your edge.
                    </p>
                    
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                        Professional trading isn't about one big win. It's about expectancy. The Dashboard tracks your Equity Curve, Win Rate, and Profit Factor in real-time, giving you the CFO-level view of your performance.
                    </p>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4">Key Metrics</h4>
                        {[
                            'Real-time Equity Curve Visualization',
                            'Win/Loss Heatmaps by Day/Asset',
                            'Expectancy Calculator (Average R:R)',
                            'Drawdown Monitoring & Alerts'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                <BarChart2 className="w-4 h-4 text-cyan-400" />
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <DashboardVisual />
                </motion.div>
            </div>
        </section>

        {/* FINAL CTA: COMPACT GLASS DESIGN */}
        <section className="relative py-24 px-6 mt-10 flex flex-col items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-4xl mx-auto"
            >
                <GlassCard className="relative p-12 md:p-16 text-center border-indigo-500/30 bg-indigo-950/10 overflow-hidden">
                    
                    {/* Internal Ambient Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
                           Ready to <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 to-indigo-500 font-normal">Ascend?</span>
                        </h2>

                        <p className="text-lg text-slate-400 mb-8 leading-relaxed font-light max-w-xl mx-auto">
                           The tools are ready. The data is live. <br />
                           Stop analyzing the past. Start trading the future.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                           <Button variant="primary" size="lg" className="min-w-[180px] shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] border-indigo-500/50">
                               Launch Terminal <ArrowRight className="w-4 h-4 ml-2" />
                           </Button>
                           <Button variant="secondary" size="lg" className="min-w-[180px] bg-white/5 border-white/10 hover:bg-white/10">
                               View Pricing
                           </Button>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        </section>

      </div>
    </div>
  );
};
