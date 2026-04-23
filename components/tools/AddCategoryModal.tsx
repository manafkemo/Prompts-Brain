'use client';

import { useState, useEffect } from 'react';
import { 
  X, Sparkles, Layout, Box, Zap, 
  Target, Rocket, Brain, Palette, 
  Plus, Loader2, Check, Camera, 
  Music, Globe, Search, Heart, 
  Star, Cloud, MessageCircle, Terminal,
  Image as ImageIcon, Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolCategory } from '@/lib/types';

const CATEGORY_ICONS = [
  { id: 'Layout', icon: Layout },
  { id: 'Sparkles', icon: Sparkles },
  { id: 'Zap', icon: Zap },
  { id: 'Rocket', icon: Rocket },
  { id: 'Target', icon: Target },
  { id: 'Brain', icon: Brain },
  { id: 'Box', icon: Box },
  { id: 'Palette', icon: Palette },
  { id: 'Camera', icon: Camera },
  { id: 'Music', icon: Music },
  { id: 'Globe', icon: Globe },
  { id: 'Search', icon: Search },
  { id: 'Heart', icon: Heart },
  { id: 'Star', icon: Star },
  { id: 'Cloud', icon: Cloud },
  { id: 'MessageCircle', icon: MessageCircle },
  { id: 'Terminal', icon: Terminal },
  { id: 'Image', icon: ImageIcon },
  { id: 'Video', icon: Video },
];

const CATEGORY_COLORS = [
  { id: 'violet', bg: 'bg-violet-500', text: 'text-violet-400', border: 'border-violet-500/50' },
  { id: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/50' },
  { id: 'rose', bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/50' },
  { id: 'amber', bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/50' },
  { id: 'blue', bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/50' },
  { id: 'cyan', bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/50' },
  { id: 'lime', bg: 'bg-lime-500', text: 'text-lime-400', border: 'border-lime-500/50' },
  { id: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/50' },
  { id: 'fuchsia', bg: 'bg-fuchsia-500', text: 'text-fuchsia-400', border: 'border-fuchsia-500/50' },
  { id: 'orange', bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/50' },
  { id: 'slate', bg: 'bg-slate-500', text: 'text-slate-400', border: 'border-slate-500/50' },
  { id: 'sky', bg: 'bg-sky-500', text: 'text-sky-400', border: 'border-sky-500/50' },
];

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ToolCategory | null;
}

export function AddCategoryModal({ isOpen, onClose, onSuccess, initialData }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Layout');
  const [selectedColor, setSelectedColor] = useState('violet');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSelectedIcon(initialData.icon || 'Layout');
      setSelectedColor(initialData.color || 'violet');
    } else {
      setName('');
      setSelectedIcon('Layout');
      setSelectedColor('violet');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = '/api/categories';
      const method = initialData ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: initialData?.id,
          name: name.trim(), 
          icon: selectedIcon, 
          color: selectedColor 
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${initialData ? 'update' : 'create'} category`);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-violet-600 rounded-xl">
                    {initialData ? <Palette className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                  </div>
                  {initialData ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 overflow-y-auto pr-2 custom-scrollbar pb-4">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                    Category Name
                  </label>
                  <input 
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. My Favorites, Work Tools..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-2xl py-4 px-6 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all font-medium"
                  />
                </div>

                {/* Icon Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                    Choose Icon
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {CATEGORY_ICONS.map(({ id, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedIcon(id)}
                        className={`flex items-center justify-center p-3 rounded-2xl border transition-all ${
                          selectedIcon === id 
                            ? 'bg-violet-600/20 border-violet-500/50 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                    Select Color
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {CATEGORY_COLORS.map(({ id, bg }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedColor(id)}
                        className={`relative h-10 w-full rounded-2xl transition-all group ${bg} ${
                          selectedColor === id 
                            ? 'ring-2 ring-white ring-offset-4 ring-offset-slate-900 scale-105' 
                            : 'hover:scale-105 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {selectedColor === id && (
                          <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center">
                    {error}
                  </div>
                )}
              </form>

              <div className="flex gap-4 pt-6 shrink-0 border-t border-white/5 mt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading || !name.trim()}
                  className="flex-[2] bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    initialData ? 'Update Category' : 'Create Category'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
