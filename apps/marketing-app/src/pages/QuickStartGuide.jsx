import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Rocket, ArrowRight, Brain, Calculator, Activity, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

const TERMINAL_URL = "http://localhost:5181";

export default function QuickStartGuide() {
    const [theme, setTheme] = useState('dark');

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

    const steps = [
        {
            number: 1,
            title: "Launch the Terminal",
            description: "Click the 'Launch Terminal' button to access the trading platform. Create an account or sign in.",
            icon: Rocket
        },
        {
            number: 2,
            title: "Explore AI Market Analyzer",
            description: "Start with the AI Market Analyzer to get an overview of current market conditions, CVD, and smart money positioning.",
            icon: Brain
        },
        {
            number: 3,
            title: "Set Up Risk Calculator",
            description: "Configure the Risk Calculator with your account size and risk tolerance. Never risk more than 1-2% per trade.",
            icon: Calculator
        },
        {
            number: 4,
            title: "Start Your Trading Journal",
            description: "Log every trade in your Trading Journal. Track entries, exits, and lessons learned for continuous improvement.",
            icon: Activity
        },
        {
            number: 5,
            title: "Review & Improve",
            description: "Use the Dashboard to analyze your performance patterns. Review win rates, profit factors, and identify areas for growth.",
            icon: BarChart3
        }
    ];

    const tips = [
        "Always use stop losses - never trade without defined risk",
        "Start with the free tier to learn the platform",
        "Read the Market Parameters Guide to understand CVD, OI, and Funding",
        "Review your trades weekly to identify patterns",
        "Use the AI Trade Coach for personalized feedback"
    ];

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
            {/* Hero Section */}
            <div className={`relative overflow-hidden border-b ${isDark ? 'border-slate-800/50' : 'border-gray-200'}`}>
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl mb-8 shadow-2xl shadow-emerald-500/50">
                            <BookOpen className="w-12 h-12 text-white" />
                        </div>
                        <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Quick Start Guide
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                            Get up and running with INVSIO in just a few minutes
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Steps */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                <div className="space-y-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                        >
                            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'}`}>
                                <CardContent className="p-8">
                                    <div className="flex items-start gap-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                <step.icon className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    Step {step.number}
                                                </span>
                                            </div>
                                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                                            <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{step.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Pro Tips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-16"
                >
                    <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pro Tips</h2>
                    <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'}`}>
                        <CardContent className="p-8">
                            <ul className="space-y-4">
                                {tips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className={`${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* CTA */}
                <Card className={`${isDark ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'} mt-16`}>
                    <CardContent className="p-12 text-center">
                        <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Ready to Start Trading?</h3>
                        <p className={`mb-8 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            Launch the Terminal and put these steps into action.
                        </p>
                        <a href={TERMINAL_URL} target="_blank" rel="noopener noreferrer">
                            <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg flex items-center gap-2 mx-auto">
                                <Rocket className="w-5 h-5" />
                                Launch Terminal
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
