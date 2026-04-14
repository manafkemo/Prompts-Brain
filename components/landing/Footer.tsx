import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { CreatorSection } from '@/components/ui/CreatorSection';

export function Footer() {
  return (
    <footer className="relative py-20 border-t border-white/5 mt-32 bg-slate-950 overflow-hidden">
      {/* Subtle background glow for the footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center justify-between mb-16">
          
          {/* LEFT: Logo & Description */}
          <div className="flex flex-col items-center lg:items-start gap-5 text-center lg:text-left">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-full" />
                <BrainCircuit className="h-7 w-7 text-violet-500 relative z-10" />
              </div>
              <span className="font-bold text-2xl text-white tracking-tighter">
                Zan<span className="text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">Zora</span>
              </span>
            </Link>
            <p className="text-slate-500 text-[0.95rem] max-w-xs leading-relaxed">
              The ultimate AI prompt management workspace for engineers and creators.
            </p>
          </div>

          {/* CENTER: Crafted By */}
          <div className="flex justify-center items-center">
            <CreatorSection />
          </div>

          {/* RIGHT: Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-6 sm:gap-8">
            <Link href="/privacy" className="relative group text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium">
              Privacy Policy
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-violet-500/50 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
            <Link href="/terms" className="relative group text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium">
              Terms of Service
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-violet-500/50 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
            <a href="#" className="relative group text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium">
              Twitter
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-violet-500/50 group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
          </div>
          
        </div>

        {/* BOTTOM: Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col items-center">
          <div className="text-slate-600 text-xs tracking-wider uppercase font-medium">
            © {new Date().getFullYear()} ZanZora. All rights reserved. Built for the future of AI.
          </div>
        </div>
      </div>
    </footer>
  );
}
