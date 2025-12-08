import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Bell, Activity } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { FEED_DATA } from '../../constants';
import { FeedItemData } from '../../types';

const FeedItem: React.FC<{ item: FeedItemData; index: number }> = ({ item, index }) => {
  const isBullish = item.signalType === 'bullish';
  const isBearish = item.signalType === 'bearish';
  
  const accentColor = isBullish ? '#10b981' : isBearish ? '#ef4444' : '#94a3b8';
  const gradientId = `gradient-${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-4"
    >
      <GlassCard className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-xs font-bold ${isBullish ? 'text-emerald-400' : isBearish ? 'text-rose-400' : 'text-slate-400'}`}>
              {item.asset.split('/')[0].substring(0, 3)}
            </div>
            <div>
              <h3 className="text-white font-medium text-sm flex items-center gap-2">
                {item.asset}
                <span className="text-xs text-slate-500 font-normal bg-white/5 px-1.5 py-0.5 rounded">{item.timeframe}</span>
              </h3>
              <span className="text-xs text-slate-500">{item.timestamp}</span>
            </div>
          </div>
          <div className="p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer">
             <Bell className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Chart Visual */}
            <div className="w-full sm:w-1/3 h-24 relative rounded-lg overflow-hidden bg-black/20 border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={item.priceData}>
                    <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={accentColor} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={accentColor} 
                        strokeWidth={2}
                        fill={`url(#${gradientId})`} 
                    />
                </AreaChart>
                </ResponsiveContainer>
                
                {/* Signal Icon Overlay */}
                <div className="absolute top-2 right-2">
                    {isBullish && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                    {isBearish && <TrendingDown className="w-4 h-4 text-rose-400" />}
                    {!isBullish && !isBearish && <Minus className="w-4 h-4 text-slate-400" />}
                </div>
            </div>

            {/* Text Analysis */}
            <div className="flex-1">
                <p className="text-sm text-slate-300 font-light leading-relaxed mb-3">
                    {item.message}
                </p>
                <div className="flex flex-wrap gap-2">
                    {item.badges.map((badge, idx) => (
                        <span key={idx} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-400 flex items-center gap-1">
                           <Activity className="w-3 h-3" /> {badge}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export const LiveFeed: React.FC = () => {
  return (
    <section id="feed" className="py-20 px-4 relative">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-white mb-2">Live Market Flow</h2>
            <p className="text-slate-400 font-light">Real-time institutional insights.</p>
        </div>
        
        <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-9 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden sm:block" />
            
            <div className="space-y-2">
                {FEED_DATA.map((item, index) => (
                    <FeedItem key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};