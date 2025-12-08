import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send } from "lucide-react";
import { useState, useEffect } from "react";

export default function Contact() {
  const [theme, setTheme] = useState('dark');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', topic: '', message: '' });
    }, 3000);
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent('SmarTrading Support Request');
    const body = encodeURIComponent(`Hello SmarTrading Team,

I need help with:

---
Please describe your issue here
---

Best regards,
`);
    window.open(`mailto:support@smartrading.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      <div className={`relative overflow-hidden border-b ${isDark ? 'border-slate-800/50 bg-gradient-to-b from-slate-900/50' : 'border-gray-200 bg-gradient-to-b from-white/50'} to-transparent`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Contact Us
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`text-xl sm:text-2xl max-w-3xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-700'}`}
            >
              We are here to help with anything you need.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'} mb-8`}>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'} rounded-xl flex items-center justify-center`}>
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Send us a message
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    We'll get back to you as soon as possible
                  </p>
                </div>
              </div>

              {submitted ? (
                <div className={`p-6 rounded-xl ${isDark ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-300'} text-center`}>
                  <p className={`text-lg font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    ✓ Message sent successfully!
                  </p>
                  <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    We'll respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Name
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your name"
                      className={`h-12 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Email
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      className={`h-12 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Topic
                    </label>
                    <Select value={formData.topic} onValueChange={(value) => setFormData({...formData, topic: value})}>
                      <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="pricing">Pricing</SelectItem>
                        <SelectItem value="tools">Tools</SelectItem>
                        <SelectItem value="security">Security & Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Message
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="How can we help you?"
                      className={`min-h-32 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card 
            onClick={handleEmailClick}
            className={`${isDark ? 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30 hover:border-emerald-500/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 hover:border-emerald-400'} cursor-pointer transition-all duration-200 hover:scale-[1.02]`}
          >
            <CardContent className="p-6 text-center">
              <Mail className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Email Support
              </h3>
              <a 
                className="text-emerald-400 hover:text-emerald-300 font-semibold text-lg transition-colors"
              >
                support@smartrading.com
              </a>
              <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Click to open your email client
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}