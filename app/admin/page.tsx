'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { AdminUserTable } from '@/components/admin/AdminUserTable';
import { EditCreditsModal } from '@/components/admin/EditCreditsModal';
import { ShieldCheck, ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  credits: number;
  created_at: string;
}

const ADMIN_EMAIL = 'manafkemo@gmail.com';

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        setIsAuthorized(false);
        setTimeout(() => router.push('/'), 2000);
        return;
      }
      setIsAuthorized(true);
      fetchUsers();
    }
    checkAuth();
  }, [router, supabase.auth]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateCredits(userId: string, credits: number) {
    try {
      const res = await fetch('/api/admin/update-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, credits })
      });

      if (res.ok) {
        // Optimistic/Local update
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, credits } : u));
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to update credits:', error);
      alert('Network error while updating credits');
    }
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-20 w-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20">
          <ShieldCheck className="h-10 w-10 text-rose-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-slate-400 max-w-md">
          You don't have administrative privileges to access this area. 
          Redirecting you back to safety...
        </p>
      </div>
    );
  }

  if (isAuthorized === null) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-violet-500/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to App
            </Link>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-[2rem] bg-violet-600 flex items-center justify-center shadow-2xl shadow-violet-600/20">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-1">Admin Dashboard</h1>
                <p className="text-slate-400 font-medium">Manage users and credit distribution</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900 border border-white/5 px-6 py-4 rounded-3xl backdrop-blur-md">
            <div className="h-10 w-10 rounded-2xl bg-violet-500/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Admin Access</p>
              <p className="text-sm font-semibold text-slate-200">{ADMIN_EMAIL}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
          
          <div className="relative z-10">
            <AdminUserTable 
              users={users} 
              loading={loading} 
              onEdit={setEditingUser} 
            />
          </div>
        </div>
      </div>

      <EditCreditsModal 
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleUpdateCredits}
      />
    </div>
  );
}
