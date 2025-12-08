
import React, { useEffect, useState } from 'react';
import { Hero } from './components/sections/Hero';
import { BentoGrid } from './components/sections/BentoGrid';
import { Testimonials } from './components/sections/Testimonials';
import { Dashboard } from './components/dashboard/Dashboard';
import { TradingJournal } from './components/journal/TradingJournal';
import { About } from './components/pages/About';
import { Pricing } from './components/pages/Pricing';
import { MarketAnalyzer } from './components/pages/MarketAnalyzer';
import { Contact } from './components/pages/Contact';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';
import { FAQ } from './components/pages/FAQ';
import { PositionCalculator } from './components/pages/PositionCalculator';
import { StarryBackground } from './components/layout/StarryBackground';
import { api } from './lib/api';
import { UserProfile } from './types';
import { 
  BookOpen, LayoutDashboard, DollarSign, Info, 
  HelpCircle, Sun, User as UserIcon, LogOut,
  Radar, Mail, Calculator
} from 'lucide-react';

// Default user for immediate access
const INITIAL_USER: UserProfile = {
  name: 'Tomer',
  plan: 'pro',
  avatar: 'https://i.pravatar.cc/150?u=tomer'
};

const App: React.FC = () => {
  // Global Cursor Torch Effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Routing State
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'journal' | 'calculator' | 'about' | 'pricing' | 'analyzer' | 'contact' | 'login' | 'register' | 'faq'>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = async () => {
    // This is now triggered by the Login Page form
    setIsLoggingIn(true);
    try {
      // Simulate login call
      const userData = await api.auth.login();
      setUser(userData);
      setCurrentView('dashboard');
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  return (
    <div className="relative min-h-screen bg-transparent text-slate-50 font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* 1. Global Space Background */}
      <StarryBackground />

      {/* 2. Global Noise Texture Overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-noise mix-blend-overlay opacity-30" />

      {/* 3. Cursor Torch Effect (Desktop Only) */}
      <div 
        className="fixed inset-0 z-[2] pointer-events-none hidden md:block transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent 40%)`
        }}
      />

      {/* 4. Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 h-16 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-void/80 transition-all duration-300">
        
        {/* Left: Logo */}
        <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setCurrentView('landing')}
        >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-indigo-500/50 transition-shadow">
                S
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-none tracking-tight">MarketFlow</span>
                <span className="text-[9px] text-slate-400 leading-none">Trade Like Smart Money</span>
            </div>
        </div>
        
        {/* Center: Navigation Links & Actions */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            
            <button 
                onClick={() => setCurrentView('pricing')}
                className={`flex items-center gap-1.5 hover:text-white transition-colors ${currentView === 'pricing' ? 'text-white' : ''}`}
            >
                <DollarSign className="w-3.5 h-3.5" /> Pricing
            </button>
            
            <button 
                onClick={() => setCurrentView('about')}
                className={`flex items-center gap-1.5 hover:text-white transition-colors ${currentView === 'about' ? 'text-white' : ''}`}
            >
                <Info className="w-3.5 h-3.5" /> About
            </button>

            {/* Dashboard Button (Prominent) */}
            <button 
                onClick={() => user ? setCurrentView('dashboard') : setCurrentView('login')}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                    ${currentView === 'dashboard' || currentView === 'journal' || currentView === 'analyzer' || currentView === 'calculator'
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'}
                `}
            >
                <LayoutDashboard className="w-3.5 h-3.5" /> 
                {currentView === 'landing' || currentView === 'pricing' || currentView === 'about' || currentView === 'contact' || currentView === 'login' || currentView === 'register' || currentView === 'faq' ? 'Launch App' : 'Dashboard'}
            </button>
            
            {user && (
                <>
                    <button 
                        onClick={() => setCurrentView('journal')}
                        className={`flex items-center gap-1.5 hover:text-white transition-colors ${currentView === 'journal' ? 'text-white' : ''}`}
                    >
                        <BookOpen className="w-3.5 h-3.5" /> Journal
                    </button>
                    
                    <button 
                        onClick={() => setCurrentView('calculator')}
                        className={`flex items-center gap-1.5 hover:text-white transition-colors ${currentView === 'calculator' ? 'text-white' : ''}`}
                    >
                        <Calculator className="w-3.5 h-3.5" /> Calculator
                    </button>

                    <button 
                        onClick={() => setCurrentView('analyzer')}
                        className={`flex items-center gap-1.5 hover:text-white transition-colors ${currentView === 'analyzer' ? 'text-white' : ''}`}
                    >
                        <Radar className="w-3.5 h-3.5" /> AI Analyzer
                    </button>
                </>
            )}

            <div className="h-4 w-px bg-white/10 mx-1" />

            <button 
                onClick={() => setCurrentView('contact')}
                className={`flex items-center gap-1.5 hover:text-white transition-colors ${currentView === 'contact' ? 'text-white' : ''}`}
            >
                <Mail className="w-3.5 h-3.5" /> Contact
            </button>

            <button 
                onClick={() => setCurrentView('faq')}
                className={`flex items-center gap-1.5 hover:text-white transition-colors ${currentView === 'faq' ? 'text-white' : ''}`}
            >
                <HelpCircle className="w-3.5 h-3.5" /> Help Center
            </button>

        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors">
                <Sun className="w-4 h-4" />
            </button>

            {user ? (
                <div className="flex items-center gap-3">
                    <div className="relative group cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-300 font-bold text-xs hover:border-indigo-400 transition-colors">
                            {user.name.charAt(0)}
                        </div>
                        {/* Dropdown Sim */}
                        <div className="absolute top-full right-0 mt-2 w-32 py-2 bg-card border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                             <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-white/5 flex items-center gap-2">
                                <LogOut className="w-3 h-3" /> Log Out
                             </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setCurrentView('login')}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-400"
                >
                    <UserIcon className="w-4 h-4" />
                </button>
            )}
        </div>

        {/* Mobile Menu Button (Hamburger) - Simplified for this demo */}
        <div className="md:hidden flex items-center">
             <button className="text-white p-2" onClick={() => user ? setCurrentView('dashboard') : setCurrentView('login')}>
                <LayoutDashboard />
             </button>
        </div>

      </nav>

      {/* 5. Main Content Switch */}
      <main className="relative z-10">
        {currentView === 'landing' && (
            <>
                <Hero />
                <Testimonials />
                <BentoGrid />
            </>
        )}
        {currentView === 'dashboard' && user && <Dashboard user={user} />}
        {currentView === 'journal' && <TradingJournal />}
        {currentView === 'calculator' && <PositionCalculator />}
        {currentView === 'about' && <About />}
        {currentView === 'pricing' && <Pricing />}
        {currentView === 'analyzer' && <MarketAnalyzer />}
        {currentView === 'contact' && <Contact />}
        {currentView === 'faq' && <FAQ />}
        {currentView === 'login' && <Login onLogin={handleLogin} onNavigateToRegister={() => setCurrentView('register')} />}
        {currentView === 'register' && <Register onLogin={handleLogin} onNavigateToLogin={() => setCurrentView('login')} />}
      </main>

      {/* 6. Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-slate-600 text-sm relative z-10 bg-void/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2025 MarketFlow Intelligence. All rights reserved.</p>
            <div className="flex gap-6">
                <a href="#" className="hover:text-slate-400">Privacy</a>
                <a href="#" className="hover:text-slate-400">Terms</a>
                <a href="#" className="hover:text-slate-400">Twitter</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
