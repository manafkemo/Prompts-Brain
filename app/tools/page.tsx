'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Tool, UserSavedTool, ToolCategory } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { CreatorSection } from '@/components/ui/CreatorSection';
import { FeedbackButton } from '@/components/ui/FeedbackButton';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolDetailModal } from '@/components/tools/ToolDetailModal';
import { AddToolModal } from '@/components/tools/AddToolModal';
import { AddCategoryModal } from '@/components/tools/AddCategoryModal';
import { MoveToCategoryModal } from '@/components/tools/MoveToCategoryModal';
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
  ExternalLink,
  Search,
  Palette,
  X,
  Trash2
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [userCategories, setUserCategories] = useState<ToolCategory[]>([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ToolCategory | null>(null);
  const [movingToolId, setMovingToolId] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [pricingFilter, setPricingFilter] = useState<string>('All');
  
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
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
      const isCustomCat = userCategories.some(c => c.id === categoryFilter);
      const url = !isCustomCat && categoryFilter !== 'All' && categoryFilter !== 'Favorites'
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
    
    setTools(prev => prev.map(t => t.id === toolId ? { ...t, is_favorite: status } : t));

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
      setTools(prev => prev.map(t => t.id === toolId ? { ...t, is_favorite: !status } : t));
      console.error(e);
    }
  };

  const handleToolAdded = (newTool: Tool) => {
    setTools(prev => [newTool, ...prev]);
    fetchCategories();
  };

  const handleMoveToolToCategory = async (toolId: string, categoryId: string | null) => {
    try {
      const res = await fetch('/api/tools/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tool_id: toolId, 
          category_id: categoryId 
        })
      });
      
      if (res.ok) {
        fetchTools(); // Refresh tools to update their category_id
      }
    } catch (e) {
      console.error('Failed to move tool:', e);
    }
  };

  const handleMoveClick = (toolId: string) => {
    setMovingToolId(toolId);
    setIsMoveModalOpen(true);
  };

  const handleDeleteTool = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool from your library?')) return;
    
    try {
      const res = await fetch(`/api/tools?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTools();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditCategory = (cat: ToolCategory) => {
    setEditingCategory(cat);
    setIsAddCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Tools will be removed from it but not deleted.')) return;
    
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (categoryFilter === id) setCategoryFilter('All');
        fetchCategories();
      }
    } catch (e) {
      console.error(e);
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
    // 1. Category Filter
    let matchesCategory = true;
    if (categoryFilter !== 'All') {
      if (categoryFilter === 'Favorites') {
        matchesCategory = tool.is_favorite || false;
      } else {
        const isCustomCat = userCategories.some(c => c.id === categoryFilter);
        if (isCustomCat) {
          matchesCategory = tool.user_category_id === categoryFilter;
        } else {
          matchesCategory = tool.category === categoryFilter;
        }
      }
    }

    // 2. Search Filter
    const matchesSearch = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // 3. Pricing Filter
    const matchesPricing = pricingFilter === 'All' || 
      tool.pricing.toLowerCase() === pricingFilter.toLowerCase();

    return matchesCategory && matchesSearch && matchesPricing;
  });

  const SidebarContent = () => (
    <>
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 px-3">
          Library
        </h2>
        <nav className="space-y-1.5">
          {mainCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setCategoryFilter(cat.name);
                setIsMobileSidebarOpen(false);
              }}
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
              onClick={() => {
                setCategoryFilter(cat.name);
                setIsMobileSidebarOpen(false);
              }}
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
        <button 
          onClick={() => setIsAddCategoryModalOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 mb-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group shadow-sm"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-violet-400">
            Add Category
          </span>
          <Plus className="h-4 w-4 text-slate-600 group-hover:text-violet-500 group-hover:rotate-90 transition-transform" />
        </button>

        <nav className="space-y-1.5">
          {userCategories.length > 0 ? (
            userCategories.map((cat) => {
              const IconComponent = (LucideIcons as any)[cat.icon || 'Globe'] || LucideIcons.Globe;
              const colorMap: any = {
                violet: 'text-violet-500',
                emerald: 'text-emerald-500',
                rose: 'text-rose-500',
                amber: 'text-amber-500',
                blue: 'text-blue-500',
                cyan: 'text-cyan-500',
              };
              const activeColorMap: any = {
                violet: 'bg-violet-500/10 text-violet-400',
                emerald: 'bg-emerald-500/10 text-emerald-400',
                rose: 'bg-rose-500/10 text-rose-400',
                amber: 'bg-amber-500/10 text-amber-400',
                blue: 'bg-blue-500/10 text-blue-400',
                cyan: 'bg-cyan-500/10 text-cyan-400',
              };
              
              const catColor = cat.color || 'violet';
              
              return (
                <div
                  key={cat.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setCategoryFilter(cat.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setCategoryFilter(cat.id);
                      setIsMobileSidebarOpen(false);
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverCategoryId(cat.id);
                  }}
                  onDragLeave={() => setDragOverCategoryId(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    const toolId = e.dataTransfer.getData('toolId');
                    handleMoveToolToCategory(toolId, cat.id);
                    setDragOverCategoryId(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer ${
                    categoryFilter === cat.id 
                      ? activeColorMap[catColor] || 'text-white bg-violet-600/10' 
                      : dragOverCategoryId === cat.id
                        ? 'bg-violet-500/20 text-white border-dashed border border-violet-500/50'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {categoryFilter === cat.id && (
                    <motion.div 
                      layoutId="active-pill"
                      className={`absolute left-0 w-1 h-6 rounded-full ${
                        catColor === 'emerald' ? 'bg-emerald-500' :
                        catColor === 'rose' ? 'bg-rose-500' :
                        catColor === 'amber' ? 'bg-amber-500' :
                        catColor === 'blue' ? 'bg-blue-500' :
                        catColor === 'cyan' ? 'bg-cyan-500' :
                        catColor === 'lime' ? 'bg-lime-500' :
                        catColor === 'indigo' ? 'bg-indigo-500' :
                        catColor === 'fuchsia' ? 'bg-fuchsia-500' :
                        catColor === 'orange' ? 'bg-orange-500' :
                        catColor === 'slate' ? 'bg-slate-500' :
                        catColor === 'sky' ? 'bg-sky-500' :
                        'bg-violet-500'
                      }`}
                    />
                  )}
                  <IconComponent className={`h-5 w-5 ${
                    categoryFilter === cat.id 
                      ? (colorMap[catColor] || 'text-violet-500') 
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                  <span className="flex-1 text-left">{cat.name}</span>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); }}
                      className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-white"
                      title="Edit"
                    >
                      <Palette className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                      className="p-1 hover:bg-red-500/20 rounded text-slate-500 hover:text-red-400"
                      title="Delete"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-3 text-xs text-slate-600 italic">
              Create categories to organize your library.
            </div>
          )}
        </nav>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-black overflow-x-hidden text-slate-200">
      <Navbar />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-72 border-r border-white/5 bg-slate-950/50 backdrop-blur-xl lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar p-6">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-y-0 left-0 w-[280px] bg-slate-950 border-r border-white/10 shadow-2xl flex flex-col p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-bold text-white">Categories</h2>
                  <button 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <SidebarContent />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8 lg:p-12 pb-32">
          {/* Header & Search-like Matchmaker */}
          <div className="max-w-6xl mx-auto mb-8 md:mb-12">
            <div className="flex flex-col gap-6 mb-8 md:mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                    {categoryFilter === 'All' 
                      ? 'Tool Library' 
                      : categoryFilter === 'Favorites' 
                        ? 'My Favorites' 
                        : (userCategories.find(c => c.id === categoryFilter)?.name || categoryFilter)}
                  </h1>
                  <p className="text-slate-500 font-medium text-sm md:text-base">
                    Discover and manage your curated stack of specialized tools.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-900 border border-white/5 text-slate-300 hover:text-white transition-all active:scale-95"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Categories
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-sm font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 transition-all active:scale-[0.98] group"
                  >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    Add Tool
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools, tags, features..."
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl md:rounded-2xl py-2.5 md:py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all backdrop-blur-sm"
                  />
                </div>
                
                <div className="flex items-center gap-1 bg-slate-900/50 border border-white/5 p-1 rounded-xl md:rounded-2xl backdrop-blur-sm overflow-x-auto no-scrollbar">
                  {['All', 'Free', 'Freemium', 'Paid'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPricingFilter(p)}
                      className={`px-3 md:px-4 py-1.5 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold transition-all whitespace-nowrap ${
                        pricingFilter === p 
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                          : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="hidden sm:flex items-center gap-3 bg-slate-900/50 border border-white/5 px-4 py-2 rounded-2xl backdrop-blur-sm h-[44px] md:h-[48px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'}
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
                            <div className="flex items-center gap-3">
                              <motion.a 
                                whileHover={{ scale: 1.1, x: 2, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                href={tool.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 text-slate-300 hover:text-white bg-slate-950/50 hover:bg-violet-600 rounded-xl transition-all border border-white/5 shadow-lg"
                                title="Visit Website"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </motion.a>
                              <button 
                                onClick={() => handleOpenTool(tool, rec.suggested_prompts)}
                                className="bg-violet-600 hover:bg-violet-700 text-white text-xs px-4 py-2 rounded-xl transition-all font-bold border border-violet-500 shadow-lg shadow-violet-600/20 active:scale-95"
                              >
                                View Details
                              </button>
                            </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {filteredTools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFavorite={tool.is_favorite || false}
                    onFavoriteToggle={handleFavoriteToggle}
                    onMove={handleMoveClick}
                    onDelete={handleDeleteTool}
                    onRemove={(toolId) => handleMoveToolToCategory(toolId, null)}
                    onClick={() => handleOpenTool(tool)}
                    isInCustomCategory={userCategories.some(c => c.id === categoryFilter)}
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

      <AddCategoryModal 
        isOpen={isAddCategoryModalOpen}
        onClose={() => {
          setIsAddCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSuccess={fetchCategories}
        initialData={editingCategory}
      />

      <MoveToCategoryModal
        isOpen={isMoveModalOpen}
        onClose={() => {
          setIsMoveModalOpen(false);
          setMovingToolId(null);
        }}
        categories={userCategories}
        currentCategoryId={tools.find(t => t.id === movingToolId)?.user_category_id}
        onMove={(catId) => movingToolId && handleMoveToolToCategory(movingToolId, catId)}
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
