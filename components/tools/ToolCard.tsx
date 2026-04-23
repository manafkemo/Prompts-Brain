'use client';

import { Tool } from '@/lib/types';
import { ExternalLink, Heart, X, FolderPlus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onFavoriteToggle: (toolId: string, status: boolean) => void;
  onRemove?: (toolId: string) => void;
  onMove?: (toolId: string) => void;
  onDelete?: (toolId: string) => void;
  onClick: (tool: Tool) => void;
  isInCustomCategory?: boolean;
}

export function ToolCard({ 
  tool, 
  isFavorite, 
  onFavoriteToggle, 
  onRemove,
  onMove,
  onDelete,
  onClick,
  isInCustomCategory 
}: ToolCardProps) {
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle(tool.id, !isFavorite);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('toolId', tool.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add a ghost image or styling if needed
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
  };

  return (
    <div 
      onClick={() => onClick(tool)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group relative flex flex-col justify-between glass-panel rounded-2xl p-5 hover:border-violet-500/50 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 active:scale-[0.98]"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors">
            {tool.name}
          </h3>
          <div className="flex items-center gap-1 -mr-2 -mt-2 relative z-10">
            <button 
              onClick={handleFavorite}
              title={isFavorite ? "Unfavorite" : "Favorite"}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

            {onMove && (
              <button 
                onClick={(e) => { e.stopPropagation(); onMove(tool.id); }}
                title="Move to category"
                className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-full transition-colors"
              >
                <FolderPlus className="w-5 h-5" />
              </button>
            )}

            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(tool.id); }}
                title="Delete tool"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            {isInCustomCategory && onRemove && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRemove(tool.id); }}
                title="Remove from this category"
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {tool.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              +{tool.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-300 bg-slate-800/50 px-2.5 py-1 rounded-md">
            {tool.category}
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
            tool.pricing.toLowerCase() === 'free' 
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
              : tool.pricing.toLowerCase() === 'freemium'
                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
          }`}>
            {tool.pricing}
          </span>
        </div>
        
        <motion.a 
          whileHover={{ scale: 1.1, x: 2, y: -2 }}
          whileTap={{ scale: 0.9 }}
          href={tool.url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-2.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-violet-600 rounded-xl transition-all shadow-lg shadow-black/20"
          title="Visit Website"
        >
          <ExternalLink className="w-5 h-5" />
        </motion.a>
      </div>
    </div>
  );
}
