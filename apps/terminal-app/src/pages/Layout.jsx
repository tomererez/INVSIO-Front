
import { Link, useLocation } from "react-router-dom";
import { Calculator, BarChart3, Brain, BookOpen, Menu, X, User, Grid, DollarSign, Sun, Moon, ChevronDown, HelpCircle, Mail, BookMarked, LogOut, Settings, CreditCard, Download, Archive, Palette, Sparkles, Activity } from "lucide-react";
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
    retry: false,
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

  const toggleTheme = () => {
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

  const mainMenuItems = [
    { name: "Pricing", label: "Pricing", icon: DollarSign },
    { name: "Features", label: "Features", icon: Grid },
    { name: "HelpCenter", label: "Help Center", icon: HelpCircle },
    { name: "About", label: "About", icon: Brain },
    { name: "Dashboard", label: "Dashboard", icon: User }
  ];

  const featureItems = [
    { name: "AIMarketAnalyzer", label: "AI Market Analyzer", icon: Sparkles },
    { name: "AIMarketAnalyzerV21", label: "AI Market Analyzer v2.1 (OpenAI)", icon: Brain },
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
    if (featuresTimeoutRef.current) {
      clearTimeout(featuresTimeoutRef.current);
    }
    setFeaturesOpen(true);
  };

  const handleFeaturesLeave = () => {
    featuresTimeoutRef.current = setTimeout(() => {
      setFeaturesOpen(false);
    }, 200);
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

  const handleUserMenuEnter = () => {
    if (userMenuTimeoutRef.current) {
      clearTimeout(userMenuTimeoutRef.current);
    }
    setUserMenuOpen(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeoutRef.current = setTimeout(() => {
      setUserMenuOpen(false);
    }, 200);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`} style={{ fontSize: '110%' }}>
      <nav className={`border-b ${isDark ? 'border-slate-800/50 bg-slate-900/80' : 'border-gray-200 bg-white/80'} backdrop-blur-lg sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
                  {t('nav.smartTrading')}
                </span>
                <span className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'} -mt-0.5 sm:-mt-1 hidden sm:block`}>
                  {t('nav.tagline')}
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              {mainMenuItems.filter(item => item.name !== 'Features' && item.name !== 'HelpCenter').map((item) => (
                <Link key={`desktop-menu-${item.name}`} to={createPageUrl(item.name)}>
                  <button className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap ${isActive(item.name)
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                    : isDark ? "text-slate-300 hover:bg-slate-800/50" : "text-gray-700 hover:bg-gray-100"
                    }`}>
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                </Link>
              ))}

              <div
                className="relative"
                onMouseEnter={handleFeaturesEnter}
                onMouseLeave={handleFeaturesLeave}
              >
                <Link to={createPageUrl("Features")}>
                  <button className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap ${isActive("Features") || featureItems.some(f => isActive(f.name))
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                    : isDark ? "text-slate-300 hover:bg-slate-800/50" : "text-gray-700 hover:bg-gray-100"
                    }`}>
                    <Grid className="w-4 h-4" />
                    <span className="font-medium text-sm">Features</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </Link>

                {featuresOpen && (
                  <div className={`absolute top-full left-0 mt-1 w-64 rounded-xl shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
                    } py-2 z-50`}>
                    {featureItems.map((item) => (
                      <Link
                        key={`feature-${item.name}`}
                        to={createPageUrl(item.name)}
                        className="block"
                      >
                        <button className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 text-left ${isActive(item.name)
                          ? "bg-emerald-600 text-white"
                          : isDark ? "text-slate-300 hover:bg-slate-800" : "text-gray-700 hover:bg-gray-100"
                          }`}>
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium text-sm">{item.label}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={handleHelpCenterEnter}
                onMouseLeave={handleHelpCenterLeave}
              >
                <Link to={createPageUrl("FAQ")}>
                  <button className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap ${helpCenterItems.some(h => isActive(h.name))
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                    : isDark ? "text-slate-300 hover:bg-slate-800/50" : "text-gray-700 hover:bg-gray-100"
                    }`}>
                    <HelpCircle className="w-4 h-4" />
                    <span className="font-medium text-sm">Help Center</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </Link>

                {helpCenterOpen && (
                  <div className={`absolute top-full left-0 mt-1 w-56 rounded-xl shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
                    } py-2 z-50`}>
                    {helpCenterItems.map((item) => (
                      <Link
                        key={`helpcenter-${item.name}`}
                        to={createPageUrl(item.name)}
                        className="block"
                      >
                        <button className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 text-left ${isActive(item.name)
                          ? "bg-emerald-600 text-white"
                          : isDark ? "text-slate-300 hover:bg-slate-800" : "text-gray-700 hover:bg-gray-100"
                          }`}>
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium text-sm">{item.label}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-200 ${isDark ? 'text-slate-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user && (
                <div
                  className="relative"
                  onMouseEnter={handleUserMenuEnter}
                  onMouseLeave={handleUserMenuLeave}
                >
                  <button className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 ${isDark ? 'text-slate-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {userMenuOpen && (
                    <div className={`absolute top-full right-0 mt-2 w-72 rounded-2xl shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
                      } overflow-hidden z-50`}>
                      {/* User Info Section */}
                      <div className={`px-5 py-4 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                        <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {user.full_name}
                        </p>
                        <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                          {user.email}
                        </p>
                      </div>

                      {/* Account Management Section */}
                      <div className="py-2">
                        <Link to={createPageUrl("MyAccount")} className="block">
                          <button
                            onClick={() => setUserMenuOpen(false)}
                            className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 text-left ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            <Settings className="w-4 h-4" />
                            <span className="font-medium text-sm">Profile & Account Settings</span>
                          </button>
                        </Link>

                        <Link to={createPageUrl("Pricing")} className="block">
                          <button
                            onClick={() => setUserMenuOpen(false)}
                            className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 text-left ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            <CreditCard className="w-4 h-4" />
                            <span className="font-medium text-sm">Subscription & Billing</span>
                          </button>
                        </Link>

                        <button
                          onClick={toggleTheme}
                          className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 text-left ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <Palette className="w-4 h-4" />
                          <span className="font-medium text-sm">Appearance</span>
                          <span className={`ml-auto text-xs px-2 py-1 rounded-md ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'
                            }`}>
                            {theme === 'dark' ? 'Dark' : 'Light'}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setShowExportModal(true);
                            setUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 text-left ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <Download className="w-4 h-4" />
                          <span className="font-medium text-sm">Export My Trades (CSV)</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowExportModal(true);
                            setUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 text-left ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <Archive className="w-4 h-4" />
                          <span className="font-medium text-sm">Backup My Journal</span>
                        </button>
                      </div>

                      {/* Divider */}
                      <div className={`border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`} />

                      {/* Logout Section */}
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 text-left text-red-500 hover:bg-red-500/10`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-bold text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

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

        <div className={`lg:hidden border-t ${isDark ? 'border-slate-800/50 bg-slate-900/95' : 'border-gray-200 bg-white/95'} backdrop-blur-lg`} style={{ display: mobileMenuOpen ? 'block' : 'none' }}>
          <div className="px-4 py-3 space-y-1">
            {user && (
              <>
                <div className={`px-4 py-4 rounded-xl mb-3 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                  <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user.full_name}
                  </p>
                  <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {user.email}
                  </p>
                </div>

                <Link to={createPageUrl("MyAccount")}>
                  <button
                    onClick={handleMenuClick}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isDark ? 'text-slate-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium text-base">Profile & Settings</span>
                  </button>
                </Link>

                <Link to={createPageUrl("Pricing")}>
                  <button
                    onClick={handleMenuClick}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isDark ? 'text-slate-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium text-base">Subscription</span>
                  </button>
                </Link>

                <button
                  onClick={() => {
                    setShowExportModal(true);
                    handleMenuClick();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isDark ? 'text-slate-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium text-base">Export Trades</span>
                </button>

                <button
                  onClick={() => {
                    setShowExportModal(true);
                    handleMenuClick();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isDark ? 'text-slate-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Archive className="w-5 h-5" />
                  <span className="font-medium text-base">Backup Journal</span>
                </button>

                <div className={`border-t ${isDark ? 'border-slate-800' : 'border-gray-200'} my-2`} />
              </>
            )}

            {mainMenuItems.filter(item => item.name !== 'HelpCenter').map((item) => (
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
              FEATURES
            </div>

            {featureItems.map((item) => (
              <Link
                key={`mobile-feature-${item.name}`}
                to={createPageUrl(item.name)}
                onClick={handleMenuClick}
              >
                <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.name)
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                  : isDark ? "text-slate-300 hover:bg-slate-800/50" : "text-gray-700 hover:bg-gray-100"
                  }`}>
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
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

            {user && (
              <>
                <div className={`border-t ${isDark ? 'border-slate-800' : 'border-gray-200'} my-2`} />
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-500/10`}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-base">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main key="main-content">
        {children}
      </main>

      <footer className={`border-t ${isDark ? 'border-slate-800/50 bg-slate-900/50' : 'border-gray-200 bg-white/50'} backdrop-blur-lg mt-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  {t('nav.smartTrading')}
                </div>
                <div className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{t('footer.tagline')}</div>
              </div>
            </div>
            <p className={`text-center text-xs sm:text-sm px-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </footer>

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          trades={trades}
          user={user}
        />
      )}
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
