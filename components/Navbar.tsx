'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BrainCircuit, LogOut, User, Plus, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface NavbarProps {
  onNewPrompt?: () => void;
}

export function Navbar({ onNewPrompt }: NavbarProps) {
  const [credits, setCredits] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    let channel: any;

    const setupSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !isMounted) return;

        // Use a unique name for this specific effect run to avoid collisions
        // the error "cannot add callbacks after subscribe" happens when reusing 
        // a channel name that hasn't finished its lifecycle yet.
        const channelName = `credits_${user.id}_${Math.random().toString(36).slice(2, 11)}`;
        
        channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`,
            },
            (payload) => {
              if (isMounted && payload.new && typeof payload.new.credits === 'number') {
                setCredits(payload.new.credits);
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.error('Failed to setup credit subscription:', err);
      }
    };

    fetchCredits();
    setupSubscription();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const fetchCredits = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (data) {
      setCredits(data.credits);
    }
  };



  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 group mr-2">
            <BrainCircuit className="h-6 w-6 text-violet-500 transition-transform group-hover:scale-110" />
            <span className="font-bold text-xl text-white tracking-tighter flex items-center gap-1">
              Zan<span className="text-violet-500">Zora</span>
            </span>
          </Link>
          <div className="h-6 w-[1px] bg-slate-800 hidden md:block"></div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className={`font-medium transition-colors ${
                pathname === '/dashboard' ? 'text-violet-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Prompts Library
            </Link>
            <Link 
              href="/tools" 
              className={`font-medium transition-colors ${
                pathname === '/tools' ? 'text-violet-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              AI Tools
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          {/* Credit Indicator */}
          <div className="flex items-center gap-1.5 px-2 sm:px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-sm font-medium text-slate-300">
              <span className="text-violet-400 font-bold">{credits ?? '...'}</span> <span className="hidden sm:inline">Credits</span>
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {onNewPrompt && (
              <button 
                onClick={onNewPrompt}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-violet-500/20"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">New Prompt</span>
              </button>
            )}
            
            <div className="h-6 w-[1px] bg-slate-800 mx-1 hidden xs:block"></div>

            <Link 
              href="/profile"
              className={`p-2 rounded-full transition-all ${
                pathname === '/profile' 
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Profile Settings"
            >
              <User className="h-5 w-5" />
            </Link>

            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
