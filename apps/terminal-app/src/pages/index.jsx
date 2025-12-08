import Layout from "./Layout.jsx";

import CryptoAnalyzer from "./CryptoAnalyzer";

import Home from "./Home";

import TradingJournal from "./TradingJournal";

import RiskCalculator from "./RiskCalculator";

import Dashboard from "./Dashboard";

import Settings from "./Settings";

import Features from "./Features";

import Pricing from "./Pricing";

import MyAccount from "./MyAccount";

import About from "./About";

import FAQ from "./FAQ";

import Contact from "./Contact";

import QuickStartGuide from "./QuickStartGuide";

import CryptoGuide from "./CryptoGuide";

import TechnicalAnalysis from "./TechnicalAnalysis";

import AIAnalysis from "./AIAnalysis";

import AIMarketAnalyzer from "./AIMarketAnalyzer";

import AIMarketAnalyzerV21 from "./AIMarketAnalyzerV21";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    CryptoAnalyzer: CryptoAnalyzer,
    
    Home: Home,
    
    TradingJournal: TradingJournal,
    
    RiskCalculator: RiskCalculator,
    
    Dashboard: Dashboard,
    
    Settings: Settings,
    
    Features: Features,
    
    Pricing: Pricing,
    
    MyAccount: MyAccount,
    
    About: About,
    
    FAQ: FAQ,
    
    Contact: Contact,
    
    QuickStartGuide: QuickStartGuide,
    
    CryptoGuide: CryptoGuide,
    
    TechnicalAnalysis: TechnicalAnalysis,
    
    AIAnalysis: AIAnalysis,
    
    AIMarketAnalyzer: AIMarketAnalyzer,
    
    AIMarketAnalyzerV21: AIMarketAnalyzerV21,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<CryptoAnalyzer />} />
                
                
                <Route path="/CryptoAnalyzer" element={<CryptoAnalyzer />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/TradingJournal" element={<TradingJournal />} />
                
                <Route path="/RiskCalculator" element={<RiskCalculator />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Features" element={<Features />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/MyAccount" element={<MyAccount />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/FAQ" element={<FAQ />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/QuickStartGuide" element={<QuickStartGuide />} />
                
                <Route path="/CryptoGuide" element={<CryptoGuide />} />
                
                <Route path="/TechnicalAnalysis" element={<TechnicalAnalysis />} />
                
                <Route path="/AIAnalysis" element={<AIAnalysis />} />
                
                <Route path="/AIMarketAnalyzer" element={<AIMarketAnalyzer />} />
                
                <Route path="/AIMarketAnalyzerV21" element={<AIMarketAnalyzerV21 />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}