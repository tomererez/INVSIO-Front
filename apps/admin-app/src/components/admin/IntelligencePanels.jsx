// Admin Dashboard Components - Risk, Cross-Module, Notifications, Audit
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import {
    Shield, AlertTriangle, Target, Activity, TrendingUp, TrendingDown,
    Bell, Mail, Eye, Download, Clock, Lock, Key, User, FileText
} from 'lucide-react';

// Risk Engine Intelligence Panel
export const RiskIntelligencePanel = () => {
    const deniedLogs = [
        { user: 'trader_001', pair: 'BTC/USDT', reason: 'Leverage exceeded limit (25x > 20x)', time: '3 min ago' },
        { user: 'trader_045', pair: 'ETH/USDT', reason: 'Position size > 5% equity', time: '12 min ago' },
        { user: 'trader_012', pair: 'SOL/USDT', reason: 'Volatility adjustment denied', time: '28 min ago' },
    ];

    const anomalies = [
        { type: 'Leverage Anomaly', count: 23, severity: 'high' },
        { type: 'Stop Distance Anomaly', count: 45, severity: 'medium' },
        { type: 'Position Size Spike', count: 12, severity: 'low' },
    ];

    return (
        <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Position Requests</div>
                    <div className="text-2xl font-bold text-white">2,847</div>
                    <div className="text-xs text-emerald-400">+12% today</div>
                </div>
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Denied</div>
                    <div className="text-2xl font-bold text-rose-400">124</div>
                    <div className="text-xs text-rose-300">4.4% rejection rate</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Avg Risk/Trade</div>
                    <div className="text-2xl font-bold text-white">1.8%</div>
                    <div className="text-xs text-slate-400">of equity</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Vol Adjustments</div>
                    <div className="text-2xl font-bold text-white">456</div>
                    <div className="text-xs text-slate-400">auto-applied</div>
                </div>
            </div>

            {/* Denied Position Logs */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-500 uppercase font-bold mb-3">Recent Denied Positions</div>
                <div className="space-y-2">
                    {deniedLogs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                            <div className="flex items-center gap-3">
                                <Shield className="w-4 h-4 text-rose-400" />
                                <div>
                                    <div className="text-sm text-white">{log.pair} - {log.user}</div>
                                    <div className="text-xs text-rose-300">{log.reason}</div>
                                </div>
                            </div>
                            <span className="text-xs text-slate-500">{log.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Anomaly Detection */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-500 uppercase font-bold mb-3">Anomaly Detection (24h)</div>
                <div className="space-y-2">
                    {anomalies.map((a) => (
                        <div key={a.type} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className={`w-4 h-4 ${a.severity === 'high' ? 'text-rose-400' : a.severity === 'medium' ? 'text-amber-400' : 'text-slate-400'}`} />
                                <span className="text-sm text-white">{a.type}</span>
                            </div>
                            <span className="text-lg font-bold text-white">{a.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Cross-Module Intelligence Panel
export const CrossModulePanel = () => {
    const alignmentStats = [
        { label: 'Signal → User Trade Alignment', value: '67.2%', trend: '+3.4%', good: true },
        { label: 'Accuracy Following Signals', value: '72.8%', trend: '+1.2%', good: true },
        { label: 'Behavioral/Signal Pattern Match', value: '54.3%', trend: '-2.1%', good: false },
    ];

    const volatilityRegimes = [
        { regime: 'Low Vol', accuracy: 78, trades: 234 },
        { regime: 'Medium Vol', accuracy: 71, trades: 456 },
        { regime: 'High Vol', accuracy: 58, trades: 189 },
        { regime: 'Extreme Vol', accuracy: 42, trades: 67 },
    ];

    return (
        <div className="space-y-4">
            {/* Alignment Stats */}
            <div className="grid md:grid-cols-3 gap-3">
                {alignmentStats.map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">{stat.label}</div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                            <span className={`text-xs ${stat.good ? 'text-emerald-400' : 'text-rose-400'}`}>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance by Volatility Regime */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-500 uppercase font-bold mb-4">Signal Performance by Volatility Regime</div>
                <div className="space-y-3">
                    {volatilityRegimes.map((regime) => (
                        <div key={regime.regime} className="flex items-center gap-4">
                            <div className="w-24 text-xs text-slate-400">{regime.regime}</div>
                            <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${regime.accuracy > 70 ? 'bg-emerald-500' : regime.accuracy > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                    style={{ width: `${regime.accuracy}%` }}
                                />
                            </div>
                            <span className="text-sm font-bold text-white w-12">{regime.accuracy}%</span>
                            <span className="text-xs text-slate-500 w-16">{regime.trades} trades</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Notification Analytics Panel
export const NotificationAnalyticsPanel = () => {
    const stats = [
        { label: 'Sent (24h)', value: '12,456', icon: Mail },
        { label: 'Opened', value: '8,234', rate: '66%', icon: Eye },
        { label: 'Clicked', value: '2,456', rate: '30%', icon: Target },
        { label: 'Silent Users', value: '234', icon: Bell },
    ];

    const dropoffs = [
        { stage: 'Delivered', count: 12456 },
        { stage: 'Opened', count: 8234 },
        { stage: 'Read', count: 5678 },
        { stage: 'Clicked', count: 2456 },
        { stage: 'Converted', count: 456 },
    ];

    return (
        <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className="w-4 h-4 text-indigo-400" />
                            <div className="text-[10px] text-slate-500 uppercase font-bold">{stat.label}</div>
                        </div>
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        {stat.rate && <div className="text-xs text-emerald-400">{stat.rate}</div>}
                    </div>
                ))}
            </div>

            {/* Engagement Funnel */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-500 uppercase font-bold mb-4">Engagement Drop-off Funnel</div>
                <div className="space-y-2">
                    {dropoffs.map((stage, i) => (
                        <div key={stage.stage} className="flex items-center gap-4">
                            <div className="w-20 text-xs text-slate-400">{stage.stage}</div>
                            <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-end pr-2"
                                    style={{ width: `${(stage.count / 12456) * 100}%` }}
                                >
                                    <span className="text-[10px] text-white font-bold">{stage.count.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Audit & Security Logs Panel
export const AuditLogPanel = () => {
    const logs = [
        { action: 'User tier upgraded', admin: 'admin@invsio.com', target: 'user_045', time: '2 min ago', type: 'user' },
        { action: 'Feature flag toggled', admin: 'admin@invsio.com', target: 'ai-signals', time: '15 min ago', type: 'config' },
        { action: 'API key created', admin: 'admin@invsio.com', target: 'analytics-v2', time: '1 hour ago', type: 'security' },
        { action: 'Suspicious login blocked', admin: 'System', target: '192.168.1.45', time: '2 hours ago', type: 'security' },
        { action: 'Analyzer restarted', admin: 'admin@invsio.com', target: 'btc-1h', time: '3 hours ago', type: 'system' },
    ];

    const typeColors = {
        user: 'text-blue-400',
        config: 'text-purple-400',
        security: 'text-rose-400',
        system: 'text-emerald-400',
    };

    return (
        <div className="space-y-4">
            {/* Export Button */}
            <div className="flex justify-end">
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                    <Download className="w-4 h-4 mr-2" />Export Audit Log
                </Button>
            </div>

            {/* Audit Log Table */}
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left p-3 text-[10px] text-slate-500 uppercase font-bold">Timestamp</th>
                            <th className="text-left p-3 text-[10px] text-slate-500 uppercase font-bold">Action</th>
                            <th className="text-left p-3 text-[10px] text-slate-500 uppercase font-bold">Admin</th>
                            <th className="text-left p-3 text-[10px] text-slate-500 uppercase font-bold">Target</th>
                            <th className="text-left p-3 text-[10px] text-slate-500 uppercase font-bold">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                                <td className="p-3 text-xs text-slate-500">{log.time}</td>
                                <td className="p-3 text-sm text-white">{log.action}</td>
                                <td className="p-3 text-xs text-slate-400">{log.admin}</td>
                                <td className="p-3 text-xs text-slate-400 font-mono">{log.target}</td>
                                <td className="p-3">
                                    <span className={`text-[10px] font-bold uppercase ${typeColors[log.type]}`}>
                                        {log.type}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Security Summary */}
            <div className="grid md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <Lock className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">4</div>
                    <div className="text-xs text-slate-500">Admin Users</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <Key className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">12</div>
                    <div className="text-xs text-slate-500">Active API Keys</div>
                </div>
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                    <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-rose-400">3</div>
                    <div className="text-xs text-rose-300">Blocked IPs (24h)</div>
                </div>
            </div>
        </div>
    );
};

export default { RiskIntelligencePanel, CrossModulePanel, NotificationAnalyticsPanel, AuditLogPanel };
