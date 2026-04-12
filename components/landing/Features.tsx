'use client';

import { motion } from 'framer-motion';
import { Search, Sparkles, Palette, Camera } from 'lucide-react';

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: 'AI Prompt Analysis',
    description: 'Get deep insights into your prompts with automated scoring and structure analysis.'
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Prompt Improver',
    description: 'Transform basic instructions into professional-grade prompts with one click using Gemini AI.'
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: 'Smart Style Generator',
    description: 'Apply consistent artistic or professional styles to your prompts automatically.'
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: 'OCR from Images',
    description: 'Extract prompts from screenshots or photos instantly using high-precision OCR.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-950/50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Advanced AI Features
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Everything you need to master prompt engineering and build a high-quality AI prompt library.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-8 rounded-3xl hover:border-violet-500/40 transition-colors group"
            >
              <div className="h-12 w-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
