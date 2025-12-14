import React from 'react';
import { motion } from 'framer-motion';

const glowVariants = {
    indigo: {
        primary: "bg-indigo-500/10",
        secondary: "bg-cyan-500/5",
        gradient: "from-indigo-400 to-cyan-400"
    },
    cyan: {
        primary: "bg-cyan-500/10",
        secondary: "bg-blue-500/5",
        gradient: "from-cyan-400 to-blue-400"
    },
    emerald: {
        primary: "bg-emerald-500/10",
        secondary: "bg-teal-500/5",
        gradient: "from-emerald-400 to-teal-400"
    },
    amber: {
        primary: "bg-amber-500/10",
        secondary: "bg-orange-500/5",
        gradient: "from-amber-400 to-orange-400"
    },
    purple: {
        primary: "bg-purple-500/10",
        secondary: "bg-fuchsia-500/5",
        gradient: "from-purple-400 to-fuchsia-400"
    },
    rose: {
        primary: "bg-rose-500/10",
        secondary: "bg-red-500/5",
        gradient: "from-rose-400 to-red-400"
    },
    slate: {
        primary: "bg-slate-500/10",
        secondary: "bg-gray-500/5",
        gradient: "from-slate-300 to-gray-400"
    }
};

export function PageHeader({
    title,
    highlightText,
    subtitle,
    variant = "indigo",
    children,
    className = ""
}) {
    const colors = glowVariants[variant] || glowVariants.indigo;

    return (
        <div className={`relative flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 ${className}`}>
            {/* Gentle Nebula Glow */}
            <div className={`absolute -top-20 -left-20 w-[300px] h-[200px] rounded-full blur-[100px] pointer-events-none ${colors.primary}`} />
            <div className={`absolute -top-10 -left-10 w-[200px] h-[150px] rounded-full blur-[80px] pointer-events-none ${colors.secondary}`} />

            <div className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white">
                        {title} {highlightText && (
                            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${colors.gradient} font-normal`}>
                                {highlightText}
                            </span>
                        )}
                    </h1>
                </motion.div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-base text-slate-400 ml-1">
                    {subtitle && <span>{subtitle}</span>}
                </div>
            </div>

            {/* Action Buttons */}
            {children && (
                <div className="relative z-10 flex flex-wrap gap-3">
                    {children}
                </div>
            )}
        </div>
    );
}
