import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { api } from '@/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Users, Crown, Zap, Shield, Mail, Calendar, CheckCircle2, AlertCircle,
    DollarSign, TrendingUp, Activity, Search, Eye, Ban, Check, X, Plus,
    BarChart3, LogIn, Loader2, UserPlus, Trash2, Rocket
} from 'lucide-react';

export default function AdminDashboard() {
    // Admin Auth State
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [adminLoginData, setAdminLoginData] = useState({ email: '', password: '' });
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Dashboard State
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserDialog, setShowUserDialog] = useState(false);
    const [theme, setTheme] = useState('dark');
    const queryClient = useQueryClient();

    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(currentTheme);
        const observer = new MutationObserver(() => {
            const newTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            setTheme(newTheme);
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const isDark = theme === 'dark';

    // Check if admin is already logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('admin_token');
        const currentUserId = localStorage.getItem('currentUserId');
        if (adminToken || currentUserId === 'admin-user-001') {
            setIsAdminAuthenticated(true);
        }
    }, []);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        try {
            const result = await api.auth.login(adminLoginData.email, adminLoginData.password);

            if (!result.success) {
                setLoginError('Invalid admin credentials');
                return;
            }

            // Check if user is actually an admin
            if (result.user.role !== 'admin') {
                setLoginError('Access denied. Admin credentials required.');
                localStorage.removeItem('currentUserId');
                return;
            }

            localStorage.setItem('admin_token', 'admin-authenticated');
            setIsAdminAuthenticated(true);
        } catch (err) {
            setLoginError(err.message || 'Invalid admin credentials');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('currentUserId');
        setIsAdminAuthenticated(false);
        setAdminLoginData({ email: '', password: '' });
    };

    // Fetch current user
    const { data: currentUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => api.auth.me(),
        enabled: isAdminAuthenticated
    });

    // Fetch all users
    const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            return JSON.parse(localStorage.getItem('users') || '[]');
        },
        enabled: isAdminAuthenticated
    });

    // Fetch all trades
    const { data: allTrades = [] } = useQuery({
        queryKey: ['allTrades'],
        queryFn: () => api.entities.Trade.list('-created_date'),
        enabled: isAdminAuthenticated
    });

    // Update user mutation
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
        },
        onError: (err) => {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        }
    });

    // Delete user mutation
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

    // Add user mutation
    const addUserMutation = useMutation({
        mutationFn: async () => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const newUser = {
                id: `user-${Date.now()}`,
                email: `user${users.length + 1}@demo.com`,
                password: 'demo123',
                full_name: `Demo User ${users.length + 1}`,
                role: 'user',
                subscription_tier: 'free',
                subscription_status: 'active',
                subscription_start_date: new Date().toISOString(),
                created_date: new Date().toISOString(),
                max_risk_percent: 2,
                default_leverage: 3,
                trading_style: 'balanced',
                theme: 'dark',
                is_active: true,
                total_revenue: 0
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            return newUser;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['allUsers']);
            setSuccess('User added successfully!');
            setTimeout(() => setSuccess(''), 3000);
        }
    });

    // Calculate stats
    const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.is_active !== false).length,
        eliteUsers: users.filter(u => u.subscription_tier === 'elite').length,
        proUsers: users.filter(u => u.subscription_tier === 'pro').length,
        freeUsers: users.filter(u => u.subscription_tier === 'free').length,
        adminUsers: users.filter(u => u.role === 'admin').length,
        totalTrades: allTrades.length,
        totalRevenue: users.reduce((sum, u) => sum + (u.total_revenue || 0), 0)
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    const getTierBadge = (tier) => {
        const badges = {
            elite: { icon: Crown, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
            pro: { icon: Zap, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
            free: { icon: Rocket, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
        };
        const badge = badges[tier] || badges.free;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${badge.color}`}>
                <Icon className="w-3 h-3" />
                {tier?.charAt(0).toUpperCase() + tier?.slice(1) || 'Free'}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const isActive = status !== false && status !== 'suspended' && status !== 'cancelled';
        return isActive ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400">
                <Check className="w-3 h-3" />Active
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400">
                <Ban className="w-3 h-3" />{status || 'Inactive'}
            </span>
        );
    };

    // Admin Login Screen
    if (!isAdminAuthenticated) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <Card className={`shadow-2xl ${isDark ? 'bg-slate-900/80 backdrop-blur-xl border-slate-800' : 'bg-white border-gray-200'}`}>
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Admin Dashboard
                            </CardTitle>
                            <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Enter your admin credentials to continue</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAdminLogin} className="space-y-4">
                                <div>
                                    <Label htmlFor="admin-email" className={isDark ? 'text-white' : 'text-gray-900'}>Admin Email</Label>
                                    <Input
                                        id="admin-email"
                                        type="email"
                                        required
                                        value={adminLoginData.email}
                                        onChange={(e) => setAdminLoginData({ ...adminLoginData, email: e.target.value })}
                                        className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                        placeholder="admin@invsio.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="admin-password" className={isDark ? 'text-white' : 'text-gray-900'}>Password</Label>
                                    <Input
                                        id="admin-password"
                                        type="password"
                                        required
                                        value={adminLoginData.password}
                                        onChange={(e) => setAdminLoginData({ ...adminLoginData, password: e.target.value })}
                                        className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                        placeholder="••••••••"
                                    />
                                </div>

                                {loginError && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {loginError}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                    disabled={loginLoading}
                                >
                                    {loginLoading ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Authenticating...</>
                                    ) : (
                                        <><LogIn className="w-4 h-4 mr-2" />Login to Admin</>
                                    )}
                                </Button>
                            </form>

                            <div className={`mt-6 p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                                <p className={`text-xs text-center ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    🔐 <strong>Admin:</strong> admin@invsio.com / admin123
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // Loading State
    if (usersLoading && users.length === 0) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
                    <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    // Main Dashboard
    return (
        <div className={`min-h-screen p-6 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Admin Dashboard
                                </h1>
                                <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
                                    Welcome back, {currentUser?.full_name || 'Admin'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => refetchUsers()} variant="outline" className={`${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-300 hover:bg-gray-100'}`}>
                                <Activity className="w-4 h-4 mr-2" />Refresh
                            </Button>
                            <Button onClick={handleAdminLogout} variant="outline" className="border-red-500/30 hover:bg-red-500/10 text-red-400">
                                Logout
                            </Button>
                        </div>
                    </div>

                    {/* Success/Error Messages */}
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <p className="text-emerald-300">{success}</p>
                        </motion.div>
                    )}
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <p className="text-red-300">{error}</p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    {[
                        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue', sub: `+${stats.activeUsers} active` },
                        { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'emerald', sub: 'Lifetime' },
                        { label: 'Active Subscriptions', value: stats.proUsers + stats.eliteUsers, icon: Crown, color: 'amber', sub: `${stats.eliteUsers} Elite, ${stats.proUsers} Pro` },
                        { label: 'Total Trades', value: stats.totalTrades, icon: BarChart3, color: 'purple', sub: 'Platform-wide' }
                    ].map((stat, idx) => (
                        <Card key={idx} className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'} hover:border-${stat.color}-500/30 transition-colors`}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</p>
                                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                                </div>
                                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                                <p className={`text-sm mt-2 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{stat.sub}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* User Management */}
                <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'}`}>
                    <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>User Management</CardTitle>
                            <div className="flex items-center gap-2">
                                <div className={`relative flex items-center ${isDark ? 'bg-slate-800' : 'bg-gray-100'} rounded-lg px-3`}>
                                    <Search className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`border-none bg-transparent w-64 ${isDark ? 'text-white' : 'text-gray-900'}`}
                                    />
                                </div>
                                <Button onClick={() => addUserMutation.mutate()} className="bg-emerald-600 hover:bg-emerald-700">
                                    <UserPlus className="w-4 h-4 mr-2" />Add User
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                                        <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>User</th>
                                        <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Role</th>
                                        <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Tier</th>
                                        <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Status</th>
                                        <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Joined</th>
                                        <th className={`text-left p-4 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className={`border-b ${isDark ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${user.subscription_tier === 'elite' ? 'from-amber-500 to-orange-600' : user.subscription_tier === 'pro' ? 'from-emerald-500 to-teal-600' : 'from-blue-500 to-indigo-600'} flex items-center justify-center`}>
                                                        <span className="text-white font-bold text-sm">{user.full_name?.charAt(0) || 'U'}</span>
                                                    </div>
                                                    <div>
                                                        <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.full_name}</div>
                                                        <div className={`text-sm flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                                            <Mail className="w-3 h-3" />{user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'}`}>
                                                    {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                                    {user.role || 'user'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    value={user.subscription_tier || 'free'}
                                                    onChange={(e) => updateUserMutation.mutate({ userId: user.id, updates: { subscription_tier: e.target.value } })}
                                                    className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-gray-900 border-gray-300'} border`}
                                                >
                                                    <option value="free">Free</option>
                                                    <option value="pro">Pro</option>
                                                    <option value="elite">Elite</option>
                                                </select>
                                            </td>
                                            <td className="p-4">{getStatusBadge(user.is_active)}</td>
                                            <td className="p-4">
                                                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(user.created_date)}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => { setSelectedUser(user); setShowUserDialog(true); }} className={`${isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-300 hover:bg-gray-100'}`}>
                                                        <Eye className="w-4 h-4 mr-1" />View
                                                    </Button>
                                                    {user.role !== 'admin' && (
                                                        <Button size="sm" variant="outline" onClick={() => deleteUserMutation.mutate(user.id)} className="border-red-500/30 hover:bg-red-500/10 text-red-400">
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
                                    <Users className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} />
                                    <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>No users found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* User Details Dialog */}
                <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                    <DialogContent className={`max-w-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                        <DialogHeader>
                            <DialogTitle className={isDark ? 'text-white' : 'text-gray-900'}>User Details</DialogTitle>
                        </DialogHeader>
                        {selectedUser && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Full Name</p>
                                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedUser.full_name}</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Email</p>
                                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedUser.email}</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Tier</p>
                                        {getTierBadge(selectedUser.subscription_tier)}
                                    </div>
                                    <div>
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Role</p>
                                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedUser.role || 'user'}</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Member Since</p>
                                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatDate(selectedUser.created_date)}</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Trading Style</p>
                                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedUser.trading_style || 'balanced'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
