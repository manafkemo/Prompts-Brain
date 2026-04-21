'use client';

import { Tool } from '@/lib/types';
import { ExternalLink, Heart } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onFavoriteToggle: (toolId: string, status: boolean) => void;
  onClick: (tool: Tool) => void;
}

export function ToolCard({ tool, isFavorite, onFavoriteToggle, onClick }: ToolCardProps) {
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle(tool.id, !isFavorite);
  };

  return (
    <div 
      onClick={() => onClick(tool)}
      className="group relative flex flex-col justify-between glass-panel rounded-2xl p-5 hover:border-violet-500/50 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10"
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
          <span className="text-xs font-medium text-amber-400/90 bg-amber-400/10 px-2.5 py-1 rounded-md">
            {tool.pricing}
          </span>
        </div>
        
        <a 
          href={tool.url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-violet-600 rounded-md transition-colors"
          title="Visit Website"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
