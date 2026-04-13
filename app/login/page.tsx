'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { BrainCircuit, Mail, Lock, Eye, EyeOff, Github, Facebook, X, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    if (provider === 'facebook') {
      setShowMaintenance(true);
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

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
        <div className="lg:w-[45%] relative overflow-hidden flex flex-col min-h-[400px] lg:min-h-0">
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

            <div className="mt-8 flex items-center gap-4 text-slate-600">
              <div className="h-[1px] flex-1 bg-slate-800"></div>
              <span className="text-xs font-bold uppercase tracking-wider">Or</span>
              <div className="h-[1px] flex-1 bg-slate-800"></div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <button 
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center p-4 bg-slate-800/40 border border-slate-700 rounded-2xl hover:bg-slate-800 transition-colors group"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:scale-110">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 4.75c1.54 0 2.91.53 4 1.48l3-3C17.46 1.45 15.02 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button 
                onClick={() => handleSocialLogin('github')}
                className="flex items-center justify-center p-4 bg-slate-800/40 border border-slate-700 rounded-2xl hover:bg-slate-800 transition-colors group"
              >
                <Github className="h-5 w-5 text-white fill-white transition-transform group-hover:scale-110" />
              </button>
              <button 
                onClick={() => handleSocialLogin('facebook')}
                className="flex items-center justify-center p-4 bg-slate-800/40 border border-slate-700 rounded-2xl hover:bg-slate-800 transition-colors group"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:scale-110">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                </svg>
              </button>
            </div>
            
            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link href="/signup" className="text-violet-400 font-bold hover:underline">
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </div>

      </motion.div>

      {/* Maintenance Overlay */}
      <AnimatePresence>
        {showMaintenance && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/20 blur-[80px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full" />
              
              <button 
                onClick={() => setShowMaintenance(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-violet-500/10 rounded-3xl flex items-center justify-center mb-6 border border-violet-500/20">
                  <AlertTriangle className="h-10 w-10 text-violet-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">Face Problem</h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  We apologize, but we are facing a problem with our <span className="text-violet-400 font-semibold">provers</span> at the moment. We will solve it soon!
                </p>
                
                <button 
                  onClick={() => setShowMaintenance(false)}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/20 transition-all active:scale-[0.98]"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
