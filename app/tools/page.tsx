'use client';

import { useEffect, useState, useRef } from 'react';
import { Tool } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { CreatorSection } from '@/components/ui/CreatorSection';
import { FeedbackButton } from '@/components/ui/FeedbackButton';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolDetailModal } from '@/components/tools/ToolDetailModal';
import { AIRecommendBox, Recommendation } from '@/components/tools/AIRecommendBox';
import { LayoutGrid, Sparkles, Filter } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [savedToolIds, setSavedToolIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // AI Recs
  const [aiRecommendations, setAiRecommendations] = useState<Recommendation[] | null>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  // Modal
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [suggestedPromptsForModal, setSuggestedPromptsForModal] = useState<string[] | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTools();
    fetchSavedTools();
  }, [categoryFilter]);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const url = categoryFilter !== 'All' 
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
  };

  const fetchSavedTools = async () => {
    try {
      const res = await fetch('/api/tools/saved');
      if (res.ok) {
        const data = await res.json();
        setSavedToolIds(new Set(data.map((item: any) => item.tool_id)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveToggle = async (toolId: string) => {
    // Optimistic UI
    const isCurrentlySaved = savedToolIds.has(toolId);
    setSavedToolIds(prev => {
      const next = new Set(prev);
      if (isCurrentlySaved) next.delete(toolId);
      else next.add(toolId);
      return next;
    });

    try {
      const res = await fetch('/api/tools/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_id: toolId })
      });
      if (!res.ok) {
        throw new Error('Failed to save tool');
      }
    } catch (e) {
      // Revert optimistic update
      setSavedToolIds(prev => {
        const next = new Set(prev);
        if (isCurrentlySaved) next.add(toolId);
        else next.delete(toolId);
        return next;
      });
      console.error(e);
    }
  };

  const categories = ['All', 'AI Image', 'AI Video', 'AI Writing', 'Dev Tools'];

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

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <AIRecommendBox 
          tools={tools} 
          onRecommendationFound={handleAiRecommendations} 
          onSelectRecommendedTool={(id) => {
            const tool = tools.find(t => t.id === id);
            if (tool) handleOpenTool(tool);
          }} 
        />

        {/* AI Recommendations Results */}
        {aiRecommendations && (
          <div ref={recommendationsRef} className="mb-16 scroll-mt-24">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-violet-500" />
              Your Custom Tool Stack
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
                  created_at: new Date().toISOString()
                } as Tool;

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
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-violet-400">Why it fits: </span>
                        {rec.reasoning}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <LayoutGrid className="text-violet-500 w-8 h-8" />
            AI Tools Library
          </h1>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto custom-scrollbar">
            <Filter className="w-4 h-4 text-slate-500 mr-2 shrink-0 hidden sm:block" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === cat 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner className="w-10 h-10 text-violet-500" />
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl mx-auto border-dashed w-full max-w-2xl mt-8">
            <LayoutGrid className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">No tools found</h3>
            <p className="text-slate-500 mb-6 mx-auto">
              We couldn't find any tools in this category. Try asking the AI Matchmaker above to recommend something for you!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isSaved={savedToolIds.has(tool.id)}
                onSaveToggle={handleSaveToggle}
                onClick={() => handleOpenTool(tool)}
              />
            ))}
          </div>
        )}
      </main>

      <ToolDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tool={selectedTool}
        suggestedPrompts={suggestedPromptsForModal}
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
