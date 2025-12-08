import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, DollarSign, Hash, Tag, Activity, Clock } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';

interface AddTradeModalProps {
  onClose: () => void;
  onSave?: (tradeData: any) => void;
}

export const AddTradeModal: React.FC<AddTradeModalProps> = ({ onClose, onSave }) => {
  const [direction, setDirection] = useState<'Long' | 'Short'>('Long');
  const [status, setStatus] = useState<'Open' | 'Closed'>('Closed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, gather form data here
    if (onSave) onSave({}); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-void/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <GlassCard className="p-0 overflow-hidden border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.15)]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="text-xl text-white font-light flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Log New Position
            </h3>
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Top Row: Asset, Direction, Status */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6 space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Asset Pair</label>
                <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. BTC/USD" 
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                      autoFocus
                    />
                    <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                </div>
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Direction</label>
                <div className="flex p-1 bg-black/20 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setDirection('Long')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      direction === 'Long' 
                        ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Long
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection('Short')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      direction === 'Short' 
                        ? 'bg-rose-500/20 text-rose-400 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Short
                  </button>
                </div>
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status</label>
                <div className="flex p-1 bg-black/20 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setStatus('Open')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      status === 'Open' 
                        ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('Closed')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      status === 'Closed' 
                        ? 'bg-slate-700/50 text-slate-200 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Closed
                  </button>
                </div>
              </div>
            </div>

            {/* Entry Details */}
            <div className="space-y-4">
               <h4 className="text-sm font-medium text-white border-b border-white/5 pb-2">Entry Details</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">Date & Time</label>
                    <div className="relative">
                        <input type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">Entry Price</label>
                    <div className="relative">
                        <input type="number" step="0.00000001" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">$</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">Position Size</label>
                    <div className="relative">
                        <input type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                        <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
               </div>
            </div>

            {/* Exit Details (Conditional) */}
            <motion.div 
                className="space-y-4 overflow-hidden"
                animate={{ 
                    height: status === 'Closed' ? 'auto' : 0, 
                    opacity: status === 'Closed' ? 1 : 0.5 
                }}
            >
               <h4 className="text-sm font-medium text-white border-b border-white/5 pb-2">Exit Details</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">Date & Time</label>
                    <div className="relative">
                        <input type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">Exit Price</label>
                    <div className="relative">
                        <input type="number" step="0.00000001" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">$</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">Fees</label>
                    <div className="relative">
                        <input type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">$</span>
                    </div>
                  </div>
               </div>
            </motion.div>

            {/* Meta & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Setup / Strategy</label>
                    <div className="relative">
                        <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:border-indigo-500 outline-none">
                            <option value="">Select Strategy...</option>
                            <option value="breakout">Breakout</option>
                            <option value="reversal">Mean Reversion</option>
                            <option value="trend_following">Trend Following</option>
                            <option value="scalp">Scalp</option>
                        </select>
                        <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                    </div>
                </div>
                
                <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Notes</label>
                     <textarea 
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none resize-none h-[50px]"
                        placeholder="Why did you take this trade?"
                     />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <Button 
                    variant="ghost" 
                    type="button" 
                    onClick={onClose}
                    className="text-slate-400 hover:text-white"
                >
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500"
                >
                    Save Trade
                </Button>
            </div>

          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};