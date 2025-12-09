import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Users, Crown, Zap, Shield, Mail, Calendar, CheckCircle2, AlertCircle,
    DollarSign, TrendingUp, Activity, Search, Eye, Ban, Check, X, Plus,
    BarChart3, LogIn, Loader2, UserPlus, Trash2, Rocket, Settings, Bell,
    Database, Cpu, Server, Globe, Lock, Key, AlertTriangle, Brain,
    Radio, Gauge, FileText, ToggleLeft, MessageSquare, ChevronRight,
    RefreshCw, Clock, Wifi, WifiOff, TrendingDown, Target, Zap as Lightning,
    BookOpen, PieChart, LayoutDashboard, Crosshair, Layers
} from 'lucide-react';

// Import modular admin components
import { CollapsiblePanel, AnalyzerControlPanel, AIPerformancePanel } from '@/components/admin/AnalyzerPanel';
import { ErrorIntelligencePanel, BehavioralInsightsPanel } from '@/components/admin/ErrorBehaviorPanels';
import { RiskIntelligencePanel, CrossModulePanel, NotificationAnalyticsPanel, AuditLogPanel } from '@/components/admin/IntelligencePanels';

// --- SIDEBAR NAVIGATION ---
const SIDEBAR_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'billing', label: 'Subscription & Billing', icon: DollarSign },
    { id: 'analyzers', label: 'Analyzer Control', icon: Radio },
    { id: 'ai-performance', label: 'AI Performance', icon: Brain },
    { id: 'errors', label: 'Error Intelligence', icon: AlertTriangle },
    { id: 'behavioral', label: 'Behavioral Engine', icon: Crosshair },
    { id: 'risk', label: 'Risk Engine', icon: Shield },
    { id: 'cross-module', label: 'Cross-Module Intel', icon: Layers },
    { id: 'journal', label: 'Journal & Signals', icon: FileText },
    { id: 'notifications', label: 'Notification Analytics', icon: Bell },
    { id: 'system', label: 'System Health', icon: Server },
    { id: 'features', label: 'Feature Toggles', icon: ToggleLeft },
    { id: 'content', label: 'Content Management', icon: MessageSquare },
    { id: 'audit', label: 'Audit & Security', icon: Lock },
];

// --- MOCK DATA FOR DEMO ---
const MOCK_ANALYZERS = [
    { id: 'btc-1h', name: 'BTC/USDT 1H', status: 'active', lastSignal: '2 min ago', accuracy: 78.5, signals: 142 },
    { id: 'btc-4h', name: 'BTC/USDT 4H', status: 'active', lastSignal: '15 min ago', accuracy: 82.3, signals: 89 },
    { id: 'eth-1h', name: 'ETH/USDT 1H', status: 'active', lastSignal: '5 min ago', accuracy: 75.2, signals: 156 },
    { id: 'eth-4h', name: 'ETH/USDT 4H', status: 'warning', lastSignal: '45 min ago', accuracy: 71.8, signals: 67 },
    { id: 'sol-1h', name: 'SOL/USDT 1H', status: 'error', lastSignal: '2 hours ago', accuracy: 68.4, signals: 45 },
];

const MOCK_API_STATUS = [
    { name: 'Bybit API', status: 'healthy', latency: '45ms', rateLimit: '85%' },
    { name: 'Binance API', status: 'healthy', latency: '32ms', rateLimit: '72%' },
    { name: 'Coinglass API', status: 'degraded', latency: '156ms', rateLimit: '45%' },
    { name: 'CoinGecko API', status: 'healthy', latency: '78ms', rateLimit: '90%' },
];

const MOCK_SYSTEM_METRICS = {
    cpu: 34,
    ram: 68,
    disk: 45,
    uptime: '99.97%',
    requests: '12.4k/min',
    errors: 3,
    dbConnections: 45,
    cacheHitRate: 94.2,
};

const MOCK_BILLING_STATS = {
    mrr: 24850,
    arr: 298200,
    ltv: 487,
    churn: 2.3,
    failedPayments: 12,
    activeTrials: 34,
};

