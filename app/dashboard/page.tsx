'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Prompt, Collection } from '@/lib/types';
import { PromptCard } from '@/components/prompts/PromptCard';
import { PromptCardSkeleton } from '@/components/prompts/PromptCardSkeleton';
import { Plus, Search, BrainCircuit, Folder, FolderOpen, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { CreatorSection } from '@/components/ui/CreatorSection';
import dynamic from 'next/dynamic';
import { DeleteConfirmationModal } from '@/components/prompts/DeleteConfirmationModal';
import { DeleteCollectionModal } from '@/components/prompts/DeleteCollectionModal';
import { FeedbackButton } from '@/components/ui/FeedbackButton';
import { FilterPanel } from '@/components/prompts/FilterPanel';
import { LibraryDrawer } from '@/components/prompts/LibraryDrawer';
import { Library as LibraryIcon, Menu } from 'lucide-react';

const AddPromptModal = dynamic(() => import('@/components/prompts/AddPromptModal').then(mod => mod.AddPromptModal), {
  ssr: false,
});

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [draftPrompt, setDraftPrompt] = useState<string | undefined>(undefined);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const supabase = createClient();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial Fetch
  useEffect(() => {
    fetchCollections();
    fetchPrompts();

    // Check for draft prompt from AI Tools Matchmaker
    const draft = localStorage.getItem('draft_prompt');
    if (draft) {
      setDraftPrompt(draft);
      setIsModalOpen(true);
      localStorage.removeItem('draft_prompt');
    }
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPrompts = useCallback(async (searchQuery?: string, activeFilters?: any) => {
    setLoading(true);
    let url = '/api/prompts';
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('search', searchQuery);
    
    if (activeFilters) {
      if (activeFilters.tags.length > 0) params.append('tags', activeFilters.tags.join(','));
      if (activeFilters.startDate) params.append('startDate', activeFilters.startDate);
      if (activeFilters.endDate) params.append('endDate', activeFilters.endDate);
      if (activeFilters.title) params.append('title', activeFilters.title);
      if (activeFilters.content) params.append('content', activeFilters.content);
      if (activeFilters.minCreativity > 1) params.append('minCreativity', activeFilters.minCreativity.toString());
      if (activeFilters.maxCreativity < 10) params.append('maxCreativity', activeFilters.maxCreativity.toString());
      if (activeFilters.minQuality > 1) params.append('minQuality', activeFilters.minQuality.toString());
      if (activeFilters.maxQuality < 10) params.append('maxQuality', activeFilters.maxQuality.toString());
    }

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      fetchPrompts(value, filters);
    }, 500);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    fetchPrompts(search, newFilters);
  };

  const handleDeletePrompt = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPromptToDelete(id);
  };

  const confirmDelete = async () => {
    if (!promptToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/prompts/${promptToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setPrompts(prev => prev.filter(p => p.id !== promptToDelete));
        setPromptToDelete(null);
      }
    } catch (error) {
      console.error('Failed to delete prompt', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNewCollection = async (name: string) => {
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const newCol = await res.json();
        setCollections([newCol, ...collections]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDeleteCollection = async () => {
    if (!collectionToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/collections/${collectionToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setCollections(prev => prev.filter(c => c.id !== collectionToDelete.id));
        // Reset prompts collection_id in local state
        setPrompts(prev => prev.map(p => 
          p.collection_id === collectionToDelete.id ? { ...p, collection_id: null } : p
        ));
        // If the deleted folder was active, switch to all prompts
        if (activeCollection === collectionToDelete.id) {
          setActiveCollection(null);
        }
        setCollectionToDelete(null);
      }
    } catch (error) {
      console.error('Failed to delete collection:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDragStart = () => {
    setIsLibraryOpen(true);
  };

  const handleDrop = async (e: React.DragEvent, collectionId: string | null) => {
    e.preventDefault();
    setDragOverFolder(null);
    const promptId = e.dataTransfer.getData('text/plain');
    if (!promptId) return;

    // Optimistic UI update
    setPrompts(prev => prev.map(p => 
      p.id === promptId ? { ...p, collection_id: collectionId } : p
    ));

    // Backend update
    try {
      await fetch(`/api/prompts/${promptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection_id: collectionId })
      });
    } catch (error) {
      console.error('Failed to move prompt', error);
    }
  };

  const displayedPrompts = activeCollection 
    ? prompts.filter(p => p.collection_id === activeCollection)
    : prompts;

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <Navbar onNewPrompt={() => setIsModalOpen(true)} />

      {/* Hover Zone Trigger (Invisible strip on the right) */}
      <div 
        className="fixed top-0 right-0 bottom-0 w-2 z-30 group flex items-center justify-center pointer-events-none sm:pointer-events-auto"
        onMouseEnter={() => {
          hoverTimeoutRef.current = setTimeout(() => setIsLibraryOpen(true), 300);
        }}
        onMouseLeave={() => {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        }}
      >
        <div className="h-20 w-1 bg-violet-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <main className="container mx-auto px-4 py-8">
        
        <div className="flex flex-col gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-white hidden sm:block">
                  {activeCollection ? collections.find(c => c.id === activeCollection)?.name : 'All Prompts'}
                </h1>
                {activeCollection && (
                  <span className="text-[10px] font-black tracking-widest text-slate-500 bg-slate-900 px-3 py-1 rounded-full uppercase">
                    FOLDER VIEW
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 w-full sm:max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input 
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                  />
                </div>
                <FilterPanel onFilterChange={handleFilterChange} />
                
                {/* Library Toggle Button */}
                <button
                  onClick={() => setIsLibraryOpen(true)}
                  className={`flex items-center justify-center p-2.5 rounded-xl border transition-all ${
                    isLibraryOpen 
                      ? 'bg-violet-600/20 border-violet-500/50 text-violet-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                  title="Open Library"
                >
                  <LibraryIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <PromptCardSkeleton key={i} />)}
            </div>
          ) : displayedPrompts.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-2xl mx-auto border-dashed">
              <FolderOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-300 mb-2">No prompts here</h3>
              <p className="text-slate-500 mb-6 mx-auto">
                {activeCollection ? "Drag prompts into this folder to organize them." : "You haven't saved any prompts yet."}
              </p>
              {!activeCollection && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors border border-slate-700"
                >
                  <Plus className="h-4 w-4" /> Add Prompt
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPrompts.map(prompt => (
                <div key={prompt.id} onDragStart={handleDragStart}>
                  <PromptCard 
                    prompt={prompt} 
                    onDelete={handleDeletePrompt}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>

      {/* Library Drawer */}
      <LibraryDrawer 
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        collections={collections}
        prompts={prompts}
        activeCollection={activeCollection}
        setActiveCollection={setActiveCollection}
        onNewCollection={handleNewCollection}
        onPromptMove={handleDrop}
        onDeleteCollection={(col) => setCollectionToDelete(col)}
      />

      {isModalOpen && (
        <AddPromptModal 
          isOpen={isModalOpen} 
          initialPrompt={draftPrompt}
          onClose={() => setIsModalOpen(false)}
          onAdded={(newPrompt) => {
            setPrompts(prev => [newPrompt, ...prev]);
            // If they are in a folder and add a prompt, automatically assign it to the folder!
            if (activeCollection) {
              handleDrop({ dataTransfer: { getData: () => newPrompt.id }, preventDefault: () => {} } as any, activeCollection);
            }
          }}
        />
      )}

      <DeleteConfirmationModal 
        isOpen={!!promptToDelete}
        onClose={() => setPromptToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <DeleteCollectionModal
        isOpen={!!collectionToDelete}
        onClose={() => setCollectionToDelete(null)}
        onConfirm={confirmDeleteCollection}
        collectionName={collectionToDelete?.name || ''}
        isDeleting={isDeleting}
      />

      <footer className="mt-20 pb-12 border-t border-white/5 pt-8">
        <CreatorSection />
        <div className="text-center text-slate-600 text-xs mt-4">
          © {new Date().getFullYear()} ZanZora. Built by creators for creators.
        </div>
      </footer>

      <FeedbackButton />
    </div>
  );
}
