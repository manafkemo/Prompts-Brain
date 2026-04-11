'use client';

import { useEffect, useState } from 'react';
import { Prompt } from '@/lib/types';
import { PromptCard } from '@/components/prompts/PromptCard';
import { AddPromptModal } from '@/components/prompts/AddPromptModal';
import { Plus, Search, BrainCircuit, LogOut } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async (searchQuery?: string) => {
    setLoading(true);
    let url = '/api/prompts';
    if (searchQuery) {
      url += `?search=${encodeURIComponent(searchQuery)}`;
    }
    
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPrompts(data);
      }
    } catch (error) {
      console.error('Failed to fetch prompts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // basic debounce
    const timeout = setTimeout(() => {
      fetchPrompts(e.target.value);
    }, 500);
    return () => clearTimeout(timeout);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-violet-500" />
            <span className="font-bold text-lg text-white tracking-tight">Prompts<span className="text-violet-500">Brain</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-violet-500/20"
            >
              <Plus className="h-4 w-4" />
              New Prompt
            </button>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input 
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search your prompt library..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Content grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8 text-violet-500" />
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-32 glass-panel rounded-2xl mx-auto max-w-2xl border-dashed">
            <BrainCircuit className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">No prompts found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              You haven't saved any prompts yet, or none match your search. Start building your library!
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors border border-slate-700"
            >
              <Plus className="h-4 w-4" />
              Add Your First Prompt
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {prompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </main>

      {/* Add Prompt Modal */}
      <AddPromptModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAdded={(newPrompt) => setPrompts(prev => [newPrompt, ...prev])}
      />
    </div>
  );
}