const MOCK_BEHAVIORAL_PATTERNS = [
    { pattern: 'Revenge Trading', count: 145, severity: 'high' },
    { pattern: 'FOMO Entry', count: 234, severity: 'medium' },
    { pattern: 'Early Profit Taking', count: 189, severity: 'low' },
    { pattern: 'Overleveraging', count: 67, severity: 'high' },
    { pattern: 'Stop Loss Widening', count: 98, severity: 'medium' },
];

const MOCK_FEATURE_FLAGS = [
    { id: 'ai-signals', name: 'AI Signal Generation', enabled: true, group: 'all' },
    { id: 'v3-analyzer', name: 'Analyzer V3 (Beta)', enabled: false, group: 'elite' },
    { id: 'behavioral-ai', name: 'Behavioral AI Coaching', enabled: true, group: 'pro' },
    { id: 'maintenance', name: 'Maintenance Mode', enabled: false, group: 'system' },
    { id: 'new-dashboard', name: 'New Dashboard UI', enabled: true, group: 'all' },
];

// --- HELPER COMPONENTS ---

const StatCard = ({ label, value, sub, icon: Icon, trend, color = 'emerald' }) => (
    <GlassCard className="p-5 h-full">
        <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}>
                <Icon className={`w-4 h-4 text-${color}-400`} />
            </div>
            {trend && (
                <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </GlassCard>
);

const StatusBadge = ({ status }) => {
    const styles = {
        active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        degraded: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        error: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.inactive}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' || status === 'healthy' ? 'bg-emerald-400' : status === 'warning' || status === 'degraded' ? 'bg-amber-400' : 'bg-rose-400'}`} />
            {status}
        </span>
    );
};

const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Icon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
            </div>
        </div>
        {action}
    </div>
);

