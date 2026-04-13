import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { CreatorSection } from '@/components/ui/CreatorSection';

export function Footer() {
  return (
    <footer className="py-12 border-t border-slate-900 mt-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-violet-500" />
              <span className="font-bold text-xl text-white tracking-tighter">
                Zan<span className="text-violet-500">Zora</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs text-center md:text-left">
              The ultimate AI prompt management workspace for engineers and creators.
            </p>
          </div>
          
          <div className="flex gap-8">
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Twitter</a>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
          <CreatorSection />
          
          <div className="text-slate-600 text-xs tracking-wide">
            © {new Date().getFullYear()} ZanZora. All rights reserved. Built for the future of AI.
          </div>
        </div>
      </div>
    </footer>
  );
}
