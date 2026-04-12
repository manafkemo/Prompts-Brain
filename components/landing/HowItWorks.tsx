'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Input Your Prompt',
    description: 'Paste your existing prompt or upload a screenshot to extract text via OCR.'
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'Our system analyzes clarity, context, and structure using state-of-the-art AI.'
  },
  {
    number: '03',
    title: 'Enhance & Style',
    description: 'Use the Improver or Style Generator to transform your prompt into a masterpiece.'
  },
  {
    number: '04',
    title: 'Save & Deploy',
    description: 'Organize your best prompts in your private library and use them whenever needed.'
  }
];

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-lg">
            A simple 4-step process to master your AI workflow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="text-6xl font-black text-violet-500/10 mb-4 absolute -top-8 -left-4 select-none">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{step.title}</h3>
              <p className="text-slate-400 relative z-10">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-[20%] -right-8 w-16 h-[2px] bg-gradient-to-r from-violet-500/20 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
