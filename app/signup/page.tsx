'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { BrainCircuit, Mail, Lock, Eye, EyeOff, Github, Chrome, Apple } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleSocialLogin = async (provider: 'google' | 'github' | 'apple') => {
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
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
        className="bg-slate-900 border border-white/5 w-full max-w-6xl max-h-[min(95vh,900px)] h-auto rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-black/50"
      >
        
        {/* Left Side - Image/Hero */}
        <div className="lg:w-[45%] relative overflow-hidden flex flex-col min-h-[400px] lg:min-h-0">
          <img 
            src="/signup-hero.png" 
            alt="ZanZora Hero" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.7] grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          <div className="relative z-10 p-12 flex flex-col h-full justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-violet-400" />
              <span className="font-bold text-2xl text-white tracking-tighter">Zan<span className="text-violet-400">Zora</span></span>
            </div>
            
            <div className="pb-4">
              <div className="flex gap-2 mb-6">
                <div className="h-1 w-8 bg-white rounded-full"></div>
                <div className="h-1 w-4 bg-white/30 rounded-full"></div>
                <div className="h-1 w-4 bg-white/30 rounded-full"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">Analyze Your Vision</h2>
              <p className="text-slate-300 text-base md:text-lg max-w-md leading-relaxed opacity-90">
                Turn screenshots into high-performance prompts with our built-in OCR and analyzer. Join ZanZora today.
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
                <button 
                  onClick={() => router.push('/login')}
                  className="px-6 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all"
                >
                  Log In
                </button>
                <button className="px-6 py-2 rounded-xl text-sm font-bold bg-violet-600 text-white shadow-lg shadow-violet-500/20 transition-all">
                  Sign Up
                </button>
              </div>
            </div>

            <div className="mb-10 text-center lg:text-left text-white">
              <h1 className="text-4xl font-bold mb-3">Create An Account</h1>
              <p className="text-slate-500 text-sm md:text-base">Transform your prompt workflow with AI.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* ... existing fields ... */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
                  />
                </div>
              </div>

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

              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl pl-14 pr-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                {loading ? "Creating Account..." : "Create an Account"}
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
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12 5.38z" fill="#EA4335"/>
                </svg>
              </button>
              <button 
                onClick={() => handleSocialLogin('github')}
                className="flex items-center justify-center p-4 bg-slate-800/40 border border-slate-700 rounded-2xl hover:bg-slate-800 transition-colors group"
              >
                <Github className="h-5 w-5 text-white fill-white transition-transform group-hover:scale-110" />
              </button>
              <button 
                onClick={() => handleSocialLogin('apple')}
                className="flex items-center justify-center p-4 bg-slate-800/40 border border-slate-700 rounded-2xl hover:bg-slate-800 transition-colors group"
              >
                <Apple className="h-5 w-5 text-white fill-white transition-transform group-hover:scale-110" />
              </button>
            </div>
            
            <p className="mt-8 text-center text-xs text-slate-500 leading-relaxed">
              By creating an account, you agree to our <Link href="/terms" className="text-violet-400 font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-violet-400 font-bold hover:underline">Privacy Policy</Link>.
            </p>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
