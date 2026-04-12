'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const values = [
  'Save hours of manual prompt tweaking',
  'Get crystal clear instructions every time',
  'Unified library for all your AI personas',
  'Real-time scoring based on LLM best practices'
];

export function WhyZanZora() {
  return (
    <section className="py-24 bg-gradient-to-b from-transparent to-violet-900/10">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Why Choose ZanZora?
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              ZanZora isn't just a bookmarking tool. It's a specialized workspace designed to elevate your AI interactions to a professional level.
            </p>
            
            <div className="space-y-4">
              {values.map((value, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-violet-500" />
                  <span className="text-slate-300 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <div className="glass-panel p-8 rounded-[2rem] border-violet-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-3 rounded-full bg-slate-800" />
                  <div className="w-8 h-3 rounded-full bg-slate-800/50" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-slate-800/40 rounded-full" />
                  <div className="h-4 w-3/4 bg-slate-800/40 rounded-full" />
                  <div className="h-4 w-5/6 bg-slate-800/40 rounded-full" />
                  <div className="h-4 w-1/2 bg-violet-500/30 rounded-full animate-pulse" />
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="h-10 w-32 bg-violet-600/40 rounded-xl" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
