// Admin Dashboard Components - Error Intelligence & Behavioral Insights
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import {
    AlertTriangle, AlertCircle, Server, Database, Globe, Brain,
    Clock, TrendingUp, TrendingDown, Filter, Download, ChevronDown
} from 'lucide-react';

// Error Intelligence Panel
export const ErrorIntelligencePanel = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const errorCategories = [
        { id: 'all', label: 'All', count: 47 },
        { id: 'api', label: 'API', count: 12, icon: Globe },
        { id: 'llm', label: 'LLM', count: 8, icon: Brain },
        { id: 'backend', label: 'Backend', count: 15, icon: Server },
        { id: 'db', label: 'Database', count: 7, icon: Database },
        { id: 'rate', label: 'Rate Limit', count: 5, icon: Clock },
    ];

    const errors = [
        { id: 1, type: 'api', message: 'Bybit API timeout on /v5/market/tickers', severity: 'high', time: '2 min ago', impact: 'user-facing', count: 3 },
        { id: 2, type: 'llm', message: 'GPT-4 rate limit exceeded', severity: 'medium', time: '15 min ago', impact: 'internal', count: 1 },
        { id: 3, type: 'backend', message: 'Worker process crashed: signal_processor', severity: 'critical', time: '32 min ago', impact: 'user-facing', count: 1 },
        { id: 4, type: 'db', message: 'Connection pool exhausted', severity: 'high', time: '1 hour ago', impact: 'internal', count: 5 },
        { id: 5, type: 'rate', message: 'Coinglass API rate limit (429)', severity: 'low', time: '2 hours ago', impact: 'internal', count: 12 },
    ];

    const filteredErrors = selectedCategory === 'all' ? errors : errors.filter(e => e.type === selectedCategory);

    const severityColors = {
        critical: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };

    return (
        <div className="space-y-4">
            {/* Error Trend Graph */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-slate-500 uppercase font-bold">Error Trend (7 Days)</div>
                    <div className="flex gap-2">
                        <button className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-400 rounded">7D</button>
                        <button className="px-2 py-1 text-xs bg-white/5 text-slate-400 rounded hover:bg-white/10">30D</button>
                    </div>
                </div>
                <div className="flex items-end gap-1 h-16">
                    {[23, 18, 45, 32, 28, 15, 12].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                            <div className={`w-full rounded-t ${v > 30 ? 'bg-rose-500' : v > 20 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ height: `${v}px` }} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                {errorCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat.id
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20'
                            }`}
                    >
                        {cat.label} ({cat.count})
                    </button>
                ))}
            </div>

            {/* Error List */}
            <div className="space-y-2">
                {filteredErrors.map((err) => (
                    <motion.div
                        key={err.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className={`w-4 h-4 mt-0.5 ${err.severity === 'critical' ? 'text-rose-400' : err.severity === 'high' ? 'text-orange-400' : 'text-amber-400'}`} />
                                <div>
                                    <div className="text-sm text-white font-medium">{err.message}</div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${severityColors[err.severity]}`}>
                                            {err.severity}
                                        </span>
                                        <span className={`text-[10px] ${err.impact === 'user-facing' ? 'text-rose-400' : 'text-slate-500'}`}>
                                            {err.impact}
                                        </span>
                                        <span className="text-[10px] text-slate-500">×{err.count}</span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-slate-500 whitespace-nowrap">{err.time}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Auto-Alert Status */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-300 text-sm">Auto-alerting active</span>
                </div>
                <span className="text-xs text-emerald-400">Slack, PagerDuty connected</span>
            </div>
        </div>
    );
};

// Behavioral Engine Deep Insights
export const BehavioralInsightsPanel = () => {
    const behaviorHeatmap = [
        { hour: '00', fomo: 2, revenge: 1, hesitation: 3 },
        { hour: '04', fomo: 1, revenge: 0, hesitation: 2 },
        { hour: '08', fomo: 5, revenge: 3, hesitation: 4 },
        { hour: '12', fomo: 8, revenge: 6, hesitation: 5 },
        { hour: '16', fomo: 12, revenge: 9, hesitation: 7 },
        { hour: '20', fomo: 15, revenge: 12, hesitation: 8 },
    ];

    const riskViolations = [
        { segment: 'Free Users', violations: 234, trend: '+12%' },
        { segment: 'Pro Users', violations: 89, trend: '-5%' },
        { segment: 'Elite Users', violations: 23, trend: '-18%' },
    ];

    const emotionalLeaks = [
        { session: '0-15 min', leaks: 45, severity: 'low' },
        { session: '15-60 min', leaks: 78, severity: 'medium' },
        { session: '60+ min', leaks: 156, severity: 'high' },
    ];

    return (
        <div className="space-y-4">
            {/* Behavior Trigger Heatmap */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-500 uppercase font-bold mb-4">Behavior Trigger Heatmap (by Hour)</div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left text-[10px] text-slate-500 pb-2">Hour</th>
                                <th className="text-center text-[10px] text-rose-400 pb-2">FOMO</th>
                                <th className="text-center text-[10px] text-amber-400 pb-2">Revenge</th>
                                <th className="text-center text-[10px] text-purple-400 pb-2">Hesitation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {behaviorHeatmap.map((row) => (
                                <tr key={row.hour}>
                                    <td className="text-xs text-slate-400 py-1">{row.hour}:00</td>
                                    <td className="text-center">
                                        <div className={`mx-auto w-8 h-6 rounded flex items-center justify-center text-[10px] font-bold ${row.fomo > 10 ? 'bg-rose-500/40 text-rose-300' : row.fomo > 5 ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {row.fomo}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className={`mx-auto w-8 h-6 rounded flex items-center justify-center text-[10px] font-bold ${row.revenge > 10 ? 'bg-amber-500/40 text-amber-300' : row.revenge > 5 ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {row.revenge}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className={`mx-auto w-8 h-6 rounded flex items-center justify-center text-[10px] font-bold ${row.hesitation > 5 ? 'bg-purple-500/40 text-purple-300' : row.hesitation > 3 ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500/10 text-purple-500'}`}>
                                            {row.hesitation}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Risk Violations by Segment */}
            <div className="grid md:grid-cols-3 gap-3">
                {riskViolations.map((seg) => (
                    <div key={seg.segment} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">{seg.segment}</div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold text-white">{seg.violations}</span>
                            <span className={`text-xs ${seg.trend.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>{seg.trend}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">violations this week</div>
                    </div>
                ))}
            </div>

            {/* Emotional Leaks by Session Time */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-500 uppercase font-bold mb-4">Emotional Leak Patterns (by Session Duration)</div>
                <div className="space-y-3">
                    {emotionalLeaks.map((leak) => (
                        <div key={leak.session} className="flex items-center gap-4">
                            <div className="w-24 text-xs text-slate-400">{leak.session}</div>
                            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${leak.severity === 'high' ? 'bg-rose-500' : leak.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${(leak.leaks / 200) * 100}%` }}
                                />
                            </div>
                            <span className="text-sm font-bold text-white w-12">{leak.leaks}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <div className="flex items-center gap-2 text-rose-300 text-xs">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Sessions over 60 min have 3x higher emotional leak rates</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default { ErrorIntelligencePanel, BehavioralInsightsPanel };
