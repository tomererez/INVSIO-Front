// Admin Dashboard Components - Analyzer Control Panel
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    RefreshCw, Play, Pause, Settings, Database, Clock, Bug,
    ChevronDown, ChevronRight, Zap, RotateCcw, Download
} from 'lucide-react';

// Collapsible Panel Component
export const CollapsiblePanel = ({ title, icon: Icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <GlassCard className="overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <Icon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-white font-medium">{title}</span>
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
            </button>
            {isOpen && <div className="p-4 pt-0 border-t border-white/5">{children}</div>}
        </GlassCard>
    );
};

// Analyzer Control Panel
export const AnalyzerControlPanel = ({ analyzers = [] }) => {
    const [selectedAnalyzer, setSelectedAnalyzer] = useState(null);
    const [debugPair, setDebugPair] = useState('');

    const actions = [
        { label: 'Restart', icon: RefreshCw, action: 'restart', color: 'blue' },
        { label: 'Pause', icon: Pause, action: 'pause', color: 'amber' },
        { label: 'Clear Cache', icon: Database, action: 'cache', color: 'purple' },
        { label: 'Force Backfill', icon: Download, action: 'backfill', color: 'cyan' },
        { label: 'Replay Signal', icon: RotateCcw, action: 'replay', color: 'emerald' },
    ];

    return (
        <div className="space-y-4">
            {/* Analyzer Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {analyzers.map((a) => (
                    <button
                        key={a.id}
                        onClick={() => setSelectedAnalyzer(a)}
                        className={`p-4 rounded-xl border transition-all ${selectedAnalyzer?.id === a.id
                            ? 'bg-indigo-500/20 border-indigo-500/50'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                    >
                        <div className="text-sm font-medium text-white">{a.name}</div>
                        <div className={`text-xs mt-1 ${a.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {a.status}
                        </div>
                    </button>
                ))}
            </div>

            {selectedAnalyzer && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {/* Quick Actions */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-3">Quick Actions</div>
                        <div className="flex flex-wrap gap-2">
                            {actions.map((act) => (
                                <Button key={act.action} size="sm" variant="outline" className={`border-${act.color}-500/30 hover:bg-${act.color}-500/10 text-${act.color}-400`}>
                                    <act.icon className="w-3 h-3 mr-2" />{act.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Version Control */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-3">Analyzer Version</div>
                        <div className="flex gap-2">
                            {['v1 (Stable)', 'v2 (Current)', 'v3 (Beta)'].map((v, i) => (
                                <button key={v} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${i === 1 ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20'}`}>
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sampling Interval */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-3">Sampling Interval</div>
                            <div className="flex items-center gap-3">
                                <Input type="number" defaultValue={5} className="w-20 bg-white/5 border-white/10 text-white" />
                                <span className="text-slate-400 text-sm">seconds</span>
                                <Button size="sm" className="ml-auto bg-indigo-600 hover:bg-indigo-500">Apply</Button>
                            </div>
                        </div>

                        {/* Debug Pair */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-3">Debug Trading Pair</div>
                            <div className="flex items-center gap-3">
                                <Input
                                    placeholder="BTC/USDT"
                                    value={debugPair}
                                    onChange={(e) => setDebugPair(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                                <Button size="sm" className="bg-rose-600 hover:bg-rose-500">
                                    <Bug className="w-3 h-3 mr-2" />Debug
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// AI Performance Panel
export const AIPerformancePanel = () => {
    const metrics = [
        { label: 'Accuracy (1H)', value: '76.2%', trend: '+2.1%', good: true },
        { label: 'Accuracy (4H)', value: '82.4%', trend: '+0.8%', good: true },
        { label: 'Accuracy (1D)', value: '71.3%', trend: '-1.2%', good: false },
        { label: 'LLM Latency', value: '234ms', trend: '-12ms', good: true },
    ];

    const driftData = [
        { day: 'Mon', drift: 0.02 },
        { day: 'Tue', drift: 0.04 },
        { day: 'Wed', drift: 0.03 },
        { day: 'Thu', drift: 0.08 },
        { day: 'Fri', drift: 0.05 },
        { day: 'Sat', drift: 0.02 },
        { day: 'Sun', drift: 0.01 },
    ];

    return (
        <div className="space-y-4">
            {/* Accuracy Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {metrics.map((m) => (
                    <div key={m.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{m.label}</div>
                        <div className="text-xl font-bold text-white">{m.value}</div>
                        <div className={`text-xs ${m.good ? 'text-emerald-400' : 'text-rose-400'}`}>{m.trend}</div>
                    </div>
                ))}
            </div>

            {/* Drift Visualization */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-500 uppercase font-bold mb-3">Daily Drift Index</div>
                <div className="flex items-end gap-2 h-24">
                    {driftData.map((d) => (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                            <div className={`w-full rounded-t ${d.drift > 0.05 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ height: `${d.drift * 1000}px` }} />
                            <span className="text-[10px] text-slate-500">{d.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Token Usage & Hallucination Detection */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-3">Token Usage (24h)</div>
                    <div className="text-2xl font-bold text-white mb-1">1.24M</div>
                    <div className="text-xs text-slate-400">Cost: $12.40</div>
                    <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '68%' }} />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">68% of daily limit</div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-3">Hallucination Detection</div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">Flagged outputs</span>
                        <span className="text-lg font-bold text-amber-400">7</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">Auto-corrected</span>
                        <span className="text-lg font-bold text-emerald-400">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Requires review</span>
                        <span className="text-lg font-bold text-rose-400">2</span>
                    </div>
                </div>
            </div>

            {/* Confidence Distribution */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-500 uppercase font-bold mb-3">Confidence Score Distribution (Last 100 Signals)</div>
                <div className="flex items-end gap-1 h-20">
                    {[12, 8, 15, 22, 35, 28, 18, 10, 5, 3].map((v, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t" style={{ height: `${v * 2}px` }} />
                    ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                    <span>50%</span>
                    <span>60%</span>
                    <span>70%</span>
                    <span>80%</span>
                    <span>90%</span>
                </div>
            </div>
        </div>
    );
};

export default { CollapsiblePanel, AnalyzerControlPanel, AIPerformancePanel };
