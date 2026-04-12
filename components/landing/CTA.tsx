'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-12 md:p-20 rounded-[3rem] border-violet-500/30 text-center relative overflow-hidden"
        >
          {/* Decorative gradients */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-violet-600/20 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-fuchsia-600/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
              Ready to Upgrade Your <br />
              <span className="text-violet-400">AI Intelligence?</span>
            </h2>
            <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
              Join hundreds of prompt engineers building the future of AI instructions. 
              Start your library today.
            </p>
            
            <Link 
              href="/login" 
              className="group bg-white text-slate-950 px-10 py-5 rounded-2xl text-xl font-bold transition-all hover:bg-violet-50 flex items-center gap-3 w-fit mx-auto active:scale-95 shadow-2xl shadow-white/10"
            >
              Start Building Now
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
