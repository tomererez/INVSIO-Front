import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, Brain } from 'lucide-react';
import { GlassCard } from '../components/ui/glass-card';
import { Button } from '../components/ui/button';

const APP_NAME = 'INVSIO';

const GoogleIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export const LoginTest = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    const [mode, setMode] = useState('login');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const isLogin = mode === 'login';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!isLogin && !agreedToTerms) {
            setError('Please agree to the Terms of Use and Privacy Policy');
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            console.log(isLogin ? 'Login submitted' : 'Register submitted');
        }, 1500);
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
    };

    const toggleMode = () => {
        setMode(isLogin ? 'register' : 'login');
        setError(null);
        setAgreedToTerms(false);
    };

    return (
        <div className="min-h-screen h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Logo - Positioned at top with proper spacing from navbar */}
            <div className="flex items-center justify-center gap-2.5 mb-5 mt-20">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                    <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">{APP_NAME}</span>
            </div>

            {/* Container for nebula + glass card */}
            <div className="relative w-full max-w-[420px] flex-shrink-0">
                {/* Heavenly Breathing Nebula - Top-left corner of login box */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.25, 0.4, 0.25],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -top-20 -left-32 w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-cyan-500/30 rounded-full blur-[80px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1.05, 0.95, 1.05],
                            opacity: [0.2, 0.35, 0.2],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                        className="absolute -top-10 -left-20 w-[350px] h-[350px] bg-gradient-to-tr from-cyan-400/25 via-blue-500/15 to-purple-400/25 rounded-full blur-[60px]"
                    />
                    <motion.div
                        animate={{
                            scale: [0.95, 1.1, 0.95],
                            opacity: [0.15, 0.3, 0.15],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2,
                        }}
                        className="absolute top-0 -left-10 w-[300px] h-[300px] bg-gradient-to-bl from-purple-500/20 to-pink-400/15 rounded-full blur-[70px]"
                    />
                </div>

                {/* Glass Box */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                    <GlassCard className="p-7 border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-black/40">
                        {/* Header */}
                        <div className="text-center mb-5">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mode}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h1 className="text-xl font-light text-white mb-1">
                                        {isLogin ? (
                                            <>Welcome <span className="font-semibold text-cyan-400">Back.</span></>
                                        ) : (
                                            <>Good to have you <span className="font-semibold text-cyan-400">here.</span></>
                                        )}
                                    </h1>
                                    <p className="text-slate-400 text-sm mt-1.5">
                                        {isLogin
                                            ? 'Enter your credentials to access the feed.'
                                            : `Join ${APP_NAME} and enjoy 14 days of PRO, on us.`}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Social Auth */}
                        <button
                            type="button"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all mb-4"
                        >
                            <GoogleIcon />
                            <span className="text-sm text-slate-200 font-medium">Google</span>
                        </button>

                        {/* Divider */}
                        <div className="relative py-2 mb-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-slate-900/80 px-4 text-slate-500">or</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                            {/* Email */}
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 outline-none transition-all"
                                placeholder="Email address"
                                required
                            />

                            {/* Password */}
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder:text-slate-400 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 outline-none transition-all"
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Forgot Password */}
                            {isLogin && (
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            {/* Terms Checkbox */}
                            <AnimatePresence>
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <label className="flex items-start gap-3 cursor-pointer group py-1">
                                            <div className="relative mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    checked={agreedToTerms}
                                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${agreedToTerms
                                                    ? 'bg-cyan-500'
                                                    : 'border-2 border-slate-500 group-hover:border-slate-400'
                                                    }`}>
                                                    {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-300 leading-relaxed">
                                                I have read and agreed with the{' '}
                                                <a href="#" className="text-cyan-400 hover:underline">Terms of Use</a>{' '}
                                                and <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>.
                                            </span>
                                        </label>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error */}
                            {error && <p className="text-xs text-red-400 text-center">{error}</p>}

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{isLogin ? 'Signing in…' : 'Creating account…'}</span>
                                    </>
                                ) : (
                                    <span>Continue</span>
                                )}
                            </Button>
                        </form>

                        {/* Mode Toggle */}
                        <div className="text-center mt-5 pt-4 border-t border-white/10">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={mode}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm text-slate-400"
                                >
                                    {isLogin ? (
                                        <>
                                            Don&apos;t have an account?{' '}
                                            <button onClick={toggleMode} type="button" className="text-cyan-400 hover:text-cyan-300 font-medium">
                                                Sign up
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Already have an account?{' '}
                                            <button onClick={toggleMode} type="button" className="text-cyan-400 hover:text-cyan-300 font-medium">
                                                Log In
                                            </button>
                                        </>
                                    )}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Bottom spacer */}
            <div className="flex-grow max-h-16" />
        </div>
    );
};

export default LoginTest;
