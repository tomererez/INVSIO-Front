import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Rocket, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const TERMINAL_URL = "http://localhost:5181";

export default function FAQ() {
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

    const faqCategories = [
        {
            title: "Getting Started",
            faqs: [
                { question: "What is INVSIO?", answer: "INVSIO is a professional trading intelligence platform designed for crypto futures traders. We provide institutional-grade analysis tools including CVD, Open Interest, and Funding Rate analysis." },
                { question: "How do I get started?", answer: "Click 'Launch Terminal' to access the platform. You can start with our free tier to explore the basic features, then upgrade as needed." },
                { question: "Is there a free trial?", answer: "Yes! Our free tier gives you access to basic features forever. You can upgrade anytime to unlock advanced features." }
            ]
        },
        {
            title: "Features & Tools",
            faqs: [
                { question: "What analysis tools are available?", answer: "We offer AI Market Analyzer, Technical Analysis, Risk Calculator, Trading Journal, and comprehensive educational resources on smart money concepts." },
                { question: "What is CVD, OI, and Funding Rate?", answer: "CVD (Cumulative Volume Delta) shows buying vs selling pressure. OI (Open Interest) shows total open positions. Funding Rate shows the cost of holding leveraged positions. Together they reveal smart money positioning." },
                { question: "Can I track my trades?", answer: "Yes! Our Trading Journal allows you to log every trade with detailed analytics including win rates, profit factors, and performance patterns." }
            ]
        },
        {
            title: "Pricing & Billing",
            faqs: [
                { question: "What payment methods do you accept?", answer: "We accept all major credit cards through Stripe and PayPal for maximum flexibility." },
                { question: "Can I cancel anytime?", answer: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period." },
                { question: "How do I upgrade or downgrade?", answer: "You can change your plan at any time from your account settings. Changes take effect immediately." }
            ]
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
                            <HelpCircle className="w-12 h-12 text-white" />
                        </div>
                        <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Frequently Asked Questions
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                            Find answers to common questions about INVSIO
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                {faqCategories.map((category, catIndex) => (
                    <motion.div
                        key={catIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * catIndex }}
                        className="mb-12"
                    >
                        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{category.title}</h2>
                        <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'}`}>
                            <CardContent className="p-6">
                                <Accordion type="single" collapsible className="w-full">
                                    {category.faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${catIndex}-${index}`} className={`${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                                            <AccordionTrigger className={`text-left ${isDark ? 'text-white hover:text-emerald-400' : 'text-gray-900 hover:text-emerald-600'}`}>
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                {/* CTA */}
                <Card className={`${isDark ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'} mt-12`}>
                    <CardContent className="p-8 text-center">
                        <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Still have questions?</h3>
                        <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Launch the Terminal and explore our features firsthand.</p>
                        <a href={TERMINAL_URL} target="_blank" rel="noopener noreferrer">
                            <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg flex items-center gap-2 mx-auto">
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
