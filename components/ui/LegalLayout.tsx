import Link from 'next/link';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { CreatorSection } from '@/components/ui/CreatorSection';

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-black selection:bg-violet-500/30">
      {/* Mini Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4">
        <div className="glass-panel max-w-5xl w-full h-16 rounded-full flex items-center justify-between px-8 border-violet-500/20">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-violet-400" />
            <span className="font-bold text-xl text-white tracking-tighter">
              Zan<span className="text-violet-400">Zora</span>
            </span>
          </Link>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-violet-500/10 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">{title}</h1>
            <div className="prose prose-invert prose-violet max-w-none prose-p:text-slate-400 prose-li:text-slate-400 prose-headings:text-white prose-strong:text-white">
              {children}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-900 flex flex-col items-center gap-6">
        <CreatorSection />
        <div className="text-slate-600 text-xs tracking-wide">
          © {new Date().getFullYear()} ZanZora. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
