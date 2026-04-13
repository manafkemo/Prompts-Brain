'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { Spinner } from '@/components/ui/Spinner';
import { motion } from 'framer-motion';
import { User, Mail, Sparkles, Shield, Clock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(profileData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex justify-center py-32">
          <Spinner className="h-10 w-10 text-violet-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-100">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Library</span>
          </button>

          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 mb-10">Manage your account and view your credit usage.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Account Info Card */}
            <div className="md:col-span-2 space-y-6">
              <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/10 blur-[60px] rounded-full" />
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-violet-400" />
                  Account Information
                </h3>

                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                    <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 px-4 py-3 rounded-xl text-slate-300">
                      <Mail className="h-4 w-4 text-slate-500" />
                      {user?.email}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Account ID</label>
                    <div className="px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl text-slate-600 font-mono text-xs truncate">
                      {user?.id}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-2 text-xs text-slate-500 italic">
                    <Shield className="h-3 w-3 text-emerald-500" />
                    Your data is secured with end-to-end encryption.
                  </div>
                </div>
              </div>

              {/* Security & Settings (Placeholders) */}
              <div className="glass-panel rounded-3xl p-8 border-dashed border-slate-800 opacity-50">
                <h3 className="text-lg font-semibold text-slate-400 mb-4">Security Settings</h3>
                <p className="text-sm text-slate-500">Password management and Two-Factor Authentication will be available soon.</p>
              </div>
            </div>

            {/* Credit Usage Card */}
            <div className="space-y-6">
              <div className="glass-panel rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-900/20 border-violet-500/20 shadow-2xl shadow-violet-900/10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-6 border border-violet-500/20">
                    <Sparkles className="h-8 w-8 text-violet-400" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">Your Credits</h3>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-4 tracking-tighter">
                    {profile?.credits ?? 0}
                  </div>
                  
                  <div className="w-full bg-slate-800 h-2 rounded-full mb-6 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full transition-all duration-1000 ease-out"
                      style={{ width: `${(profile?.credits ?? 0) * 10}%` }}
                    />
                  </div>

                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    You have <span className="text-white font-bold">{profile?.credits ?? 0}</span> actions remaining in your current plan.
                  </p>

                  <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all text-sm border border-slate-700">
                    Get More Credits
                  </button>
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6 flex items-center gap-4">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Clock className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Plan Type</div>
                  <div className="text-sm text-white font-medium">Free Access</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
