import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Clock, Rocket, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const TERMINAL_URL = "http://localhost:5181";

export default function Contact() {
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

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Support",
            description: "Get help with technical issues or account questions",
            detail: "support@invsio.com",
            color: "from-blue-500 to-cyan-600"
        },
        {
            icon: MessageSquare,
            title: "Live Chat",
            description: "Chat with our support team in real-time",
            detail: "Available in Terminal",
            color: "from-emerald-500 to-teal-600"
        },
        {
            icon: Clock,
            title: "Response Time",
            description: "We typically respond within 24 hours",
            detail: "Priority for Pro & Elite",
            color: "from-purple-500 to-pink-600"
        }
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
                            <Mail className="w-12 h-12 text-white" />
                        </div>
                        <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Contact & Support
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                            We're here to help you succeed in your trading journey
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Contact Methods */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {contactMethods.map((method, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                        >
                            <Card className={`h-full ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'}`}>
                                <CardContent className="p-8 text-center">
                                    <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto`}>
                                        <method.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{method.title}</h3>
                                    <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{method.description}</p>
                                    <p className={`text-base font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{method.detail}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <Card className={`${isDark ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'}`}>
                    <CardContent className="p-12 text-center">
                        <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Ready to Get Started?</h3>
                        <p className={`mb-8 max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            Launch the Terminal to access all features and get support directly from the platform.
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
