'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BrainCircuit, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function AIToolsShowcase() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              Meet Your New AI Matchmaker
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Perfect AI Tool</span> for Any Task.
            </h2>
            
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Stop guessing which AI model to use. Our curated AI directory and intelligent matchmaking system instantly connects you with the exact tools you need based on your prompts, goals, and workflow.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { icon: BrainCircuit, text: "Context-Aware Tool Recommendations" },
                { icon: ShieldCheck, text: "Curated & Verified AI Directory" },
                { icon: Sparkles, text: "Create Your Custom Favorites Stack" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <span className="text-slate-200 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="pt-8">
              <Link href="/tools" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors shadow-xl shadow-white/10 group">
                Explore AI Tools
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Image/Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full"
          >
            <div className="relative group">
              {/* Glow Behind Image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[2.5rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              
              <div className="relative glass-panel rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50">
                {/* Safari-style window controls */}
                <div className="h-10 border-b border-white/5 bg-slate-900/80 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                </div>
                
                <img 
                  src="/ai-tools-showcase.png" 
                  alt="ZanZora AI Tools Dashboard Mockup" 
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>

              {/* Floating Element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 glass-panel p-4 rounded-2xl border-violet-500/30 flex items-center gap-4 bg-slate-900/90 shadow-2xl backdrop-blur-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI MATCH</div>
                  <div className="text-sm font-semibold text-white">Found 3 Perfect Tools</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
