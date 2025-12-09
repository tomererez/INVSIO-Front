import { Link, useLocation } from "react-router-dom";
import { Brain, Menu, X, Sun, Moon, ChevronDown, HelpCircle, Rocket, DollarSign, Grid, Info, Mail, BookMarked } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { useState, useEffect, useRef } from "react";
import { TorchEffect } from "./ui/torch-effect";
import { config } from "@/config";

const TERMINAL_URL = config.TERMINAL_URL;

export default function Layout({ children }) {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [helpCenterOpen, setHelpCenterOpen] = useState(false);
    const helpCenterTimeoutRef = useRef(null);
    // Scroll to Top on Route Change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);



    const isActive = (pageName) => {
        const pageUrl = createPageUrl(pageName).toLowerCase();
        return location.pathname.toLowerCase() === pageUrl ||
            location.pathname.toLowerCase().includes(pageName.toLowerCase());
    };

    const mainMenuItems = [
        { name: "Home", label: "Home", icon: Brain },
        { name: "Features", label: "Features", icon: Grid },
        { name: "Pricing", label: "Pricing", icon: DollarSign },
        { name: "About", label: "About", icon: Info },
    ];

    const helpCenterItems = [
        { name: "FAQ", label: "FAQ", icon: HelpCircle },
        { name: "Contact", label: "Contact / Support", icon: Mail },
    ];

    const handleMenuClick = () => {
        setMobileMenuOpen(false);
    };

    const handleHelpCenterEnter = () => {
        if (helpCenterTimeoutRef.current) {
            clearTimeout(helpCenterTimeoutRef.current);
        }
        setHelpCenterOpen(true);
    };

    const handleHelpCenterLeave = () => {
        helpCenterTimeoutRef.current = setTimeout(() => {
            setHelpCenterOpen(false);
        }, 200);
    };

    const isDark = true;

    const [isLaunching, setIsLaunching] = useState(false);

    const handleLaunchTerminal = () => {
        setIsLaunching(true);
        setTimeout(() => {
            window.open(TERMINAL_URL, '_blank');
            setIsLaunching(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-transparent text-slate-50 font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
            <TorchEffect />
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 h-[72px] flex justify-between items-center backdrop-blur-xl bg-white/[0.02] shadow-lg shadow-black/20 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between h-[72px] w-full">
                        <Link to={createPageUrl("Home")} className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base shadow-lg group-hover:shadow-indigo-500/50 transition-shadow">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white leading-none tracking-tight">
                                    INVSIO
                                </span>
                                <span className="text-[10px] text-slate-400 leading-none mt-0.5">
                                    Trade Like Smart Money
                                </span>
                            </div>
                        </Link>

                        {/* Launch Terminal CTA - Centered Space Button */}
                        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                            <button
                                onClick={handleLaunchTerminal}
                                className="group relative"
                            >
                                {/* Vivid Outer Glow */}
                                <div className="absolute -inset-1.5 bg-indigo-500/40 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse"></div>

                                {/* Button Container */}
                                <div className="relative flex items-center gap-3 px-10 py-2.5 rounded-2xl overflow-hidden bg-[#0A0A0F] border border-white/20 transition-all duration-300 group-hover:border-white/40 group-hover:bg-[#12121A] shadow-[0_0_15px_rgba(99,102,241,0.3)]">

                                    {/* Deep Space Background - Enhanced Visibility */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-blue-600/30 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Dense Star Field */}
                                    <div className={`absolute inset-0 opacity-80 transition-transform duration-700 ease-in ${isLaunching ? 'translate-y-[150%] scale-y-125 opacity-40' : ''}`}>
                                        <div className="absolute top-1.5 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
                                        <div className="absolute bottom-2 right-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-75"></div>
                                        <div className="absolute top-1/2 right-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-150"></div>
                                        <div className="absolute top-2 right-8 w-0.5 h-0.5 bg-indigo-200 rounded-full animate-pulse delay-300"></div>
                                        <div className="absolute bottom-1.5 left-8 w-1 h-1 bg-white/80 rounded-full blur-[0.5px] animate-pulse delay-500"></div>
                                        <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200"></div>

                                        {/* Additional Stars */}
                                        <div className="absolute top-1 right-10 w-0.5 h-0.5 bg-white/90 rounded-full animate-pulse delay-100"></div>
                                        <div className="absolute bottom-3 left-12 w-0.5 h-0.5 bg-indigo-100 rounded-full animate-pulse delay-400"></div>
                                        <div className="absolute top-3 left-8 w-1 h-1 bg-white/60 blur-[0.3px] rounded-full animate-pulse delay-600"></div>
                                        <div className="absolute bottom-1 right-12 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-250"></div>
                                        <div className="absolute top-2 left-16 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-350"></div>
                                    </div>

                                    {/* Rocket Animation Wrapper */}
                                    <div className={`relative w-5 h-5 transition-all duration-1000 ease-in-out ${isLaunching ? '-translate-y-[60px] cursor-default' : ''}`}>
                                        <Rocket className={`w-5 h-5 text-indigo-300 group-hover:text-white transition-all duration-300 ${isLaunching ? 'rotate-[-45deg]' : 'rotate-0 group-hover:rotate-[-45deg]'}`} />

                                        {/* Engine flame when launching */}
                                        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-7 bg-orange-500/90 blur-[2px] rounded-full transition-opacity duration-300 ${isLaunching ? 'opacity-100' : 'opacity-0'}`} />
                                        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-3.5 h-5 bg-orange-400/50 blur-md rounded-full transition-opacity duration-300 ${isLaunching ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>

                                    {/* Text Transition */}
                                    <div className="relative z-10 w-[120px] h-[18px] overflow-hidden text-center">
                                        <div className={`flex flex-col items-center transition-transform duration-500 ${isLaunching ? '-translate-y-[20px]' : 'translate-y-0'}`}>
                                            <span className="text-slate-200 font-semibold text-xs tracking-widest uppercase group-hover:text-white transition-colors duration-300 block leading-[18px] text-shadow-sm w-full text-center">
                                                Terminal
                                            </span>
                                            <span className="text-indigo-300 font-semibold text-xs tracking-widest uppercase animate-pulse block leading-[18px] mt-[2px] w-full text-center">
                                                Launching
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Right Side Nav */}
                        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400">
                            {mainMenuItems.map((item) => {
                                const active = isActive(item.name);
                                return (
                                    <Link key={`desktop-menu-${item.name}`} to={createPageUrl(item.name)}>
                                        <button className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${active ? "text-white" : "hover:text-white"}`}>
                                            {active && (
                                                <motion.div
                                                    layoutId="nav-glass-pill"
                                                    className="absolute inset-0 bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-lg shadow-sm"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                            <span className="relative z-10 flex items-center gap-2">
                                                <item.icon className="w-4 h-4" />
                                                <span>{item.label}</span>
                                            </span>
                                        </button>
                                    </Link>
                                );
                            })}

                            <div
                                className="relative"
                                onMouseEnter={handleHelpCenterEnter}
                                onMouseLeave={handleHelpCenterLeave}
                            >
                                <Link to={createPageUrl("FAQ")}>
                                    <button className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${helpCenterItems.some(h => isActive(h.name)) ? "text-white" : "hover:text-white"}`}>
                                        {helpCenterItems.some(h => isActive(h.name)) && (
                                            <motion.div
                                                layoutId="nav-glass-pill"
                                                className="absolute inset-0 bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-lg shadow-sm"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            <HelpCircle className="w-4 h-4" />
                                            <span>Help</span>
                                            <ChevronDown className="w-3.5 h-3.5" />
                                        </span>
                                    </button>
                                </Link>

                                {helpCenterOpen && (
                                    <div className="absolute top-full right-0 mt-1 w-48 rounded-xl shadow-2xl border bg-card border-white/10 py-1 z-50 backdrop-blur-xl">
                                        {helpCenterItems.map((item) => (
                                            <Link
                                                key={`helpcenter-${item.name}`}
                                                to={createPageUrl(item.name)}
                                                className="block"
                                            >
                                                <button className={`w-full flex items-center gap-3 px-3 py-2 transition-all duration-200 text-left ${isActive(item.name)
                                                    ? "text-white bg-white/5"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                                    }`}>
                                                    <item.icon className="w-3.5 h-3.5" />
                                                    <span className="text-[11px] font-medium">{item.label}</span>
                                                </button>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex lg:hidden items-center gap-2">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6" key="close-icon" />
                                ) : (
                                    <Menu className="w-6 h-6" key="menu-icon" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:hidden border-t border-white/5 bg-void/95 backdrop-blur-lg" style={{ display: mobileMenuOpen ? 'block' : 'none' }}>
                    <div className="px-4 py-3 space-y-1">
                        {mainMenuItems.map((item) => (
                            <Link
                                key={`mobile-menu-${item.name}`}
                                to={createPageUrl(item.name)}
                                onClick={handleMenuClick}
                            >
                                <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.name)
                                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                                    : isDark ? "text-slate-300 hover:bg-slate-800/50" : "text-gray-700 hover:bg-gray-100"
                                    }`}>
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium text-base">{item.label}</span>
                                </button>
                            </Link>
                        ))}

                        <div className={`px-4 py-2 text-xs font-bold ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                            HELP CENTER
                        </div>

                        {helpCenterItems.map((item) => (
                            <Link
                                key={`mobile-helpcenter-${item.name}`}
                                to={createPageUrl(item.name)}
                                onClick={handleMenuClick}
                            >
                                <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.name)
                                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                                    : isDark ? "text-slate-300 hover:bg-slate-800/50" : "text-gray-700 hover:bg-gray-100"
                                    }`}>
                                    <item.icon className="w-4 h-4" />
                                    <span className="font-medium text-base">{item.label}</span>
                                </button>
                            </Link>
                        ))}

                        <div className={`border-t ${isDark ? 'border-slate-800' : 'border-gray-200'} my-2 pt-2`}>
                            <a href={TERMINAL_URL} target="_blank" rel="noopener noreferrer" onClick={handleMenuClick}>
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg">
                                    <Rocket className="w-5 h-5" />
                                    <span className="text-base">Launch Terminal</span>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <main key="main-content" className="relative z-10">
                {children}
            </main>

            <footer className="relative z-10 bg-white/[0.02] backdrop-blur-xl mt-20">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p className="text-slate-300">&copy; 2025 INVSIO. All rights reserved.</p>
                    <p className="text-[10px] text-slate-400">
                        ⚠️ For educational purposes only. Not financial advice. Trading involves significant risk.
                    </p>
                    <div className="flex gap-6">
                        <Link to="#" className="text-slate-400 hover:text-white transition-colors">Privacy</Link>
                        <Link to="#" className="text-slate-400 hover:text-white transition-colors">Terms</Link>
                        <Link to="#" className="text-slate-400 hover:text-white transition-colors">Twitter</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
