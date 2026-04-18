'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { BrainCircuit, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-slate-900 border border-white/5 w-full max-w-6xl max-h-[min(95vh,850px)] h-auto rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-black/50"
      >
        
        {/* Left Side - Image/Hero */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col">
          <img 
            src="/login-hero.png" 
            alt="ZanZora Hero" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          <div className="relative z-10 p-12 flex flex-col h-full justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-violet-400" />
              <span className="font-bold text-2xl text-white tracking-tighter">Zan<span className="text-violet-400">Zora</span></span>
            </div>
            
            <div className="pb-4">
              <div className="flex gap-2 mb-6">
                <div className="h-1 w-4 bg-white/30 rounded-full"></div>
                <div className="h-1 w-8 bg-white rounded-full"></div>
                <div className="h-1 w-4 bg-white/30 rounded-full"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">Master AI Intelligence</h2>
              <p className="text-slate-300 text-base md:text-lg max-w-md leading-relaxed opacity-90">
                Organize, test, and refine your prompt library with state-of-the-art AI insights. Welcome back.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-start overflow-y-auto bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto w-full pt-4"
          >
            {/* Switcher */}
            <div className="flex justify-center mb-10">
              <div className="bg-slate-800/50 p-1.5 rounded-2xl flex items-center border border-white/5 shadow-inner">
                <button className="px-6 py-2 rounded-xl text-sm font-bold bg-violet-600 text-white shadow-lg shadow-violet-500/20 transition-all">
                  Log In
                </button>
                <button 
                  onClick={() => router.push('/signup')}
                  className="px-6 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all"
                >
                  Sign Up
                </button>
              </div>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
              <p className="text-slate-500 text-sm md:text-base">Please enter your details to sign in to your library.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl pl-14 pr-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl pl-14 pr-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-violet-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            
            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link href="/signup" className="text-violet-400 font-bold hover:underline">
                Sign up for free
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-slate-500 leading-relaxed">
              By using ZanZora, you agree to our <Link href="/terms" className="text-violet-400 font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-violet-400 font-bold hover:underline">Privacy Policy</Link>.
            </p>
          </motion.div>
        </div>

      </motion.div>

    </div>
  );
}
