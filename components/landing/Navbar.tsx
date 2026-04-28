'use client';

import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel max-w-5xl w-full h-16 rounded-full flex items-center justify-between px-8 border-violet-500/20"
      >
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-violet-400" />
          <span className="font-bold text-xl text-white tracking-tighter">
            Zan<span className="text-violet-400">Zora</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            href="/login" 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/login" 
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-violet-500/20 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </motion.div>
    </nav>
  );
}
