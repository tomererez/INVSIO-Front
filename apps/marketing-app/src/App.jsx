import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Pricing from './pages/Pricing'
import Features from './pages/Features'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import { StarryBackground } from './components/layout/StarryBackground'

function App() {
    return (
        <Router>
            <Layout>
                <StarryBackground />
                <div className="relative z-10">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </div>
            </Layout>
        </Router>
    )
}

export default App
