'use client';

import { motion } from 'framer-motion';

export function CreatorSection() {
  return (
    <div className="flex items-center justify-center flex-wrap gap-2 text-slate-400 text-sm font-medium py-4">
      <span className="whitespace-nowrap">Crafted with passion by</span>
      <motion.a 
        href="https://instagram.com/manafkemo" 
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.5, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-violet-500/30 shadow-lg shadow-violet-500/20 cursor-pointer mx-1 shrink-0 bg-slate-800"
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
      <span className="whitespace-nowrap">
        Manaf Kemo. Feel free to connect on <a href="https://instagram.com/manafkemo" target="_blank" className="text-violet-400 hover:text-violet-300 transition-colors font-bold underline decoration-violet-500/30 underline-offset-4">Instagram</a>.
      </span>
    </div>
  );
}
