'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Supabase handles the code exchange automatically if the PKCE flow is used
        // and initialized with the correct client settings.
        // For @supabase/ssr, we just need to ensure the session is retrieved.
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;
        
        if (session) {
          router.push('/dashboard');
        } else {
          // If no session is found, it might be an error or expired link
          router.push('/login?error=Session not found');
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login?error=Authentication failed');
      }
    };

    handleAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <BrainCircuit className="h-10 w-10 text-violet-400 animate-pulse" />
          <span className="font-bold text-3xl text-white tracking-tighter">
            Zan<span className="text-violet-400">Zora</span>
          </span>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center max-w-sm w-full">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full" />
            <Loader2 className="h-12 w-12 text-violet-400 animate-spin relative z-10" />
          </div>
          
          <h1 className="text-xl font-bold text-white mb-2">Signing you in</h1>
          <p className="text-slate-400 text-sm">
            Please wait while we securely authenticate your session...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