// --- MAIN COMPONENT ---
export default function AdminDashboard() {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [adminLoginData, setAdminLoginData] = useState({ email: '', password: '' });
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [activeSection, setActiveSection] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserDialog, setShowUserDialog] = useState(false);
    const queryClient = useQueryClient();

    // Check admin auth
    useEffect(() => {
        const adminToken = localStorage.getItem('admin_token');
        if (adminToken) setIsAdminAuthenticated(true);
    }, []);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);
        try {
            // Hardcoded admin credentials for standalone admin app
            if (adminLoginData.email === 'admin@invsio.com' && adminLoginData.password === 'admin123') {
                localStorage.setItem('admin_token', 'admin-authenticated');
                setIsAdminAuthenticated(true);
            } else {
                setLoginError('Access denied. Invalid admin credentials.');
            }
        } catch (err) {
            setLoginError(err.message || 'Invalid admin credentials');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('currentUserId');
        setIsAdminAuthenticated(false);
    };

    // Queries
    const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => JSON.parse(localStorage.getItem('users') || '[]'),
        enabled: isAdminAuthenticated
    });

    const { data: allTrades = [] } = useQuery({
        queryKey: ['allTrades'],
        queryFn: async () => JSON.parse(localStorage.getItem('trades') || '[]'),
        enabled: isAdminAuthenticated
    });

    // Mutations
    const updateUserMutation = useMutation({
        mutationFn: async ({ userId, updates }) => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const index = users.findIndex(u => u.id === userId);
            if (index !== -1) {
                users[index] = { ...users[index], ...updates };
                localStorage.setItem('users', JSON.stringify(users));
                return users[index];
            }
            throw new Error('User not found');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['allUsers']);
            setSuccess('User updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (userId) => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const filtered = users.filter(u => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(filtered));
            return filtered;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['allUsers']);
            setSuccess('User deleted successfully!');
            setTimeout(() => setSuccess(''), 3000);
        }
    });

    // Stats
    const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.is_active !== false).length,
        eliteUsers: users.filter(u => u.subscription_tier === 'elite').length,
        proUsers: users.filter(u => u.subscription_tier === 'pro').length,
        freeUsers: users.filter(u => u.subscription_tier === 'free').length,
        totalTrades: allTrades.length,
        totalRevenue: users.reduce((sum, u) => sum + (u.total_revenue || 0), 0)
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount || 0);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // --- LOGIN SCREEN ---
    if (!isAdminAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                    <GlassCard className="p-8 border-indigo-500/20">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-light text-white mb-2">Admin <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Command Center</span></h1>
                            <p className="text-sm text-slate-400">Enter admin credentials to access the control panel</p>
                        </div>

                        <form onSubmit={handleAdminLogin} className="space-y-5">
                            <div>
                                <Label className="text-slate-300 text-sm">Admin Email</Label>
                                <Input
                                    type="email"
                                    required
                                    value={adminLoginData.email}
                                    onChange={(e) => setAdminLoginData({ ...adminLoginData, email: e.target.value })}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                    placeholder="admin@invsio.com"
                                />
                            </div>
                            <div>
                                <Label className="text-slate-300 text-sm">Password</Label>
                                <Input
                                    type="password"
                                    required
                                    value={adminLoginData.password}
                                    onChange={(e) => setAdminLoginData({ ...adminLoginData, password: e.target.value })}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                    placeholder="••••••••"
                                />
                            </div>

                            {loginError && (
                                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-rose-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />{loginError}
                                </div>
                            )}

                            <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500" disabled={loginLoading}>
                                {loginLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Authenticating...</> : <><LogIn className="w-4 h-4 mr-2" />Access Dashboard</>}
                            </Button>
                        </form>

                        <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-xs text-center text-slate-400">🔐 <strong>Demo:</strong> admin@invsio.com / admin123</p>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        );
    }

    // --- MAIN DASHBOARD ---
    return (
        <div className="min-h-screen pt-20">
            <div className="flex">
                {/* Sidebar */}
                <aside className="fixed left-0 top-[72px] bottom-0 w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl p-4 overflow-y-auto">
                    <div className="space-y-1">
                        {SIDEBAR_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === item.id
                                    ? 'bg-indigo-500/20 text-white border border-indigo-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
                            <LogIn className="w-4 h-4 mr-2 rotate-180" />Logout
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ml-64 flex-1 p-8 max-w-[1400px]">
                    {/* Success/Error Messages */}
                    <AnimatePresence>
                        {success && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <p className="text-emerald-300">{success}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* OVERVIEW SECTION */}
                    {activeSection === 'overview' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <SectionHeader icon={LayoutDashboard} title="Command Overview" subtitle="Platform-wide metrics and status" />

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard label="Monthly Revenue" value={formatCurrency(MOCK_BILLING_STATS.mrr)} icon={DollarSign} trend={12.5} color="emerald" />
                                <StatCard label="Total Users" value={stats.totalUsers || 156} icon={Users} trend={8.2} color="blue" sub={`${stats.activeUsers || 142} active`} />
                                <StatCard label="Paid Subscribers" value={stats.eliteUsers + stats.proUsers || 89} icon={Crown} trend={15.3} color="amber" />
                                <StatCard label="System Uptime" value={MOCK_SYSTEM_METRICS.uptime} icon={Server} color="purple" sub="Last 30 days" />
                            </div>

                            {/* Quick Status Grid */}
                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* API Health */}
                                <GlassCard className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-cyan-400" />API Status
                                        </h3>
                                        <StatusBadge status="healthy" />
                                    </div>
                                    <div className="space-y-3">
                                        {MOCK_API_STATUS.map((api) => (
                                            <div key={api.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    {api.status === 'healthy' ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
                                                    <span className="text-sm text-slate-300">{api.name}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs text-slate-500">{api.latency}</span>
                                                    <StatusBadge status={api.status} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>

                                {/* System Resources */}
                                <GlassCard className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                            <Cpu className="w-5 h-5 text-purple-400" />System Resources
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'CPU Usage', value: MOCK_SYSTEM_METRICS.cpu, color: 'indigo' },
                                            { label: 'RAM Usage', value: MOCK_SYSTEM_METRICS.ram, color: 'purple' },
                                            { label: 'Cache Hit Rate', value: MOCK_SYSTEM_METRICS.cacheHitRate, color: 'emerald' },
                                        ].map((metric) => (
                                            <div key={metric.label}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-400">{metric.label}</span>
                                                    <span className="text-white font-medium">{metric.value}%</span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div className={`h-full bg-${metric.color}-500 rounded-full transition-all`} style={{ width: `${metric.value}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Analyzer Status Quick View */}
                            <GlassCard className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                        <Radio className="w-5 h-5 text-cyan-400" />Active Analyzers
                                    </h3>
                                    <Button variant="ghost" size="sm" onClick={() => setActiveSection('analyzers')} className="text-slate-400 hover:text-white">
                                        View All <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {MOCK_ANALYZERS.map((analyzer) => (
                                        <div key={analyzer.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-medium text-white">{analyzer.name}</span>
                                                <StatusBadge status={analyzer.status} />
                                            </div>
                                            <div className="text-2xl font-bold text-white mb-1">{analyzer.accuracy}%</div>
                                            <div className="text-[10px] text-slate-500">{analyzer.signals} signals</div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* USER MANAGEMENT SECTION */}
                    {activeSection === 'users' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader
                                icon={Users}
                                title="User Management"
                                subtitle={`${stats.totalUsers} total users • ${stats.activeUsers} active`}
                                action={
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                placeholder="Search users..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 w-64 bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                        <Button className="bg-indigo-600 hover:bg-indigo-500">
                                            <UserPlus className="w-4 h-4 mr-2" />Add User
                                        </Button>
                                    </div>
                                }
                            />

                            {/* User Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatCard label="Elite Users" value={stats.eliteUsers} icon={Crown} color="amber" />
                                <StatCard label="Pro Users" value={stats.proUsers} icon={Zap} color="emerald" />
                                <StatCard label="Free Users" value={stats.freeUsers} icon={Rocket} color="blue" />
                                <StatCard label="Total Trades" value={stats.totalTrades} icon={BarChart3} color="purple" />
                            </div>

                            {/* User Table */}
                            <GlassCard className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tier</th>
                                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
                                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map((user) => (
                                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.subscription_tier === 'elite' ? 'from-amber-500 to-orange-600' : user.subscription_tier === 'pro' ? 'from-emerald-500 to-teal-600' : 'from-blue-500 to-indigo-600'} flex items-center justify-center`}>
                                                                <span className="text-white font-bold text-sm">{user.full_name?.charAt(0) || 'U'}</span>
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-white">{user.full_name}</div>
                                                                <div className="text-xs text-slate-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${user.role === 'admin' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-500/20 text-slate-400'}`}>
                                                            {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                                            {user.role || 'user'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <select
                                                            value={user.subscription_tier || 'free'}
                                                            onChange={(e) => updateUserMutation.mutate({ userId: user.id, updates: { subscription_tier: e.target.value } })}
                                                            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-white border border-white/10 cursor-pointer"
                                                        >
                                                            <option value="free">Free</option>
                                                            <option value="pro">Pro</option>
                                                            <option value="elite">Elite</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-4">
                                                        <StatusBadge status={user.is_active !== false ? 'active' : 'inactive'} />
                                                    </td>
                                                    <td className="p-4 text-sm text-slate-400">{formatDate(user.created_date)}</td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <Button size="sm" variant="ghost" onClick={() => { setSelectedUser(user); setShowUserDialog(true); }} className="text-slate-400 hover:text-white">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            {user.role !== 'admin' && (
                                                                <Button size="sm" variant="ghost" onClick={() => deleteUserMutation.mutate(user.id)} className="text-rose-400 hover:text-rose-300">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredUsers.length === 0 && (
                                        <div className="text-center py-12">
                                            <Users className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                                            <p className="text-slate-400">No users found</p>
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* BILLING SECTION */}
                    {activeSection === 'billing' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={DollarSign} title="Subscription & Billing" subtitle="Revenue metrics and payment status" />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard label="Monthly Recurring" value={formatCurrency(MOCK_BILLING_STATS.mrr)} icon={TrendingUp} trend={12.5} color="emerald" />
                                <StatCard label="Annual Revenue" value={formatCurrency(MOCK_BILLING_STATS.arr)} icon={DollarSign} color="blue" />
                                <StatCard label="Customer LTV" value={formatCurrency(MOCK_BILLING_STATS.ltv)} icon={Users} color="purple" />
                                <StatCard label="Churn Rate" value={`${MOCK_BILLING_STATS.churn}%`} icon={TrendingDown} color="rose" sub="Last 30 days" />
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                                <GlassCard className="p-6">
                                    <h3 className="text-lg font-medium text-white mb-4">Plan Distribution</h3>
                                    <div className="space-y-4">
                                        {[
                                            { name: 'Elite', count: stats.eliteUsers || 12, color: 'amber', revenue: 4800 },
                                            { name: 'Pro', count: stats.proUsers || 45, revenue: 12500, color: 'emerald' },
                                            { name: 'Free', count: stats.freeUsers || 89, revenue: 0, color: 'slate' },
                                        ].map((plan) => (
                                            <div key={plan.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full bg-${plan.color}-500`} />
                                                    <span className="text-white font-medium">{plan.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-white font-bold">{plan.count} users</div>
                                                    <div className="text-xs text-slate-500">{formatCurrency(plan.revenue)}/mo</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6">
                                    <h3 className="text-lg font-medium text-white mb-4">Payment Issues</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                            <div className="flex items-center gap-3">
                                                <AlertTriangle className="w-5 h-5 text-rose-400" />
                                                <span className="text-rose-300">Failed Payments</span>
                                            </div>
                                            <span className="text-2xl font-bold text-rose-400">{MOCK_BILLING_STATS.failedPayments}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-amber-400" />
                                                <span className="text-amber-300">Active Trials</span>
                                            </div>
                                            <span className="text-2xl font-bold text-amber-400">{MOCK_BILLING_STATS.activeTrials}</span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {/* ANALYZERS SECTION */}
                    {activeSection === 'analyzers' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={Radio} title="Analyzer Control Panel" subtitle="Full analyzer control: restart, version, cache, debug" action={
                                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                                    <RefreshCw className="w-4 h-4 mr-2" />Refresh All
                                </Button>
                            } />

                            {/* API Health */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {MOCK_API_STATUS.map((api) => (
                                    <GlassCard key={api.name} className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-300">{api.name}</span>
                                            <StatusBadge status={api.status} />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Latency: {api.latency}</span>
                                            <span>Rate: {api.rateLimit}</span>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>

                            {/* Analyzer Control Panel */}
                            <CollapsiblePanel title="Analyzer Controls" icon={Settings} defaultOpen={true}>
                                <AnalyzerControlPanel analyzers={MOCK_ANALYZERS} />
                            </CollapsiblePanel>

                            {/* Analyzer Grid */}
                            <GlassCard className="p-6">
                                <h3 className="text-lg font-medium text-white mb-4">Active Analyzers</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="text-left p-3 text-xs font-bold text-slate-400 uppercase">Analyzer</th>
                                                <th className="text-left p-3 text-xs font-bold text-slate-400 uppercase">Status</th>
                                                <th className="text-left p-3 text-xs font-bold text-slate-400 uppercase">Accuracy</th>
                                                <th className="text-left p-3 text-xs font-bold text-slate-400 uppercase">Signals</th>
                                                <th className="text-left p-3 text-xs font-bold text-slate-400 uppercase">Last Signal</th>
                                                <th className="text-left p-3 text-xs font-bold text-slate-400 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {MOCK_ANALYZERS.map((analyzer) => (
                                                <tr key={analyzer.id} className="border-b border-white/5">
                                                    <td className="p-3 text-white font-medium">{analyzer.name}</td>
                                                    <td className="p-3"><StatusBadge status={analyzer.status} /></td>
                                                    <td className="p-3">
                                                        <span className={`font-bold ${analyzer.accuracy >= 75 ? 'text-emerald-400' : analyzer.accuracy >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                            {analyzer.accuracy}%
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-slate-300">{analyzer.signals}</td>
                                                    <td className="p-3 text-slate-500 text-sm">{analyzer.lastSignal}</td>
                                                    <td className="p-3">
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white"><Eye className="w-4 h-4" /></Button>
                                                            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white"><RefreshCw className="w-4 h-4" /></Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* BEHAVIORAL ENGINE SECTION */}
                    {activeSection === 'behavioral' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={Crosshair} title="Behavioral Engine Deep Insights" subtitle="Heatmaps, emotional patterns, and risk violations by segment" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard label="Patterns Detected" value="1,234" icon={Brain} sub="Last 7 days" color="purple" />
                                <StatCard label="Risk Alerts" value="67" icon={AlertTriangle} sub="Today" color="amber" />
                                <StatCard label="Users Flagged" value="23" icon={Shield} sub="Active monitoring" color="rose" />
                            </div>

                            {/* Deep Insights Panel */}
                            <BehavioralInsightsPanel />

                            {/* Common Patterns (collapsible) */}
                            <CollapsiblePanel title="Common Behavioral Patterns" icon={Brain} defaultOpen={false}>
                                <div className="space-y-3">
                                    {MOCK_BEHAVIORAL_PATTERNS.map((pattern) => (
                                        <div key={pattern.pattern} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${pattern.severity === 'high' ? 'bg-rose-500' : pattern.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                                <span className="text-white">{pattern.pattern}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xl font-bold text-white">{pattern.count}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${pattern.severity === 'high' ? 'bg-rose-500/20 text-rose-400' : pattern.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                    {pattern.severity}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CollapsiblePanel>
                        </motion.div>
                    )}

                    {/* RISK ENGINE SECTION */}
                    {activeSection === 'risk' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={Shield} title="Risk Engine Intelligence" subtitle="Denied positions, anomaly detection, and volatility adjustments" />
                            <RiskIntelligencePanel />
                        </motion.div>
                    )}

                    {/* JOURNAL & SIGNALS SECTION */}
                    {activeSection === 'journal' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={FileText} title="Journal & Signals Overview" subtitle="Trading signals and journal activity" />

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatCard label="Signals Generated" value="1,456" icon={Radio} sub="Today" color="cyan" />
                                <StatCard label="Journal Entries" value="892" icon={BookOpen} sub="This week" color="purple" />
                                <StatCard label="Avg Accuracy" value="74.2%" icon={Target} color="emerald" />
                                <StatCard label="AI Notes Created" value="234" icon={Brain} sub="Auto-generated" color="indigo" />
                            </div>
                        </motion.div>
                    )}

                    {/* SYSTEM HEALTH SECTION */}
                    {activeSection === 'system' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={Server} title="System Health Dashboard" subtitle="Infrastructure and performance monitoring" />

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatCard label="CPU Usage" value={`${MOCK_SYSTEM_METRICS.cpu}%`} icon={Cpu} color="indigo" />
                                <StatCard label="RAM Usage" value={`${MOCK_SYSTEM_METRICS.ram}%`} icon={Database} color="purple" />
                                <StatCard label="Uptime" value={MOCK_SYSTEM_METRICS.uptime} icon={Server} color="emerald" />
                                <StatCard label="Errors (24h)" value={MOCK_SYSTEM_METRICS.errors} icon={AlertTriangle} color="rose" />
                            </div>

                            <GlassCard className="p-6">
                                <h3 className="text-lg font-medium text-white mb-4">System Metrics</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-sm text-slate-400 mb-2">Requests/min</div>
                                        <div className="text-3xl font-bold text-white">{MOCK_SYSTEM_METRICS.requests}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-2">DB Connections</div>
                                        <div className="text-3xl font-bold text-white">{MOCK_SYSTEM_METRICS.dbConnections}</div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* FEATURE TOGGLES SECTION */}
                    {activeSection === 'features' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={ToggleLeft} title="Feature Toggles" subtitle="Enable/disable platform features" />

                            <GlassCard className="p-6">
                                <div className="space-y-4">
                                    {MOCK_FEATURE_FLAGS.map((flag) => (
                                        <div key={flag.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div>
                                                <div className="text-white font-medium">{flag.name}</div>
                                                <div className="text-xs text-slate-500">Target: {flag.group}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs px-2 py-1 rounded-full ${flag.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                                    {flag.enabled ? 'Enabled' : 'Disabled'}
                                                </span>
                                                <Button size="sm" variant="outline" className="border-white/10">
                                                    {flag.enabled ? 'Disable' : 'Enable'}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* CONTENT MANAGEMENT SECTION */}
                    {activeSection === 'content' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={MessageSquare} title="Content Management" subtitle="Notifications, announcements, and content" action={
                                <Button className="bg-indigo-600 hover:bg-indigo-500">
                                    <Plus className="w-4 h-4 mr-2" />New Announcement
                                </Button>
                            } />

                            <div className="grid md:grid-cols-3 gap-4">
                                <GlassCard className="p-6 text-center">
                                    <Bell className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                                    <div className="text-2xl font-bold text-white">12</div>
                                    <div className="text-sm text-slate-400">Active Notifications</div>
                                </GlassCard>
                                <GlassCard className="p-6 text-center">
                                    <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                                    <div className="text-2xl font-bold text-white">5</div>
                                    <div className="text-sm text-slate-400">Announcements</div>
                                </GlassCard>
                                <GlassCard className="p-6 text-center">
                                    <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                                    <div className="text-2xl font-bold text-white">24</div>
                                    <div className="text-sm text-slate-400">Educational Articles</div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {/* SECURITY SECTION */}
                    {activeSection === 'security' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={Lock} title="Security" subtitle="Access control and threat monitoring" />

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatCard label="IP Addresses" value="1,234" icon={Globe} sub="Active" color="blue" />
                                <StatCard label="Suspicious Logins" value="3" icon={AlertTriangle} sub="Last 24h" color="rose" />
                                <StatCard label="Admin Users" value="4" icon={Shield} color="purple" />
                                <StatCard label="API Keys" value="12" icon={Key} sub="Active" color="amber" />
                            </div>

                            <GlassCard className="p-6">
                                <h3 className="text-lg font-medium text-white mb-4">Recent Security Events</h3>
                                <div className="space-y-3">
                                    {[
                                        { event: 'Failed login attempt', ip: '192.168.1.45', time: '2 min ago', severity: 'warning' },
                                        { event: 'New admin API key created', ip: 'System', time: '1 hour ago', severity: 'info' },
                                        { event: 'Suspicious activity detected', ip: '10.0.0.23', time: '3 hours ago', severity: 'critical' },
                                    ].map((event, idx) => (
                                        <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${event.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/20' : event.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/5'}`}>
                                            <div className="flex items-center gap-3">
                                                <AlertCircle className={`w-5 h-5 ${event.severity === 'critical' ? 'text-rose-400' : event.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'}`} />
                                                <div>
                                                    <div className="text-white">{event.event}</div>
                                                    <div className="text-xs text-slate-500">IP: {event.ip}</div>
                                                </div>
                                            </div>
                                            <span className="text-sm text-slate-400">{event.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* AI PERFORMANCE SECTION */}
                    {activeSection === 'ai-performance' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={Brain} title="AI Performance & Drift Tracking" subtitle="LLM accuracy, latency, token usage, and drift detection" />
                            <AIPerformancePanel />
                        </motion.div>
                    )}

                    {/* ERROR INTELLIGENCE SECTION */}
                    {activeSection === 'errors' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={AlertTriangle} title="Error Intelligence" subtitle="Categorized errors, severity, and impact assessment" />
                            <ErrorIntelligencePanel />
                        </motion.div>
                    )}

                    {/* CROSS-MODULE INTELLIGENCE SECTION */}
                    {activeSection === 'cross-module' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={Layers} title="Cross-Module Intelligence" subtitle="Signal alignment, user trade correlation, and volatility analysis" />
                            <CrossModulePanel />
                        </motion.div>
                    )}

                    {/* NOTIFICATION ANALYTICS SECTION */}
                    {activeSection === 'notifications' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={Bell} title="Notification Analytics" subtitle="Engagement metrics, delivery stats, and drop-off analysis" />
                            <NotificationAnalyticsPanel />
                        </motion.div>
                    )}

                    {/* AUDIT & SECURITY SECTION */}
                    {activeSection === 'audit' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <SectionHeader icon={Lock} title="Audit & Security Logs" subtitle="Admin actions, permission changes, and security events" />
                            <AuditLogPanel />
                        </motion.div>
                    )}
                </main>
            </div>

            {/* User Details Dialog */}
            <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                <DialogContent className="max-w-2xl bg-slate-900 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">User Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-sm text-slate-400">Full Name</p>
                                <p className="font-semibold text-white">{selectedUser.full_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Email</p>
                                <p className="font-semibold text-white">{selectedUser.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Tier</p>
                                <p className="font-semibold text-white capitalize">{selectedUser.subscription_tier || 'free'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Role</p>
                                <p className="font-semibold text-white">{selectedUser.role || 'user'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Member Since</p>
                                <p className="font-semibold text-white">{formatDate(selectedUser.created_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Trading Style</p>
                                <p className="font-semibold text-white">{selectedUser.trading_style || 'balanced'}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
