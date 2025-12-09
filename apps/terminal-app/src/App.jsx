import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/toaster"
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AIMarketAnalyzer from './pages/AIMarketAnalyzer'
import AIMarketAnalyzerV21 from './pages/AIMarketAnalyzerV21'
import TechnicalAnalysis from './pages/TechnicalAnalysis'
import AIAnalysis from './pages/AIAnalysis'
import RiskCalculator from './pages/RiskCalculator'
import TradingJournal from './pages/TradingJournal'
import CryptoGuide from './pages/CryptoGuide'
import Settings from './pages/Settings'
import MyAccount from './pages/MyAccount'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import QuickStartGuide from './pages/QuickStartGuide'
import Login from './pages/Login'
import Features from './pages/Features'
import MarketParametersGuide from './pages/MarketParametersGuide'
import { StarryBackground } from './components/layout/StarryBackground'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Layout>
                    <StarryBackground />
                    <div className="relative z-10">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/features" element={<Features />} />
                            <Route path="/aimarketanalyzer" element={<AIMarketAnalyzer />} />
                            <Route path="/aimarketanalyzerv21" element={<AIMarketAnalyzerV21 />} />
                            <Route path="/technicalanalysis" element={<TechnicalAnalysis />} />
                            <Route path="/aianalysis" element={<AIAnalysis />} />
                            <Route path="/riskcalculator" element={<RiskCalculator />} />
                            <Route path="/tradingjournal" element={<TradingJournal />} />
                            <Route path="/cryptoguide" element={<CryptoGuide />} />
                            <Route path="/parameters" element={<MarketParametersGuide />} />
                            <Route path="/marketparametersguide" element={<MarketParametersGuide />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/myaccount" element={<MyAccount />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/quickstartguide" element={<QuickStartGuide />} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </div>
                </Layout>
            </Router>
            <Toaster />
        </QueryClientProvider>
    )
}

export default App
