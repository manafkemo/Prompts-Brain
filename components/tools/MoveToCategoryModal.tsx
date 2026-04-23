'use client';

import { 
  X, FolderPlus, Check, Globe, 
  Layout, Sparkles, Zap, Rocket, 
  Target, Brain, Box, Palette 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolCategory } from '@/lib/types';
import * as LucideIcons from 'lucide-react';

interface MoveToCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ToolCategory[];
  currentCategoryId?: string | null;
  onMove: (categoryId: string) => void;
}

export function MoveToCategoryModal({ 
  isOpen, 
  onClose, 
  categories, 
  currentCategoryId,
  onMove 
}: MoveToCategoryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-violet-600 rounded-xl">
                    <FolderPlus className="h-5 w-5 text-white" />
                  </div>
                  Move to Category
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {categories.length > 0 ? (
                  categories.map((cat) => {
                    const IconComponent = (LucideIcons as any)[cat.icon || 'Globe'] || Globe;
                    const isSelected = currentCategoryId === cat.id;
                    const colorMap: any = {
                      violet: 'text-violet-400',
                      emerald: 'text-emerald-400',
                      rose: 'text-rose-400',
                      amber: 'text-amber-400',
                      blue: 'text-blue-400',
                      cyan: 'text-cyan-400',
                      lime: 'text-lime-400',
                      indigo: 'text-indigo-400',
                      fuchsia: 'text-fuchsia-400',
                      orange: 'text-orange-400',
                      slate: 'text-slate-400',
                      sky: 'text-sky-400',
                    };

                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onMove(cat.id);
                          onClose();
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                          isSelected 
                            ? 'bg-violet-600/20 border-violet-500/50 text-white' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <div className={`p-2 rounded-lg bg-slate-900 group-hover:scale-110 transition-transform ${isSelected ? colorMap[cat.color || 'violet'] : 'text-slate-500'}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="font-semibold flex-1">{cat.name}</span>
                        {isSelected && <Check className="h-5 w-5 text-violet-400" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p className="mb-4">You haven't created any categories yet.</p>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-white/5 mt-6">
                <button 
                  onClick={onClose}
                  className="w-full py-4 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
