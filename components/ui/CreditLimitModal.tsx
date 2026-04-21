'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';

interface CreditLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditLimitModal({ isOpen, onClose }: CreditLimitModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/20 blur-[80px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-violet-500/10 rounded-3xl flex items-center justify-center mb-6 border border-violet-500/20">
                <AlertTriangle className="h-10 w-10 text-violet-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Limit Reached</h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                You’ve reached your trial limit. To continue analyzing, improving, and organizing your prompts, we’ll be introducing premium plans soon.
              </p>
              
              <div className="space-y-4 w-full">
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                  Understood
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <p className="text-xs text-slate-500">
                  Join the waitlist for <span className="text-violet-400 font-semibold">ZanZora Pro</span> to get unlimited credits.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
