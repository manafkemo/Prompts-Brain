'use client';

import { useState } from 'react';
import { Edit2, Search, User } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

interface UserProfile {
  id: string;
  email: string;
  credits: number;
  created_at: string;
}

interface AdminUserTableProps {
  users: UserProfile[];
  loading: boolean;
  onEdit: (user: UserProfile) => void;
}

export function AdminUserTable({ users, loading, onEdit }: AdminUserTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="h-10 w-10 text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-violet-500/50 transition-all text-lg placeholder:text-slate-600"
        />
      </div>

      <div className="overflow-hidden bg-slate-900/30 border border-white/5 rounded-3xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-5 text-slate-400 font-medium text-sm">USER</th>
                <th className="px-6 py-5 text-slate-400 font-medium text-sm">CREDITS</th>
                <th className="px-6 py-5 text-slate-400 font-medium text-sm text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5">
                          <User className="h-6 w-6 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{user.email || 'No email provided'}</span>
                          <span className="text-xs text-slate-500">Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-1.5 rounded-xl text-sm font-bold border ${
                          user.credits > 0 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {user.credits}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => onEdit(user)}
                        className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all active:scale-95"
                        title="Edit Credits"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    {searchTerm ? `No users found matching "${searchTerm}"` : 'No users associated with this project yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
