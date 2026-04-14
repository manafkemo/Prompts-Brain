'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Image from 'next/image';


const values = [
  'Save hours of manual prompt tweaking',
  'Get crystal clear instructions every time',
  'Unified library for all your AI personas',
  'Real-time scoring based on LLM best practices'
];

export function WhyZanZora() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    let effect: any = null;
    const initVanta = async () => {
      if (!vantaEffect && vantaRef.current) {
        try {
          // @ts-ignore
          const vantaModule = await import('vanta/dist/vanta.net.min');
          const VantaNet = vantaModule.default || vantaModule;
          effect = VantaNet({
            el: vantaRef.current,
            THREE: THREE,
            color: 0x8b5cf6, // Violet 500
            backgroundColor: 0x000000, 
            points: 12.00,
            maxDistance: 22.00,
            spacing: 18.00,
            showDots: true
          });
          setVantaEffect(effect);
        } catch (err) {
          console.error("Vanta initialization failed", err);
        }
      }
    };
    initVanta();
    
    return () => {
      if (effect) effect.destroy();
    };
  }, [vantaEffect]);


  return (
    <section ref={vantaRef} className="py-24 relative overflow-hidden min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-black/50 z-0 backdrop-blur-[2px]" />
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 drop-shadow-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300 drop-shadow-md">ZanZora</span>?
            </h2>
            <p className="text-slate-300/90 text-lg md:text-xl mb-10 leading-relaxed max-w-lg font-light">
              ZanZora isn't just a bookmarking tool. It's a specialized workspace designed to elevate your AI interactions to a professional level.
            </p>
            
            <div className="space-y-4 md:space-y-5">
              {values.map((value, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 bg-slate-900/40 border border-violet-500/10 hover:bg-violet-900/20 hover:border-violet-500/30 transition-all duration-300 p-4 rounded-2xl md:w-fit pr-6 md:pr-10 backdrop-blur-md shadow-xl"
                >
                  <div className="bg-violet-500/20 p-2 rounded-full shadow-inner shadow-violet-500/50">
                    <CheckCircle2 className="h-6 w-6 text-violet-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                  </div>
                  <span className="text-slate-100 font-medium md:text-[1.05rem] tracking-wide">{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 w-full flex justify-end"
          >
            <div className="relative group w-full max-w-lg mx-auto lg:mx-0 xl:max-w-xl">
              {/* Glow Effect Behind Image */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative rounded-3xl overflow-hidden border border-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.2)] bg-slate-900 ring-1 ring-white/10">
                <Image
                  src="/zanzora-features.png"
                  alt="ZanZora App Features UI"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* Subtle Inner Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
