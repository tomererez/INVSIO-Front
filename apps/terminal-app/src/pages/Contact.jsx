
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MessageSquare, Twitter, Send,
  MapPin, Globe, CheckCircle2, ArrowRight,
  Zap, Radio, ChevronDown
} from 'lucide-react';
import { GlassCard } from '../components/ui/glass-card';
import { Button } from '../components/ui/marketing-button';
import { PageHeader } from '../components/PageHeader';

// --- VISUAL HELPERS ---

const GlowingOrb = ({ color, className }) => (
  <div className={`absolute rounded-full blur-[100px] mix-blend-screen pointer-events-none opacity-10 ${className}`} style={{ background: color }} />
);

const ContactOption = ({ icon, title, desc, action, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="h-full"
    onClick={onClick}
  >
    <GlassCard className="p-6 h-full flex flex-col justify-between group cursor-pointer border-white/5 hover:border-indigo-500/30 transition-colors">
      <div>
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">{desc}</p>
      </div>
      <div className="flex items-center text-xs font-bold uppercase tracking-wider text-indigo-400 group-hover:text-indigo-300">
        {action} <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </GlassCard>
  </motion.div>
);

const InputField = ({ label, type = "text", placeholder, rows, value, onChange }) => (
  <div className="space-y-1.5 group">
    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors">{label}</label>
    {rows ? (
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
      />
    )}
  </div>
);

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', topic: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      // Reset form after a while if desired, but here we show "Message Received" state
    }, 2000);
  };

  // Preserved logic from original Terminal App Contact.jsx
  const handleEmailClick = () => {
    const subject = encodeURIComponent('INVSIO Support Request');
    const body = encodeURIComponent(`Hello INVSIO Team,

I need help with:

---
Please describe your issue here
---

Best regards,
`);
    window.open(`mailto:support@invsio.ai?subject=${subject}&body=${body}`, '_blank');
  };

  const handleTwitterClick = () => {
    window.open("https://twitter.com/invsio", "_blank");
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden pt-32 pb-20">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Original Top-Left Orb */}
        <GlowingOrb color="#6366f1" className="top-[-100px] left-[20%] w-[600px] h-[600px]" />

        {/* Strong Pink Nebula Center-Left */}
        <GlowingOrb color="#ec4899" className="top-1/2 left-[-150px] -translate-y-1/2 w-[900px] h-[900px] opacity-15" />

        {/* Original Bottom-Right Orb */}
        <GlowingOrb color="#ec4899" className="bottom-[10%] right-[10%] w-[500px] h-[500px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HERO SECTION */}
        <div className="mb-20">
          <PageHeader
            title="Establish"
            highlightText="Connection."
            subtitle={<span>Questions about the terminal? Enterprise inquiries? <br className="hidden md:block" />Our team is ready to deploy assistance.</span>}
            variant="indigo"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md h-fit mt-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Systems Online
            </motion.div>
          </PageHeader>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">

          {/* LEFT: INFO CARDS */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <ContactOption
                icon={<MessageSquare className="w-6 h-6" />}
                title="Live Support"
                desc="Technical issues or account help? Our engineers respond in <50ms (usually)."
                action="Open Chat"
                delay={0.2}
              />
              <ContactOption
                icon={<Mail className="w-6 h-6" />}
                title="Email Us"
                desc="For partnerships, press, or detailed inquiries that require deep analysis."
                action="Send Email"
                delay={0.3}
                onClick={handleEmailClick}
              />
              <ContactOption
                icon={<Twitter className="w-6 h-6" />}
                title="Twitter / X"
                desc="Follow the flow. Get real-time updates and join the public discourse."
                action="Follow @INVSIO"
                delay={0.4}
                onClick={handleTwitterClick}
              />
              <ContactOption
                icon={<Globe className="w-6 h-6" />}
                title="HQ / Base"
                desc="Global distributed team. Digital-first, but grounded in reality."
                action="View Regions"
                delay={0.5}
              />
            </div>

            {/* Status Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-900/5 flex items-center justify-between backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-white font-medium">Support Status</div>
                  <div className="text-xs text-emerald-400 font-mono mt-0.5">OPERATIONAL // LOW LATENCY</div>
                </div>
              </div>
              <div className="text-2xl font-light text-white">100%</div>
            </motion.div>
          </div>

          {/* RIGHT: THE FORM */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-full"
          >
            <GlassCard className="p-8 md:p-10 relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Zap className="w-24 h-24 text-indigo-500 -rotate-12" />
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl font-light text-white mb-2">Get in Touch</h2>
                <p className="text-sm text-slate-400 mb-8">Fill out the form below. We'll get back to you shortly.</p>

                <AnimatePresence mode="wait">
                  {isSent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                      </div>
                      <h3 className="text-2xl text-white font-medium mb-2">Message Received</h3>
                      <p className="text-slate-400 max-w-xs mx-auto">
                        Our team has logged your message. Expect a response shortly.
                      </p>
                      <Button variant="secondary" className="mt-8" onClick={() => { setIsSent(false); setFormState({ name: '', email: '', topic: '', message: '' }) }}>
                        Send Another
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField
                          label="Full Name"
                          placeholder="John Doe"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        />
                        <InputField
                          label="Email Address"
                          type="email"
                          placeholder="john@example.com"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5 group">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors">Topic</label>
                        <div className="relative">
                          <select
                            value={formState.topic}
                            onChange={(e) => setFormState({ ...formState, topic: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-slate-900 text-slate-500">Select a topic...</option>
                            <option value="pricing" className="bg-slate-900">Pricing & Plans</option>
                            <option value="features" className="bg-slate-900">Platform Features</option>
                            <option value="security" className="bg-slate-900">Security & Data</option>
                            <option value="other" className="bg-slate-900">Other</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>

                      <InputField
                        label="Message"
                        rows={5}
                        placeholder="How can we help you?"
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      />

                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full relative overflow-hidden"
                        disabled={isSubmitting}
                      >
                        <span className={`flex items-center gap-2 transition-opacity ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                          Send <Send className="w-4 h-4" />
                        </span>

                        {isSubmitting && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </div>
  );
}