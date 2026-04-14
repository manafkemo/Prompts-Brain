'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Prompt } from '@/lib/types';
import { PromptCard } from '@/components/prompts/PromptCard';
import { PromptCardSkeleton } from '@/components/prompts/PromptCardSkeleton';
import { Plus, Search, BrainCircuit } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { CreatorSection } from '@/components/ui/CreatorSection';
import dynamic from 'next/dynamic';

// Lazy load the modal to reduce initial bundle size
const AddPromptModal = dynamic(() => import('@/components/prompts/AddPromptModal').then(mod => mod.AddPromptModal), {
  ssr: false,
});

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPrompts = useCallback(async (searchQuery?: string) => {
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
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    // Clear previous timeout for better debouncing
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchPrompts(value);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar onNewPrompt={() => setIsModalOpen(true)} />

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <PromptCardSkeleton key={i} />
            ))}
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

      {/* Add Prompt Modal - Rendered only when needed */}
      {isModalOpen && (
        <AddPromptModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onAdded={(newPrompt) => setPrompts(prev => [newPrompt, ...prev])}
        />
      )}

      <footer className="mt-20 pb-12 border-t border-white/5 pt-8">
        <CreatorSection />
        <div className="text-center text-slate-600 text-xs mt-4">
          © {new Date().getFullYear()} ZanZora. Built by creators for creators.
        </div>
      </footer>
    </div>
  );
}
