'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Tool, UserSavedTool } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { CreatorSection } from '@/components/ui/CreatorSection';
import { FeedbackButton } from '@/components/ui/FeedbackButton';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolDetailModal } from '@/components/tools/ToolDetailModal';
import { AddToolModal } from '@/components/tools/AddToolModal';
import { AIRecommendBox, Recommendation } from '@/components/tools/AIRecommendBox';
import { 
  LayoutGrid, 
  Sparkles, 
  Filter, 
  Plus, 
  Heart, 
  Image as ImageIcon, 
  Video, 
  Type, 
  Code2, 
  Globe,
  Home,
  ChevronRight,
  Search
} from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [userCategories, setUserCategories] = useState<any[]>([]);
  
  // AI Recs
  const [aiRecommendations, setAiRecommendations] = useState<Recommendation[] | null>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  // Modals
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [suggestedPromptsForModal, setSuggestedPromptsForModal] = useState<string[] | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchTools = useCallback(async () => {
    setLoading(true);
    try {
      const url = categoryFilter !== 'All' && categoryFilter !== 'Favorites'
        ? `/api/tools?category=${encodeURIComponent(categoryFilter)}` 
        : `/api/tools`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTools(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  const fetchSavedTools = useCallback(async () => {
    try {
      const res = await fetch('/api/tools/saved');
      if (res.ok) {
        const data: UserSavedTool[] = await res.json();
        setFavoriteIds(new Set(data.filter(item => item.is_favorite).map(item => item.tool_id)));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setUserCategories(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchTools();
    fetchSavedTools();
    fetchCategories();
  }, [fetchTools, fetchSavedTools, fetchCategories]);

  const handleFavoriteToggle = async (toolId: string, status: boolean) => {
    // Optimistic UI
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (status) next.add(toolId);
      else next.delete(toolId);
      return next;
    });

    try {
      const res = await fetch('/api/tools/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_id: toolId, is_favorite: status })
      });
      if (!res.ok) throw new Error('Failed to favorite tool');
    } catch (e) {
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (status) next.delete(toolId);
        else next.add(toolId);
        return next;
      });
      console.error(e);
    }
  };

  const handleToolAdded = (newTool: Tool) => {
    setTools(prev => [newTool, ...prev]);
    fetchCategories();
  };

  const handleCreateCategory = async () => {
    const name = window.prompt('Enter new category name:');
    if (!name || name.trim() === '') return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create category');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while creating the category');
    }
  };

  const handleOpenTool = (tool: Tool, prompts?: string[]) => {
    setSelectedTool(tool);
    setSuggestedPromptsForModal(prompts);
    setIsModalOpen(true);
  };

  const handleAiRecommendations = (recs: Recommendation[]) => {
    setAiRecommendations(recs);
    setTimeout(() => {
      recommendationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const mainCategories = [
    { name: 'All', icon: Home },
    { name: 'Favorites', icon: Heart },
  ];

  const defaultCategories = [
    { name: 'AI Image', icon: ImageIcon },
    { name: 'AI Video', icon: Video },
    { name: 'AI Writing', icon: Type },
    { name: 'Dev Tools', icon: Code2 },
  ];

  const filteredTools = tools.filter(tool => {
    if (categoryFilter === 'Favorites') return favoriteIds.has(tool.id);
    return true; 
  });

  return (
    <div className="min-h-screen bg-black overflow-x-hidden text-slate-200">
      <Navbar />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="lg:w-72 border-r border-white/5 bg-slate-950/50 backdrop-blur-xl lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar p-6">
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 px-3">
              Library
            </h2>
            <nav className="space-y-1.5">
              {mainCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategoryFilter(cat.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative group ${
                    categoryFilter === cat.name 
                      ? 'text-white bg-violet-600/10' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {categoryFilter === cat.name && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-violet-500 rounded-full"
                    />
                  )}
                  <cat.icon className={`h-5 w-5 ${categoryFilter === cat.name ? 'text-violet-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 px-3">
              Explore
            </h2>
            <nav className="space-y-1.5">
              {defaultCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategoryFilter(cat.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative group ${
                    categoryFilter === cat.name 
                      ? 'text-white bg-violet-600/10' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {categoryFilter === cat.name && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-violet-500 rounded-full"
                    />
                  )}
                  <cat.icon className={`h-5 w-5 ${categoryFilter === cat.name ? 'text-violet-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between px-3 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Your Lists
              </h2>
              <button 
                onClick={handleCreateCategory}
                title="Create new category"
                className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <nav className="space-y-1.5">
              {userCategories.length > 0 ? (
                userCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setCategoryFilter(cat.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative group ${
                      categoryFilter === cat.name 
                        ? 'text-white bg-violet-600/10' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {categoryFilter === cat.name && (
                      <motion.div 
                        layoutId="active-pill"
                        className="absolute left-0 w-1 h-6 bg-violet-500 rounded-full"
                      />
                    )}
                    <Globe className={`h-5 w-5 ${categoryFilter === cat.name ? 'text-violet-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    {cat.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-slate-600 italic">
                  Create categories to organize your library.
                </div>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 lg:p-12 pb-32">
          {/* Header & Search-like Matchmaker */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                  {categoryFilter === 'All' ? 'Tool Library' : categoryFilter}
                </h1>
                <p className="text-slate-500 font-medium">
                  Discover and manage your curated stack of specialized tools.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 transition-all active:scale-[0.98] group"
                >
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                  Add Tool
                </button>
                <div className="flex items-center gap-3 bg-slate-900/50 border border-white/5 px-4 py-2 rounded-2xl backdrop-blur-sm h-[44px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {tools.length} Tools
                  </span>
                </div>
              </div>
            </div>

            <AIRecommendBox 
              onRecommendationFound={handleAiRecommendations} 
            />

            {/* AI Recommendations Results */}
            {aiRecommendations && (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  ref={recommendationsRef} 
                  className="mt-12 scroll-mt-32"
                >
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-violet-500" />
                    AI Recommendations
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {aiRecommendations.map((rec) => {
                      const tool = tools.find(t => t.id === rec.tool_id) || {
                        id: rec.tool_id,
                        name: rec.name,
                        description: "Tool info not loaded initially.",
                        category: "Recommended",
                        pricing: "Unknown",
                        url: "#",
                        tags: [],
                      } as any;

                      return (
                        <div key={rec.tool_id} className="glass-panel p-6 rounded-2xl border-violet-500/30 flex flex-col h-full bg-slate-900/40">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-xl font-bold text-white">{rec.name}</h4>
                            <button 
                              onClick={() => handleOpenTool(tool, rec.suggested_prompts)}
                              className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-medium border border-violet-500"
                            >
                              View Details
                            </button>
                          </div>
                          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 mb-4 flex-grow">
                            <p className="text-sm text-slate-300 leading-relaxed">
                              <span className="font-semibold text-violet-400">Match reasoning: </span>
                              {rec.reasoning}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-32">
                <Spinner className="w-12 h-12 text-violet-500" />
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-32 glass-panel rounded-[32px] mx-auto border-dashed border-white/5 w-full mt-8">
                <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-6">
                  <LayoutGrid className="h-10 w-10 text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Empty Category</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                  {categoryFilter === 'Favorites' 
                    ? "You haven't favorited any tools yet. Heart your top tools to see them here!"
                    : "No tools found in this category yet. Start by adding a new one!"}
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl transition-colors font-bold border border-white/10"
                >
                  Add Your First Tool
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredTools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFavorite={favoriteIds.has(tool.id)}
                    onFavoriteToggle={handleFavoriteToggle}
                    onClick={() => handleOpenTool(tool)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <ToolDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tool={selectedTool}
        suggestedPrompts={suggestedPromptsForModal}
      />

      <AddToolModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleToolAdded}
      />

      <footer className="mt-20 pb-12 border-t border-white/5 pt-12 bg-slate-950/30">
        <CreatorSection />
        <div className="text-center text-slate-600 text-xs mt-8 font-medium tracking-widest uppercase">
          © {new Date().getFullYear()} ZanZora. Built by creators for creators.
        </div>
      </footer>

      <FeedbackButton />
    </div>
  );
}
