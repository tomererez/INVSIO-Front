import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "relative font-medium transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group rounded-full select-none";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.4)] border border-white/10",
    secondary: "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-sm shadow-sm",
    outline: "bg-transparent border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-white/5",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Internal Shine Effect for Primary Buttons */}
      {variant === 'primary' && (
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
      )}
      
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};