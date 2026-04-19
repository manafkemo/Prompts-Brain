'use client';

import { useState } from 'react';
import { 
  X, Plus, BrainCircuit, Folder, FolderOpen, 
  ChevronRight, Library, Search, Trash2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collection, Prompt } from '@/lib/types';

interface LibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  prompts: Prompt[];
  activeCollection: string | null;
  setActiveCollection: (id: string | null) => void;
  onNewCollection: (name: string) => Promise<void>;
  onPromptMove: (e: React.DragEvent, collectionId: string | null) => void;
  onDeleteCollection: (col: Collection) => void;
}

export function LibraryDrawer({
  isOpen,
  onClose,
  collections,
  prompts,
  activeCollection,
  setActiveCollection,
  onNewCollection,
  onDeleteCollection
}: LibraryDrawerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await onNewCollection(newName);
    setNewName('');
    setIsCreating(false);
  };

  const handleDragOver = (e: React.DragEvent, id: string | null) => {
    e.preventDefault();
    setDragOverId(id || 'all');
  };

  const handleDrop = (e: React.DragEvent, id: string | null) => {
    setDragOverId(null);
    onPromptMove(e, id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-slate-950 border-l border-white/10 z-[101] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-600 rounded-lg">
                  <Library className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-none">Your Library</h2>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">Manage Folders</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              
              {/* All Prompts */}
              <div 
                onClick={() => setActiveCollection(null)}
                onDragOver={(e) => handleDragOver(e, null)}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => handleDrop(e, null)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${
                  activeCollection === null 
                    ? 'bg-violet-600/10 border border-violet-500/50 text-white shadow-lg shadow-violet-500/5' 
                    : dragOverId === 'all'
                      ? 'bg-violet-500/20 border-dashed border-2 border-violet-500 scale-[1.02] text-white'
                      : 'text-slate-400 hover:bg-slate-900 border border-transparent hover:text-slate-200'
                }`}
              >
                <BrainCircuit className={`w-5 h-5 ${activeCollection === null ? 'text-violet-400' : ''}`} />
                <span className="font-semibold text-sm">All Prompts</span>
                <span className="ml-auto text-xs font-bold bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
                  {prompts.length}
                </span>
              </div>

              <div className="pt-4 pb-2 px-2">
                <hr className="border-white/5" />
              </div>

              {/* Collections List */}
              <div className="space-y-1.5">
                {collections.map(col => {
                  const count = prompts.filter(p => p.collection_id === col.id).length;
                  const isActive = activeCollection === col.id;
                  const isDraggingOver = dragOverId === col.id;

                  return (
                    <div 
                      key={col.id}
                      onClick={() => setActiveCollection(col.id)}
                      onDragOver={(e) => handleDragOver(e, col.id)}
                      onDragLeave={() => setDragOverId(null)}
                      onDrop={(e) => handleDrop(e, col.id)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-violet-600/10 border border-violet-500/50 text-white' 
                          : isDraggingOver
                            ? 'bg-violet-500/20 border-dashed border-2 border-violet-500 scale-[1.02] text-white'
                            : 'text-slate-400 hover:bg-slate-900 border border-transparent hover:text-slate-200'
                      }`}
                    >
                      {isActive || isDraggingOver ? 
                        <FolderOpen className="w-5 h-5 text-violet-400" /> : 
                        <Folder className="w-5 h-5" />
                      }
                      <span className="font-medium text-sm truncate">{col.name}</span>
                      
                      <div className="ml-auto flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCollection(col);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-400 transition-all"
                          title="Delete Folder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full group-hover:opacity-0 transition-opacity">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* No Collections State */}
              {collections.length === 0 && !isCreating && (
                <div className="text-center py-12 px-6">
                  <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Folder className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">No folders yet</p>
                  <p className="text-slate-500 text-xs mt-1">Create your first collection to stay organized.</p>
                </div>
              )}
            </div>

            {/* Footer / Create Collection */}
            <div className="p-6 bg-slate-900/30 border-t border-white/5">
              {isCreating ? (
                <form onSubmit={handleSubmit} className="animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col gap-3">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Folder name..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="flex-1 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/50 text-slate-300 hover:text-violet-400 py-3 rounded-2xl transition-all group lg:hover:shadow-lg lg:hover:shadow-violet-500/5"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  <span className="text-sm font-bold">New Folder</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
