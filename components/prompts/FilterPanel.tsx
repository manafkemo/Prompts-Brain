'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Tag, Star, Type, Filter, ChevronDown, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterState {
  tags: string[];
  startDate: string;
  endDate: string;
  title: string;
  content: string;
  minCreativity: number;
  maxCreativity: number;
  minQuality: number;
  maxQuality: number;
}

const initialFilters: FilterState = {
  tags: [],
  startDate: '',
  endDate: '',
  title: '',
  content: '',
  minCreativity: 1,
  maxCreativity: 10,
  minQuality: 1,
  maxQuality: 10,
};

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      if (res.ok) {
        const data = await res.json();
        setAvailableTags(data);
      }
    } catch (e) {
      console.error('Failed to fetch tags', e);
    }
  };

  const handleApply = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  const activeFilterCount = Object.entries(filters).reduce((acc, [key, value]) => {
    if (key === 'tags' && Array.isArray(value)) return acc + value.length;
    if (key === 'minCreativity' && value > 1) return acc + 1;
    if (key === 'maxCreativity' && value < 10) return acc + 1;
    if (key === 'minQuality' && value > 1) return acc + 1;
    if (key === 'maxQuality' && value < 10) return acc + 1;
    if (typeof value === 'string' && value !== '') return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
          isOpen || activeFilterCount > 0 
            ? 'bg-violet-600/20 border-violet-500/50 text-violet-400 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]' 
            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filter</span>
        {activeFilterCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 bg-violet-500 text-white text-[10px] font-bold rounded-full">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 w-[350px] sm:w-[450px] bg-slate-950 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
            >
              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase">Advanced Search</h3>
                  <button 
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-violet-400 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset All
                  </button>
                </div>

                {/* Title & Keywords */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                      <Type className="w-3 h-3" /> TITLE KEYWORDS
                    </label>
                    <input 
                      type="text"
                      value={filters.title}
                      onChange={(e) => setFilters({...filters, title: e.target.value})}
                      placeholder="e.g. Marketing, Logo..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                      <Filter className="w-3 h-3" /> CONTENT WORDS
                    </label>
                    <input 
                      type="text"
                      value={filters.content}
                      onChange={(e) => setFilters({...filters, content: e.target.value})}
                      placeholder="Specific words in prompt..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Tags */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> TAGS
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all ${
                          filters.tags.includes(tag)
                            ? 'bg-violet-600 text-white border-violet-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                    {availableTags.length === 0 && (
                      <span className="text-[11px] text-slate-600 italic">No tags found</span>
                    )}
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                      <Star className="w-3 h-3 text-emerald-500" /> CREATIVITY
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="1" max="10"
                        value={filters.minCreativity}
                        onChange={(e) => setFilters({...filters, minCreativity: parseInt(e.target.value) || 1})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-en-nums"
                        placeholder="Min"
                      />
                      <span className="text-slate-600">-</span>
                      <input 
                        type="number" 
                        min="1" max="10"
                        value={filters.maxCreativity}
                        onChange={(e) => setFilters({...filters, maxCreativity: parseInt(e.target.value) || 10})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-en-nums"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                      <Star className="w-3 h-3 text-violet-500" /> QUALITY
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="1" max="10"
                        value={filters.minQuality}
                        onChange={(e) => setFilters({...filters, minQuality: parseInt(e.target.value) || 1})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-en-nums"
                        placeholder="Min"
                      />
                      <span className="text-slate-600">-</span>
                      <input 
                        type="number" 
                        min="1" max="10"
                        value={filters.maxQuality}
                        onChange={(e) => setFilters({...filters, maxQuality: parseInt(e.target.value) || 10})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-en-nums"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Dates */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> DATE RANGE
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="date" 
                      value={filters.startDate}
                      onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white color-scheme-dark"
                    />
                    <input 
                      type="date" 
                      value={filters.endDate}
                      onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white color-scheme-dark"
                    />
                  </div>
                </div>

              </div>

              {/* Action */}
              <div className="p-4 bg-slate-900/50 border-t border-white/5 flex gap-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApply}
                  className="flex-1 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-violet-900/20 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
