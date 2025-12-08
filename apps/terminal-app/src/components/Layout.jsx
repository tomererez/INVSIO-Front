import { Link, useLocation } from "react-router-dom";
import { Calculator, BarChart3, Brain, BookOpen, Menu, X, User, Grid, Sun, Moon, ChevronDown, HelpCircle, Mail, BookMarked, LogOut, Settings, CreditCard, Download, Archive, Palette, Sparkles, Activity, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { LanguageProvider, useLanguage } from '@/components/LanguageContext';
import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import ExportModal from '@/components/ExportModal';

function LayoutContent({ children }) {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [featuresOpen, setFeaturesOpen] = useState(false);
    const [helpCenterOpen, setHelpCenterOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const featuresTimeoutRef = useRef(null);
    const helpCenterTimeoutRef = useRef(null);
    const userMenuTimeoutRef = useRef(null);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });
    const { t } = useLanguage();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const isAuth = await api.auth.isAuthenticated();
            if (!isAuth) return null;
            return await api.auth.me();
        },
        retry: 1,
    });

    const { data: trades = [] } = useQuery({
        queryKey: ['trades'],
        queryFn: () => api.entities.Trade.list('-created_date', 10000),
        enabled: !!user,
        initialData: [],
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleToggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const isActive = (pageName) => {
        const pageUrl = createPageUrl(pageName).toLowerCase();
        return location.pathname.toLowerCase() === pageUrl ||
            location.pathname.toLowerCase().includes(pageName.toLowerCase());
    };

    const handleLogout = () => {
        api.auth.logout();
    };

    const featureItems = [
        { name: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
        { name: "AIMarketAnalyzer", label: "AI Market Analyzer", icon: Sparkles },
        { name: "AIMarketAnalyzerV21", label: "AI Market Analyzer v2.1", icon: Brain },
        { name: "CryptoGuide", label: "Market Parameters Guide", icon: BookOpen },
        { name: "TechnicalAnalysis", label: "Technical Analysis", icon: BarChart3 },
        { name: "AIAnalysis", label: "AI Analysis", icon: Brain },
        { name: "RiskCalculator", label: t('nav.riskCalculator'), icon: Calculator },
        { name: "TradingJournal", label: t('nav.tradingJournal'), icon: Activity },
    ];

    const helpCenterItems = [
        { name: "FAQ", label: "FAQ", icon: HelpCircle },
        { name: "Contact", label: "Contact / Support", icon: Mail },
        { name: "QuickStartGuide", label: "Quick Start Guide", icon: BookMarked },
    ];

    const handleMenuClick = () => {
        setMobileMenuOpen(false);
    };

    const handleFeaturesEnter = () => {
        if (featuresTimeoutRef.current) clearTimeout(featuresTimeoutRef.current);
        setFeaturesOpen(true);
    };

    const handleFeaturesLeave = () => {
        featuresTimeoutRef.current = setTimeout(() => setFeaturesOpen(false), 200);
    };

    const handleHelpCenterEnter = () => {
        if (helpCenterTimeoutRef.current) clearTimeout(helpCenterTimeoutRef.current);
        setHelpCenterOpen(true);
    };

    const handleHelpCenterLeave = () => {
        helpCenterTimeoutRef.current = setTimeout(() => setHelpCenterOpen(false), 200);
    };

    const handleUserMenuEnter = () => {
        if (userMenuTimeoutRef.current) clearTimeout(userMenuTimeoutRef.current);
        setUserMenuOpen(true);
    };

    const handleUserMenuLeave = () => {
        userMenuTimeoutRef.current = setTimeout(() => setUserMenuOpen(false), 200);
    };

    const isDark = theme === 'dark';

    return (
        <div className="min-h-screen bg-transparent text-slate-50 font-sans selection:bg-indigo-500/30 selection:text-white" style={{ fontSize: '110%' }}>
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 h-14 flex justify-between items-center backdrop-blur-xl bg-white/[0.02] shadow-lg shadow-black/20 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                    <div className="flex items-center justify-between h-14 w-full">
                        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base shadow-lg group-hover:shadow-indigo-500/50 transition-shadow">
                                <Brain className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white leading-none tracking-tight">
                                    INVSIO
                                </span>
                                <span className="text-[8px] text-slate-400 leading-none">
                                    Terminal Edition
                                </span>
                            </div>
                        </Link>

                        <div className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            {/* Features Dropdown */}
                            <div className="relative" onMouseEnter={handleFeaturesEnter} onMouseLeave={handleFeaturesLeave}>
                                <button className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${featureItems.slice(1).some(f => isActive(f.name)) ? "text-white" : "hover:text-white"}`}>
                                    {featureItems.slice(1).some(f => isActive(f.name)) && (
                                        <motion.div
                                            layoutId="nav-glass-pill"
                                            className="absolute inset-0 bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-lg shadow-sm"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-1.5">
                                        <Grid className="w-3.5 h-3.5" />
                                        <span>Features</span>
                                        <ChevronDown className="w-3 h-3" />
                                    </span>
                                </button>

                                {featuresOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-64 rounded-xl shadow-2xl border bg-card border-white/10 py-2 z-50 backdrop-blur-xl">
                                        {featureItems.slice(1).map((item) => (
                                            <Link key={`feature-${item.name}`} to={createPageUrl(item.name)} className="block">
                                                <button className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 text-left ${isActive(item.name)
                                                    ? "text-white bg-white/5"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                                    }`}>
                                                    <item.icon className="w-3.5 h-3.5" />
                                                    <span className="font-medium text-sm">{item.label}</span>
                                                </button>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Help Center Dropdown */}
                            <div className="relative" onMouseEnter={handleHelpCenterEnter} onMouseLeave={handleHelpCenterLeave}>
                                <Link to={createPageUrl("FAQ")}>
                                    <button className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${helpCenterItems.some(h => isActive(h.name)) ? "text-white" : "hover:text-white"}`}>
                                        {helpCenterItems.some(h => isActive(h.name)) && (
                                            <motion.div
                                                layoutId="nav-glass-pill"
                                                className="absolute inset-0 bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-lg shadow-sm"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-1.5">
                                            <HelpCircle className="w-3.5 h-3.5" />
                                            <span>Help Center</span>
                                            <ChevronDown className="w-3 h-3" />
                                        </span>
                                    </button>
                                </Link>

                                {helpCenterOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-56 rounded-xl shadow-2xl border bg-card border-white/10 py-2 z-50 backdrop-blur-xl">
                                        {helpCenterItems.map((item) => (
                                            <Link key={`helpcenter-${item.name}`} to={createPageUrl(item.name)} className="block">
                                                <button className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 text-left ${isActive(item.name)
                                                    ? "text-white bg-white/5"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                                    }`}>
                                                    <item.icon className="w-3.5 h-3.5" />
                                                    <span className="font-medium text-sm">{item.label}</span>
                                                </button>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Theme Toggle */}
                            <button onClick={handleToggleTheme} className={`p-2.5 rounded-xl transition-all duration-200 ${isDark ? 'text-slate-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-gray-100'}`}>
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <div className="h-4 w-px bg-white/10 mx-1" />

                            {/* User Menu */}
                            {user && (
                                <div className="relative" onMouseEnter={handleUserMenuEnter} onMouseLeave={handleUserMenuLeave}>
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-slate-400 hover:text-white">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-300 font-bold text-xs hover:border-indigo-400 transition-colors">
                                            {user.full_name ? user.full_name.charAt(0) : <User className="w-4 h-4" />}
                                        </div>
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-72 rounded-xl shadow-2xl border bg-card border-white/10 overflow-hidden z-50">
                                            <div className="px-5 py-4 bg-white/5">
                                                <p className="font-bold text-base text-white">{user.full_name}</p>
                                                <p className="text-sm mt-0.5 text-slate-400">{user.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <Link to={createPageUrl("MyAccount")} className="block">
                                                    <button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 text-left text-slate-400 hover:text-white hover:bg-white/5">
                                                        <Settings className="w-4 h-4" />
                                                        <span className="font-medium text-sm">Profile & Account Settings</span>
                                                    </button>
                                                </Link>
                                                <button onClick={handleToggleTheme} className="w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 text-left text-slate-400 hover:text-white hover:bg-white/5">
                                                    <Palette className="w-4 h-4" />
                                                    <span className="font-medium text-sm">Appearance</span>
                                                    <span className="ml-auto text-xs px-2 py-1 rounded-md bg-white/10 text-slate-300">
                                                        {theme === 'dark' ? 'Dark' : 'Light'}
                                                    </span>
                                                </button>
                                                <button onClick={() => { setShowExportModal(true); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 text-left text-slate-400 hover:text-white hover:bg-white/5">
                                                    <Download className="w-4 h-4" />
                                                    <span className="font-medium text-sm">Export My Trades (CSV)</span>
                                                </button>
                                            </div>
                                            <div className="border-t border-white/10" />
                                            <div className="py-2">
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 text-left text-red-500 hover:bg-red-500/10">
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="font-bold text-sm">Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Dashboard CTA */}
                            <Link to="/dashboard" className="group">
                                <button className="relative flex items-center gap-2 px-5 py-2 rounded-full overflow-hidden transition-all duration-500 group-hover:scale-105">
                                    {/* Animated gradient background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 opacity-90" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-shadow duration-500" />

                                    {/* Stars/particles effect */}
                                    <div className="absolute inset-0 opacity-30">
                                        <div className="absolute w-1 h-1 bg-white rounded-full top-1 left-3 animate-pulse" />
                                        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-3 right-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
                                        <div className="absolute w-1 h-1 bg-white rounded-full bottom-2 left-8 animate-pulse" style={{ animationDelay: '1s' }} />
                                    </div>

                                    {/* Content */}
                                    <LayoutDashboard className="relative z-10 w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform duration-300" />
                                    <span className="relative z-10 text-white font-medium text-[11px] tracking-wide">Dashboard</span>

                                    {/* Subtle border glow */}
                                    <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors" />
                                </button>
                            </Link>
                        </div>

                        <div className="flex lg:hidden items-center gap-2">
                            <button onClick={handleToggleTheme} className="p-2 rounded-lg transition-colors text-slate-400 hover:text-white">
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg transition-colors text-slate-400 hover:text-white">
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden border-t border-white/5 bg-void/95 backdrop-blur-lg" style={{ display: mobileMenuOpen ? 'block' : 'none' }}>
                    <div className="px-4 py-3 space-y-1">
                        {user && (
                            <>
                                <div className={`px-4 py-4 rounded-xl mb-3 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                    <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.full_name}</p>
                                    <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{user.email}</p>
                                </div>
                                <Link to={createPageUrl("MyAccount")}>
                                    <button onClick={handleMenuClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isDark ? 'text-slate-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-gray-100'}`}>
                                        <Settings className="w-5 h-5" />
                                        <span className="font-medium text-base">Profile & Settings</span>
                                    </button>
                                </Link>
                                <div className={`border-t ${isDark ? 'border-slate-800' : 'border-gray-200'} my-2`} />
                            </>
                        )}

                        <div className={`px-4 py-2 text-xs font-bold ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>FEATURES</div>
                        {featureItems.map((item) => (
                            <Link key={`mobile-feature-${item.name}`} to={createPageUrl(item.name)} onClick={handleMenuClick}>
                                <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.name) ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" : isDark ? "text-slate-300 hover:bg-slate-800/50" : "text-gray-700 hover:bg-gray-100"
                                    }`}>
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </button>
                            </Link>
                        ))}

                        <div className={`px-4 py-2 text-xs font-bold ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>HELP CENTER</div>
                        {helpCenterItems.map((item) => (
                            <Link key={`mobile-helpcenter-${item.name}`} to={createPageUrl(item.name)} onClick={handleMenuClick}>
                                <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.name) ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" : isDark ? "text-slate-300 hover:bg-slate-800/50" : "text-gray-700 hover:bg-gray-100"
                                    }`}>
                                    <item.icon className="w-4 h-4" />
                                    <span className="font-medium text-base">{item.label}</span>
                                </button>
                            </Link>
                        ))}

                        {user && (
                            <>
                                <div className={`border-t ${isDark ? 'border-slate-800' : 'border-gray-200'} my-2`} />
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-500/10">
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-bold text-base">Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main key="main-content" className="relative z-10">{children}</main>

            <footer className="relative z-10 bg-white/[0.02] backdrop-blur-xl mt-20">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p className="text-slate-300">&copy; 2025 INVSIO. All rights reserved.</p>
                    <p className="text-[10px] text-slate-400">
                        ⚠️For educational purposes only. Not financial advice. Trading involves significant risk.
                    </p>
                    <div className="flex gap-6">
                        <Link to="#" className="text-slate-400 hover:text-white transition-colors">Privacy</Link>
                        <Link to="#" className="text-slate-400 hover:text-white transition-colors">Terms</Link>
                        <Link to="#" className="text-slate-400 hover:text-white transition-colors">Twitter</Link>
                    </div>
                </div>
            </footer>

            {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} trades={trades} user={user} />}
        </div>
    );
}

LayoutContent.propTypes = {
    children: PropTypes.node.isRequired
};

function Layout({ children }) {
    return (
        <LanguageProvider>
            <LayoutContent>{children}</LayoutContent>
        </LanguageProvider>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired
};

export default Layout;
