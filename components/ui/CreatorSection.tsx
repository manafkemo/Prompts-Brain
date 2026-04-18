'use client';

import { motion } from 'framer-motion';

export function CreatorSection() {
  return (
    <div className="flex items-center justify-center flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 text-slate-400 text-[0.95rem] font-medium p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm shadow-xl hover:bg-white/[0.04] transition-colors duration-300">
      <span className="whitespace-nowrap tracking-wide">Crafted with passion by</span>
      <motion.a 
        href="https://instagram.com/manafkemo" 
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:border-violet-400 transition-all duration-50 cursor-pointer mx-1 shrink-0 bg-slate-800 ring-2 ring-transparent hover:ring-violet-500/30 ring-offset-2 ring-offset-slate-950"
      >
        <img 
          src="/manafkemo.jpg" 
          alt="Manaf Kemo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails
            e.currentTarget.src = "https://ui-avatars.com/api/?name=Manaf+Kemo&background=8b5cf6&color=fff";
          }}
        />
      </motion.a>
      <span className="whitespace-nowrap tracking-wide">
        Manaf Kemo. Feel free to connect on <a href="https://instagram.com/manafkemo" target="_blank" className="text-violet-400 hover:text-violet-300 transition-colors font-bold underline decoration-violet-500/30 hover:decoration-violet-400 underline-offset-4">Instagram</a>.
      </span>
    </div>
  );
}
